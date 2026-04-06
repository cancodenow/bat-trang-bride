import Phaser from "phaser";
import { preloadUIAssets, createPanel, createImageButton } from "../UIHelpers";

export default class CookingChallengeCompleteScene extends Phaser.Scene {
  constructor() {
    super("CookingChallengeCompleteScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width: W, height: H } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Gold border frame
    createPanel(this, W / 2, H / 2, W - 40, H - 40, {
      textureKey: "ui-success-modal",
      fillColor: 0x1a1a2e,
      strokeColor: 0xffcc00,
      strokeWidth: 3,
    });

    // Title
    this.add
      .text(W / 2, H / 2 - 120, "Cooking Challenge Complete!", {
        fontSize: "36px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Body
    this.add
      .text(
        W / 2,
        H / 2 - 20,
        "You have successfully prepared all three dishes\nfor the family feast.\n\nMom is proud of you!",
        {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial",
          align: "center",
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5);

    // Continue button
    createImageButton(this, W / 2, H / 2 + 120, "Continue", {
      fontSize: "22px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => {
        // Placeholder — go back to opening or a future Level 3
        this.scene.start("OpeningScene");
      },
    });
  }
}
