import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    DialogueRunner,
    preloadCharacters,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
} from "../UIHelpers";

export default class Scene02MarketInvite extends Phaser.Scene {
    constructor() {
        super("Scene02MarketInvite");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const { width, height } = this.scale;

        addCoverBg(this, "lv1-bg-homeyard");

        this.cameras.main.setBackgroundColor("#3a3a4a");

        // Dialogue lines — charLeft: wife, charRight: mom
        this.dialogueLines = [
            {
                text: "Taylor: Mom, is there anything I can help with?",
                charLeft: "char-wife",
                charRight: "char-mom",
            },
            {
                text: "Mom: Oh Taylor, you're up so early. Go get some more sleep dear!",
                charLeft: "char-wife",
                charRight: "char-mom-happy",
            },
            {
                text: "Taylor: No, I'm fully awake, I'd like to help you. What are you doing?",
                charLeft: "char-wife-curious",
                charRight: "char-mom-happy",
            },
            {
                text: "Mom: Alright then, I'm going to the market to prepare your welcome feast. Come, go with me.",
                charLeft: "char-wife-giggle",
                charRight: "char-mom-thrilled",
            },
        ];

        // Initialize DialogueRunner with dialogue configuration
        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - 120, w: 700, h: 150 },
            chars: {
                left: { x: width * 0.2, y: height + 70, scale: 0.5 },
                right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showEndScreen(),
        });

        createDevSkipButton(this, "TaskIntroScene");
        createBackButton(this);
    }

    showEndScreen() {
        this.runner.destroy();

        // Fade to black
        this.cameras.main.fadeOut(1500, 0, 0, 0);

        // After fade, transition to TaskIntroScene
        this.time.delayedCall(1500, () => {
            this.scene.start("TaskIntroScene");
        });
    }
}
