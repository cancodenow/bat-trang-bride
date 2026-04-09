import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    DialogueRunner,
    preloadCharacters,
    preloadSoundAssets,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    playSFX,
    crossfadeMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Scene02MarketInvite extends Phaser.Scene {
    constructor() {
        super("Scene02MarketInvite");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("Scene02MarketInvite", "intro.market-invite");
        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr } = metrics;

        // Fade out any previous music and play footsteps
        crossfadeMusic(this, "food-step", 500);

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

        createDevSkipButton(this, "TaskIntroScene");
        createBackButton(this);
    }

    showEndScreen() {
        this.runner.destroy();

        // Fade to black
        this.cameras.main.fadeOut(1500, 0, 0, 0);

        // After fade, transition to TaskIntroScene
        this.time.delayedCall(1500, () => {
            goToScene(this, "TaskIntroScene");
        });
    }
}
