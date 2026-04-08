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

export default class Level3PassScene extends Phaser.Scene {
    constructor() {
        super("Level3PassScene");
    }

    preload() {
        this.load.image("taskBg", "/assets/background/task-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 3);
    }

    create() {
        const { buttonScale } = getResponsiveMetrics(this);

        addCoverBg(this, "taskBg", { depth: 0 });

        createCompletionBoard(this, "lv3-finish", {
            contentHeightRatio: 0.5,
            button: { scale: buttonScale, onClick: () => this.scene.start("Level4IntroScene") },
        });

        createDevSkipButton(this, "Level4IntroScene");
        createBackButton(this);
    }
}
