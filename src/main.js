import Phaser from "phaser";
import OpeningScene from "./game/scenes/OpeningScene";
import IntroScene from "./game/scenes/[Intro 0] IntroScene";
import MorningScene01 from "./game/scenes/[Intro 1] MorningScene";
import BadEndingScene from "./game/scenes/[Intro 2] BadEndingScene";
import Scene02MarketInvite from "./game/scenes/[Intro 3] Scene02MarketInvite";
import TaskIntroScene from "./game/scenes/[1.1] TaskIntroScene";
import IngredientSelectionIntroScene from "./game/scenes/[1.2] IngredientSelectionIntroScene";
import MarketIngredientSelectionScene from "./game/scenes/[1.3] MarketIngredientSelectionScene";
import CookingChallengePlaceholderScene from "./game/scenes/[2] CookingChallenge";
import BuyRibsIntroScene from "./game/scenes/[1.4] BuyRibsIntroScene";
import PorkRibSelectionScene from "./game/scenes/[1.5] PorkRibSelectionScene";
import BargainScene from "./game/scenes/[1.6] BargainScene";
import BargainBadEndingScene from "./game/scenes/[1.61] BargainBadEndingScene";
import Level1PassScene from "./game/scenes/[1.7] Level1PassScene";
import Level2IntroScene from "./game/scenes/[2.1] Level2IntroScene";
import Level2InstructionScene from "./game/scenes/[2.2] Level2InstructionScene";
import Level2CookingGuidedScene from "./game/scenes/[2.3] Level2CookingGuidedScene";
import CookingChallengeCompleteScene from "./game/scenes/[2.4] CookingChallengeCompleteScene";
import Level3IntroScene from "./game/scenes/[3.1] Level3Introscene";
import Level3MainChallengeScene from "./game/scenes/[3.2] Level3mainchallenge";
import Level3PassScene from "./game/scenes/[3.3] Level3PassScene";
import Level4IntroScene from "./game/scenes/[4.1] Level4IntroScene";
import Level4MainChallengeScene from "./game/scenes/[4.2] Level4mainchallenge";
import Level4PassScene from "./game/scenes/[4.3] Level4PassScene";
import FinishLevelScene from "./game/scenes/[4.4] FinishLevelScene";
import RotateDeviceOverlayScene from "./game/scenes/RotateDeviceOverlayScene";
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
const SCENE_ANALYTICS_MAP = {
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
    console.log("[boot]", ...args);
};

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

        OpeningScene,
        IntroScene,
        MorningScene01,
        BadEndingScene,
        Scene02MarketInvite,
        TaskIntroScene,
        IngredientSelectionIntroScene,
        MarketIngredientSelectionScene,
        BuyRibsIntroScene,
        PorkRibSelectionScene,
        BargainScene,
        BargainBadEndingScene,
        Level1PassScene,
        Level2IntroScene,
        Level2InstructionScene,
        Level2CookingGuidedScene,
        CookingChallengeCompleteScene,
        CookingChallengePlaceholderScene,
        Level3IntroScene,
        Level3MainChallengeScene,
        Level3PassScene,
        Level4IntroScene,
        Level4MainChallengeScene,
        Level4PassScene,
        FinishLevelScene,
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
    console.log("[lifecycle] pageshow", {
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
    console.log("[lifecycle] pagehide", {
        persisted: e.persisted,
        session: _sessionId,
    });
});
document.addEventListener("visibilitychange", () => {
    analytics.setAppActive(document.visibilityState === "visible");
    console.log("[lifecycle] visibilitychange", {
        state: document.visibilityState,
        session: _sessionId,
    });
});
window.addEventListener("resize", () => {
    updateViewportCssVars();
    console.log("[lifecycle] resize", {
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
    console.log("[phaser] ready", {
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
        scene.events.on("start", () => {
            console.log("[scene] start", scene.scene.key);
        });
        scene.events.on("create", () => {
            console.log("[scene] create", scene.scene.key);
            trackSceneAnalytics(scene.scene.key);
        });
        scene.events.on("shutdown", () => {
            console.log("[scene] shutdown", scene.scene.key);
        });
    });

    game.scene.start("OpeningScene");
});
