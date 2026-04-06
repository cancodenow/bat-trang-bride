import Phaser from "phaser";
import { preloadUIAssets, createPanel, createImageButton } from "../UIHelpers";

export default class Level1PassScene extends Phaser.Scene {
  constructor() {
    super("Level1PassScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#103c5a");

    // Market background
    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

    // Congratulation modal
    createPanel(this, width / 2, height / 2, 620, 320, {
      textureKey: "ui-success-modal",
      fillColor: 0x1a2a3a,
      strokeColor: 0xffcc00,
      strokeWidth: 3,
    });

    // Title
    this.add
      .text(width / 2, height / 2 - 100, "🎉 Congratulations!", {
        fontSize: "32px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, height / 2 - 50, "You passed Level 1", {
        fontSize: "26px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Description
    this.add
      .text(width / 2, height / 2 + 10, "You successfully completed the market trip\nand brought everything home.", {
        fontSize: "18px",
        color: "#cccccc",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 550 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Continue button
    createImageButton(this, width / 2, height / 2 + 100, "Continue", {
      fontSize: "22px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("Level2IntroScene"),
    });
  }
}
