import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createDialogueBox, createDevSkipButton, preloadCharacters, createCharacter , createBackButton } from "../UIHelpers";

export default class BuyRibsIntroScene extends Phaser.Scene {
  constructor() {
    super("BuyRibsIntroScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");
    preloadUIAssets(this);
    preloadLevelAssets(this, 1);
    preloadCharacters(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#103c5a");

    // Market background
    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

    // Characters
    createCharacter(this, width * 0.2, height - 20, "char-wife", { scale: 0.5 });
    createCharacter(this, width * 0.8, height - 20, "char-mom-happy", { scale: 0.5, flipX: true });

    // Dialogue box
    createDialogueBox(this, width / 2, height - 140, width - 100, 200, {
      fillColor: 0x1a2a3a,
      fillAlpha: 0.92,
      strokeColor: 0x5a8aaa,
    });

    // Speaker label
    this.add
      .text(80, height - 230, "Mom", {
        fontSize: "18px",
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
      });

    // Dialogue text
    this.add
      .text(width / 2, height - 150, "Oh, you're so capable — you bought everything correctly.\nGo buy 1kg of pork ribs for me, then we'll head home.", {
        fontSize: "20px",
        color: "#000000",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: width - 200 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Button
    const BUTTON_SCALE = 0.15;
    this.add
      .image(width / 2, height - 50, "lv1-opt-tasks-of-course")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.scene.start("PorkRibSelectionScene"));
    createDevSkipButton(this, "PorkRibSelectionScene");
    createBackButton(this);
  }
}
