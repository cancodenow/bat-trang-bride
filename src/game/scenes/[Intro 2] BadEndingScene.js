import Phaser from "phaser";
import { preloadUIAssets, createDevSkipButton } from "../UIHelpers";

export default class BadEndingScene extends Phaser.Scene {
  constructor() {
    super("BadEndingScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#000000");

    // Title
    this.add
      .text(width / 2, height / 2 - 100, "BAD ENDING", {
        fontSize: "48px",
        color: "#ff4444",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Body
    this.add
      .text(width / 2, height / 2, "You accidentally watched TikTok for 5 hours\nand failed to wake up in time to help with lunch.", {
        fontSize: "22px",
        color: "#cccccc",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: 600 },
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Restart button
    const BUTTON_SCALE = 0.2;
    this.add
      .image(width / 2, height / 2 + 120, "continue_button")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.scene.start("MorningScene01", { skipToChoice: true }));

    createDevSkipButton(this, "MorningScene01");
  }
}
