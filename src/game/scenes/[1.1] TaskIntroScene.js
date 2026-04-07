import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createBox, createFrame, preloadCharacters, createCharacter, createDevSkipButton , createBackButton } from "../UIHelpers";

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

    this.add.image(width / 2, height / 2, "taskBg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

    // Dialogue lines — charLeft: wife listening, charRight: mom speaking
    this.dialogueLines = [
      { text: "Mom: Today, following tradition, our family is making a Bat Trang feast for lunch.", charLeft: "char-wife",         charRight: "char-mom-cook"  },
      { text: "Mom: A typical Bat Trang feast includes six dishes:",                               charLeft: "char-wife-curious", charRight: "char-mom-cook"  },
    ];

    this.currentLine = 0;

    // Left character (wife) — listens, faces right
    this.charLeft = createCharacter(this, width * 0.2, height + 70, "char-wife", { scale: 0.5 });
    // Right character (mom) — speaks, flipped to face left
    this.charRight = createCharacter(this, width * 0.8, height + 50, "char-mom-cook", { scale: 0.5, flipX: true });

    // Dialogue box background
    this.dialogueBox = createBox(this, width / 2, height - 120, {
      textureKey: "ui-box-textbox",
      width: 700,
      height: 150,
    });

    // Dialogue text
    this.dialogueText = this.add
      .text(width / 2, height - 120, "", {
        fontSize: "22px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "14px",
        color: "#aaaaaa",
        fontFamily: "SVN-Pequena Neo",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextDialogueLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextDialogueLine();
    });
    createDevSkipButton(this, "MarketIngredientSelectionScene");
    createBackButton(this);
  }

  showNextDialogueLine() {
    if (this.currentLine < this.dialogueLines.length) {
      const { text, charLeft, charRight } = this.dialogueLines[this.currentLine];
      this.dialogueText.setText(text);
      this.charLeft.setTexture(charLeft);
      this.charRight.setTexture(charRight);
      this.currentLine++;
    } else {
      // All lines shown, show the feast panel
      this.showFeastPanel();
    }
  }

  showFeastPanel() {
    const { width, height } = this.scale;

    // Remove input listener for dialogue
    this.input.off("pointerdown");

    // Hide dialogue elements
    this.dialogueBox.setVisible(false);
    this.dialogueText.setVisible(false);
    this.instructionText.setVisible(false);

    // Dark overlay behind the frame
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5).setDepth(0);

    // Framed panel background
    createFrame(this, width / 2, height / 2 - 20, {
      textureKey: "ui-frame-food", scale: 0.8
    });


    // Action button
    const BUTTON_SCALE = 0.15;
    this.add
      .image(width / 2, height - 60, "lv1-opt-tasks-of-course")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.scene.start("MarketIngredientSelectionScene"));
  }
}
