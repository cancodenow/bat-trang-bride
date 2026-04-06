import Phaser from "phaser";
import { preloadUIAssets, createImageButton } from "../UIHelpers";

export default class OpeningScene extends Phaser.Scene {
  constructor() {
    super("OpeningScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    this.add.text(width / 2, height / 2 - 40, "Becoming a Bát Tràng Bride", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: "Arial",
      align: "center",
    }).setOrigin(0.5);

    this.add.text(50, 50, "Opening Scene Loaded", {
      fontSize: "24px",
      color: "#ffffff",
    });

    createImageButton(this, width / 2, height - 100, "Start the Journey", {
      fontSize: "28px",
      onClick: () => this.scene.start("IntroScene"),
    });
  }
}