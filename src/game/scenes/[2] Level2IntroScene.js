import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createImageButton } from "../UIHelpers";

export default class Level2IntroScene extends Phaser.Scene {
  constructor() {
    super("Level2IntroScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a2a3a");

    // Dialogue box
    createDialogueBox(this, width / 2, height / 2 - 40, width - 200, 180, {
      fillColor: 0x141e2b,
      fillAlpha: 0.9,
      strokeColor: 0x5a8aaa,
    });

    // Speaker
    this.add
      .text(130, height / 2 - 120, "Mom", {
        fontSize: "18px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    // Dialogue
    this.add
      .text(width / 2, height / 2 - 40, "Cooking isn't hard, dear. Here — let's do it together!", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: width - 300 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Continue button
    createImageButton(this, width / 2, height / 2 + 100, "Begin Level 2", {
      fontSize: "20px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("Level2InstructionScene"),
    });
  }
}
