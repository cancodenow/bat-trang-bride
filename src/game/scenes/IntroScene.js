import Phaser from "phaser";
import { preloadUIAssets, createImageButton } from "../UIHelpers";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Story lines
    this.storyLines = [
      "After seven years together, you and Sơn Tùng finally got married!",
      "The wedding was held in his hometown - a traditional ceramic village near Hanoi.",
    ];

    this.currentLine = 0;

    // Display area
    this.storyText = this.add
      .text(width / 2, height / 2, "", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "16px",
        color: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextLine();
    });
  }

  showNextLine() {
    if (this.currentLine < this.storyLines.length) {
      this.storyText.setText(this.storyLines[this.currentLine]);
      this.currentLine++;
    } else {
      // All lines shown, show continue button
      this.showContinueButton();
    }
  }

  showContinueButton() {
    const { width, height } = this.scale;

    // Remove input listener for lines
    this.input.off("pointerdown");

    createImageButton(this, width / 2, height - 60, "Continue", {
      fontSize: "24px",
      onClick: () => this.scene.start("MorningScene01"),
    });
  }
}
