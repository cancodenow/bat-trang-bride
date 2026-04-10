import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    preloadSoundAssets,
    DialogueRunner,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    bindResponsiveScene,
    createContinueButton,
    crossfadeMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create(data = {}) {
        updateCheckpoint("IntroScene", "intro.story");
        const metrics = getResponsiveMetrics(this);

        crossfadeMusic(this, "wedding");

        addCoverBg(this, "introBg");

        this.runner = new DialogueRunner(this, {
            box: {
                x: metrics.dialogue.x,
                y: metrics.dialogue.y,
                w: metrics.dialogue.width,
                h: metrics.dialogue.height,
            },
            lines: [
                {
                    text: "After seven years together, you and Sơn Tùng finally got married!",
                },
                {
                    text: "The wedding was held in his hometown - a traditional ceramic village near Hanoi.",
                },
            ],
            skipTo: data.lineIndex || 0,
            onComplete: () => this.showContinueButton(),
        });

        if (data.showContinueButton) {
            this.showContinueButton();
        }

        // createDevSkipButton(this, "MorningScene01");
        createBackButton(this);
        // bindResponsiveScene(this, () =>
        //     this.scene.restart({
        //         lineIndex: this.runner?._completed
        //             ? this.runner.lines.length
        //             : this.runner?.lineIndex || 0,
        //         showContinueButton: Boolean(this.continueButton),
        //     }),
        // );
    }

    showContinueButton() {
        if (this.continueButton) {
            try {
                this.continueButton.destroy();
            } catch (e) {
                console.warn("Continue button already destroyed");
            }
        }
        const { buttonScale: BUTTON_SCALE, dpr } = getResponsiveMetrics(this);

        // Use the dialogue runner's helper to position button beneath dialogue
        this.continueButton = this.runner.positionContinueButton({
            scale: BUTTON_SCALE,
            onClick: () => goToScene(this, "MorningScene01"),
            gap: Math.round(-20 * dpr),
        });
    }
}
