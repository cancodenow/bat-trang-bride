import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createContinueButton, createDevSkipButton , createBackButton } from "../UIHelpers";

// ── Tuning ────────────────────────────────────────────────────────────────────
const FINISH_SCALE = 0.8; // scale of the Finish_level4 image
// ─────────────────────────────────────────────────────────────────────────────

export default class Level4PassScene extends Phaser.Scene {
  constructor() {
    super("Level4PassScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 4);
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "lv4-bg")
      .setDisplaySize(width, height)
      .setDepth(0);

    this.add
      .image(width / 2, height / 2, "lv4-finish")
      .setScale(FINISH_SCALE)
      .setDepth(1);

    createContinueButton(this, width / 2, height / 2 + 320, {
      scale: 0.2,
      onClick: () => this.scene.start("FinishLevelScene"),
    });

    createDevSkipButton(this, "FinishLevelScene");
    createBackButton(this);
  }
}
