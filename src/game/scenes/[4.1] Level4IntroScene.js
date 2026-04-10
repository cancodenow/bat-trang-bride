import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, DialogueRunner, preloadCharacters, createBackButton, getResponsiveMetrics, preloadSoundAssets, playMusic, goToScene, purgeLevelAssets } from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Level4IntroScene extends Phaser.Scene {
  constructor() {
    super("Level4IntroScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 4);
    preloadCharacters(this);
    preloadSoundAssets(this);
  }

  create() {
    updateCheckpoint("Level4IntroScene", "level4.intro");
    purgeLevelAssets(this.game, 3);
    const metrics = getResponsiveMetrics(this);
    const { width, height, dpr } = metrics;

    this.add.image(width / 2, height / 2, "lv4-intro-bg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

    playMusic(this, "bgm");

    // Dialogue lines — charLeft: Taylor, charRight: mom speaking
    this.dialogueLines = [
      {
        text: "Mom: \"Taylor, you've worked hard. Go wash up and get ready to eat.\"",
        charLeft: "char-wife",
        charRight: "char-mom",
      },
    ];

    // Initialize DialogueRunner with dialogue configuration
    this.runner = new DialogueRunner(this, {
      box: {
        x: metrics.dialogue.x,
        y: metrics.dialogue.y,
        w: metrics.dialogue.width,
        h: metrics.dialogue.height,
      },
      chars: {
        left: { x: width * 0.2, y: height, scale: 0.5 },
        right: { x: width * 0.8, y: height, scale: 0.5, flipX: true },
      },
      lines: this.dialogueLines,
      onComplete: () => this.showFamilyMeal(),
    });

    // createDevSkipButton(this, "Level4MainChallengeScene");
    createBackButton(this);
  }

  showFamilyMeal() {
    const metrics = getResponsiveMetrics(this);
    const { width, height } = metrics;

    this.destroyRunner(this.runner);

    this.add
      .image(width / 2, height / 2, "lv4-family-meal")
      .setDisplaySize(width, height)
      .setDepth(10);

    this.familyMealDialogueLines = [
      {
        text: "Mom: Taylor, everything turned out beautifully. This feast feels complete with you here.",
      },
      {
        text: "Taylor: Thank you, Mom. I'm glad I could help bring everyone together.",
      },
      {
        text: "Tùng: Eat while it's warm. After dinner, we'll clean up together.",
      },
    ];

    this.runner = new DialogueRunner(this, {
      box: {
        x: metrics.dialogue.x,
        y: metrics.dialogue.y,
        w: metrics.dialogue.width,
        h: metrics.dialogue.height,
      },
      lines: this.familyMealDialogueLines,
      onComplete: () => this.startLevel4Challenge(),
    });

    this.runner.boxObj.setDepth(20);
    this.runner.textObj.setDepth(21);
    this.runner.hintObj.setDepth(21);
  }

  startLevel4Challenge() {
    this.destroyRunner(this.runner);

    this.cameras.main.once("camerafadeoutcomplete", () => {
      goToScene(this, "Level4MainChallengeScene");
    });

    this.cameras.main.fadeOut(800, 0, 0, 0);
  }

  destroyRunner(runner) {
    if (!runner) return;

    runner.destroy();
    runner.boxObj?.destroy();
    runner.textObj?.destroy();
    runner.hintObj?.destroy();
    runner.charLeft?.destroy();
    runner.charRight?.destroy();
  }
}
