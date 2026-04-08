import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadSoundAssets,
    createDevSkipButton,
    createBackButton,
    createCompletionBoard,
    addCoverBg,
    getResponsiveMetrics,
    crossfadeMusic,
    playSFX,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Level1PassScene extends Phaser.Scene {
    constructor() {
        super("Level1PassScene");
    }

    preload() {
        this.load.image("marketBg", "/assets/background/market-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("Level1PassScene", "level1.complete");
        playSFX(this, "food-step");
        crossfadeMusic(this, "win");

        const { buttonScale } = getResponsiveMetrics(this);

        addCoverBg(this, "marketBg", { depth: 0 });

        createCompletionBoard(this, "lv1-finish", {
            contentHeightRatio: 0.5,
            button: { scale: buttonScale, onClick: () => goToScene(this, "Level2IntroScene") },
        });

        createDevSkipButton(this, "Level2IntroScene");
        createBackButton(this);
    }
}
