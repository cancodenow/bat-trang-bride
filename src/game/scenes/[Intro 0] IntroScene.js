import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    DialogueRunner,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    getResponsiveMetrics,
    bindResponsiveScene,
    createContinueButton,
} from "../UIHelpers";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }

    preload() {
        this.load.image("introBg", "/assets/background/intro-bg.png");
        this.load.image("morningBg", "/assets/background/morning-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create(data = {}) {
        const metrics = getResponsiveMetrics(this);

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

        createDevSkipButton(this, "MorningScene01");
        createBackButton(this);
        bindResponsiveScene(this, () =>
            this.scene.restart({
                lineIndex: this.runner?._completed
                    ? this.runner.lines.length
                    : this.runner?.lineIndex || 0,
                showContinueButton: Boolean(this.continueButton),
            }),
        );
    }

    showContinueButton() {
        if (this.continueButton) {
            this.continueButton.destroy();
        }
        const {
            buttonScale: BUTTON_SCALE,
            width,
            height,
            bottomInset,
        } = getResponsiveMetrics(this);

        this.continueButton = createContinueButton(this, width / 2, height - bottomInset, {
            scale: BUTTON_SCALE,
            onClick: () => this.scene.start("MorningScene01"),
        });
    }
}
