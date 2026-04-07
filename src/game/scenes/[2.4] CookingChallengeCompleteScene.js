import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createContinueButton, createDevSkipButton , createBackButton } from "../UIHelpers";

// ── Tuning ────────────────────────────────────────────────────────────────────
const FINISH_SCALE = 0.8; // scale of the Finish_level2 image
// ─────────────────────────────────────────────────────────────────────────────

export default class CookingChallengeCompleteScene extends Phaser.Scene {
  constructor() {
    super("CookingChallengeCompleteScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 2);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "lv2-cl1-bg-start").setDisplaySize(width, height).setDepth(0);

    this.add
      .image(width / 2, height / 2, "lv2-finish")
      .setScale(FINISH_SCALE)
      .setDepth(1);

    createContinueButton(this, width / 2, height / 2 + 320, {
      scale: 0.2,
      onClick: () => this.scene.start("Level3IntroScene"),
    });

    createDevSkipButton(this, "Level3IntroScene");
    createBackButton(this);
  }
}
