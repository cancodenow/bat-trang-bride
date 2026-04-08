import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createFinishButton,
    createDevSkipButton,
    getResponsiveMetrics,
} from "../UIHelpers";

export default class FinishLevelScene extends Phaser.Scene {
    constructor() {
        super("FinishLevelScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 3);
    }

    create() {
        const metrics = getResponsiveMetrics(this);
        const { width, height, edgePadding, topInset, bottomInset, dpr, buttonScale, fs } = metrics;
        const panelWidth = Math.min(width - edgePadding * 2, Math.round((metrics.isPortrait ? 760 : 980) * dpr));
        const panelHeight = Math.min(height - topInset - bottomInset - Math.round(180 * dpr), Math.round((metrics.isPortrait ? 900 : 520) * dpr));
        const panelY = height / 2 - Math.round(40 * dpr);
        const paragraphWrapWidth = panelWidth - Math.round(80 * dpr);

        this.add
            .image(width / 2, height / 2, "lv3-bg-cl2")
            .setDisplaySize(width, height)
            .setDepth(0);

        this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
            .setDepth(1);

        this.add
            .rectangle(width / 2, panelY, panelWidth, panelHeight, 0x1f120c, 0.78)
            .setStrokeStyle(Math.round(4 * dpr), 0xf0d6a5, 0.95)
            .setDepth(2);

        this.add
            .text(
                width / 2,
                panelY - Math.round(70 * dpr),
                "From choosing ingredients, cooking, arranging the tray, to cleaning up, each step is part of the Bát Tràng way of life.\n\nKeeping a bowl intact is also a way of preserving care and respect for the meal, and for the village's ceramic craft.",
                {
                    fontSize: metrics.isPortrait ? fs(26) : fs(24),
                    color: "#fff4dc",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    lineSpacing: Math.round(14 * dpr),
                    wordWrap: { width: paragraphWrapWidth },
                    stroke: "#2b140d",
                    strokeThickness: Math.round(3 * dpr),
                },
            )
            .setOrigin(0.5)
            .setDepth(3);

        this.add
            .text(width / 2, panelY + Math.round(130 * dpr), "Follow us on IG @colamduc.heritage", {
                fontSize: metrics.isPortrait ? fs(20) : fs(18),
                color: "#f7d89c",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                stroke: "#2b140d",
                strokeThickness: Math.round(2 * dpr),
            })
            .setOrigin(0.5)
            .setDepth(3);

        this.add
            .text(width / 2, panelY + Math.round(180 * dpr), "Check out our menu", {
                fontSize: metrics.isPortrait ? fs(20) : fs(18),
                color: "#f7d89c",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                stroke: "#2b140d",
                strokeThickness: Math.round(2 * dpr),
            })
            .setOrigin(0.5)
            .setDepth(3);

        const { bg: finishButton } = createFinishButton(this, width / 2, height - bottomInset - Math.round(55 * dpr), {
            scale: buttonScale,
            onClick: () => this.scene.start("OpeningScene"),
        });
        finishButton.setDepth(4);

        createDevSkipButton(this, "OpeningScene");
    }
}
