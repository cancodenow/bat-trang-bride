import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    preloadSoundAssets,
    createBackButton,
    addCoverBg,
    DialogueRunner,
    getResponsiveMetrics,
    createImageButton,
    crossfadeMusic,
    playSFX,
    goToScene,
} from "../UIHelpers";
import { getAnalytics } from "../analytics";
import { updateCheckpoint } from "../progress.js";

export default class MorningScene01 extends Phaser.Scene {
    constructor() {
        super("MorningScene01");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("MorningScene01", "intro.morning.dialogue");
        const metrics = getResponsiveMetrics(this);
        const { width, height, fs, dpr } = metrics;

        // Crossfade to bedroom/rustling sound
        crossfadeMusic(this, "bed-music");

        addCoverBg(this, "morningBg");

        this.cameras.main.setBackgroundColor("#2a3a4a");

        // Time label with infobox background
        this.add
            .image(width / 2, 40, "ui-box-infobox")
            .setDisplaySize(Math.round(180 * dpr), Math.round(75 * dpr))
            .setDepth(0);
        this.add
            .text(width / 2, 40, "5:00 AM", {
                fontSize: fs(28),
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
            box: {
                x: metrics.dialogue.x,
                y: metrics.dialogue.y,
                w: metrics.dialogue.width,
                h: metrics.dialogue.height,
            },
            chars: {
                left: { x: width * 0.2, y: height, scale: 0.5 },
                right: { x: width * 0.8, y: height, scale: 0.5, flipX: true },
            },
            lines: this.dialogueLines,
            onComplete: () => this.showChoiceButtons(),
            skipTo: skipToChoice ? this.dialogueLines.length - 1 : 0,
            onLineChange: (index) => {
                // Play pan sound when mom is mentioned (line 3)
                if (index === 3) {
                    playSFX(this, "pan");
                }
            },
        });

        // createDevSkipButton(this, "Scene02MarketInvite");
        createBackButton(this);
    }

    showChoiceButtons() {
        const metrics = getResponsiveMetrics(this);
        const { dpr, buttonScale } = metrics;
        getAnalytics().markCheckpoint({
            sceneKey: this.scene.key,
            checkpointId: "intro.morning.choice",
        });

        this.runner.hintObj.setText("Make a choice:");

        // Position buttons relative to dialogue box center for symmetry
        const dialogueBox = this.runner.config.box;
        const centerX = dialogueBox.x;
        const buttonY = dialogueBox.y - dialogueBox.h / 2 - Math.round(60 * dpr);

        // Option: Keep scrolling TikTok → bad ending
        const btn1 = createImageButton(this, 0, buttonY, "", {
            textureKey: "lv1-opt-wake-tiktok",
            hoverScale: true,
            scale: buttonScale,
            onClick: () => goToScene(this, "BadEndingScene"),
        }).bg;
        btn1.setX(centerX - dialogueBox.w / 2 + btn1.displayWidth / 2 + Math.round(40 * dpr));

        // Option: Get up → continue
        const btn2 = createImageButton(this, 0, buttonY, "", {
            textureKey: "lv1-opt-wake-get-up",
            hoverScale: true,
            scale: buttonScale,
            onClick: () => goToScene(this, "Scene02MarketInvite"),
        }).bg;
        btn2.setX(centerX + dialogueBox.w / 2 - btn2.displayWidth / 2 - Math.round(40 * dpr));
    }
}
