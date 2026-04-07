import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, DialogueRunner, preloadCharacters, createDevSkipButton, createBackButton } from "../UIHelpers";

export default class Level4IntroScene extends Phaser.Scene {
  constructor() {
    super("Level4IntroScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 3);
    preloadLevelAssets(this, 4);
    preloadCharacters(this);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "lv3-bg-cl2").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

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
      box: { x: width / 2, y: height - 120, w: 700, h: 150 },
      chars: {
        left: { x: width * 0.2, y: height + 70, scale: 0.5 },
        right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
      },
      lines: this.dialogueLines,
      onComplete: () => this.showFamilyMeal(),
    });

    createDevSkipButton(this, "Level4MainChallengeScene");
    createBackButton(this);
  }

  showFamilyMeal() {
    const { width, height } = this.scale;

    this.runner.destroy();

    // Cover everything with the family meal image
    this.add
      .image(width / 2, height / 2, "lv4-family-meal")
      .setDisplaySize(width, height)
      .setDepth(10);

    // After 5 seconds, jump to the challenge
    this.time.delayedCall(3000, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
    });

    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("Level4MainChallengeScene");
    });
  }
}
