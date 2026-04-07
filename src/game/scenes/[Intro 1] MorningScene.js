import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
    DialogueRunner,
} from "../UIHelpers";

export default class MorningScene01 extends Phaser.Scene {
    constructor() {
        super("MorningScene01");
    }

    preload() {
        this.load.image("morningBg", "/assets/background/morning-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const { width, height } = this.scale;

        addCoverBg(this, "morningBg");

        this.cameras.main.setBackgroundColor("#2a3a4a");

        // Time label with infobox background
        this.add
            .image(width / 2, 40, "ui-box-infobox")
            .setDisplaySize(180, 75)
            .setDepth(0);
        this.add
            .text(width / 2, 40, "5:00 AM", {
                fontSize: "28px",
                color: "#ffcc00",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5);

        // Dialogue lines — charLeft: wife expression, charRight: other character
        this.dialogueLines = [
            {
                text: "Taylor: I'm too excited to sleep",
                charLeft: "char-wife-giggle",
                charRight: "char-husband-sleepy",
            },
            {
                text: "Taylor: Baby, baby,...",
                charLeft: "char-wife",
                charRight: "char-husband-sleepy",
            },
            {
                text: "Taylor: He seems not gonna wake up",
                charLeft: "char-wife-curious",
                charRight: "char-husband-sleepy",
            },
            {
                text: "Taylor: What's the sound? Is that mom?",
                charLeft: "char-wife-surprised",
                charRight: "char-mom",
            },
            {
                text: "Taylor: What should I do now?",
                charLeft: "char-wife-curious",
                charRight: "char-mom",
            },
        ];

        const skipToChoice = this.scene.settings.data?.skipToChoice;

        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - 100, w: 780, h: 130 },
            chars: {
                left: { x: width * 0.2, y: height + 70, scale: 0.5 },
                right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showChoiceButtons(),
            skipTo: skipToChoice ? this.dialogueLines.length - 1 : 0,
        });

        createDevSkipButton(this, "Scene02MarketInvite");
        createBackButton(this);
    }

    showChoiceButtons() {
        const { width, height } = this.scale;

        this.runner.hintObj.setText("Make a choice:");

        const BUTTON_SCALE = 0.15;

        // Option: Keep scrolling TikTok → bad ending
        this.add
            .image(width / 2 - 200, height - 200, "lv1-opt-wake-tiktok")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.scene.start("BadEndingScene"));

        // Option: Get up → continue
        this.add
            .image(width / 2 + 200, height - 200, "lv1-opt-wake-get-up")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.scene.start("Scene02MarketInvite"));
    }
}
