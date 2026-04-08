import Phaser from "phaser";
import BootScene from "./game/scenes/BootScene.js";
import SceneLoadingScene from "./game/scenes/SceneLoadingScene.js";
import { getAnalytics, initAnalytics } from "./game/analytics";
import { RAW_DPR, getOrientationGameSize, getSafeDevicePixelRatio, getSafeRenderResolution } from "./game/UIHelpers";

const baseGameSize = getOrientationGameSize();
const SAFE_DPR = getSafeDevicePixelRatio();
const SAFE_RENDER_RESOLUTION = getSafeRenderResolution(baseGameSize.height);
const initialGameSize = {
    width: baseGameSize.width * SAFE_DPR,
    height: baseGameSize.height * SAFE_DPR,
};

function updateViewportCssVars() {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    const viewportHeight = Math.round(viewport?.height || window.innerHeight || 0);

    root.style.setProperty("--app-height", `${viewportHeight}px`);
}

const analytics = getAnalytics();
const SHOULD_LOG_DEBUG = !import.meta.env.PROD;
const SCENE_ANALYTICS_MAP = {
    BootScene: {},
    SceneLoadingScene: {},
    OpeningScene: { checkpointId: "opening.start" },
    IntroScene: { checkpointId: "intro.story" },
    MorningScene01: { checkpointId: "intro.morning.dialogue" },
    BadEndingScene: { checkpointId: "intro.bad-ending", status: "bad_ending", result: "intro_tiktok" },
    Scene02MarketInvite: { checkpointId: "intro.market-invite" },
    TaskIntroScene: { checkpointId: "level1.task-intro", level: 1, markLevelStart: true },
    MarketIngredientSelectionScene: { checkpointId: "level1.market-selection", level: 1 },
    BuyRibsIntroScene: { checkpointId: "level1.buy-ribs-intro", level: 1 },
    PorkRibSelectionScene: { checkpointId: "level1.pork-rib-selection", level: 1 },
    BargainScene: { checkpointId: "level1.bargain-choice", level: 1 },
    BargainBadEndingScene: { checkpointId: "level1.bad-ending", level: 1, status: "bad_ending", result: "bargain_fail" },
    Level1PassScene: { checkpointId: "level1.complete", level: 1, markLevelComplete: true },
    Level2IntroScene: { checkpointId: "level2.intro", level: 2, markLevelStart: true },
    Level2InstructionScene: { checkpointId: "level2.instruction", level: 2 },
    CookingChallengeCompleteScene: { checkpointId: "level2.complete", level: 2, markLevelComplete: true },
    Level3IntroScene: { checkpointId: "level3.intro", level: 3, markLevelStart: true },
    Level3MainChallengeScene: { level: 3 },
    Level3PassScene: { checkpointId: "level3.complete", level: 3, markLevelComplete: true },
    Level4IntroScene: { checkpointId: "level4.intro", level: 4, markLevelStart: true },
    Level4MainChallengeScene: { level: 4 },
    Level4PassScene: { checkpointId: "level4.complete", level: 4, markLevelComplete: true },
    FinishLevelScene: { checkpointId: "game.complete", markGameComplete: true },
};

function trackSceneAnalytics(sceneKey) {
    const sceneAnalytics = SCENE_ANALYTICS_MAP[sceneKey] || {};

    analytics.markSceneEnter(sceneKey, {
        checkpointId: sceneAnalytics.checkpointId ?? null,
        level: sceneAnalytics.level ?? null,
        status: sceneAnalytics.status ?? null,
        result: sceneAnalytics.result ?? null,
    });

    if (sceneAnalytics.checkpointId) {
        analytics.markCheckpoint({
            sceneKey,
            checkpointId: sceneAnalytics.checkpointId,
            level: sceneAnalytics.level ?? null,
            status: sceneAnalytics.status ?? null,
            result: sceneAnalytics.result ?? null,
        });
    }

    if (sceneAnalytics.markLevelStart) {
        analytics.markLevelStart(sceneAnalytics.level, {
            sceneKey,
            checkpointId: sceneAnalytics.checkpointId,
        });
    }

    if (sceneAnalytics.markLevelComplete) {
        analytics.markLevelComplete(sceneAnalytics.level, {
            sceneKey,
            checkpointId: sceneAnalytics.checkpointId,
        });
    }

    if (sceneAnalytics.status === "bad_ending") {
        analytics.markBadEnding({
            sceneKey,
            checkpointId: sceneAnalytics.checkpointId,
            level: sceneAnalytics.level ?? null,
            result: sceneAnalytics.result ?? null,
        });
    }

    if (sceneAnalytics.markGameComplete) {
        analytics.markGameComplete({
            sceneKey,
            checkpointId: sceneAnalytics.checkpointId,
        });
    }
}

initAnalytics({ entryScene: "boot" });
const _sessionId = analytics.getSessionId();
const logBootDiagnostics = (...args) => {
    if (SHOULD_LOG_DEBUG) {
        console.log("[boot]", ...args);
    }
};
const logLifecycle = (...args) => {
    if (SHOULD_LOG_DEBUG) {
        console.log(...args);
    }
};

function instrumentSceneLifecycle(scene) {
    if (scene.__bbbLifecycleInstrumented) {
        return;
    }

    scene.__bbbLifecycleInstrumented = true;

    scene.events.on("start", () => {
        logLifecycle("[scene] start", scene.scene.key);
    });
    scene.events.on("create", () => {
        logLifecycle("[scene] create", scene.scene.key);
        trackSceneAnalytics(scene.scene.key);
    });
    scene.events.on("shutdown", () => {
        logLifecycle("[scene] shutdown", scene.scene.key);
    });
}

updateViewportCssVars();

window.addEventListener("error", (event) => {
    console.error("[runtime] error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
    });
});
window.addEventListener("unhandledrejection", (event) => {
    console.error("[runtime] unhandledrejection", event.reason);
});

logBootDiagnostics("page loaded", {
    session: _sessionId,
    isoTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    rawDpr: RAW_DPR,
    safeDpr: SAFE_DPR,
    safeRenderResolution: SAFE_RENDER_RESOLUTION,
    gameSize: initialGameSize,
});

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: initialGameSize.width,
    height: initialGameSize.height,
    backgroundColor: "#000000",
    render: {
        antialias: true,
        antialiasGL: true,
        pixelArt: false,
        resolution: SAFE_RENDER_RESOLUTION,
    },
    scene: [
        BootScene,
        SceneLoadingScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    title: "Bat trang's Bride"
};

const game = new Phaser.Game(config);

window.addEventListener("pageshow", (e) => {
    analytics.setAppActive(document.visibilityState === "visible");
    logLifecycle("[lifecycle] pageshow", {
        persisted: e.persisted,
        session: _sessionId,
        visibilityState: document.visibilityState,
    });
});
window.addEventListener("pagehide", (e) => {
    if (!e.persisted) {
        analytics.finalizeSession("pagehide");
    } else {
        analytics.setAppActive(false);
    }
    logLifecycle("[lifecycle] pagehide", {
        persisted: e.persisted,
        session: _sessionId,
    });
});
document.addEventListener("visibilitychange", () => {
    analytics.setAppActive(document.visibilityState === "visible");
    logLifecycle("[lifecycle] visibilitychange", {
        state: document.visibilityState,
        session: _sessionId,
    });
});
window.addEventListener("resize", () => {
    updateViewportCssVars();
    logLifecycle("[lifecycle] resize", {
        width: window.innerWidth,
        height: window.innerHeight,
        rawDpr: RAW_DPR,
        safeDpr: SAFE_DPR,
        safeRenderResolution: SAFE_RENDER_RESOLUTION,
        session: _sessionId,
    });
});
window.addEventListener("orientationchange", updateViewportCssVars);
window.visualViewport?.addEventListener("resize", updateViewportCssVars);
window.visualViewport?.addEventListener("scroll", updateViewportCssVars);
window.__BBB_ANALYTICS__ = analytics;

game.events.once("ready", () => {
    game.registry.set("__instrumentSceneLifecycle", instrumentSceneLifecycle);

    logLifecycle("[phaser] ready", {
        renderer: game.renderer.type,
        canvas: {
            width: game.canvas?.width,
            height: game.canvas?.height,
            cssWidth: game.canvas?.style?.width,
            cssHeight: game.canvas?.style?.height,
        },
        scale: {
            width: game.scale.width,
            height: game.scale.height,
            orientation: game.scale.orientation,
        },
        safeDpr: SAFE_DPR,
        rawDpr: RAW_DPR,
        safeRenderResolution: SAFE_RENDER_RESOLUTION,
        session: _sessionId,
    });

    game.scene.scenes.forEach((scene) => {
        instrumentSceneLifecycle(scene);
    });

    game.scene.start("BootScene");
});
