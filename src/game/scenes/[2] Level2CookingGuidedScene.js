import Phaser from "phaser";
import { preloadUIAssets, createDialogueBox, createImageButton, createModalFrame } from "../UIHelpers";

export default class Level2CookingGuidedScene extends Phaser.Scene {
  constructor() {
    super("Level2CookingGuidedScene");
  }

  preload() {
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;
    this.W = width;
    this.H = height;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // ===================== DISH DATA =====================

    this.dishes = [
      {
        title: "Bamboo Shoot and Dried Squid Soup",
        introDialogue: [
          "We'll start with bamboo shoot and dried squid soup, dear.",
          "This is a slow soup, so we need to treat the bamboo shoots and squid differently.",
        ],
        steps: [
          {
            instruction: "Put in the dried bamboo shoots first.",
            correct: "Dried bamboo shoots",
          },
          {
            instruction: "Now pour in water for the soup.",
            correct: "Add water",
          },
          {
            instruction: "Good. Let it cook gently.",
            correct: "Low heat",
          },
          {
            instruction: "Now add the dried squid.",
            correct: "Dried squid",
          },
          {
            instruction: "Finish by adding seasoning.",
            correct: "Add seasoning",
          },
        ],
        completionLine:
          "That's right, dear. A good soup needs patience and gentle heat.",
      },
      {
        title: "Pork Skin Balloon Soup",
        introDialogue: [
          "Now let's make pork skin balloon soup.",
          "This dish is delicate, so we must keep the broth clear and gentle.",
        ],
        steps: [
          {
            instruction: "Put in the puffed pork skin.",
            correct: "Puffed pork skin",
          },
          {
            instruction: "Now add water to make the broth.",
            correct: "Add water",
          },
          {
            instruction: "Let it cook on low heat.",
            correct: "Low heat",
          },
          {
            instruction: "Now add the shiitake mushrooms.",
            correct: "Shiitake mushrooms",
          },
          {
            instruction: "Good. Add seasoning to finish the soup.",
            correct: "Add seasoning",
          },
        ],
        completionLine:
          "Very good. A refined soup should be light, clear, and fragrant.",
      },
      {
        title: "Stir-fried Kohlrabi with Squid",
        introDialogue: [
          "Next is stir-fried kohlrabi with squid.",
          "This one is quicker, so the pan should be hot and the vegetables should stay crisp.",
        ],
        steps: [
          {
            instruction: "Turn the stove to high heat first.",
            correct: "High heat",
          },
          {
            instruction: "Now add the squid into the pan.",
            correct: "Squid",
          },
          {
            instruction: "Give it a quick stir.",
            correct: "Stir",
          },
          {
            instruction: "Now add the kohlrabi.",
            correct: "Kohlrabi",
          },
          {
            instruction: "Finish with seasoning.",
            correct: "Add seasoning",
          },
        ],
        completionLine:
          "Exactly, dear. A good stir-fry should stay crisp and fresh.",
      },
    ];

    // Wrong feedback rotation
    this.wrongLines = [
      "Not quite, dear. Think again.",
      "Almost there, dear. Try once more.",
      "Something is missing here, dear.",
      "Have another look at the recipe, dear.",
      "Not this one, dear. Try another.",
    ];
    this.wrongLineIndex = 0;

    // State
    this.currentDishIndex = 0;
    this.currentStepIndex = 0;
    this.introLineIndex = 0;
    this.phase = "intro"; // "intro" | "cooking" | "completion"

    // Collect all unique choice tokens across all steps of all dishes, for distractors
    this.allTokens = [];
    this.dishes.forEach((dish) => {
      dish.steps.forEach((step) => {
        if (!this.allTokens.includes(step.correct)) {
          this.allTokens.push(step.correct);
        }
      });
    });

    this.loadDish(0);
  }

  // ===================== LOAD DISH =====================

  loadDish(index) {
    this.children.removeAll(true);
    this.currentDishIndex = index;
    this.currentStepIndex = 0;
    this.introLineIndex = 0;
    this.phase = "intro";

    this.drawChrome();
    this.showIntro();
  }

  // ===================== CHROME (persistent UI) =====================

  drawChrome() {
    const dish = this.dishes[this.currentDishIndex];

    // Progress label (top-right)
    this.add
      .text(
        this.W - 30,
        20,
        "Dish " + (this.currentDishIndex + 1) + " / " + this.dishes.length,
        { fontSize: "16px", color: "#888888", fontFamily: "Arial" }
      )
      .setOrigin(1, 0);

    // Dish title (top-center)
    this.add
      .text(this.W / 2, 30, dish.title, {
        fontSize: "28px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // Divider
    this.add.rectangle(this.W / 2, 72, this.W - 100, 1, 0x3a5a7a);

    // Pot / pan area — a simple visual in the center
    this.potY = 340;
    this.add
      .ellipse(this.W / 2, this.potY, 320, 180, 0x222e3e)
      .setStrokeStyle(3, 0x5a8aaa);
    this.add
      .ellipse(this.W / 2, this.potY - 30, 260, 60, 0x1a2538)
      .setStrokeStyle(1, 0x3a5a7a);
    this.add
      .text(this.W / 2, this.potY + 10, "🍲", {
        fontSize: "54px",
        align: "center",
      })
      .setOrigin(0.5);

    // Container for ingredients that have been added to the pot
    this.potIngredients = [];

    // Dialogue box background at bottom-center
    this.dialogueBg = createDialogueBox(
      this,
      this.W / 2,
      this.H - 290,
      this.W - 160,
      80,
      {
        fillColor: 0x141e2b,
        fillAlpha: 0.92,
        strokeColor: 0x5a8aaa,
      }
    );
  }

  // ===================== INTRO DIALOGUE =====================

  showIntro() {
    const dish = this.dishes[this.currentDishIndex];
    this.phase = "intro";
    this.introLineIndex = 0;

    this.showIntroLine();
  }

  showIntroLine() {
    const dish = this.dishes[this.currentDishIndex];
    const lines = dish.introDialogue;

    // Clear previous intro elements
    if (this.introGroup) {
      this.introGroup.forEach((obj) => obj.destroy());
    }
    this.introGroup = [];

    const line = lines[this.introLineIndex];

    // Speaker
    const speaker = this.add.text(110, this.H - 318, "Mom", {
      fontSize: "15px",
      color: "#ffcc00",
      fontFamily: "Arial",
      fontStyle: "bold",
    });
    this.introGroup.push(speaker);

    // Dialogue text
    const txt = this.add
      .text(this.W / 2, this.H - 290, line, {
        fontSize: "19px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: this.W - 240 },
        lineSpacing: 6,
      })
      .setOrigin(0.5);
    this.introGroup.push(txt);

    // Continue / Start cooking button
    const isLast = this.introLineIndex >= lines.length - 1;
    const btnLabel = isLast ? "Let's Cook!" : "Next";

    const { bg: btn } = createImageButton(this, this.W / 2, this.H - 215, btnLabel, {
      fontSize: "18px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => {
        if (isLast) {
          // Clean up intro elements and start cooking
          this.introGroup.forEach((obj) => obj.destroy());
          btn.destroy();
          this.introGroup = [];
          this.phase = "cooking";
          this.currentStepIndex = 0;
          this.showStep();
        } else {
          this.introLineIndex++;
          this.showIntroLine();
        }
      },
    });
    this.introGroup.push(btn);
  }

  // ===================== COOKING STEP =====================

  showStep() {
    const dish = this.dishes[this.currentDishIndex];
    const step = dish.steps[this.currentStepIndex];

    // Clear previous step elements
    if (this.stepGroup) {
      this.stepGroup.forEach((obj) => obj.destroy());
    }
    this.stepGroup = [];

    // Step progress dots
    const dotY = 88;
    const dotGap = 28;
    const totalDots = dish.steps.length;
    const dotsStartX = this.W / 2 - ((totalDots - 1) * dotGap) / 2;
    for (let i = 0; i < totalDots; i++) {
      const color =
        i < this.currentStepIndex
          ? 0x66ff66
          : i === this.currentStepIndex
          ? 0xffcc00
          : 0x3a5a7a;
      const dot = this.add.circle(dotsStartX + i * dotGap, dotY, 8, color);
      this.stepGroup.push(dot);
    }

    // Step counter
    const stepLabel = this.add
      .text(
        this.W / 2,
        dotY + 22,
        "Step " + (this.currentStepIndex + 1) + " of " + totalDots,
        { fontSize: "13px", color: "#888888", fontFamily: "Arial" }
      )
      .setOrigin(0.5);
    this.stepGroup.push(stepLabel);

    // Mom instruction
    const speaker = this.add.text(110, this.H - 318, "Mom", {
      fontSize: "15px",
      color: "#ffcc00",
      fontFamily: "Arial",
      fontStyle: "bold",
    });
    this.stepGroup.push(speaker);

    const instrText = this.add
      .text(this.W / 2, this.H - 290, step.instruction, {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: this.W - 240 },
        lineSpacing: 6,
      })
      .setOrigin(0.5);
    this.stepGroup.push(instrText);

    // Feedback text (below dialogue box)
    this.feedbackText = this.add
      .text(this.W / 2, this.H - 230, "", {
        fontSize: "15px",
        color: "#ff9999",
        fontFamily: "Arial",
        fontStyle: "italic",
        align: "center",
      })
      .setOrigin(0.5);
    this.stepGroup.push(this.feedbackText);

    // Render choice tokens
    this.renderChoices(step);
  }

  // ===================== CHOICE TOKENS =====================

  renderChoices(step) {
    // Build choices: correct answer + distractors from other steps
    const correct = step.correct;

    // Get some distractors — pick from allTokens, excluding the correct one
    const distractors = this.allTokens.filter((t) => t !== correct);

    // Shuffle distractors and take 3-4
    const shuffledDistractors = Phaser.Utils.Array.Shuffle([...distractors]);
    const numDistractors = Math.min(3, shuffledDistractors.length);
    const choices = [correct, ...shuffledDistractors.slice(0, numDistractors)];

    // Shuffle all choices
    Phaser.Utils.Array.Shuffle(choices);

    // Layout tokens in a row at bottom
    const tokenY = this.H - 140;
    const fontSize = 17;
    const charW = fontSize * 0.55;
    const paddingH = 20;
    const gap = 16;

    // Calculate widths
    const tokenData = choices.map((text) => ({
      text,
      w: Math.max(text.length * charW + paddingH * 2, 100),
    }));

    // Arrange — allow wrapping into multiple rows
    const maxRowW = this.W - 200;
    const rows = [];
    let currentRow = [];
    let currentRowW = 0;

    tokenData.forEach((td) => {
      if (currentRowW + td.w + gap > maxRowW && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        currentRowW = 0;
      }
      currentRow.push(td);
      currentRowW += td.w + gap;
    });
    if (currentRow.length > 0) rows.push(currentRow);

    let rowY = tokenY;
    rows.forEach((row) => {
      const totalW = row.reduce((sum, td) => sum + td.w + gap, -gap);
      let rx = this.W / 2 - totalW / 2;

      row.forEach((td) => {
        const isCorrect = td.text === correct;

        // Token background
        const tokenBg = this.add
          .rectangle(rx + td.w / 2, rowY, td.w, 44, 0x2a4a6a)
          .setStrokeStyle(2, 0x5a8aaa);
        tokenBg.setInteractive({ useHandCursor: true });
        this.stepGroup.push(tokenBg);

        // Token label
        const tokenLabel = this.add
          .text(rx + td.w / 2, rowY, td.text, {
            fontSize: fontSize + "px",
            color: "#ffffff",
            fontFamily: "Arial",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5);
        this.stepGroup.push(tokenLabel);

        // Hover
        tokenBg.on("pointerover", () => {
          tokenBg.setFillStyle(0x3a5a7a);
          tokenBg.setStrokeStyle(2, 0x88aacc);
        });
        tokenBg.on("pointerout", () => {
          tokenBg.setFillStyle(0x2a4a6a);
          tokenBg.setStrokeStyle(2, 0x5a8aaa);
        });

        // Click
        tokenBg.on("pointerdown", () => {
          if (isCorrect) {
            this.onCorrectChoice(td.text, tokenBg, tokenLabel);
          } else {
            this.onWrongChoice(tokenBg, tokenLabel);
          }
        });

        rx += td.w + gap;
      });

      rowY += 54;
    });

    // "Choose the right ingredient or action" hint
    const hint = this.add
      .text(this.W / 2, tokenY - 30, "Choose the right ingredient or action:", {
        fontSize: "14px",
        color: "#888888",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);
    this.stepGroup.push(hint);
  }

  // ===================== CORRECT CHOICE =====================

  onCorrectChoice(text, tokenBg, tokenLabel) {
    // Flash the token green
    tokenBg.setFillStyle(0x22664a);
    tokenBg.setStrokeStyle(2, 0x66ff66);
    tokenLabel.setColor("#66ff66");

    // Add ingredient to pot visually
    const idx = this.potIngredients.length;
    const angle = (idx / 6) * Math.PI * 2 - Math.PI / 2;
    const rx = 50;
    const ry = 18;
    const ix = this.W / 2 + Math.cos(angle) * rx;
    const iy = this.potY - 30 + Math.sin(angle) * ry;

    const addedLabel = this.add
      .text(ix, iy, text, {
        fontSize: "13px",
        color: "#88ddaa",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate ingredient flying into pot
    const startX = tokenBg.x;
    const startY = tokenBg.y;

    const flyLabel = this.add
      .text(startX, startY, text, {
        fontSize: "15px",
        color: "#66ff66",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: flyLabel,
      x: ix,
      y: iy,
      alpha: 0.6,
      scale: 0.8,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        flyLabel.destroy();
        addedLabel.setAlpha(1);
      },
    });

    this.potIngredients.push(addedLabel);

    // Advance after brief delay
    this.time.delayedCall(700, () => {
      const dish = this.dishes[this.currentDishIndex];
      if (this.currentStepIndex < dish.steps.length - 1) {
        this.currentStepIndex++;
        this.showStep();
      } else {
        // Dish complete — show completion line then success modal
        this.showCompletionLine();
      }
    });
  }

  // ===================== WRONG CHOICE =====================

  onWrongChoice(tokenBg, tokenLabel) {
    // Flash red
    tokenBg.setFillStyle(0x664422);
    tokenBg.setStrokeStyle(2, 0xff4444);
    tokenLabel.setColor("#ff8888");

    // Restore after a short time
    this.time.delayedCall(600, () => {
      tokenBg.setFillStyle(0x2a4a6a);
      tokenBg.setStrokeStyle(2, 0x5a8aaa);
      tokenLabel.setColor("#ffffff");
    });

    // Rotating feedback
    const line = this.wrongLines[this.wrongLineIndex % this.wrongLines.length];
    this.wrongLineIndex++;

    if (this.feedbackText) {
      this.feedbackText.setText("Mom: \"" + line + "\"");
      this.feedbackText.setColor("#ff9999");
    }
  }

  // ===================== COMPLETION LINE =====================

  showCompletionLine() {
    const dish = this.dishes[this.currentDishIndex];

    // Clear step elements
    if (this.stepGroup) {
      this.stepGroup.forEach((obj) => obj.destroy());
      this.stepGroup = [];
    }

    // Show completion dialogue
    const speaker = this.add.text(110, this.H - 318, "Mom", {
      fontSize: "15px",
      color: "#ffcc00",
      fontFamily: "Arial",
      fontStyle: "bold",
    });

    const compText = this.add
      .text(this.W / 2, this.H - 290, dish.completionLine, {
        fontSize: "20px",
        color: "#aaffaa",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: this.W - 240 },
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    // After a short pause, show success modal
    this.time.delayedCall(1500, () => {
      speaker.destroy();
      compText.destroy();
      this.showSuccessModal();
    });
  }

  // ===================== SUCCESS MODAL =====================

  showSuccessModal() {
    const { container: modal } = createModalFrame(this, 520, 280, {
      textureKey: "ui-success-modal",
    });

    const title = this.add
      .text(this.W / 2, this.H / 2 - 80, "Nicely Done", {
        fontSize: "30px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const body = this.add
      .text(
        this.W / 2,
        this.H / 2 - 10,
        "The dish is ready.\nOne more step closer to the family feast.",
        {
          fontSize: "18px",
          color: "#ffffff",
          fontFamily: "Arial",
          align: "center",
          lineSpacing: 8,
        }
      )
      .setOrigin(0.5);

    const { bg: btn } = createImageButton(this, this.W / 2, this.H / 2 + 80, "Continue", {
      fontSize: "20px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.goToNextDish(),
    });

    modal.add([title, body, btn]);
  }

  // ===================== NEXT DISH =====================

  goToNextDish() {
    const nextIndex = this.currentDishIndex + 1;
    if (nextIndex < this.dishes.length) {
      this.loadDish(nextIndex);
    } else {
      this.scene.start("CookingChallengeCompleteScene");
    }
  }
}
