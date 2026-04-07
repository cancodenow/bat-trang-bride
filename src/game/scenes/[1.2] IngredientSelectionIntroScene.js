import Phaser from "phaser";
import { preloadUIAssets , createBackButton } from "../UIHelpers";

export default class IngredientSelectionIntroScene extends Phaser.Scene {
  constructor() {
    super("IngredientSelectionIntroScene");
  }

  preload() {
    this.load.image("ingredientIntroBg", "/assets/background/ingredient-intro-bg.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "ingredientIntroBg").setDisplaySize(width, height).setDepth(0);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4).setDepth(1);

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Placeholder text
    this.add
      .text(width / 2, height / 2, "Next step: Choose ingredients at the market", {
        fontSize: "32px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
