import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, DialogueRunner, preloadCharacters, createDevSkipButton, createBackButton, getResponsiveMetrics, preloadSoundAssets, playMusic, crossfadeMusic, goToScene } from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Level3IntroScene extends Phaser.Scene {
    constructor() {
        super("Level3IntroScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("Level3IntroScene", "level3.intro");
        playMusic(this, "bgm");

        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr } = metrics;

        this.add.image(width / 2, height / 2, "lv2-cl1-bg-start").setDisplaySize(width, height);

        this.cameras.main.setBackgroundColor("#3a3a4a");

        // Dialogue lines — charLeft: Tùng, charRight: mom speaking
        this.dialogueLines = [
            {
                text: "Mom: \"You two set the table. Tùng, remember what I told you. Guide Taylor, okay? Don't get it wrong.\"",
                charLeft: "char-husband",
                charRight: "char-mom-cook",
            },
        ];

        // Initialize DialogueRunner with dialogue configuration
        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - Math.round(120 * dpr), w: Math.round(750 * dpr), h: Math.round(150 * dpr) },
            chars: {
                left: { x: width * 0.2, y: height + Math.round(70 * dpr), scale: 0.5 },
                right: { x: width * 0.8, y: height + Math.round(50 * dpr), scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => goToScene(this, "Level3MainChallengeScene"),
        });

        createDevSkipButton(this, "Level3MainChallengeScene");
        createBackButton(this);
    }
}
