import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createFrame,
    preloadCharacters,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    DialogueRunner,
} from "../UIHelpers";

export default class TaskIntroScene extends Phaser.Scene {
    constructor() {
        super("TaskIntroScene");
    }

    preload() {
        this.load.image("taskBg", "/assets/background/task-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const { width, height } = this.scale;

        addCoverBg(this, "taskBg");

        this.cameras.main.setBackgroundColor("#3a3a4a");

        // Dialogue lines — charLeft: wife listening, charRight: mom speaking
        this.dialogueLines = [
            {
                text: "Mom: Today, following tradition, our family is making a Bat Trang feast for lunch.",
                charLeft: "char-wife",
                charRight: "char-mom-cook",
            },
            {
                text: "Mom: A typical Bat Trang feast includes six dishes:",
                charLeft: "char-wife-curious",
                charRight: "char-mom-cook",
            },
        ];

        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - 120, w: 700, h: 150 },
            chars: {
                left: { x: width * 0.2, y: height + 70, scale: 0.5 },
                right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showFeastPanel(),
        });

        createDevSkipButton(this, "MarketIngredientSelectionScene");
        createBackButton(this);
    }

    showFeastPanel() {
        const { width, height } = this.scale;

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
        createFrame(this, width / 2, height / 2 - 20, {
            textureKey: "ui-frame-food",
            scale: 0.8,
        });

        // Action button
        const BUTTON_SCALE = 0.15;
        this.add
            .image(width / 2, height - 60, "lv1-opt-tasks-of-course")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () =>
                this.scene.start("MarketIngredientSelectionScene"),
            );
    }
}
