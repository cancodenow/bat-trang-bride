import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createFinishButton,
    createDevSkipButton,
    createBackButton,
    createCompletionBoard,
    getResponsiveMetrics,
    preloadSoundAssets,
    playMusic,
    playSFX,
} from "../UIHelpers";

export default class Level4PassScene extends Phaser.Scene {
    constructor() {
        super("Level4PassScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 4);
        preloadSoundAssets(this);
    }

    create() {
        const { width, height } = this.scale;
        const { buttonScale } = getResponsiveMetrics(this);

        this.add
            .image(width / 2, height / 2, "lv4-bg")
            .setDisplaySize(width, height)
            .setDepth(0);

        playSFX(this, "clap");
        playMusic(this, "win");

        const { centerX, buttonY, depth } = createCompletionBoard(this, "lv4-finish", {
            contentHeightRatio: 0.5,
        });

        const { bg: button } = createFinishButton(this, centerX, buttonY, {
            scale: buttonScale,
            onClick: () => this.scene.start("FinishLevelScene"),
        });
        button.setDepth(depth + 1);

        createDevSkipButton(this, "FinishLevelScene");
        createBackButton(this);
    }
}
