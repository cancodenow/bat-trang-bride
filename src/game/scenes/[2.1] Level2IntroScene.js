import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    DialogueRunner,
    preloadCharacters,
    createDevSkipButton,
    createBackButton,
    getResponsiveMetrics,
    addCoverBg,
} from "../UIHelpers";

export default class Level2IntroScene extends Phaser.Scene {
    constructor() {
        super("Level2IntroScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadCharacters(this);
    }

    create() {
        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr } = metrics;

        addCoverBg(this, "lv2-intro-bg");

        this.cameras.main.setBackgroundColor("#3a3a4a");

        this.dialogueLines = [
            {
                text: "Mom: Cooking isn't hard, dear. Here — let's do it together!",
                charLeft: "char-wife-curious",
                charRight: "char-mom-cook",
            },
        ];

        this.runner = new DialogueRunner(this, {
            box: {
                x: width / 2,
                y: height - Math.round(120 * dpr),
                w: Math.round(700 * dpr),
                h: Math.round(150 * dpr),
            },
            chars: {
                left: { x: width * 0.2, y: height + Math.round(70 * dpr), scale: 0.5 },
                right: { x: width * 0.8, y: height + Math.round(50 * dpr), scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showEndScreen(),
        });

        createDevSkipButton(this, "Level2CookingGuidedScene");
        createBackButton(this);
    }

    showEndScreen() {
        this.runner.destroy();

        this.cameras.main.fadeOut(1500, 0, 0, 0);

        this.time.delayedCall(1500, () => {
            this.scene.start("Level2CookingGuidedScene");
        });
    }
}
