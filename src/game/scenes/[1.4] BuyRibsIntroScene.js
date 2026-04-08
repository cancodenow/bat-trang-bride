import Phaser from "phaser";
import {
    preloadAssetGroups,
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
    crossfadeMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class BuyRibsIntroScene extends Phaser.Scene {
    constructor() {
        super("BuyRibsIntroScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        updateCheckpoint("BuyRibsIntroScene", "level1.buy-ribs-intro");
        crossfadeMusic(this, "market-music");

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
        createDialogueBox(this, width / 2, height - Math.round(140 * dpr), width / 2, Math.round(200 * dpr), {
            fillColor: 0x1a2a3a,
            fillAlpha: 0.92,
            strokeColor: 0x5a8aaa,
        });

        // Speaker label
        this.add.text(width / 4 + Math.round(20 * dpr), height - Math.round(230 * dpr), "Mom", {
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
            onClick: () => goToScene(this, "PorkRibSelectionScene"),
        });
        createDevSkipButton(this, "PorkRibSelectionScene");
        createBackButton(this);
    }
}
