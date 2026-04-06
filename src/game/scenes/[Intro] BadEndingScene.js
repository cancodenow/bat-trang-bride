import Phaser from "phaser";

export default class BadEndingScene extends Phaser.Scene {
  constructor() {
    super("BadEndingScene");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#4a2a2a");

    // Bad Ending Title
    this.add
      .text(width / 2, height / 2 - 100, "BAD ENDING", {
        fontSize: "48px",
        color: "#ff6666",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Bad Ending Message
    this.add
      .text(width / 2, height / 2, "You accidentally watched TikTok for 5 hours\nand failed to wake up in time to help with lunch.", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    // Restart Button
    const restartButton = this.add
      .text(width / 2, height / 2 + 120, "Restart from Screen 01", {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { left: 20, right: 20, top: 12, bottom: 12 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    restartButton.on("pointerover", () => {
      restartButton.setStyle({ backgroundColor: "#dddddd" });
    });

    restartButton.on("pointerout", () => {
      restartButton.setStyle({ backgroundColor: "#ffffff" });
    });

    restartButton.on("pointerdown", () => {
      this.scene.start("MorningScene01");
    });
  }
}
