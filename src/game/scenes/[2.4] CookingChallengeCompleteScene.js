import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createDevSkipButton,
    createBackButton,
    createCompletionBoard,
    getResponsiveMetrics,
} from "../UIHelpers";

export default class CookingChallengeCompleteScene extends Phaser.Scene {
    constructor() {
        super("CookingChallengeCompleteScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
    }

    create() {
        const { width, height } = this.scale;
        const { buttonScale } = getResponsiveMetrics(this);

        this.add
            .image(width / 2, height / 2, "lv2-cl1-bg-start")
            .setDisplaySize(width, height)
            .setDepth(0);

        createCompletionBoard(this, "lv2-finish", {
            contentHeightRatio: 0.5,
            button: { scale: buttonScale, onClick: () => this.scene.start("Level3IntroScene") },
        });

        createDevSkipButton(this, "Level3IntroScene");
        createBackButton(this);
    }
}
