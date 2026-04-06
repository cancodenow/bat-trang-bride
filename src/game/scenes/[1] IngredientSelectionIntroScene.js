import Phaser from "phaser";

export default class IngredientSelectionIntroScene extends Phaser.Scene {
  constructor() {
    super("IngredientSelectionIntroScene");
  }

  preload() {
    this.load.image("ingredientIntroBg", "/assets/background/ingredient-intro-bg.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "ingredientIntroBg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Placeholder text
    this.add
      .text(width / 2, height / 2, "Next step: Choose ingredients at the market", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
