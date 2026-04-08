import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createDevSkipButton,
    createBackButton,
    createCompletionBoard,
    addCoverBg,
    getResponsiveMetrics,
} from "../UIHelpers";

export default class Level1PassScene extends Phaser.Scene {
    constructor() {
        super("Level1PassScene");
    }

    preload() {
        this.load.image("marketBg", "/assets/background/market-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
    }

    create() {
        const { buttonScale } = getResponsiveMetrics(this);

        addCoverBg(this, "marketBg", { depth: 0 });

        createCompletionBoard(this, "lv1-finish", {
            contentHeightRatio: 0.5,
            button: { scale: buttonScale, onClick: () => this.scene.start("Level2IntroScene") },
        });

        createDevSkipButton(this, "Level2IntroScene");
        createBackButton(this);
    }
}
