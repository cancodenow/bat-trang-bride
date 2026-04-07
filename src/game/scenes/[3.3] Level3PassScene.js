import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createContinueButton, createDevSkipButton , createBackButton } from "../UIHelpers";

// ── Tuning ────────────────────────────────────────────────────────────────────
const FINISH_SCALE = 0.8; // scale of the Finish_level3 image
// ─────────────────────────────────────────────────────────────────────────────

export default class Level3PassScene extends Phaser.Scene {
  constructor() {
    super("Level3PassScene");
  }

  preload() {
    this.load.image("taskBg", "/assets/background/task-bg.png");
    preloadUIAssets(this);
    preloadLevelAssets(this, 3);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "taskBg").setDisplaySize(width, height).setDepth(0);

    this.add
      .image(width / 2, height / 2, "lv3-finish")
      .setScale(FINISH_SCALE)
      .setDepth(1);

    createContinueButton(this, width / 2, height / 2 + 320, {
      scale: 0.2,
      onClick: () => this.scene.start("Level4IntroScene"),
    });

    createDevSkipButton(this, "Level4IntroScene");
    createBackButton(this);
  }
}
