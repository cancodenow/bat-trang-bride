import Phaser from "phaser";

export default class CookingChallengePlaceholderScene extends Phaser.Scene {
  constructor() {
    super("CookingChallengePlaceholderScene");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a2a3a");

    this.add
      .text(width / 2, height / 2, "Next scene: Cooking Challenge", {
        fontSize: "40px",
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
