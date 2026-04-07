import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    DialogueRunner,
    createDevSkipButton,
    preloadCharacters,
    createBackButton,
    addCoverBg,
} from "../UIHelpers";

export default class BargainScene extends Phaser.Scene {
    constructor() {
        super("BargainScene");
    }

    preload() {
        this.load.image("marketBg", "/assets/background/market-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor("#103c5a");
        addCoverBg(this, "marketBg");
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.45,
        );

        // Dialogue lines — charLeft: wife (Taylor), charRight: seller
        this.dialogueLines = [
            {
                text: "Seller: You're taking the tender ribs, right? That will be 160K.",
                charLeft: "char-wife",
                charRight: "char-seller",
            },
            {
                text: "Taylor: Why is it so expensive, sis? Could you lower it to 130K?",
                charLeft: "char-wife-curious",
                charRight: "char-seller",
            },
            {
                text: "Seller: No, I'm already selling at the right price. If you're buying, I'll make it 150K for you.",
                charLeft: "char-wife",
                charRight: "char-seller-annoyed",
            },
        ];

        // Runner handles initial 3-line dialogue
        this.runner = new DialogueRunner(this, {
            box: { x: width / 2, y: height - 160, w: width - 100, h: 240 },
            chars: {
                left:  { x: width * 0.2, y: height + 70, scale: 0.5 },
                right: { x: width * 0.8, y: height + 50, scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showChoices(),
        });

        // Choice buttons container (hidden initially)
        this.choiceContainer = this.add.container(0, 0).setVisible(false);
        this.createChoiceButtons();

        // skipToChoice support: if retry from bad ending, skip to choices immediately
        const skipToChoice = this.scene.settings.data?.skipToChoice;
        if (skipToChoice) {
            this.runner.destroy();
            this.showChoices();
        }

        createDevSkipButton(this, "Level1PassScene");
        createBackButton(this);
    }

    createChoiceButtons() {
        const { width, height } = this.scale;
        const BUTTON_SCALE = 0.15;

        // Button 1 — correct: bargain
        const btn1 = this.add
            .image(width / 2 - 180, height - 100, "lv1-opt-bargain")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.onCorrectChoice());

        // Button 2 — wrong: accept price
        const btn2 = this.add
            .image(width / 2 + 180, height - 100, "lv1-opt-no-bargain")
            .setScale(BUTTON_SCALE)
            .setInteractive({ useHandCursor: true })
            .on("pointerover", function () {
                this.setScale(BUTTON_SCALE * 1.08);
            })
            .on("pointerout", function () {
                this.setScale(BUTTON_SCALE);
            })
            .on("pointerdown", () => this.scene.start("BargainBadEndingScene"));

        this.choiceContainer.add([btn1, btn2]);
    }

    showChoices() {
        this.choiceContainer.setVisible(true);
        this.runner.setText("What will you do?");
        this.runner.hintObj.setVisible(false);
    }

    onCorrectChoice() {
        this.runner.destroy();
        this.choiceContainer.setVisible(false);

        this.walkAwayDialogue = [
            { text: "Taylor: If that's the price, then I'll pass.", charLeft: "char-wife", charRight: "char-seller-annoyed" },
            { text: "* footsteps... *", charLeft: "char-wife", charRight: "char-seller-annoyed", color: "#888888" },
            { text: "Seller: WAIT! You're Ms. Hang's daughter-in-law, right?\nFine, take it — I'm giving you that price because I like your family.", charLeft: "char-wife", charRight: "char-seller" },
            { text: "Taylor: Thank you.", charLeft: "char-wife-giggle", charRight: "char-seller" },
        ];

        this.walkStep = 0;
        this.showWalkDialogue();

        this.input.on("pointerdown", () => {
            this.walkStep++;
            if (this.walkStep < this.walkAwayDialogue.length) {
                this.showWalkDialogue();
            } else {
                this.scene.start("Level1PassScene");
            }
        });
    }

    showWalkDialogue() {
        const line = this.walkAwayDialogue[this.walkStep];
        this.runner.setText(line.text, line.color);
        if (this.runner.charLeft && line.charLeft) this.runner.charLeft.setTexture(line.charLeft);
        if (this.runner.charRight && line.charRight) this.runner.charRight.setTexture(line.charRight);
        this.runner.hintObj.setVisible(true);
    }
}
