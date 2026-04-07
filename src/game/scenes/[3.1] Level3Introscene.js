import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, DialogueRunner, preloadCharacters, createDevSkipButton, createBackButton } from "../UIHelpers";

export default class Level3IntroScene extends Phaser.Scene {
  constructor() {
    super("Level3IntroScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 2);
    preloadCharacters(this);
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "lv2-cl1-bg-start").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#3a3a4a");

    // Dialogue lines — charLeft: Tùng, charRight: mom speaking
    this.dialogueLines = [
      {
        text: "Mom: \"You two set the table. Tùng, remember what I told you. Guide Taylor, okay? Don't get it wrong.\"",
        charLeft: "char-husband",
        charRight: "char-mom-cook",
      },
    ];

    // Initialize DialogueRunner with dialogue configuration
    this.runner = new DialogueRunner(this, {
      box: { x: width / 2, y: height - 120, w: 750, h: 150 },
      chars: {
        left: { x: width * 0.2, y: height + 70, scale: 0.5 },
        right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
      },
      lines: this.dialogueLines,
      onComplete: () => this.scene.start("Level3MainChallengeScene"),
    });

    createDevSkipButton(this, "Level3mainchallenge");
    createBackButton(this);
  }
}
