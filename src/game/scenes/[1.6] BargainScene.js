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
        this.dialogueStep = 0;

        // Left character (wife / Taylor) — listens, faces right
        this.charLeft = createCharacter(
            this,
            width * 0.2,
            height + 70,
            "char-wife",
            { scale: 0.5 },
        );
        // Right character (seller) — speaks, flipped to face left
        this.charRight = createCharacter(
            this,
            width * 0.8,
            height + 50,
            "char-seller",
            { scale: 0.5, flipX: true },
        );

        // Dialogue box
        this.dialogueBox = createDialogueBox(
            this,
            width / 2,
            height - 160,
            width - 100,
            240,
            {
                fillColor: 0x1a2a3a,
                fillAlpha: 0.92,
                strokeColor: 0x5a8aaa,
            },
        );

        // Dialogue text
        this.dialogueText = this.add
            .text(width / 2, height - 180, "", {
                fontSize: "20px",
                color: "#000000",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: width - 200 },
                lineSpacing: 8,
            })
            .setOrigin(0.5)
            .setScale(1);

        // "Click to continue" hint
        this.continueHint = this.add
            .text(width / 2, height - 60, "▼ Click to continue", {
                fontSize: "14px",
                color: "#888888",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(0.5)
            .setScale(1);

        // Choice buttons container (hidden initially)
        this.choiceContainer = this.add.container(0, 0).setVisible(false);
        this.createChoiceButtons();

        // Show first dialogue
        this.showCurrentDialogue();

        // Click to advance dialogue
        this.input.on("pointerdown", () => {
            if (this.choiceContainer.visible) return;

            this.dialogueStep++;
            if (this.dialogueStep < this.dialogueLines.length) {
                this.showCurrentDialogue();
            } else {
                this.continueHint.setVisible(false);
                this.showChoices();
            }
        });

        createDevSkipButton(this, "Level1PassScene");
        createBackButton(this);
    }

    showCurrentDialogue() {
        const line = this.dialogueLines[this.dialogueStep];
        this.dialogueText.setText(line.text);
        this.dialogueText.setColor("#000000");
        this.charLeft.setTexture(line.charLeft);
        this.charRight.setTexture(line.charRight);
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
        this.dialogueText.setText("What will you do?");
        this.dialogueText.setColor("#000000");
    }

    onCorrectChoice() {
        this.input.removeAllListeners();
        this.choiceContainer.setVisible(false);

        // Walk-away dialogue — charLeft: wife, charRight: seller
        this.walkAwayDialogue = [
            {
                text: "Taylor: If that's the price, then I'll pass.",
                charLeft: "char-wife",
                charRight: "char-seller-annoyed",
            },
            {
                text: "* footsteps... *",
                charLeft: "char-wife",
                charRight: "char-seller-annoyed",
                color: "#888888",
            },
            {
                text: "Seller: WAIT! You're Ms. Hang's daughter-in-law, right?\nFine, take it — I'm giving you that price because I like your family.",
                charLeft: "char-wife",
                charRight: "char-seller",
            },
            {
                text: "Taylor: Thank you.",
                charLeft: "char-wife-giggle",
                charRight: "char-seller",
            },
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
        this.dialogueText.setText(line.text);
        this.dialogueText.setColor(line.color || "#000000");
        this.charLeft.setTexture(line.charLeft);
        this.charRight.setTexture(line.charRight);
        this.continueHint.setVisible(true);
    }
}
