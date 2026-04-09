import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadLevelAssets,
    preloadSoundAssets,
    createModalFrame,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    playMusic,
    playSFX,
    goToScene,
} from "../UIHelpers";
import { createImageButton } from "../ui/buttons.js";
import { updateCheckpoint } from "../progress.js";

export default class PorkRibSelectionScene extends Phaser.Scene {
    constructor() {
        super("PorkRibSelectionScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds", "market-ingredients"]);
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("PorkRibSelectionScene", "level1.pork-rib-selection");
        this.metrics = getResponsiveMetrics(this);
        const { width, height } = this.scale;
        const { fs, dpr } = this.metrics;

        playMusic(this, "market-music");

        this.cameras.main.setBackgroundColor("#103c5a");

        // Constants
        this.PRICE_PER_PIECE = 32;
        this.TOTAL_PIECES = 5;
        this.MONEY = 130;
        this.SIDEBAR_W = Math.min(400, Math.round(width * 0.26)) * this.metrics.dpr;

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
        const dpr = this.metrics.dpr;
        const fs = this.metrics.fs;
        const pad = Math.round(15 * dpr);

        this.add.rectangle(sw / 2, height / 2, sw, height, 0x141e2b);
        this.add.rectangle(sw, height / 2, 2, height, 0x3a5a7a);

        this.add
            .text(sw / 2, Math.round(16 * dpr), "Mua Sườn / Buy Ribs", {
                fontSize: fs(18),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.add.rectangle(sw / 2, Math.round(46 * dpr), sw - Math.round(30 * dpr), Math.round(1 * dpr), 0x3a5a7a);

        this.add.text(pad, Math.round(56 * dpr), "Price per piece:", {
            fontSize: fs(15),
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
        });
        this.add
            .text(sw - pad, Math.round(56 * dpr), "32K VND", {
                fontSize: fs(15),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(1, 0);

        this.add.text(pad, Math.round(76 * dpr), "Budget:", {
            fontSize: fs(15),
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
        });
        this.add
            .text(sw - pad, Math.round(76 * dpr), this.MONEY + "K VND", {
                fontSize: fs(15),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(1, 0);

        this.add.rectangle(sw / 2, Math.round(100 * dpr), sw - Math.round(30 * dpr), Math.round(1 * dpr), 0x3a5a7a);

        this.add
            .text(sw / 2, Math.round(108 * dpr), "Selection", {
                fontSize: fs(15),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
            })
            .setOrigin(0.5, 0);

        this.selectedCountText = this.add.text(pad, Math.round(128 * dpr), "Pieces: 0 ", {
            fontSize: fs(17),
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
        });

        this.totalText = this.add.text(pad, Math.round(150 * dpr), "Total: 0K", {
            fontSize: fs(17),
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
        });

        this.add.rectangle(sw / 2, Math.round(180 * dpr), sw - Math.round(30 * dpr), Math.round(1 * dpr), 0x3a5a7a);

        this.add
            .text(sw / 2, Math.round(188 * dpr), "one piece = 200g", {
                fontSize: fs(14),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.statusText = this.add
            .text(sw / 2, Math.round(212 * dpr), "Click the rib to add one piece.", {
                fontSize: fs(14),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: sw - Math.round(20 * dpr) },
            })
            .setOrigin(0.5, 0);

        this.createQuantityControls(sw / 2, Math.round(275 * dpr));

        // Check button
        const BUTTON_SCALE = 0.15;
        createImageButton(
            this,
            sw / 2,
            height - Math.round(60 * dpr),
            "",
            { textureKey: "lv1-opt-buy-check", scale: BUTTON_SCALE, onClick: () => this.checkSelection() },
        );
    }

    createQuantityControls(x, y) {
        const { dpr, fs } = this.metrics;
        const buttonWidth = Math.round(52 * dpr);
        const buttonHeight = Math.round(44 * dpr);

        const minusButton = createImageButton(this, x - Math.round(60 * dpr), y, "-", {
            textureKey: "ui-missing-rib-minus",
            width: buttonWidth,
            height: buttonHeight,
            fontSize: fs(24),
            fontColor: "#ffffff",
            bgColor: "#2a4a6a",
            hoverBgColor: "#3a5a7a",
            onClick: () => this.setQuantity(this.quantity - 1),
        });

        this.quantityValueText = this.add
            .text(x, y, "0", {
                fontSize: fs(22),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        const plusButton = createImageButton(this, x + Math.round(60 * dpr), y, "+", {
            textureKey: "ui-missing-rib-plus",
            width: buttonWidth,
            height: buttonHeight,
            fontSize: fs(24),
            fontColor: "#ffffff",
            bgColor: "#2a4a6a",
            hoverBgColor: "#3a5a7a",
            onClick: () => this.setQuantity(this.quantity + 1),
        });

        this.add.text(x, y + Math.round(42 * dpr), "Adjust pieces", {
            fontSize: fs(13),
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
            align: "center",
        }).setOrigin(0.5);

        this.quantityControls = [minusButton.bg, this.quantityValueText, plusButton.bg];
    }

    // ===================== RIB DISPLAY =====================

    createRibDisplay() {
        const { width, height } = this.scale;
        const fs = this.metrics.fs;
        const sw = this.SIDEBAR_W;
        const cx = sw + (width - sw) / 2;
        const cy = height / 2 - Math.round(20 * this.metrics.dpr);
        const imgSize = Math.round(90 * this.metrics.dpr);

        const ribX = cx + Math.round(120 * this.metrics.dpr);
        const ribH = imgSize * 0.85;

        const img = this.add
            .image(ribX, cy + Math.round(70 * this.metrics.dpr), "pork-ribs")
            .setDisplaySize(imgSize, ribH)
            .setInteractive({ useHandCursor: true });

        const imgBottom = cy + Math.round(70 * this.metrics.dpr) + ribH / 2;

        this.add
            .text(ribX, imgBottom + Math.round(12 * this.metrics.dpr), "Pork Ribs", {
                fontSize: fs(18),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        this.add
            .text(ribX, imgBottom + Math.round(36 * this.metrics.dpr), "32K / piece  —  click to add", {
                fontSize: fs(15),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5, 0);

        img.on("pointerdown", () => this.setQuantity(this.quantity + 1));

        img.on("pointerover", () =>
            img.setDisplaySize(imgSize + Math.round(14 * this.metrics.dpr), (imgSize + Math.round(14 * this.metrics.dpr)) * 0.85),
        );
        img.on("pointerout", () => img.setDisplaySize(imgSize, ribH));
    }

    setQuantity(nextQuantity) {
        this.quantity = Phaser.Math.Clamp(nextQuantity, 0, this.TOTAL_PIECES);
        this.updateSidebar();
    }

    updateSidebar() {
        const count = this.quantity;
        const total = count * this.PRICE_PER_PIECE;

        this.selectedCountText.setText("Pieces: " + count);
        this.totalText.setText("Total: " + total + "K");
        this.totalText.setColor(total > this.MONEY ? "#ff6666" : "#ffffff");
        this.quantityValueText.setText(String(count));

        if (count === 0) {
            this.statusText.setText("Click the rib or use +/- to add pieces.");
            this.statusText.setColor("#bb9882");
        } else if (count < 5) {
            this.statusText.setText(
                "You have selected " + (count * 0.2).toLocaleString() + " kg of pork ribs.\nChoose 1kg before checking.",
            );
            this.statusText.setColor("#ffffff");
        } else {
            this.statusText.setText("1kg selected, but total exceeds budget.\nBargaining is required.");
            this.statusText.setColor("#ff6666");
        }
    }

    checkSelection() {
        if (this.quantity < 5) {
            playSFX(this, "wrong");
            this.statusText.setText(
                "That is not enough pork ribs. \nPlease choose more to make a full kilogram",
            );
            this.statusText.setColor("#ff6666");
        } else {
            playSFX(this, "correct");
            this.showBargainModal();
        }
    }

    showBargainModal() {
        const { width, height } = this.scale;
        const { fs, dpr } = this.metrics;

        const { container } = createModalFrame(this, Math.round(640 * dpr), Math.round(260 * dpr), {
            overlayAlpha: 0.6,
        });
        const frameY = height / 2; // frame is centered here by createModalFrame

        const msg = this.add
            .text(
                width / 2,
                frameY,
                "That is 160K for 1kg of ribs,\nwhich is over your 130K budget.\nYou need to bargain.",
                {
                    fontSize: fs(22),
                    color: "#ffffff",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    wordWrap: { width: Math.round(560 * dpr) },
                    lineSpacing: Math.round(6 * dpr),
                },
            )
            .setOrigin(0.5);

        const YES_SCALE = 0.15;
        const { bg: yesBtn } = createImageButton(
            this,
            width / 2,
            frameY + Math.round(80 * dpr),
            "",
            { textureKey: "lv1-opt-ribs-yes", scale: YES_SCALE, onClick: () => goToScene(this, "BargainScene") },
        );

        container.add([msg, yesBtn]);
    }
}
