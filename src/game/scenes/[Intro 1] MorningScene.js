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

        this.currentLine = 0;

        // Dialogue box background
        createBox(this, width / 2, height - 100, {
            textureKey: "ui-box-textbox",
            width: 780,
            height: 130,
        });

        // Left character (wife) — faces right (default)
        this.charLeft = createCharacter(
            this,
            width * 0.2,
            height + 70,
            "char-wife-giggle",
            { scale: 0.5 },
        );
        // Right character (husband / mom) — flipped to face left
        this.charRight = createCharacter(
            this,
            width * 0.8,
            height + 50,
            "char-husband-sleepy",
            { scale: 0.5, flipX: true },
        );

        // Dialogue text
        this.dialogueText = this.add
            .text(width / 2, height - 120, "", {
                fontSize: "22px",
                color: "#111010",
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
            createDevSkipButton(this, "Scene02MarketInvite");
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
            // All lines shown, show choice buttons
            this.showChoiceButtons();
        }
    }

    showChoiceButtons() {
        const { width, height } = this.scale;

        this.input.off("pointerdown");
        this.instructionText.setText("Make a choice:");

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
