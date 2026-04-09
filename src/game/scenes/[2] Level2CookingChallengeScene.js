import Phaser from "phaser";
import {
    createDevSkipButton,
    createBackButton,
    getResponsiveMetrics,
    preloadSoundAssets,
    playMusic,
    playSFX,
    crossfadeMusic,
} from "../UIHelpers";
import { startManagedScene } from "../sceneLoading.js";

export default class Level2CookingChallengeScene extends Phaser.Scene {
  constructor() {
    super("Level2CookingChallengeScene");
  }

  preload() {
    preloadSoundAssets(this);
  }

  create() {
    playMusic(this, "bgm");
    const { width, height } = this.scale;
    this.metrics = getResponsiveMetrics(this);
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

    createDevSkipButton(this, "CookingChallengeCompleteScene");
    createBackButton(this);
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
      .text(this.W - Math.round(30 * this.metrics.dpr), Math.round(20 * this.metrics.dpr), "Dish " + (index + 1) + " / " + this.dishes.length, {
        fontSize: this.metrics.fs(16),
        color: "#888888",
        fontFamily: "SVN-Pequena Neo",
      })
      .setOrigin(1, 0);

    // Title
    this.add
      .text(this.W / 2, Math.round(36 * this.metrics.dpr), dish.title, {
        fontSize: this.metrics.fs(26),
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
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
      .text(this.W / 2, this.H - Math.round(50 * this.metrics.dpr), "Check Recipe", {
        fontSize: this.metrics.fs(18),
        fontFamily: "SVN-Pequena Neo",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: {
          left: Math.round(25 * this.metrics.dpr),
          right: Math.round(25 * this.metrics.dpr),
          top: Math.round(10 * this.metrics.dpr),
          bottom: Math.round(10 * this.metrics.dpr),
        },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.checkBtn.on("pointerover", () => this.checkBtn.setStyle({ backgroundColor: "#dddddd" }));
    this.checkBtn.on("pointerout", () => this.checkBtn.setStyle({ backgroundColor: "#ffffff" }));
    this.checkBtn.on("pointerdown", () => this.validateRecipe());

    // Feedback text area
    this.feedbackText = this.add
      .text(this.W / 2, this.H - Math.round(95 * this.metrics.dpr), "", {
        fontSize: this.metrics.fs(16),
        color: "#ff9999",
        fontFamily: "SVN-Pequena Neo",
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
    const startX = Math.round(60 * this.metrics.dpr);
    const startY = Math.round(85 * this.metrics.dpr);
    const maxWidth = this.W - Math.round(120 * this.metrics.dpr);
    const lineHeight = Math.round(36 * this.metrics.dpr);
    const fontSize = Math.round(17 * this.metrics.dpr);

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
              fontFamily: "SVN-Pequena Neo",
            });
          }
          curX += wordW;
        });
      } else if (seg.type === "blank") {
        const blankIdx = seg.index;
        const answerText = dish.answers[blankIdx];
        const blankW = Math.max(answerText.length * fontSize * 0.5, Math.round(100 * this.metrics.dpr));

        // Wrap if needed
        if (curX + blankW + 20 > startX + maxWidth) {
          curX = startX;
          curY += lineHeight;
        }

        // Blank slot background
        const slotX = curX;
        const slotY = curY - Math.round(2 * this.metrics.dpr);
        const slotW = blankW + Math.round(16 * this.metrics.dpr);
        const slotH = Math.round(28 * this.metrics.dpr);

        const bg = this.add.rectangle(
          slotX + slotW / 2,
          slotY + slotH / 2,
          slotW,
          slotH,
          0x2a3a50
        );
        bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x5a8aaa);
        bg.setInteractive({ useHandCursor: true });

        // Blank label — shows index or filled answer
        const label = this.add
          .text(slotX + slotW / 2, slotY + slotH / 2, "[" + blankIdx + "]", {
            fontSize: this.metrics.fs(14),
            color: "#5a8aaa",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5);

        // Click to select this blank
        bg.on("pointerdown", () => this.selectBlank(blankIdx));
        bg.on("pointerover", () => {
          if (this.selectedBlank !== blankIdx) bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x88aacc);
        });
        bg.on("pointerout", () => {
          if (this.selectedBlank !== blankIdx) bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x5a8aaa);
        });

        this.blankObjects[blankIdx] = { bg, label, slotW, slotH };

        curX += slotW + Math.round(6 * this.metrics.dpr);
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
    const optionY = this.H - Math.round(190 * this.metrics.dpr);

    this.add
      .text(this.W / 2, optionY - Math.round(30 * this.metrics.dpr), "Answer Options (click a blank, then click an option)", {
        fontSize: this.metrics.fs(13),
        color: "#888888",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
      })
      .setOrigin(0.5);

    // Layout options in rows
    const maxRowW = this.W - Math.round(120 * this.metrics.dpr);
    const padding = Math.round(12 * this.metrics.dpr);
    const gap = Math.round(10 * this.metrics.dpr);
    const fontSize = Math.round(14 * this.metrics.dpr);
    const charW = fontSize * 0.55;

    // Calculate option sizes
    const optionSizes = shuffled.map((text) => ({
      text,
      w: text.length * charW + padding * 2 + Math.round(16 * this.metrics.dpr),
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
          Math.round(32 * this.metrics.dpr),
          0x2a4a6a
        );
        chipBg.setStrokeStyle(Math.round(1 * this.metrics.dpr), 0x5a8aaa);
        chipBg.setInteractive({ useHandCursor: true });

        const chipText = this.add
          .text(rx + opt.w / 2, rowY, opt.text, {
            fontSize: fontSize + "px",
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
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

      rowY += Math.round(40 * this.metrics.dpr);
    });
  }

  // =================== BLANK SELECTION ===================

  selectBlank(blankIdx) {
    // Deselect previous
    if (this.selectedBlank !== null && this.blankObjects[this.selectedBlank]) {
      this.blankObjects[this.selectedBlank].bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x5a8aaa);
    }

    this.selectedBlank = blankIdx;

    // Highlight selected blank
    if (this.blankObjects[blankIdx]) {
      this.blankObjects[blankIdx].bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0xffcc00);
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
      this.blankObjects[blankIdx].label.setFontSize(this.metrics.fs(13));
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
      this.blankObjects[blankIdx].bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x66ff66);
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
        this.blankObjects[i].bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0xff4444);
        // Reset after 1.5 seconds
        this.time.delayedCall(1500, () => {
          if (this.blankObjects[i]) {
            this.blankObjects[i].bg.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x5a8aaa);
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

    const box = this.add.rectangle(this.W / 2, this.H / 2, Math.round(520 * this.metrics.dpr), Math.round(280 * this.metrics.dpr), 0x16213e);
    const border = this.add
      .rectangle(this.W / 2, this.H / 2, Math.round(520 * this.metrics.dpr), Math.round(280 * this.metrics.dpr), 0xffffff, 0)
      .setStrokeStyle(Math.round(3 * this.metrics.dpr), 0xffcc00);

    const title = this.add
      .text(this.W / 2, this.H / 2 - Math.round(80 * this.metrics.dpr), "Nicely Done", {
        fontSize: this.metrics.fs(30),
        color: "#ffcc00",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const body = this.add
      .text(
        this.W / 2,
        this.H / 2 - Math.round(10 * this.metrics.dpr),
        "The dish is ready.\nOne more step closer to the family feast.",
        {
          fontSize: this.metrics.fs(18),
          color: "#000000",
          fontFamily: "SVN-Pequena Neo",
          align: "center",
          lineSpacing: Math.round(8 * this.metrics.dpr),
        }
      )
      .setOrigin(0.5);

    const btn = this.add
      .text(this.W / 2, this.H / 2 + Math.round(80 * this.metrics.dpr), "Continue", {
        fontSize: this.metrics.fs(20),
        fontFamily: "SVN-Pequena Neo",
        color: "#000000",
        backgroundColor: "#ffcc00",
        padding: {
          left: Math.round(30 * this.metrics.dpr),
          right: Math.round(30 * this.metrics.dpr),
          top: Math.round(10 * this.metrics.dpr),
          bottom: Math.round(10 * this.metrics.dpr),
        },
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
      startManagedScene(this, "CookingChallengeCompleteScene");
    }
  }
}
