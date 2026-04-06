import Phaser from "phaser";
import { preloadUIAssets, createImageButton } from "../UIHelpers";

export default class BargainBadEndingScene extends Phaser.Scene {
  constructor() {
    super("BargainBadEndingScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#000000");

    // Big title
    this.add
      .text(width / 2, height / 2 - 100, "BAD ENDING", {
        fontSize: "48px",
        color: "#ff4444",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Body text
    this.add
      .text(width / 2, height / 2, "You do not know how to bargain.\nYou spend all your pocket money on the ribs.", {
        fontSize: "22px",
        color: "#cccccc",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 600 },
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Restart button
    createImageButton(this, width / 2, height / 2 + 120, "Restart from Screen 04", {
      fontSize: "20px",
      onClick: () => this.scene.start("BuyRibsIntroScene"),
    });
  }
}
