import Phaser from "phaser";

export default class MorningScene01 extends Phaser.Scene {
  constructor() {
    super("MorningScene01");
  }

  preload() {
    this.load.image("morningBg", "/assets/background/morning-bg.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "morningBg").setDisplaySize(width, height);

    this.cameras.main.setBackgroundColor("#2a3a4a");

    // Time label
    this.add
      .text(width / 2, 30, "5:00 AM", {
        fontSize: "28px",
        color: "#ffcc00",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Dialogue lines
    this.dialogueLines = [
      "Taylor: I'm too excited to sleep",
      "Taylor: Baby, baby,...",
      "Taylor: He seems not gonna wake up",
      "Taylor: What's the sound? Is that mom?",
      "Taylor: What should I do now?",
    ];

    this.currentLine = 0;

    // Dialogue box background
    this.dialogueBox = this.add.rectangle(width / 2, height - 120, 700, 150, 0x444444);

    // Dialogue text
    this.dialogueText = this.add
      .text(width / 2, height - 120, "", {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 650 },
      })
      .setOrigin(0.5);

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height - 40, "Click to continue...", {
        fontSize: "14px",
        color: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Show first line
    this.showNextDialogueLine();

    // Click to advance
    this.input.on("pointerdown", () => {
      this.showNextDialogueLine();
    });
  }

  showNextDialogueLine() {
    if (this.currentLine < this.dialogueLines.length) {
      this.dialogueText.setText(this.dialogueLines[this.currentLine]);
      this.currentLine++;
    } else {
      // All lines shown, show choice buttons
      this.showChoiceButtons();
    }
  }

  showChoiceButtons() {
    const { width, height } = this.scale;

    // Remove input listener for dialogue
    this.input.off("pointerdown");
    this.instructionText.setText("Make a choice:");

    // Button 1: Keep laying down
    const button1 = this.add
      .text(width / 2 - 150, height - 200, "Keep laying down,\nscrolling TikTok", {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button1.on("pointerover", () => {
      button1.setStyle({ backgroundColor: "#dddddd" });
    });

    button1.on("pointerout", () => {
      button1.setStyle({ backgroundColor: "#ffffff" });
    });

    button1.on("pointerdown", () => {
      this.scene.start("BadEndingScene");
    });

    // Button 2: Get up and help
    const button2 = this.add
      .text(width / 2 + 150, height - 200, "Get up and go out,\nask mother-in-law", {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button2.on("pointerover", () => {
      button2.setStyle({ backgroundColor: "#dddddd" });
    });

    button2.on("pointerout", () => {
      button2.setStyle({ backgroundColor: "#ffffff" });
    });

    button2.on("pointerdown", () => {
      this.scene.start("Scene02MarketInvite");
    });
  }
}
