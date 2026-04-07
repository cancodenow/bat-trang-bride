import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createBox, preloadCharacters, createCharacter, createDevSkipButton , createBackButton } from "../UIHelpers";

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
        text: 'Mom: "Taylor, you\'ve worked hard. Go wash up and get ready to eat."',
        charLeft: "char-wife",
        charRight: "char-mom",
      },
    ];

    this.currentLine = 0;

    // Left character (Taylor) — listens, faces right
    this.charLeft = createCharacter(this, width * 0.2, height + 70, "char-wife", { scale: 0.5 });
    // Right character (mom) — speaks, flipped to face left
    this.charRight = createCharacter(this, width * 0.8, height + 50, "char-mom", { scale: 0.5, flipX: true });

    // Dialogue box background
    this.dialogueBox = createBox(this, width / 2, height - 120, {
      textureKey: "ui-box-textbox",
      width: 700,
      height: 150,
    });

    // Dialogue text
    this.dialogueText = this.add
      .text(width / 2, height - 120, "", {
        fontSize: "22px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "14px",
        color: "#aaaaaa",
        fontFamily: "SVN-Pequena Neo",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextDialogueLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextDialogueLine();
    });

    createDevSkipButton(this, "Level4MainChallengeScene");
    createBackButton(this);
  }

  showNextDialogueLine() {
    if (this.currentLine < this.dialogueLines.length) {
      const { text, charLeft, charRight } = this.dialogueLines[this.currentLine];
      this.dialogueText.setText(text);
      this.charLeft.setTexture(charLeft);
      this.charRight.setTexture(charRight);
      this.currentLine++;
    } else {
      this.showFamilyMeal();
    }
  }

  showFamilyMeal() {
    const { width, height } = this.scale;

    this.input.off("pointerdown");

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
