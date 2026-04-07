import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createModalFrame,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
} from "../UIHelpers";

export default class PorkRibSelectionScene extends Phaser.Scene {
    constructor() {
        super("PorkRibSelectionScene");
    }

    preload() {
        this.load.image("marketBg", "/assets/background/market-bg.png");
        this.load.image("pork-ribs", "/assets/ingredients/pork-ribs.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor("#103c5a");

        // Constants
        this.PRICE_PER_PIECE = 32;
        this.TOTAL_PIECES = 5;
        this.MONEY = 130;
        this.SIDEBAR_W = 260;

        // State — single quantity counter
        this.quantity = 0;

        addCoverBg(this, "marketBg");

        this.createSidebar();
        this.createRibDisplay();

        createDevSkipButton(this, "BargainScene");
        createBackButton(this);
    }

    // ===================== SIDEBAR =====================

    createSidebar() {
        const { height } = this.scale;
        const sw = this.SIDEBAR_W;

        this.add.rectangle(sw / 2, height / 2, sw, height, 0x141e2b);
        this.add.rectangle(sw, height / 2, 2, height, 0x3a5a7a);

        this.add
            .text(sw / 2, 16, "Mua Sườn / Buy Ribs", {
                fontSize: "18px",
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.add.rectangle(sw / 2, 46, sw - 30, 1, 0x3a5a7a);

        this.add.text(15, 56, "Price per piece:", {
            fontSize: "15px",
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
        });
        this.add
            .text(sw - 15, 56, "32K VND", {
                fontSize: "15px",
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(1, 0);

        this.add.text(15, 76, "Budget:", {
            fontSize: "15px",
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
        });
        this.add
            .text(sw - 15, 76, this.MONEY + "K VND", {
                fontSize: "15px",
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(1, 0);

        this.add.rectangle(sw / 2, 100, sw - 30, 1, 0x3a5a7a);

        this.add
            .text(sw / 2, 108, "Selection", {
                fontSize: "15px",
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
            })
            .setOrigin(0.5, 0);

        this.selectedCountText = this.add.text(15, 128, "Pieces: 0 ", {
            fontSize: "17px",
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
        });

        this.totalText = this.add.text(15, 150, "Total: 0K", {
            fontSize: "17px",
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
        });

        this.add.rectangle(sw / 2, 180, sw - 30, 1, 0x3a5a7a);

        this.add
            .text(sw / 2, 188, "one piece = 200g", {
                fontSize: "14px",
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.statusText = this.add
            .text(sw / 2, 212, "Click the rib to add one piece.", {
                fontSize: "14px",
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: sw - 20 },
            })
            .setOrigin(0.5, 0);

        // Check button
        const BUTTON_SCALE = 0.15;
        this.add
            .image(sw / 2, height - 60, "lv1-opt-buy-check")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.checkSelection());
    }

    // ===================== RIB DISPLAY =====================

    createRibDisplay() {
        const { width, height } = this.scale;
        const sw = this.SIDEBAR_W;
        const cx = sw + (width - sw) / 2;
        const cy = height / 2 - 20;
        const imgSize = 90;

        const ribX = cx + 120;
        const ribH = imgSize * 0.85;

        const img = this.add
            .image(ribX, cy + 70, "pork-ribs")
            .setDisplaySize(imgSize, ribH)
            .setInteractive({ useHandCursor: true });

        const imgBottom = cy + 70 + ribH / 2;

        this.add
            .text(ribX, imgBottom + 12, "Pork Ribs", {
                fontSize: "18px",
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.add
            .text(ribX, imgBottom + 36, "32K / piece  —  click to add", {
                fontSize: "15px",
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        img.on("pointerdown", () => {
            if (this.quantity < this.TOTAL_PIECES) {
                this.quantity++;
                this.updateSidebar();
            }
        });

        img.on("pointerover", () =>
            img.setDisplaySize(imgSize + 14, (imgSize + 14) * 0.85),
        );
        img.on("pointerout", () => img.setDisplaySize(imgSize, ribH));
    }

    updateSidebar() {
        const count = this.quantity;
        const total = count * this.PRICE_PER_PIECE;

        this.selectedCountText.setText("Pieces: " + count);
        this.totalText.setText("Total: " + total + "K");
        this.totalText.setColor(total > this.MONEY ? "#ff6666" : "#ffffff");

        if (count === 0) {
            this.statusText.setText("Click the rib to add pieces.");
            this.statusText.setColor("#bb9882");
        } else if (count < 5) {
            this.statusText.setText(
                "You have selected " + count * 0.2 + " kg of pork ribs",
            );
            this.statusText.setColor("#ffffff");
        } else {
            this.statusText.setText("Total exceeds budget!\nTry bargaining.");
            this.statusText.setColor("#ff6666");
        }
    }

    checkSelection() {
        if (this.quantity < 5) {
            this.statusText.setText(
                "That is not enough pork ribs. \nPlease choose more to make a full kilogram",
            );
            this.statusText.setColor("#ff6666");
        } else {
            this.showBargainModal();
        }
    }

    showBargainModal() {
        const { width, height } = this.scale;

        const { container } = createModalFrame(this, 640, 260, {
            overlayAlpha: 0.6,
        });
        const frameY = height / 2; // frame is centered here by createModalFrame

        const msg = this.add
            .text(
                width / 2,
                frameY,
                "Let's keep within the budget, dear.\nDo you want to bargain?",
                {
                    fontSize: "22px",
                    color: "#ffffff",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    wordWrap: { width: 560 },
                    lineSpacing: 6,
                },
            )
            .setOrigin(0.5);

        const YES_SCALE = 0.15;
        const yesBtn = this.add
            .image(width / 2 + 160, frameY + 80, "lv1-opt-ribs-yes")
            .setScale(YES_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(YES_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(YES_SCALE);
            })
            .on("pointerdown", () => this.scene.start("BargainScene"));

        const NO_SCALE = 0.15;
        const momBtn = this.add
            .image(width / 2 - 160, frameY + 80, "lv1-opt-no-bargain")
            .setScale(NO_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(NO_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(NO_SCALE);
            })
            .on("pointerdown", () => this.scene.start("BargainBadEndingScene"));

        container.add([msg, yesBtn, momBtn]);
    }
}
