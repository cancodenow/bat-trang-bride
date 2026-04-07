import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    DialogueRunner,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
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

    create() {
        const { width, height } = this.scale;

        addCoverBg(this, "introBg");

        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - 130, w: 830, h: 150 },
            lines: [
                {
                    text: "After seven years together, you and Sơn Tùng finally got married!",
                },
                {
                    text: "The wedding was held in his hometown - a traditional ceramic village near Hanoi.",
                },
            ],
            onComplete: () => this.showContinueButton(),
        });

        createDevSkipButton(this, "MorningScene01");
        createBackButton(this);
    }

    showContinueButton() {
        const { width, height } = this.scale;

        const BUTTON_SCALE = 0.15;
        this.add
            .image(width / 2, height - 50, "continue_button")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.scene.start("MorningScene01"));
    }
}
