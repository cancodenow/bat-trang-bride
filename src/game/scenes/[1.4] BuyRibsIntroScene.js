import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadLevelAssets,
    createDevSkipButton,
    preloadCharacters,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    crossfadeMusic,
    goToScene,
    DialogueRunner,
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
        crossfadeMusic(this, "market-music", { volume: 0.3 });

        const metrics = getResponsiveMetrics(this);
        const { width, height, dpr, buttonScale } = metrics;

        this.cameras.main.setBackgroundColor("#103c5a");

        // Market background
        addCoverBg(this, "marketBg");
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);

        // Dialogue
        this.runner = new DialogueRunner(this, {
            box: {
                x: width / 2,
                y: height - Math.round(100 * dpr),
                w: Math.round(780 * dpr),
                h: Math.round(130 * dpr),
            },
            chars: {
                left: { x: width * 0.2, y: height + Math.round(70 * dpr), scale: 0.5 },
                right: { x: width * 0.8, y: height + Math.round(70 * dpr), scale: 0.5, flipX: true },
            },
            lines: [
                {
                    text: "Mom: Oh, you're so capable — you bought everything correctly.",
                    charLeft: "char-wife",
                    charRight: "char-mom-happy",
                },
                {
                    text: "Mom: Go buy 1kg of pork ribs for me, then we'll head home.",
                    charLeft: "char-wife",
                    charRight: "char-mom-happy",
                },
            ],
            onComplete: () => this.showActionButton(),
        });

        createDevSkipButton(this, "PorkRibSelectionScene");
        createBackButton(this);
    }

    showActionButton() {
        const { width, height, dpr, buttonScale } = getResponsiveMetrics(this);

        this.runner.positionContinueButton({
            scale: buttonScale * 0.8,
            onClick: () => goToScene(this, "PorkRibSelectionScene"),
            gap: Math.round(-20 * dpr),
        });
    }
}
