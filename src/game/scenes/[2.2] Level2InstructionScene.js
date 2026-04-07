import Phaser from "phaser";
import { preloadUIAssets, createPanel, createImageButton , createDevSkipButton , createBackButton, getResponsiveMetrics } from "../UIHelpers";

export default class Level2InstructionScene extends Phaser.Scene {
  constructor() {
    super("Level2InstructionScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const metrics = getResponsiveMetrics(this);
    const { width, height, fs, dpr } = metrics;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Decorative frame
    createPanel(this, width / 2, height / 2, Math.round(700 * dpr), Math.round(440 * dpr), {
      textureKey: "ui-modal-frame",
      fillColor: 0x16213e,
      strokeColor: 0xffcc00,
      strokeWidth: Math.round(3 * dpr),
    });

    // Title — Vietnamese
    this.add
      .text(width / 2, height / 2 - Math.round(160 * dpr), "NẤU CỖ", {
        fontSize: fs(48),
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Subtitle — English
    this.add
      .text(width / 2, height / 2 - Math.round(100 * dpr), "Cooking Challenge", {
        fontSize: fs(24),
        color: "#aabbcc",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);

    // Divider
    this.add.rectangle(width / 2, height / 2 - Math.round(70 * dpr), Math.round(500 * dpr), Math.round(1 * dpr), 0x3a5a7a);

    // Body
    this.add
      .text(width / 2, height / 2 + Math.round(10 * dpr), "Follow Mom's instructions and choose the right\ncooking actions to complete each family dish.", {
        fontSize: fs(20),
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        lineSpacing: Math.round(10 * dpr),
      })
      .setOrigin(0.5);

    // Start button
    createImageButton(this, width / 2, height / 2 + Math.round(150 * dpr), "Start Cooking", {
      fontSize: fs(22),
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("Level2CookingGuidedScene"),
    });
    createDevSkipButton(this, "Level2CookingGuidedScene");
    createBackButton(this);
  }
}
