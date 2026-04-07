import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createDialogueBox,
    createDevSkipButton,
    preloadCharacters,
    createCharacter,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    createImageButton,
} from "../UIHelpers";

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
        const metrics = getResponsiveMetrics(this);
        const { width, height, fs, dpr, buttonScale } = metrics;

        this.cameras.main.setBackgroundColor("#103c5a");

        // Market background
        addCoverBg(this, "marketBg");
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

        // Characters
        createCharacter(this, width * 0.2, height - Math.round(20 * dpr), "char-wife", {
            scale: 0.5,
        });
        createCharacter(this, width * 0.8, height - Math.round(20 * dpr), "char-mom-happy", {
            scale: 0.5,
            flipX: true,
        });

        // Dialogue box
        createDialogueBox(this, width / 2, height - Math.round(140 * dpr), width - Math.round(100 * dpr), Math.round(200 * dpr), {
            fillColor: 0x1a2a3a,
            fillAlpha: 0.92,
            strokeColor: 0x5a8aaa,
        });

        // Speaker label
        this.add.text(Math.round(80 * dpr), height - Math.round(230 * dpr), "Mom", {
            fontSize: fs(18),
            color: "#ffcc00",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
        });

        // Dialogue text
        this.add
            .text(
                width / 2,
                height - Math.round(150 * dpr),
                "Oh, you're so capable — you bought everything correctly.\nGo buy 1kg of pork ribs for me, then we'll head home.",
                {
                    fontSize: fs(20),
                    color: "#000000",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    wordWrap: { width: width - Math.round(200 * dpr) },
                    lineSpacing: Math.round(8 * dpr),
                },
            )
            .setOrigin(0.5);

        // Button
        createImageButton(this, width / 2, height - 60 * dpr, "", {
            textureKey: "lv1-opt-tasks-of-course",
            scale: buttonScale,
            onClick: () => this.scene.start("PorkRibSelectionScene"),
        });
        createDevSkipButton(this, "PorkRibSelectionScene");
        createBackButton(this);
    }
}
