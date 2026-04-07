import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, preloadCharacters, createBox, createDevSkipButton , createBackButton } from "../UIHelpers";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  preload() {
    this.load.image("introBg", "/assets/background/intro-bg.png");
    this.load.image("morningBg", "/assets/background/morning-bg.png");
    preloadUIAssets(this);
    preloadLevelAssets(this, 1);
    preloadCharacters(this);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "introBg").setDisplaySize(width, height);

    // Story lines
    this.storyLines = [
      "After seven years together, you and Sơn Tùng finally got married!",
      "The wedding was held in his hometown - a traditional ceramic village near Hanoi.",
    ];

    this.currentLine = 0;

    // Textbox background
    createBox(this, width / 2, height - 130, {
      textureKey: "ui-box-textbox",
      width: 830,
      height: 150,
    });

    // Display area
    this.storyText = this.add
      .text(width / 2, height - 130, "", {
        fontSize: "24px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "16px",
        color: "#aaaaaa",
        fontFamily: "SVN-Pequena Neo",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextLine();
    });
    createDevSkipButton(this, "MorningScene01");
    createBackButton(this);
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

    this.input.off("pointerdown");

    const BUTTON_SCALE = 0.15;
    this.add
      .image(width / 2, height - 50, "continue_button")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.scene.start("MorningScene01"));
  }
}
