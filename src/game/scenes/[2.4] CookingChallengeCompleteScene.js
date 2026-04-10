import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createBackButton,
    createCompletionBoard,
    getResponsiveMetrics,
    preloadSoundAssets,
    playSFX,
    playMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class CookingChallengeCompleteScene extends Phaser.Scene {
    constructor() {
        super("CookingChallengeCompleteScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("CookingChallengeCompleteScene", "level2.complete");
        const { width, height } = this.scale;
        const { buttonScale } = getResponsiveMetrics(this);

        playSFX(this, "food-step");
        playMusic(this, "win");

        this.add
            .image(width / 2, height / 2, "lv2-cl1-bg-start")
            .setDisplaySize(width, height)
            .setDepth(0);

        createCompletionBoard(this, "lv2-finish", {
            contentHeightRatio: 0.5,
            button: { scale: buttonScale, onClick: () => goToScene(this, "Level3IntroScene") },
        });

        // createDevSkipButton(this, "Level3IntroScene");
        createBackButton(this);
    }
}
