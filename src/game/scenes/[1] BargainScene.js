import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createChoiceButton } from "../UIHelpers";

export default class BargainScene extends Phaser.Scene {
  constructor() {
    super("BargainScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#103c5a");
    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    this.dialogueStep = 0;
    this.dialogueLines = [
      { speaker: "Seller", text: "You're taking the tender ribs, right? That will be 160K." },
      { speaker: "Taylor", text: "Why is it so expensive, sis? Could you lower it to 130K?" },
      { speaker: "Seller", text: "No, I'm already selling at the right price. If you're buying, I'll make it 150K for you." },
    ];

    // Dialogue box area
    this.dialogueBox = createDialogueBox(this, width / 2, height - 160, width - 100, 240, {
      fillColor: 0x1a2a3a,
      fillAlpha: 0.92,
      strokeColor: 0x5a8aaa,
    });

    // Speaker label
    this.speakerText = this.add
      .text(80, height - 272, "", {
        fontSize: "18px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    // Dialogue text
    this.dialogueText = this.add
      .text(width / 2, height - 180, "", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: width - 200 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // "Click to continue" hint
    this.continueHint = this.add
      .text(width / 2, height - 60, "▼ Click to continue", {
        fontSize: "14px",
        color: "#888888",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Choice buttons container (hidden initially)
    this.choiceContainer = this.add.container(0, 0).setVisible(false);

    this.createChoiceButtons();

    // Show first dialogue
    this.showCurrentDialogue();

    // Click to advance dialogue
    this.input.on("pointerdown", () => {
      if (this.choiceContainer.visible) return;

      this.dialogueStep++;
      if (this.dialogueStep < this.dialogueLines.length) {
        this.showCurrentDialogue();
      } else {
        // Show choices
        this.continueHint.setVisible(false);
        this.showChoices();
      }
    });
  }

  showCurrentDialogue() {
    const line = this.dialogueLines[this.dialogueStep];
    this.speakerText.setText(line.speaker);
    this.dialogueText.setText(line.text);

    const color = line.speaker === "Taylor" ? "#aaddff" : "#ffffff";
    this.dialogueText.setColor(color);
  }

  createChoiceButtons() {
    const { width, height } = this.scale;

    // Button 1 — correct: walk away
    const { bg: btn1 } = createChoiceButton(this, width / 2, height - 180, "Pretend not to buy, walk away, and wait\nfor the seller to call back.", {
      bgColor: "#2a4a6a",
      hoverBgColor: "#3a5a7a",
      fontSize: "16px",
      wordWrap: { width: 500 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      onClick: () => this.onCorrectChoice(),
    });

    // Button 2 — wrong: accept price
    const { bg: btn2 } = createChoiceButton(this, width / 2, height - 100, "Okay, I'll take it for 150K.", {
      bgColor: "#5a2a2a",
      hoverBgColor: "#6a3a3a",
      fontSize: "16px",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      onClick: () => this.scene.start("BargainBadEndingScene"),
    });

    this.choiceContainer.add([btn1, btn2]);
  }

  showChoices() {
    this.choiceContainer.setVisible(true);

    // Update dialogue to prompt
    this.speakerText.setText("");
    this.dialogueText.setText("What will you do?");
    this.dialogueText.setColor("#ffcc00");
  }

  onCorrectChoice() {
    // Disable clicks and choices
    this.input.removeAllListeners();
    this.choiceContainer.setVisible(false);

    // Play walk-away sequence
    this.walkAwayDialogue = [
      { speaker: "Taylor", text: "If that's the price, then I'll pass." },
      { speaker: "", text: "* footsteps... *", color: "#888888" },
      { speaker: "Seller", text: "WAIT! You're Ms. Hang's daughter-in-law, right?\nFine, take it — I'm giving you that price because I like your family." },
      { speaker: "Taylor", text: "Thank you." },
    ];

    this.walkStep = 0;
    this.showWalkDialogue();

    this.input.on("pointerdown", () => {
      this.walkStep++;
      if (this.walkStep < this.walkAwayDialogue.length) {
        this.showWalkDialogue();
      } else {
        this.scene.start("Level1PassScene");
      }
    });
  }

  showWalkDialogue() {
    const line = this.walkAwayDialogue[this.walkStep];
    this.speakerText.setText(line.speaker);
    this.dialogueText.setText(line.text);

    const color = line.color || (line.speaker === "Taylor" ? "#aaddff" : "#ffffff");
    this.dialogueText.setColor(color);

    // Show continue hint if not last line
    const isLast = this.walkStep === this.walkAwayDialogue.length - 1;
    this.continueHint.setVisible(true);
    this.continueHint.setText(isLast ? "▼ Click to continue" : "▼ Click to continue");
  }
}
