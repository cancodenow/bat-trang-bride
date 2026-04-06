import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox } from "../UIHelpers";

export default class Scene02MarketInvite extends Phaser.Scene {
  constructor() {
    super("Scene02MarketInvite");
  }

  preload() {
    this.load.image("marketInviteBg", "/assets/background/market-invite-bg.png");
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "marketInviteBg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

    // Dialogue lines
    this.dialogueLines = [
      "Taylor: Mom, is there anything I can help with?",
      "Mom: Oh Taylor, you're up so early. Go get some more sleep dear!",
      "Taylor: No, I'm fully awake, I'd like to help you. What are you doing?",
      "Mom: Alright then, I'm going to the market to prepare your welcome feast. Come here, go with me.",
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
      // All lines shown, show end screen
      this.showEndScreen();
    }
  }

  showEndScreen() {
    const { width, height } = this.scale;

    // Remove input listener for dialogue
    this.input.off("pointerdown");

    // Fade to black
    this.cameras.main.fadeOut(1500, 0, 0, 0);

    // After fade, transition to TaskIntroScene
    this.time.delayedCall(1500, () => {
      this.scene.start("TaskIntroScene");
    });
  }
}
