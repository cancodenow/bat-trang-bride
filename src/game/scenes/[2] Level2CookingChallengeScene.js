import Phaser from "phaser";

export default class Level2CookingChallengeScene extends Phaser.Scene {
  constructor() {
    super("Level2CookingChallengeScene");
  }

  create() {
    const { width, height } = this.scale;
    this.W = width;
    this.H = height;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    // =================== DISH DATA ===================

    this.dishes = [
      {
        title: "Bamboo Shoot and Dried Squid Soup",
        textTemplate:
          "Bamboo shoot and dried squid soup is a signature soup in the Bat Trang feast, known for the combination of [1] and [2]. To cook this dish, the bamboo shoots need to be [3] so they soften and expand, while the squid only needs to be [4]. Because the bamboo shoots take longer to soften, they must be [5], while the squid is usually [6] to preserve its sweetness and aroma.",
        answers: {
          1: "dried bamboo shoots",
          2: "dried squid",
          3: "soaked for 6-8 hours",
          4: "soaked for 15-20 minutes",
          5: "simmered first",
          6: "added later",
        },
      },
      {
        title: "Pork Skin Balloon Soup",
        textTemplate:
          "Pork skin balloon soup is an elaborate soup that showcases technique in a traditional feast. The two main ingredients are [1] and [2]. Before cooking, the puffed pork skin must be [3] to reach the right softness, while the shiitake mushrooms only need to be [4]. Therefore, the pork skin must be [5] before cooking, while the mushrooms are usually [6] to preserve their fragrance.",
        answers: {
          1: "puffed pork skin",
          2: "shiitake mushrooms",
          3: "soaked for 30-40 minutes",
          4: "soaked for 10-15 minutes",
          5: "fully expanded / softened carefully",
          6: "added later",
        },
      },
      {
        title: "Stir-fried Kohlrabi with Squid",
        textTemplate:
          "Stir-fried kohlrabi with squid is a signature stir-fry that combines crunch with deep savory sweetness. The dish is made from [1] and [2]. During preparation, the kohlrabi is [3], while the squid needs to be [4] before cooking. When stir-frying, the squid is usually [5] in the hot pan, while the kohlrabi is [6] so it keeps its crunch and does not release too much water.",
        answers: {
          1: "kohlrabi",
          2: "squid",
          3: "julienned",
          4: "softened by soaking",
          5: "stir-fried first",
          6: "added later",
        },
      },
    ];

    // Wrong feedback lines — rotate through them
    this.wrongLines = [
      "Not quite, dear. Think again.",
      "Almost there, dear. Try once more.",
      "Something is missing here, dear.",
      "Have another look at the recipe, dear.",
    ];
    this.wrongLineIndex = 0;

    // State
    this.currentDishIndex = 0;
    this.filledAnswers = {};
    this.selectedBlank = null;

    this.loadDish(0);
  }

  // =================== LOAD DISH ===================

  loadDish(index) {
    // Clear everything except camera bg
    this.children.removeAll(true);

    this.currentDishIndex = index;
    this.filledAnswers = {};
    this.selectedBlank = null;
    this.blankObjects = {};
    this.optionObjects = [];

    const dish = this.dishes[index];

    // Progress
    this.add
      .text(this.W - 30, 20, "Dish " + (index + 1) + " / " + this.dishes.length, {
        fontSize: "16px",
        color: "#888888",
        fontFamily: "Arial",
      })
      .setOrigin(1, 0);

    // Title
    this.add
      .text(this.W / 2, 36, dish.title, {
        fontSize: "26px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Divider
    this.add.rectangle(this.W / 2, 68, this.W - 100, 1, 0x3a5a7a);

    // Render recipe with blanks
    this.renderRecipe(dish);

    // Render shuffled answer options
    this.renderOptions(dish);

    // Check button
    this.checkBtn = this.add
      .text(this.W / 2, this.H - 50, "Check Recipe", {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { left: 25, right: 25, top: 10, bottom: 10 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.checkBtn.on("pointerover", () => this.checkBtn.setStyle({ backgroundColor: "#dddddd" }));
    this.checkBtn.on("pointerout", () => this.checkBtn.setStyle({ backgroundColor: "#ffffff" }));
    this.checkBtn.on("pointerdown", () => this.validateRecipe());

    // Feedback text area
    this.feedbackText = this.add
      .text(this.W / 2, this.H - 95, "", {
        fontSize: "16px",
        color: "#ff9999",
        fontFamily: "Arial",
        fontStyle: "italic",
        align: "center",
      })
      .setOrigin(0.5);
  }

  // =================== RENDER RECIPE ===================

  renderRecipe(dish) {
    const template = dish.textTemplate;
    const blankCount = Object.keys(dish.answers).length;

    // Parse text into segments: text and blanks
    const segments = [];
    let remaining = template;

    while (remaining.length > 0) {
      const match = remaining.match(/\[(\d+)\]/);
      if (!match) {
        segments.push({ type: "text", value: remaining });
        break;
      }
      const before = remaining.substring(0, match.index);
      if (before) segments.push({ type: "text", value: before });
      segments.push({ type: "blank", index: parseInt(match[1]) });
      remaining = remaining.substring(match.index + match[0].length);
    }

    // Render as flowing text with inline blank slots
    // We'll use a word-wrapping approach: render word by word
    const startX = 60;
    const startY = 85;
    const maxWidth = this.W - 120;
    const lineHeight = 36;
    const fontSize = 17;

    let curX = startX;
    let curY = startY;

    segments.forEach((seg) => {
      if (seg.type === "text") {
        // Split text into words and render each
        const words = seg.value.split(/(\s+)/);
        words.forEach((word) => {
          if (!word) return;

          // Measure word width roughly
          const charW = fontSize * 0.52;
          const wordW = word.length * charW;

          // Wrap if needed
          if (curX + wordW > startX + maxWidth && word.trim()) {
            curX = startX;
            curY += lineHeight;
          }

          if (word.trim()) {
            this.add.text(curX, curY, word, {
              fontSize: fontSize + "px",
              color: "#cccccc",
              fontFamily: "Arial",
            });
          }
          curX += wordW;
        });
      } else if (seg.type === "blank") {
        const blankIdx = seg.index;
        const answerText = dish.answers[blankIdx];
        const blankW = Math.max(answerText.length * fontSize * 0.5, 100);

        // Wrap if needed
        if (curX + blankW + 20 > startX + maxWidth) {
          curX = startX;
          curY += lineHeight;
        }

        // Blank slot background
        const slotX = curX;
        const slotY = curY - 2;
        const slotW = blankW + 16;
        const slotH = 28;

        const bg = this.add.rectangle(
          slotX + slotW / 2,
          slotY + slotH / 2,
          slotW,
          slotH,
          0x2a3a50
        );
        bg.setStrokeStyle(2, 0x5a8aaa);
        bg.setInteractive({ useHandCursor: true });

        // Blank label — shows index or filled answer
        const label = this.add
          .text(slotX + slotW / 2, slotY + slotH / 2, "[" + blankIdx + "]", {
            fontSize: "14px",
            color: "#5a8aaa",
            fontFamily: "Arial",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5);

        // Click to select this blank
        bg.on("pointerdown", () => this.selectBlank(blankIdx));
        bg.on("pointerover", () => {
          if (this.selectedBlank !== blankIdx) bg.setStrokeStyle(2, 0x88aacc);
        });
        bg.on("pointerout", () => {
          if (this.selectedBlank !== blankIdx) bg.setStrokeStyle(2, 0x5a8aaa);
        });

        this.blankObjects[blankIdx] = { bg, label, slotW, slotH };

        curX += slotW + 6;
      }
    });
  }

  // =================== RENDER OPTIONS ===================

  renderOptions(dish) {
    const answers = Object.values(dish.answers);

    // Shuffle answers
    const shuffled = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Render options at bottom area
    const optionY = this.H - 190;

    this.add
      .text(this.W / 2, optionY - 30, "Answer Options (click a blank, then click an option)", {
        fontSize: "13px",
        color: "#888888",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    // Layout options in rows
    const maxRowW = this.W - 120;
    const padding = 12;
    const gap = 10;
    const fontSize = 14;
    const charW = fontSize * 0.55;

    // Calculate option sizes
    const optionSizes = shuffled.map((text) => ({
      text,
      w: text.length * charW + padding * 2 + 16,
    }));

    // Arrange into rows
    const rows = [];
    let currentRow = [];
    let currentRowW = 0;

    optionSizes.forEach((opt) => {
      if (currentRowW + opt.w + gap > maxRowW && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        currentRowW = 0;
      }
      currentRow.push(opt);
      currentRowW += opt.w + gap;
    });
    if (currentRow.length > 0) rows.push(currentRow);

    let rowY = optionY;
    rows.forEach((row) => {
      const totalW = row.reduce((sum, o) => sum + o.w + gap, -gap);
      let rx = this.W / 2 - totalW / 2;

      row.forEach((opt) => {
        const chipBg = this.add.rectangle(
          rx + opt.w / 2,
          rowY,
          opt.w,
          32,
          0x2a4a6a
        );
        chipBg.setStrokeStyle(1, 0x5a8aaa);
        chipBg.setInteractive({ useHandCursor: true });

        const chipText = this.add
          .text(rx + opt.w / 2, rowY, opt.text, {
            fontSize: fontSize + "px",
            color: "#ffffff",
            fontFamily: "Arial",
            align: "center",
          })
          .setOrigin(0.5);

        chipBg.on("pointerdown", () => this.assignAnswer(opt.text));
        chipBg.on("pointerover", () => chipBg.setFillStyle(0x3a5a7a));
        chipBg.on("pointerout", () => {
          const isUsed = Object.values(this.filledAnswers).includes(opt.text);
          chipBg.setFillStyle(isUsed ? 0x1a2a3a : 0x2a4a6a);
          chipText.setColor(isUsed ? "#555555" : "#ffffff");
        });

        this.optionObjects.push({ chipBg, chipText, text: opt.text });
        rx += opt.w + gap;
      });

      rowY += 40;
    });
  }

  // =================== BLANK SELECTION ===================

  selectBlank(blankIdx) {
    // Deselect previous
    if (this.selectedBlank !== null && this.blankObjects[this.selectedBlank]) {
      this.blankObjects[this.selectedBlank].bg.setStrokeStyle(2, 0x5a8aaa);
    }

    this.selectedBlank = blankIdx;

    // Highlight selected blank
    if (this.blankObjects[blankIdx]) {
      this.blankObjects[blankIdx].bg.setStrokeStyle(2, 0xffcc00);
    }

    this.feedbackText.setText("");
  }

  // =================== ASSIGN ANSWER ===================

  assignAnswer(answerText) {
    if (this.selectedBlank === null) {
      this.feedbackText.setText("Click a blank first, then click an answer.");
      this.feedbackText.setColor("#ffcc00");
      return;
    }

    const blankIdx = this.selectedBlank;

    // If this answer was already assigned to another blank, remove it
    for (const [key, val] of Object.entries(this.filledAnswers)) {
      if (val === answerText) {
        delete this.filledAnswers[key];
        // Reset that blank's label
        const k = parseInt(key);
        if (this.blankObjects[k]) {
          this.blankObjects[k].label.setText("[" + k + "]");
          this.blankObjects[k].label.setColor("#5a8aaa");
          this.blankObjects[k].bg.setFillStyle(0x2a3a50);
        }
      }
    }

    // If this blank already had a different answer, free it
    if (this.filledAnswers[blankIdx]) {
      // The old answer is now freed
    }

    // Assign
    this.filledAnswers[blankIdx] = answerText;

    // Update blank label
    if (this.blankObjects[blankIdx]) {
      this.blankObjects[blankIdx].label.setText(answerText);
      this.blankObjects[blankIdx].label.setColor("#aaddff");
      this.blankObjects[blankIdx].label.setFontSize(13);
      this.blankObjects[blankIdx].bg.setFillStyle(0x1c3350);
    }

    // Update option chips — dim used ones
    this.optionObjects.forEach((opt) => {
      const isUsed = Object.values(this.filledAnswers).includes(opt.text);
      opt.chipBg.setFillStyle(isUsed ? 0x1a2a3a : 0x2a4a6a);
      opt.chipText.setColor(isUsed ? "#555555" : "#ffffff");
    });

    // Auto-advance to next empty blank
    const dish = this.dishes[this.currentDishIndex];
    const blankCount = Object.keys(dish.answers).length;
    let nextBlank = null;
    for (let i = 1; i <= blankCount; i++) {
      if (!this.filledAnswers[i]) {
        nextBlank = i;
        break;
      }
    }

    if (nextBlank !== null) {
      this.selectBlank(nextBlank);
    } else {
      // All filled — deselect
      this.blankObjects[blankIdx].bg.setStrokeStyle(2, 0x66ff66);
      this.selectedBlank = null;
    }

    this.feedbackText.setText("");
  }

  // =================== VALIDATION ===================

  validateRecipe() {
    const dish = this.dishes[this.currentDishIndex];
    const blankCount = Object.keys(dish.answers).length;

    // Check all blanks filled
    for (let i = 1; i <= blankCount; i++) {
      if (!this.filledAnswers[i]) {
        this.feedbackText.setText("Please fill in all blanks first.");
        this.feedbackText.setColor("#ffcc00");
        return;
      }
    }

    // Check correctness
    let allCorrect = true;
    for (let i = 1; i <= blankCount; i++) {
      if (this.filledAnswers[i] !== dish.answers[i]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      this.showSuccessModal();
    } else {
      this.showWrongFeedback();
    }
  }

  showWrongFeedback() {
    const line = this.wrongLines[this.wrongLineIndex % this.wrongLines.length];
    this.wrongLineIndex++;

    this.feedbackText.setText(line);
    this.feedbackText.setColor("#ff9999");

    // Highlight wrong blanks in red briefly
    const dish = this.dishes[this.currentDishIndex];
    for (let i = 1; i <= Object.keys(dish.answers).length; i++) {
      if (this.filledAnswers[i] !== dish.answers[i] && this.blankObjects[i]) {
        this.blankObjects[i].bg.setStrokeStyle(2, 0xff4444);
        // Reset after 1.5 seconds
        this.time.delayedCall(1500, () => {
          if (this.blankObjects[i]) {
            this.blankObjects[i].bg.setStrokeStyle(2, 0x5a8aaa);
          }
        });
      }
    }
  }

  // =================== SUCCESS MODAL ===================

  showSuccessModal() {
    const modal = this.add.container(0, 0).setDepth(200);

    const overlay = this.add
      .rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x000000, 0.6)
      .setInteractive();

    const box = this.add.rectangle(this.W / 2, this.H / 2, 520, 280, 0x16213e);
    const border = this.add
      .rectangle(this.W / 2, this.H / 2, 520, 280, 0xffffff, 0)
      .setStrokeStyle(3, 0xffcc00);

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

    const btn = this.add
      .text(this.W / 2, this.H / 2 + 80, "Continue", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "#ffcc00",
        padding: { left: 30, right: 30, top: 10, bottom: 10 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#ffee00" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ffcc00" }));
    btn.on("pointerdown", () => this.goToNextDish());

    modal.add([overlay, box, border, title, body, btn]);
  }

  // =================== NEXT DISH ===================

  goToNextDish() {
    const nextIndex = this.currentDishIndex + 1;
    if (nextIndex < this.dishes.length) {
      this.loadDish(nextIndex);
    } else {
      this.scene.start("CookingChallengeCompleteScene");
    }
  }
}
