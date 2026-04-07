import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createBox,
    preloadCharacters,
    createCharacter,
    createDevSkipButton,
    createBackButton,
    addCoverBg,
} from "../UIHelpers";

export default class Scene02MarketInvite extends Phaser.Scene {
    constructor() {
        super("Scene02MarketInvite");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const { width, height } = this.scale;

        addCoverBg(this, "lv1-bg-homeyard");

        this.cameras.main.setBackgroundColor("#3a3a4a");

        // Dialogue lines — charLeft: wife, charRight: mom
        this.dialogueLines = [
            {
                text: "Taylor: Mom, is there anything I can help with?",
                charLeft: "char-wife",
                charRight: "char-mom",
            },
            {
                text: "Mom: Oh Taylor, you're up so early. Go get some more sleep dear!",
                charLeft: "char-wife",
                charRight: "char-mom-happy",
            },
            {
                text: "Taylor: No, I'm fully awake, I'd like to help you. What are you doing?",
                charLeft: "char-wife-curious",
                charRight: "char-mom-happy",
            },
            {
                text: "Mom: Alright then, I'm going to the market to prepare your welcome feast. Come, go with me.",
                charLeft: "char-wife-giggle",
                charRight: "char-mom-thrilled",
            },
        ];

        this.currentLine = 0;

        // Left character (wife) — faces right
        this.charLeft = createCharacter(
            this,
            width * 0.2,
            height + 70,
            "char-wife",
            { scale: 0.5 },
        );
        // Right character (mom) — flipped to face left
        this.charRight = createCharacter(
            this,
            width * 0.8,
            height + 50,
            "char-mom",
            { scale: 0.5, flipX: true },
        );

        // Dialogue box background
        this.dialogueBox = createBox(this, width / 2, height - 120, {
            textureKey: "ui-box-textbox",
            width: 700,
            height: 150,
        });

        // Dialogue text
        this.dialogueText = this.add
            .text(width / 2, height - 120, "", {
                fontSize: "22px",
                color: "#000000",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: 650 },
            })
            .setOrigin(0.5);

        // Instruction text
        this.instructionText = this.add
            .text(width / 2, height - 40, "Click to continue...", {
                fontSize: "14px",
                color: "#aaaaaa",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(0.5);

        // Show first line
        this.showNextDialogueLine();

        // Click to advance
        this.input.on("pointerdown", () => {
            this.showNextDialogueLine();
            createDevSkipButton(this, "TaskIntroScene");
            createBackButton(this);
        });
    }

    showNextDialogueLine() {
        if (this.currentLine < this.dialogueLines.length) {
            const { text, charLeft, charRight } =
                this.dialogueLines[this.currentLine];
            this.dialogueText.setText(text);
            this.charLeft.setTexture(charLeft);
            this.charRight.setTexture(charRight);
            this.currentLine++;
        } else {
            // All lines shown, show end screen
            this.showEndScreen();
        }
    }

    showEndScreen() {
        const { width, height } = this.scale;

        // Remove input listener for dialogue
        this.input.off("pointerdown");

        // Fade to black
        this.cameras.main.fadeOut(1500, 0, 0, 0);

        // After fade, transition to TaskIntroScene
        this.time.delayedCall(1500, () => {
            this.scene.start("TaskIntroScene");
        });
    }
}
