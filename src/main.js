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

const _sessionId = Math.random().toString(36).slice(2);
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
        RotateDeviceOverlayScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    title: "Bat trang's Bride"
};

const game = new Phaser.Game(config);

window.addEventListener("pageshow", (e) => {
    console.log("[lifecycle] pageshow", {
        persisted: e.persisted,
        session: _sessionId,
        visibilityState: document.visibilityState,
    });
});
window.addEventListener("pagehide", (e) => {
    console.log("[lifecycle] pagehide", {
        persisted: e.persisted,
        session: _sessionId,
    });
});
document.addEventListener("visibilitychange", () => {
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
        });
        scene.events.on("shutdown", () => {
            console.log("[scene] shutdown", scene.scene.key);
        });
    });

    if (game.scale.orientation === Phaser.Scale.PORTRAIT) {
        console.log("[scene] boot target", "RotateDeviceOverlayScene");
        game.scene.start("RotateDeviceOverlayScene");
        game.scene.bringToTop("RotateDeviceOverlayScene");
    } else {
        console.log("[scene] boot target", "OpeningScene");
        game.scene.start("OpeningScene");
    }
});
