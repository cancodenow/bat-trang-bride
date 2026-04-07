import Phaser from "phaser";
import { getResponsiveMetrics } from "../UIHelpers";

export default class CookingChallengePlaceholderScene extends Phaser.Scene {
  constructor() {
    super("CookingChallengePlaceholderScene");
  }

  create() {
    const metrics = getResponsiveMetrics(this);
    const { width, height, fs } = metrics;

    this.cameras.main.setBackgroundColor("#1a2a3a");

    this.add
      .text(width / 2, height / 2, "Next scene: Cooking Challenge", {
        fontSize: fs(40),
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
