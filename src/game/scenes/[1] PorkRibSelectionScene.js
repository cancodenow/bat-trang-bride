import Phaser from "phaser";
import { preloadUIAssets, createImageButton, createModalFrame } from "../UIHelpers";

export default class PorkRibSelectionScene extends Phaser.Scene {
  constructor() {
    super("PorkRibSelectionScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");
    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#103c5a");
    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.35);

    // Constants
    this.PRICE_PER_PIECE = 32;
    this.TOTAL_PIECES = 5;
    this.MONEY = 130;

    // State
    this.selectedPieces = {};
    this.ribObjects = [];

    // Title
    this.add
      .text(width / 2, 40, "Buy Pork Ribs — Select pieces for 1kg", {
        fontSize: "24px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Info panel
    this.add.rectangle(width / 2, 100, 500, 50, 0x1a2a3a, 0.85);
    this.add.rectangle(width / 2, 100, 500, 50, 0xffffff, 0).setStrokeStyle(1, 0x5a8aaa);

    this.add
      .text(width / 2 - 230, 90, "Price per piece: 32K", {
        fontSize: "14px",
        color: "#cccccc",
        fontFamily: "Arial",
      });

    this.moneyText = this.add
      .text(width / 2 + 230, 90, "Money: 130K", {
        fontSize: "14px",
        color: "#66ccff",
        fontFamily: "Arial",
      })
      .setOrigin(1, 0);

    // Rib pieces display
    const startX = width / 2 - (this.TOTAL_PIECES - 1) * 100;
    const ribY = height / 2 - 40;

    for (let i = 0; i < this.TOTAL_PIECES; i++) {
      const x = startX + i * 200;
      this.createRibPiece(i, x, ribY);
    }

    // Selected count and total
    this.selectedText = this.add
      .text(width / 2, height / 2 + 140, "Selected: 0 / 5 pieces", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    this.totalText = this.add
      .text(width / 2, height / 2 + 170, "Total: 0K", {
        fontSize: "20px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Check button
    createImageButton(this, width / 2, height - 100, "Check Pork Ribs", {
      fontSize: "20px",
      onClick: () => this.checkSelection(),
    });
  }

  createRibPiece(index, x, y) {
    // Rib visual — a rounded rectangle representing a rib piece
    const ribW = 140;
    const ribH = 180;

    const bg = this.add.rectangle(x, y, ribW, ribH, 0x8b4513);
    bg.setStrokeStyle(3, 0xd2691e);
    bg.setInteractive({ useHandCursor: true });

    // Bone line detail
    this.add.rectangle(x, y - 30, 8, 80, 0xf5deb3);
    this.add.rectangle(x, y + 20, ribW - 30, 8, 0xf5deb3);

    // Label
    const label = this.add
      .text(x, y + 60, "Piece " + (index + 1), {
        fontSize: "13px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    const priceLabel = this.add
      .text(x, y + 78, "32K", {
        fontSize: "14px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    // Click handler
    bg.on("pointerdown", () => {
      if (this.selectedPieces[index]) {
        delete this.selectedPieces[index];
        bg.setFillStyle(0x8b4513);
        bg.setStrokeStyle(3, 0xd2691e);
      } else {
        this.selectedPieces[index] = true;
        bg.setFillStyle(0x2a7a3a);
        bg.setStrokeStyle(3, 0x66ff66);
      }
      this.updateDisplay();
    });

    bg.on("pointerover", () => {
      if (!this.selectedPieces[index]) bg.setFillStyle(0xa0522d);
    });
    bg.on("pointerout", () => {
      if (!this.selectedPieces[index]) bg.setFillStyle(0x8b4513);
    });

    this.ribObjects.push({ bg, label, priceLabel });
  }

  updateDisplay() {
    const count = Object.keys(this.selectedPieces).length;
    const total = count * this.PRICE_PER_PIECE;

    this.selectedText.setText("Selected: " + count + " / 5 pieces");
    this.totalText.setText("Total: " + total + "K");

    if (total > this.MONEY) {
      this.totalText.setColor("#ff6666");
    } else {
      this.totalText.setColor("#ffcc00");
    }
  }

  checkSelection() {
    const count = Object.keys(this.selectedPieces).length;
    const total = count * this.PRICE_PER_PIECE;

    if (count === 5) {
      // 5 pieces = 160K, exceeds 130K budget
      this.showOverBudgetModal();
    } else if (count < 5) {
      this.showNotEnoughModal();
    }
  }

  showNotEnoughModal() {
    const { width, height } = this.scale;

    const { container } = createModalFrame(this, 550, 220, {
      strokeColor: 0xff6666,
      depth: 100,
    });

    const msg = this.add
      .text(width / 2, height / 2 - 30, "That is not enough pork ribs.\nPlease choose more to make a full kilogram.", {
        fontSize: "18px",
        color: "#ff9999",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 480 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const { bg: closeBtn } = createImageButton(this, width / 2, height / 2 + 60, "OK", {
      fontSize: "18px",
      onClick: () => container.destroy(),
    });

    container.add([msg, closeBtn]);
  }

  showOverBudgetModal() {
    const { width, height } = this.scale;

    const { container } = createModalFrame(this, 580, 260, {
      strokeColor: 0xffcc00,
      depth: 100,
    });

    const msg = this.add
      .text(width / 2, height / 2 - 50, "The total is 160K but you only have 130K.\nThe price exceeds the money you have.\n\nDo you want to bargain?", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 520 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const { bg: bargainBtn } = createImageButton(this, width / 2, height / 2 + 70, "Yes, I want to bargain", {
      fontSize: "18px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("BargainScene"),
    });

    container.add([msg, bargainBtn]);
  }
}
