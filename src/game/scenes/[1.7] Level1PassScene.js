import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createContinueButton, createDevSkipButton , createBackButton } from "../UIHelpers";

// ── Tuning ────────────────────────────────────────────────────────────────────
const FINISH_SCALE = 0.8; // scale of the Finish_level1 image
// ─────────────────────────────────────────────────────────────────────────────

export default class Level1PassScene extends Phaser.Scene {
  constructor() {
    super("Level1PassScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");
    preloadUIAssets(this);
    preloadLevelAssets(this, 1);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height).setDepth(0);

    this.add
      .image(width / 2, height / 2, "lv1-finish")
      .setScale(FINISH_SCALE)
      .setDepth(1);

    createContinueButton(this, width / 2, height / 2 + 320, {
      scale: 0.2,
      onClick: () => this.scene.start("Level2IntroScene"),
    });

    createDevSkipButton(this, "Level2IntroScene");
    createBackButton(this);
  }
}
