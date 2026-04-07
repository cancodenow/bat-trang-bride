import Phaser from "phaser";
import { preloadUIAssets, createPanel, createImageButton , createDevSkipButton , createBackButton } from "../UIHelpers";

export default class Level2InstructionScene extends Phaser.Scene {
  constructor() {
    super("Level2InstructionScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Decorative frame
    createPanel(this, width / 2, height / 2, 700, 440, {
      textureKey: "ui-modal-frame",
      fillColor: 0x16213e,
      strokeColor: 0xffcc00,
      strokeWidth: 3,
    });

    // Title — Vietnamese
    this.add
      .text(width / 2, height / 2 - 160, "NẤU CỖ", {
        fontSize: "48px",
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Subtitle — English
    this.add
      .text(width / 2, height / 2 - 100, "Cooking Challenge", {
        fontSize: "24px",
        color: "#aabbcc",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);

    // Divider
    this.add.rectangle(width / 2, height / 2 - 70, 500, 1, 0x3a5a7a);

    // Body
    this.add
      .text(width / 2, height / 2 + 10, "Follow Mom's instructions and choose the right\ncooking actions to complete each family dish.", {
        fontSize: "20px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Start button
    createImageButton(this, width / 2, height / 2 + 150, "Start Cooking", {
      fontSize: "22px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("Level2CookingGuidedScene"),
    });
    createDevSkipButton(this, "Level2CookingGuidedScene");
    createBackButton(this);
  }
}
