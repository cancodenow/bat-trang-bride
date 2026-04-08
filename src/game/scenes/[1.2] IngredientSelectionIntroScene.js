import Phaser from "phaser";
import { preloadAssetGroups, preloadUIAssets, createBackButton, addCoverBg, getResponsiveMetrics } from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class IngredientSelectionIntroScene extends Phaser.Scene {
    constructor() {
        super("IngredientSelectionIntroScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
    }

    create() {
        updateCheckpoint("IngredientSelectionIntroScene", "level1.market-selection");
        const metrics = getResponsiveMetrics(this);
        const { width, height, fs } = metrics;

        addCoverBg(this, "ingredientIntroBg", { depth: 0 });
        this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.4)
            .setDepth(1);

        this.cameras.main.setBackgroundColor("#1a1a2e");

        // Placeholder text
        this.add
            .text(
                width / 2,
                height / 2,
                "Next step: Choose ingredients at the market",
                {
                    fontSize: fs(32),
                    color: "#000000",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                },
            )
            .setOrigin(0.5);
        createBackButton(this);
    }
}
