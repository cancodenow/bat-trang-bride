import Phaser from "phaser";
import {
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
} from "../UIHelpers";
import { createImageButton } from "../ui/buttons.js";

export default class PorkRibSelectionScene extends Phaser.Scene {
    constructor() {
        super("PorkRibSelectionScene");
    }

    preload() {
        this.load.image("marketBg", "/assets/background/market-bg.png");
        this.load.image("pork-ribs", "/assets/ingredients/pork-ribs.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadSoundAssets(this);
    }

    create() {
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

        img.on("pointerdown", () => {
            if (this.quantity < this.TOTAL_PIECES) {
                this.quantity++;
                this.updateSidebar();
            }
        });

        img.on("pointerover", () =>
            img.setDisplaySize(imgSize + Math.round(14 * this.metrics.dpr), (imgSize + Math.round(14 * this.metrics.dpr)) * 0.85),
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
                "You have selected " + (count * 0.2).toLocaleString() + " kg of pork ribs",
            );
            this.statusText.setColor("#ffffff");
        } else {
            this.statusText.setText("Total exceeds budget!\nTry bargaining.");
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
                "Let's keep within the budget, dear.\nDo you want to bargain?",
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
            width / 2 + Math.round(160 * dpr),
            frameY + Math.round(80 * dpr),
            "",
            { textureKey: "lv1-opt-ribs-yes", scale: YES_SCALE, onClick: () => this.scene.start("BargainScene") },
        );

        const NO_SCALE = 0.15;
        const { bg: momBtn } = createImageButton(
            this,
            width / 2 - Math.round(160 * dpr),
            frameY + Math.round(80 * dpr),
            "",
            { textureKey: "lv1-opt-no-bargain", scale: NO_SCALE, onClick: () => this.scene.start("BargainBadEndingScene") },
        );

        container.add([msg, yesBtn, momBtn]);
    }
}
