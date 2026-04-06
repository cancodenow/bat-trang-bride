import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createPanel, createImageButton } from "../UIHelpers";

export default class TaskIntroScene extends Phaser.Scene {
  constructor() {
    super("TaskIntroScene");
  }

  preload() {
    this.load.image("taskBg", "/assets/background/task-bg.png");
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "taskBg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

    // Dialogue lines for introduction
    this.dialogueLines = [
      "Mom: Today, following tradition, our family is making a Bat Trang feast for lunch.",
      "Mom: A typical Bat Trang feast includes six dishes:",
    ];

    this.currentLine = 0;

    // Dialogue box background
    this.dialogueBox = createDialogueBox(this, width / 2, height - 120, 700, 150);

    // Dialogue text
    this.dialogueText = this.add
      .text(width / 2, height - 120, "", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "14px",
        color: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextDialogueLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextDialogueLine();
    });
  }

  showNextDialogueLine() {
    if (this.currentLine < this.dialogueLines.length) {
      this.dialogueText.setText(this.dialogueLines[this.currentLine]);
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

    // Framed panel background
    createPanel(this, width / 2, height / 2 - 20, 720, 400, {
      fillColor: 0x2a2a3a,
      strokeColor: 0xffffff,
    });

    // Feast title
    this.add
      .text(width / 2, 60, "A typical Bát Tràng feast includes six dishes:", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Feast dishes list
    const dishesText = `1. Canh măng mực
   (Bamboo Shoot & Shredded Squid Soup)

2. Canh bóng
   (Pork Puff Skin Soup)

3. Su hào xào mực
   (Stir-fried Kohlrabi with Squid)

4. Nem tôm
   (Crispy Shrimp Rolls)

5. Chim hầm hạt sen
   (Slow-braised Pigeon with Lotus Seeds)

6. Gà hấp lá chanh
   (Poached Chicken with Lime Leaves)`;

    this.add
      .text(width / 2, height / 2 + 20, dishesText, {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Action button
    createImageButton(this, width / 2, height - 60, "Of course, I can do it mom!", {
      fontSize: "24px",
      onClick: () => this.scene.start("MarketIngredientSelectionScene"),
    });
  }
}
