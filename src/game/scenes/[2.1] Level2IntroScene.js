import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createImageButton , createDevSkipButton , createBackButton, getResponsiveMetrics } from "../UIHelpers";

export default class Level2IntroScene extends Phaser.Scene {
  constructor() {
    super("Level2IntroScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const metrics = getResponsiveMetrics(this);
    const { width, height, fs, dpr } = metrics;

    this.cameras.main.setBackgroundColor("#1a2a3a");

    // Dialogue box
    createDialogueBox(this, width / 2, height / 2 - Math.round(40 * dpr), width - Math.round(200 * dpr), Math.round(180 * dpr), {
      fillColor: 0x141e2b,
      fillAlpha: 0.9,
      strokeColor: 0x5a8aaa,
    });

    // Speaker
    this.add
      .text(Math.round(130 * dpr), height / 2 - Math.round(120 * dpr), "Mom", {
        fontSize: fs(18),
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
      });

    // Dialogue
    this.add
      .text(width / 2, height / 2 - 40, "Cooking isn't hard, dear. Here — let's do it together!", {
        fontSize: fs(22),
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: width - Math.round(300 * dpr) },
        lineSpacing: Math.round(8 * dpr),
      })
      .setOrigin(0.5);

    // Continue button
    createImageButton(this, width / 2, height / 2 + Math.round(100 * dpr), "Begin Level 2", {
      fontSize: fs(20),
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("Level2CookingGuidedScene"),
    });
    createDevSkipButton(this, "Level2CookingGuidedScene");
    createBackButton(this);
  }
}
