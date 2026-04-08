const KEY = "bbb.progress.v1";

function _load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (data?.version !== 1) return null;
        return data;
    } catch {
        return null;
    }
}

function _save(data) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
}

function _defaults() {
    return {
        version: 1,
        updatedAt: new Date().toISOString(),
        started: false,
        finished: false,
        currentScene: "OpeningScene",
        resumeTarget: { sceneKey: "OpeningScene", checkpointId: "opening.start" },
        story: {},
        badEndings: {},
        levels: {
            level1: { status: "locked", checkpointId: null, completedAt: null },
            level2: { status: "locked", checkpointId: null, challengeIndex: null, stepIndex: null, completedAt: null },
            level3: { status: "locked", checkpointId: null, completedAt: null },
            level4: { status: "locked", checkpointId: null, ringStage: null, completedAt: null }
        }
    };
}

export function loadProgress() {
    return _load();
}

export function updateCheckpoint(sceneKey, checkpointId, extra = {}) {
    const data = _load() || _defaults();
    data.updatedAt = new Date().toISOString();
    data.started = true;
    data.currentScene = sceneKey;
    data.resumeTarget = { sceneKey, checkpointId, ...extra };
    _save(data);
}

export function markBadEnding(endingKey, retryTarget) {
    const data = _load() || _defaults();
    data.badEndings[endingKey] = {
        seen: true,
        lastSeenAt: new Date().toISOString(),
        retryTarget
    };
    _save(data);
}

export function markLevelStatus(level, status, extra = {}) {
    const data = _load() || _defaults();
    data.levels[level] = { ...data.levels[level], status, ...extra };
    if (status === "completed") data.levels[level].completedAt = new Date().toISOString();
    _save(data);
}

export function markGameFinished() {
    const data = _load() || _defaults();
    data.finished = true;
    data.updatedAt = new Date().toISOString();
    _save(data);
}

export function resetProgress() {
    try { localStorage.removeItem(KEY); } catch {}
}
