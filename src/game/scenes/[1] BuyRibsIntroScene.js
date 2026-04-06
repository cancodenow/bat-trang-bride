import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createImageButton } from "../UIHelpers";

export default class BuyRibsIntroScene extends Phaser.Scene {
  constructor() {
    super("BuyRibsIntroScene");
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
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

    // Dialogue box
    createDialogueBox(this, width / 2, height - 140, width - 100, 200, {
      fillColor: 0x1a2a3a,
      fillAlpha: 0.92,
      strokeColor: 0x5a8aaa,
    });

    // Speaker label
    this.add
      .text(80, height - 230, "Mom", {
        fontSize: "18px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    // Dialogue text
    this.add
      .text(width / 2, height - 150, "Oh, you're so capable — you bought everything correctly.\nGo buy 1kg of pork ribs for me, then we'll head home.", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: width - 200 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Button
    createImageButton(this, width / 2, height - 50, "Yes mom, let me go buy it", {
      fontSize: "18px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("PorkRibSelectionScene"),
    });
  }
}
