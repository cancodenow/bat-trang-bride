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
    preloadSoundAssets,
    playMusic,
    crossfadeMusic,
    goToScene,
    purgeLevelAssets,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Level2IntroScene extends Phaser.Scene {
    constructor() {
        super("Level2IntroScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("Level2IntroScene", "level2.intro");
        purgeLevelAssets(this.game, 1);
        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr } = metrics;

        playMusic(this, "bgm");

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
                x: metrics.dialogue.x,
                y: metrics.dialogue.y,
                w: metrics.dialogue.width,
                h: metrics.dialogue.height,
            },
            chars: {
                left: { x: width * 0.2, y: height, scale: 0.5 },
                right: { x: width * 0.8, y: height, scale: 0.5, flipX: true },
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
            goToScene(this, "Level2CookingGuidedScene");
        });
    }
}
