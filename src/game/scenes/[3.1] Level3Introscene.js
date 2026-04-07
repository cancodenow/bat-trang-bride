import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createBox, preloadCharacters, createCharacter, createDevSkipButton , createBackButton } from "../UIHelpers";

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
        text: 'Mom: "You two set the table. Tùng, remember what I told you. Guide Taylor, okay? Don\'t get it wrong."',
        charLeft: "char-husband",
        charRight: "char-mom-cook",
      },
    ];

    this.currentLine = 0;

    // Left character (Tùng) — listens, faces right
    this.charLeft = createCharacter(this, width * 0.2, height + 70, "char-husband", { scale: 0.5 });
    // Right character (mom) — speaks, flipped to face left
    this.charRight = createCharacter(this, width * 0.8, height + 50, "char-mom-cook", { scale: 0.5, flipX: true });

    // Dialogue box background
    this.dialogueBox = createBox(this, width / 2, height - 120, {
      textureKey: "ui-box-textbox",
      width: 750,
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

    createDevSkipButton(this, "Level3mainchallenge");
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
      this.scene.start("Level3MainChallengeScene");
    }
  }
}
