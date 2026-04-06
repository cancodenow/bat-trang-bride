import Phaser from "phaser";

export default class BedroomScene extends Phaser.Scene {
  constructor() {
    super("BedroomScene");
  }

  preload() {
    this.load.image("bedroomBg", "/assets/background/bedroom-bg.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "bedroomBg").setDisplaySize(width, height);



    this.add
      .text(width / 2, 120, "5:00 AM", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 280, "Taylor: I'm too excited to sleep...", {
        fontSize: "24px",
        color: "#ffffff",
        wordWrap: { width: 650 },
        align: "center",
      })
      .setOrigin(0.5);
  }
}