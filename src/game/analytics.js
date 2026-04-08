const SESSION_STORAGE_KEY = "bbb.session.v1";
const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
const BOUNCE_WINDOW_MS = 10_000;
const SESSION_RESUME_WINDOW_MS = 30 * 60 * 1000;

const FORWARDED_EVENTS = new Set([
    "session_start",
    "session_end",
    "scene_enter",
    "checkpoint_reached",
    "level_start",
    "level_complete",
    "bad_ending",
    "game_complete",
]);

function nowIso() {
    return new Date().toISOString();
}

function createSessionId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `bbb_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function safeParseStorage(rawValue) {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
        console.warn("[analytics] failed to parse session storage", error);
        return null;
    }
}

function isProductionRuntime() {
    return Boolean(import.meta.env.PROD);
}

function normalizeLevel(level) {
    if (level == null) {
        return null;
    }

    return Number(level);
}

class AnalyticsService {
    constructor() {
        this.meta = null;
        this.isInitialized = false;
        this.isProduction = isProductionRuntime();
        this._activeSince = null;
        this._scriptInjected = false;
    }

    initSession({ entryScene = null } = {}) {
        if (this.isInitialized) {
            return this.meta;
        }

        const restoredMeta = this._restoreExistingSession();
        const timestamp = Date.now();

        if (restoredMeta) {
            this.meta = {
                ...restoredMeta,
                restoredAt: nowIso(),
                endedAt: null,
            };
        } else {
            this.meta = this._createSessionMeta(entryScene, timestamp);
        }

        this.isInitialized = true;
        console.log("[analytics] init", { mode: this.isProduction ? "production" : "dev", session: this.meta.sessionId, restored: Boolean(restoredMeta) });
        this._ensureGtag();
        this._persistMeta();
        this.setAppActive(document.visibilityState === "visible");
        this.trackEvent("session_start", {
            scene_key: entryScene,
            checkpoint_id: this.meta.entryCheckpointId,
            duration_ms: 0,
        });

        return this.meta;
    }

    getSessionId() {
        return this.meta?.sessionId ?? null;
    }

    setAppActive(isActive) {
        if (!this.meta) {
            return;
        }

        if (isActive) {
            if (this._activeSince == null) {
                const timestamp = Date.now();
                this._activeSince = timestamp;
                this.meta.lastActiveAt = new Date(timestamp).toISOString();
                this._persistMeta();
            }
            return;
        }

        this._flushActiveDuration();
    }

    markSceneEnter(sceneKey, payload = {}) {
        if (!this.meta) {
            this.initSession({ entryScene: sceneKey });
        }

        this.meta.lastScene = sceneKey;
        if (!this.meta.entryScene) {
            this.meta.entryScene = sceneKey;
        }
        this._persistMeta();

        this.trackEvent("scene_enter", {
            scene_key: sceneKey,
            checkpoint_id: payload.checkpointId ?? null,
            level: normalizeLevel(payload.level),
            status: payload.status ?? null,
            result: payload.result ?? null,
            duration_ms: this.getActiveDurationMs(),
        });
    }

    markCheckpoint({ sceneKey = null, checkpointId, level = null, status = null, result = null } = {}) {
        if (!checkpointId) {
            return;
        }

        if (!this.meta) {
            this.initSession({ entryScene: sceneKey });
        }

        const currentSceneKey = sceneKey ?? this.meta.lastScene ?? null;

        if (!this.meta.entryCheckpointId) {
            this.meta.entryCheckpointId = checkpointId;
        } else if (checkpointId !== this.meta.entryCheckpointId) {
            this.meta.hasMeaningfulProgress = true;
        }

        this.meta.lastScene = currentSceneKey;
        this.meta.lastCheckpointId = checkpointId;

        const numericLevel = normalizeLevel(level);
        if (numericLevel != null) {
            this.meta.lastLevel = numericLevel;
        }

        this._persistMeta();

        this.trackEvent("checkpoint_reached", {
            scene_key: currentSceneKey,
            checkpoint_id: checkpointId,
            level: numericLevel,
            status,
            result,
            duration_ms: this.getActiveDurationMs(),
        });
    }

    markLevelStart(level, payload = {}) {
        if (!this.meta) {
            this.initSession({ entryScene: payload.sceneKey ?? null });
        }

        const levelKey = String(level);
        if (this.meta.startedLevels[levelKey]) {
            return;
        }

        this.meta.startedLevels[levelKey] = {
            startedAt: nowIso(),
            sceneKey: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpointId: payload.checkpointId ?? null,
        };
        this._persistMeta();

        this.trackEvent("level_start", {
            scene_key: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpoint_id: payload.checkpointId ?? null,
            level: Number(level),
            status: "started",
            duration_ms: this.getActiveDurationMs(),
        });
    }

    markLevelComplete(level, payload = {}) {
        if (!this.meta) {
            this.initSession({ entryScene: payload.sceneKey ?? null });
        }

        const levelKey = String(level);
        if (this.meta.completedLevels[levelKey]) {
            return;
        }

        this.meta.completedLevels[levelKey] = {
            completedAt: nowIso(),
            sceneKey: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpointId: payload.checkpointId ?? null,
        };
        this._persistMeta();

        this.trackEvent("level_complete", {
            scene_key: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpoint_id: payload.checkpointId ?? null,
            level: Number(level),
            status: "completed",
            duration_ms: this.getActiveDurationMs(),
        });
    }

    markBadEnding(payload = {}) {
        if (!this.meta) {
            this.initSession({ entryScene: payload.sceneKey ?? null });
        }

        this.trackEvent("bad_ending", {
            scene_key: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpoint_id: payload.checkpointId ?? null,
            level: normalizeLevel(payload.level),
            status: "bad_ending",
            result: payload.result ?? null,
            duration_ms: this.getActiveDurationMs(),
        });
    }

    markGameComplete(payload = {}) {
        if (!this.meta) {
            this.initSession({ entryScene: payload.sceneKey ?? null });
        }

        if (this.meta.gameCompletedAt) {
            return;
        }

        this.meta.gameCompletedAt = nowIso();
        this._persistMeta();

        this.trackEvent("game_complete", {
            scene_key: payload.sceneKey ?? this.meta.lastScene ?? null,
            checkpoint_id: payload.checkpointId ?? null,
            status: "completed",
            duration_ms: this.getActiveDurationMs(),
        });
    }

    trackEvent(eventName, payload = {}) {
        if (!this.meta || !eventName) {
            return;
        }

        const eventPayload = {
            session_id: this.meta.sessionId,
            scene_key: payload.scene_key ?? this.meta.lastScene ?? null,
            checkpoint_id: payload.checkpoint_id ?? this.meta.lastCheckpointId ?? null,
            level: normalizeLevel(payload.level ?? this.meta.lastLevel),
            status: payload.status ?? null,
            result: payload.result ?? null,
            duration_ms: Number.isFinite(payload.duration_ms) ? Math.round(payload.duration_ms) : Math.round(this.getActiveDurationMs()),
            wall_clock_duration_ms: Number.isFinite(payload.wall_clock_duration_ms) ? Math.round(payload.wall_clock_duration_ms) : undefined,
            bounce: typeof payload.bounce === "boolean" ? payload.bounce : undefined,
        };

        if (this.isProduction && FORWARDED_EVENTS.has(eventName) && typeof window.gtag === "function") {
            console.log("[analytics] → GA4", eventName, eventPayload);
            window.gtag("event", eventName, eventPayload);
        } else {
            console.log("[analytics] local-only", eventName, eventPayload);
        }
    }

    getActiveDurationMs() {
        if (!this.meta) {
            return 0;
        }

        if (this._activeSince == null) {
            return this.meta.activeDurationMs;
        }

        return this.meta.activeDurationMs + (Date.now() - this._activeSince);
    }

    finalizeSession(reason = "pagehide") {
        if (!this.meta || this.meta.endedAt) {
            return;
        }

        this._flushActiveDuration();

        const wallClockDurationMs = Math.max(0, Date.now() - Date.parse(this.meta.startedAt));
        const bounce = this.getActiveDurationMs() < BOUNCE_WINDOW_MS || !this.meta.hasMeaningfulProgress;

        this.meta.endedAt = nowIso();
        this.meta.exitReason = reason;
        this.meta.bounce = bounce;
        this._persistMeta();

        this.trackEvent("session_end", {
            scene_key: this.meta.lastScene,
            checkpoint_id: this.meta.lastCheckpointId,
            level: this.meta.lastLevel,
            status: bounce ? "bounce" : "completed",
            result: reason,
            duration_ms: this.getActiveDurationMs(),
            wall_clock_duration_ms: wallClockDurationMs,
            bounce,
        });
    }

    _restoreExistingSession() {
        try {
            const stored = safeParseStorage(window.localStorage.getItem(SESSION_STORAGE_KEY));
            if (!stored || stored.endedAt) {
                return null;
            }

            const lastActiveAt = Date.parse(stored.lastActiveAt ?? stored.startedAt ?? "");
            if (!Number.isFinite(lastActiveAt)) {
                return null;
            }

            if (Date.now() - lastActiveAt > SESSION_RESUME_WINDOW_MS) {
                return null;
            }

            return {
                ...stored,
                activeDurationMs: Number(stored.activeDurationMs) || 0,
                startedLevels: stored.startedLevels && typeof stored.startedLevels === "object" ? stored.startedLevels : {},
                completedLevels: stored.completedLevels && typeof stored.completedLevels === "object" ? stored.completedLevels : {},
                hasMeaningfulProgress: Boolean(stored.hasMeaningfulProgress),
            };
        } catch (error) {
            console.warn("[analytics] failed to restore session", error);
            return null;
        }
    }

    _createSessionMeta(entryScene, timestamp) {
        const isoTime = new Date(timestamp).toISOString();

        return {
            version: 1,
            sessionId: createSessionId(),
            startedAt: isoTime,
            lastActiveAt: isoTime,
            entryScene,
            lastScene: entryScene,
            entryCheckpointId: null,
            lastCheckpointId: null,
            lastLevel: null,
            activeDurationMs: 0,
            hasMeaningfulProgress: false,
            startedLevels: {},
            completedLevels: {},
            gameCompletedAt: null,
            endedAt: null,
            exitReason: null,
            bounce: null,
        };
    }

    _flushActiveDuration() {
        if (!this.meta || this._activeSince == null) {
            return;
        }

        const timestamp = Date.now();
        this.meta.activeDurationMs += Math.max(0, timestamp - this._activeSince);
        this.meta.lastActiveAt = new Date(timestamp).toISOString();
        this._activeSince = null;
        this._persistMeta();
    }

    _persistMeta() {
        if (!this.meta) {
            return;
        }

        try {
            window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.meta));
        } catch (error) {
            console.warn("[analytics] failed to persist session", error);
        }
    }

    _ensureGtag() {
        if (typeof window === "undefined") {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== "function") {
            window.gtag = function gtag() {
                window.dataLayer.push(arguments);
            };
        }

        if (!this.isProduction) {
            console.log("[analytics] GA forwarding disabled (dev mode)");
            return;
        }

        if (!GA_MEASUREMENT_ID) {
            console.warn("[analytics] missing VITE_GA_MEASUREMENT_ID; GA forwarding disabled");
            return;
        }

        if (!this._scriptInjected) {
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);
            this._scriptInjected = true;
            console.log("[analytics] GA4 script injected", GA_MEASUREMENT_ID);
        }

        window.gtag("js", new Date());
        window.gtag("config", GA_MEASUREMENT_ID, {
            send_page_view: false,
        });
    }
}

const analytics = new AnalyticsService();

export function getAnalytics() {
    return analytics;
}

export function initAnalytics(options) {
    return analytics.initSession(options);
}
