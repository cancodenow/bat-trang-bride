import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadLevelAssets,
    createFrame,
    preloadCharacters,
    preloadSoundAssets,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    DialogueRunner,
    getResponsiveMetrics,
    createImageButton,
    playMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class TaskIntroScene extends Phaser.Scene {
    constructor() {
        super("TaskIntroScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("TaskIntroScene", "level1.task-intro");

        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr } = metrics;

        // Start gameplay music for Level 1
        playMusic(this, "bgm");

        addCoverBg(this, "taskBg");

        this.cameras.main.setBackgroundColor("#3a3a4a");

        // Dialogue lines — charLeft: wife listening, charRight: mom speaking
        this.dialogueLines = [
            {
                text: "Mom: Today, following tradition, our family is making a Bát Tràng feast for lunch.",
                charLeft: "char-wife",
                charRight: "char-mom-cook",
            },
            {
                text: "Mom: A typical Bát Tràng feast includes six dishes:",
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
            onComplete: () => this.showFeastPanel(),
        });

        createDevSkipButton(this, "MarketIngredientSelectionScene");
        createBackButton(this);
    }

    showFeastPanel() {
        const { width, height, dpr, buttonScale } = getResponsiveMetrics(this);

        // Hide dialogue runner elements
        this.runner.destroy();
        this.runner.boxObj.setVisible(false);
        this.runner.textObj.setVisible(false);
        this.runner.hintObj.setVisible(false);
        if (this.runner.charLeft) this.runner.charLeft.setVisible(false);
        if (this.runner.charRight) this.runner.charRight.setVisible(false);

        // Dark overlay behind the frame
        this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
            .setDepth(0);

        // Framed panel background
        createFrame(this, width / 2, (height / 2 - 20), {
            textureKey: "ui-frame-food",
            scale: 0.8,
        });

        // Action button
        createImageButton(this, width / 2, height - 60 * dpr, "", {
            textureKey: "lv1-opt-tasks-of-course",
            scale: buttonScale,
            onClick: () => goToScene(this, "MarketIngredientSelectionScene"),
        });
    }

    destroy() {
        purgeStoryAssets(this.game);
    }
}
