import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createContinueButton,
    createModalFrame,
    createBackButton,
    getResponsiveMetrics,
    preloadSoundAssets,
    preloadCharacters,
    playMusic,
    playSFX,
    goToScene,
    DialogueRunner,
} from "../UIHelpers";
import { getAnalytics } from "../analytics";
import { updateCheckpoint } from "../progress.js";

// Build full distractor pool once at module load: all icon keys across all challenges
const ALL_ICON_KEYS = (() => {
    const keys = [];
    const challenges = [
        {
            steps: [
                { icon: "lv2-cl1-step1" },
                { icon: "lv2-cl1-step2" },
                { icon: "lv2-cl1-step4" },
                { icon: "lv2-cl1-step3" },
                { icon: "lv2-cl1-step5" },
            ],
        },
        {
            steps: [
                { icon: "lv2-cl2-step1" },
                { icon: "lv2-cl2-step2" },
                { icon: "lv2-cl2-step3" },
                { icon: "lv2-cl2-step4" },
                { icon: "lv2-cl2-step5" },
            ],
        },
        {
            steps: [
                { icon: "lv2-cl3-step1" },
                { icon: "lv2-cl3-step2" },
                { icon: "lv2-cl3-step3" },
                { icon: "lv2-cl3-step4" },
                { icon: "lv2-cl3-step5" },
            ],
        },
    ];
    challenges.forEach((ch) => {
        ch.steps.forEach((s) => {
            if (!keys.includes(s.icon)) {
                keys.push(s.icon);
            }
        });
    });
    return keys;
})();

// Compliments are now delivered via DialogueRunner instead of static images

export default class Level2CookingGuidedScene extends Phaser.Scene {
    constructor() {
        super("Level2CookingGuidedScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadSoundAssets(this);
        preloadCharacters(this);
    }

    create(data = {}) {
        const { width, height } = this.scale;
        this.W = width;
        this.H = height;
        this.metrics = getResponsiveMetrics(this);

        playMusic(this, "bgm");

        // ===================== CHALLENGE DATA =====================

        this.challenges = [
            {
                // CL1: Bamboo Shoot and Dried Squid Soup
                // Icons: step1=bamboo shoots, step2=water, step3=dried squid, step4=low heat, step5=seasoning
                id: "cl1",
                bgStart: "lv2-cl1-bg-start",
                steps: [
                    {
                        bg: "lv2-cl1-bg-start",
                        icon: "lv2-cl1-step1",   // Dried bamboo shoots
                        instruction: "Add dried bamboo shoots",
                        choices: ["lv2-cl1-step1", "lv2-cl1-step2", "lv2-cl1-step3", "lv2-cl1-step4"],
                    },
                    {
                        bg: "lv2-cl1-bg-step1",
                        icon: "lv2-cl1-step2",   // Water
                        instruction: "Add water",
                        choices: ["lv2-cl1-step1", "lv2-cl1-step2", "lv2-cl1-step3", "lv2-cl1-step4"],
                    },
                    {
                        bg: "lv2-cl1-bg-step2",
                        icon: "lv2-cl1-step4",   // Low heat (file: cl1_lv2_step3(1).png)
                        instruction: "Low heat",
                        choices: ["lv2-cl1-step2", "lv2-cl1-step3", "lv2-cl1-step4", "lv2-cl1-step5"],
                    },
                    {
                        bg: "lv2-cl1-bg-step3",
                        icon: "lv2-cl1-step3",   // Dried squid
                        instruction: "Add dried squid",
                        choices: ["lv2-cl1-step1", "lv2-cl1-step3", "lv2-cl1-step4", "lv2-cl1-step5"],
                    },
                    {
                        bg: "lv2-cl1-bg-step4",
                        icon: "lv2-cl1-step5",   // Seasoning
                        instruction: "Add seasoning",
                        choices: ["lv2-cl1-step1", "lv2-cl1-step3", "lv2-cl1-step4", "lv2-cl1-step5"],
                    },

                ],
                dishUnlocked: "lv2-dish-unlocked-bamboo",
            },
            {
                // CL2: Stir-fried Kohlrabi with Squid
                // Icons in order: step1=high heat, step2=squid, step3=stir, step4=kohlrabi, step5=seasoning
                id: "cl2",
                bgStart: "lv2-cl2-bg-start",
                steps: [
                    {
                        bg: "lv2-cl2-bg-start",
                        icon: "lv2-cl2-step1",   // High heat
                        instruction: "High heat",
                        choices: ["lv2-cl2-step1", "lv2-cl2-step2", "lv2-cl2-step3", "lv2-cl2-step4"],
                    },
                    {
                        bg: "lv2-cl2-bg-step1",
                        icon: "lv2-cl2-step2",   // Add squid
                        instruction: "Add squid",
                        choices: ["lv2-cl2-step1", "lv2-cl2-step2", "lv2-cl2-step3", "lv2-cl2-step4"],
                    },
                    {
                        bg: "lv2-cl2-bg-step2",
                        icon: "lv2-cl2-step3",   // Stir
                        instruction: "Stir",
                        choices: ["lv2-cl2-step1", "lv2-cl2-step3", "lv2-cl2-step4", "lv2-cl2-step5"],
                    },
                    {
                        bg: "lv2-cl2-bg-step3",
                        icon: "lv2-cl2-step4",   // Add kohlrabi
                        instruction: "Add kohlrabi",
                        choices: ["lv2-cl2-step2", "lv2-cl2-step3", "lv2-cl2-step4", "lv2-cl2-step5"],
                    },
                    {
                        bg: "lv2-cl2-bg-step4",
                        icon: "lv2-cl2-step5",   // Add seasoning
                        instruction: "Add seasoning",
                        choices: ["lv2-cl2-step1", "lv2-cl2-step3", "lv2-cl2-step4", "lv2-cl2-step5"],
                    },
                ],
                dishUnlocked: "lv2-dish-unlocked-kohlrabi",
            },
            {
                // CL3: Crispy Shrimp Rolls
                // Icons in order: step1=shrimp, step2=wood ear mushrooms, step3=shiitake, step4=wrap rolls, step5=fry
                id: "cl3",
                bgStart: "lv2-cl3-bg-start",
                steps: [
                    {
                        bg: "lv2-cl3-bg-start",
                        icon: "lv2-cl3-step1",   // Add shrimp
                        instruction: "Add shrimp",
                        choices: ["lv2-cl3-step1", "lv2-cl3-step2", "lv2-cl3-step3", "lv2-cl3-step4"],
                    },
                    {
                        bg: "lv2-cl3-bg-step1",
                        icon: "lv2-cl3-step2",   // Add wood ear mushrooms
                        instruction: "Add wood ear mushrooms",
                        choices: ["lv2-cl3-step1", "lv2-cl3-step2", "lv2-cl3-step3", "lv2-cl3-step4"],
                    },
                    {
                        bg: "lv2-cl3-bg-step2",
                        icon: "lv2-cl3-step3",   // Add shiitake mushrooms
                        instruction: "Add shiitake mushrooms",
                        choices: ["lv2-cl3-step1", "lv2-cl3-step3", "lv2-cl3-step4", "lv2-cl3-step5"],
                    },
                    {
                        bg: "lv2-cl3-bg-step3",
                        icon: "lv2-cl3-step4",   // Wrap rolls
                        instruction: "Wrap rolls",
                        choices: ["lv2-cl3-step2", "lv2-cl3-step3", "lv2-cl3-step4", "lv2-cl3-step5"],
                    },
                    {
                        bg: "lv2-cl3-bg-step4",
                        icon: "lv2-cl3-step5",   // Fry until golden
                        instruction: "Fry until golden",
                        choices: ["lv2-cl3-step1", "lv2-cl3-step3", "lv2-cl3-step4", "lv2-cl3-step5"],
                    },
                ],
                dishUnlocked: "lv2-dish-unlocked-crispy-shrimp-rolls",
            },
        ];

        // Use pre-built distractor pool from module scope
        this.allIconKeys = ALL_ICON_KEYS;

        this.currentChallengeIndex = data.currentChallengeIndex || 0;
        this.currentStepIndex = data.currentStepIndex || 0;
        this.currentView = data.view || "instruction";

        updateCheckpoint("Level2CookingGuidedScene", `level2.challenge${this.currentChallengeIndex + 1}.step${this.currentStepIndex + 1}`, {
            challengeIndex: this.currentChallengeIndex,
            stepIndex: this.currentStepIndex
        });

        // Background visible behind the instruction modal
        this.add.image(this.W / 2, this.H / 2, "lv2-cl1-bg-start").setDisplaySize(this.W, this.H).setDepth(0);
        this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x000000, 0.35).setDepth(1);

        // createDevSkipButton(this, "CookingChallengeCompleteScene");
        createBackButton(this);
        this.restoreViewFromState();
    }

    getSceneState() {
        return {
            currentChallengeIndex: this.currentChallengeIndex,
            currentStepIndex: this.currentStepIndex,
            view: this.currentView,
        };
    }

    restoreViewFromState() {
        if (this.currentView === "step") {
            this.loadStep(this.currentStepIndex);
            return;
        }

        if (this.currentView === "challenge") {
            this.loadChallenge(this.currentChallengeIndex);
            return;
        }

        if (this.currentView === "unlocked") {
            this.showDishUnlocked();
            return;
        }

        this.showInstructionModal();
    }

    // ===================== INSTRUCTION MODAL =====================

    showInstructionModal() {
        this.currentView = "instruction";
        const { width, modal, buttonScale } = this.metrics;
        const { container } = createModalFrame(this, modal.width, modal.height, {
            overlayAlpha: 0.7,
            textureKey: "lv2-how-to-play",
            fitTexture: true,
        });
        this.instructionModal = container;

        const { bg: startButton } = createContinueButton(this, width / 2, modal.buttonY, {
            onClick: () => {
                this.instructionModal.destroy();
                this.loadChallenge(0);
            },
            scale: buttonScale,
        });

        this.instructionModal.add([startButton]);
    }

    // ===================== LOAD CHALLENGE =====================

    loadChallenge(index) {
        // Explicitly clean up continue button from previous challenge's dish unlock modal
        // to prevent its click handler from persisting and triggering goToNextChallenge
        if (this.dishContinueButton) {
            this.dishContinueButton.bg?.off("pointerdown");
            this.dishContinueButton.bg?.destroy();
            this.dishContinueButton.label?.destroy();
            this.dishContinueButton = null;
        }
        this.children.removeAll(true);
        this._isTransitioningToStep = false; // Reset flag for new challenge
        this.currentChallengeIndex = index;
        this.currentStepIndex = 0;
        this.currentView = "challenge";
        this.metrics = getResponsiveMetrics(this);

        const challenge = this.challenges[index];
        getAnalytics().markCheckpoint({
            sceneKey: this.scene.key,
            checkpointId: `level2.challenge${index + 1}.start`,
            level: 2,
        });

        // Show bg_start, click to begin step 1
        this.bgImage = this.add
            .image(this.W / 2, this.H / 2, challenge.bgStart)
            .setDisplaySize(this.W, this.H)
            .setInteractive();

        // Progress label
        this.add
            .text(
                this.W - 20,
                20,
                `Challenge ${index + 1} / ${this.challenges.length}`,
                { fontSize: this.metrics.fs(16), color: "#ffffff", fontFamily: "SVN-Pequena Neo", stroke: "#000000", strokeThickness: Math.round(3 * this.metrics.dpr) }
            )
            .setOrigin(1, 0);

        // Click anywhere to start step 1
        const clickHint = this.add
            .text(this.W / 2, this.H - this.metrics.bottomInset - Math.round(36 * this.metrics.dpr), "Tap to start", {
                fontSize: this.metrics.fs(20),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                stroke: "#000000",
                strokeThickness: Math.round(4 * this.metrics.dpr),
            })
            .setOrigin(0.5);

        // Blink the hint
        this.tweens.add({
            targets: clickHint,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1,
        });

        // Register click handler on background only (not global input)
        // Using a named handler so we can properly clean it up if needed
        this.bgImage.on("pointerdown", this.handleChallengeStartClick, this);
    }

    handleChallengeStartClick() {
        // Prevent double-firing if already transitioning
        if (this._isTransitioningToStep) {
            return;
        }
        this._isTransitioningToStep = true;

        // Disable interactivity immediately and remove handler
        if (this.bgImage) {
            this.bgImage.off("pointerdown", this.handleChallengeStartClick, this);
            this.bgImage.disableInteractive();
        }
        this.tweens.killAll();
        this.loadStep(0);
    }

    // ===================== LOAD STEP =====================

    loadStep(stepIndex) {
        this.children.removeAll(true);
        this.currentStepIndex = stepIndex;
        this.currentView = "step";
        this.metrics = getResponsiveMetrics(this);

        const challenge = this.challenges[this.currentChallengeIndex];
        const step = challenge.steps[stepIndex];
        getAnalytics().markCheckpoint({
            sceneKey: this.scene.key,
            checkpointId: `level2.challenge${this.currentChallengeIndex + 1}.step${stepIndex + 1}`,
            level: 2,
        });
        updateCheckpoint("Level2CookingGuidedScene", `level2.challenge${this.currentChallengeIndex + 1}.step${stepIndex + 1}`, {
            challengeIndex: this.currentChallengeIndex,
            stepIndex: this.currentStepIndex
        });

        // Background for this step
        this.bgImage = this.add
            .image(this.W / 2, this.H / 2, step.bg)
            .setDisplaySize(this.W, this.H);

        // Progress label
        this.add
            .text(
                this.W - 20,
                this.metrics.topInset,
                `Challenge ${this.currentChallengeIndex + 1} / ${this.challenges.length}  ·  Step ${stepIndex + 1} / ${challenge.steps.length}`,
                { fontSize: this.metrics.fs(16), color: "#ffffff", fontFamily: "SVN-Pequena Neo", stroke: "#000000", strokeThickness: Math.round(3 * this.metrics.dpr) }
            )
            .setOrigin(1, 0);

        // Step progress dots
        this.drawProgressDots(challenge.steps.length, stepIndex);

        // Render icon choices
        this.renderIconChoices(step.icon, step.instruction, step.choices);
    }

    // ===================== PROGRESS DOTS =====================

    drawProgressDots(total, current) {
        const dotY = this.metrics.topInset + Math.round(40 * this.metrics.dpr);
        const dotGap = Math.round(32 * this.metrics.dpr);
        const startX = this.W / 2 - ((total - 1) * dotGap) / 2;
        for (let i = 0; i < total; i++) {
            const color =
                i < current ? 0x66ff66 : i === current ? 0xffcc00 : 0xaaaaaa;
            const dot = this.add.circle(startX + i * dotGap, dotY, Math.round(10 * this.metrics.dpr), color);
            dot.setStrokeStyle(Math.round(2 * this.metrics.dpr), 0x000000);
        }
    }

    // ===================== ICON CHOICES =====================

    renderIconChoices(correctKey, instruction, choicesOverride) {
        // Use explicit choices if provided, otherwise pick random distractors
        let choices;
        if (choicesOverride && choicesOverride.length > 0) {
            choices = Phaser.Utils.Array.Shuffle([...choicesOverride]);
        } else {
            const distractors = Phaser.Utils.Array.Shuffle(
                this.allIconKeys.filter((k) => k !== correctKey)
            ).slice(0, 3);
            choices = Phaser.Utils.Array.Shuffle([correctKey, ...distractors]);
        }

        const iconSize = this.metrics.challengeChoices.iconSize;
        const gap = this.metrics.challengeChoices.gap;
        const columns = this.metrics.challengeChoices.columns;
        const rows = Math.ceil(choices.length / columns);
        const totalW = columns * iconSize + (columns - 1) * gap;
        const startX = this.W / 2 - totalW / 2 + iconSize / 2;
        const startY = this.H - Math.round(120 * this.metrics.dpr) - iconSize / 2;
        const instructionY = startY - Math.round(100 * this.metrics.dpr);

        // Instruction text (custom per step, or fallback)
        this.add
            .text(this.W / 2, instructionY, instruction || "Pick the next step:", {
                fontSize: this.metrics.fs(24),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                stroke: "#000000",
                strokeThickness: Math.round(4 * this.metrics.dpr),
                align: "center",
            })
            .setOrigin(0.5);

        choices.forEach((key, i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            const x = startX + col * (iconSize + gap);
            const iconY = startY + row * (iconSize + gap);
            const icon = this.add
                .image(x, iconY, key)
                .setDisplaySize(iconSize, iconSize)
                .setInteractive({ useHandCursor: true });

            const isCorrect = key === correctKey;

            icon.on("pointerover", () => {
                if (!this.lockIcons) icon.setScale(icon.scaleX * 1.08);
            });
            icon.on("pointerout", () => {
                if (!this.lockIcons) icon.setDisplaySize(iconSize, iconSize);
            });

            icon.on("pointerdown", () => {
                if (this.lockIcons) return;
                this.lockIcons = true;
                if (isCorrect) {
                    icon.setTint(0x66ff66);
                    playSFX(this, "correct");
                    this.time.delayedCall(600, () => this.onCorrect());
                } else {
                    icon.setTint(0xff4444);
                    playSFX(this, "wrong");
                    this.time.delayedCall(600, () => {
                        icon.clearTint();
                        icon.setDisplaySize(iconSize, iconSize);
                        this.lockIcons = false;
                    });
                }
            });
        });

        this.lockIcons = false;
    }

    // ===================== CORRECT =====================

    onCorrect() {
        const challenge = this.challenges[this.currentChallengeIndex];
        const nextStep = this.currentStepIndex + 1;

        if (nextStep < challenge.steps.length) {
            this.loadStep(nextStep);
        } else {
            this.showDishUnlocked();
        }
    }

    // ===================== DISH UNLOCKED MODAL =====================

    showDishUnlocked() {
        this.children.removeAll(true);
        this.currentView = "unlocked";
        this.metrics = getResponsiveMetrics(this);

        const challenge = this.challenges[this.currentChallengeIndex];

        // Restore background, then overlay
        this.add.image(this.W / 2, this.H / 2, challenge.bgStart).setDisplaySize(this.W, this.H);
        this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x000000, 0.4);

        // Dish unlocked image
        this.add
            .image(this.W / 2, this.H / 2 - 60, challenge.dishUnlocked)
            .setScale(0.3 * this.metrics.dpr);

        // Random compliment dialogue from mom
        const complimentLines = [
            [
                { text: "Mom: Wonderful! You're getting better at this!", charLeft: "char-wife", charRight: "char-mom-happy" },
                { text: "Wife: Thank you, Mom! I'm learning so much.", charLeft: "char-wife", charRight: "char-mom-happy" },
            ],
            [
                { text: "Mom: Excellent work! That's exactly how it's done.", charLeft: "char-wife", charRight: "char-mom-thrilled" },
                { text: "Wife: I hope I can cook as well as you someday!", charLeft: "char-wife", charRight: "char-mom-thrilled" },
            ],
            [
                { text: "Mom: Perfect! You have a natural talent for cooking.", charLeft: "char-wife", charRight: "char-mom-happy" },
                { text: "Wife: Your guidance makes all the difference, Mom.", charLeft: "char-wife-giggle", charRight: "char-mom-happy" },
            ],
        ];
        const selectedLines = complimentLines[Math.floor(Math.random() * complimentLines.length)];

        this.dishDialogueRunner = new DialogueRunner(this, {
            box: {
                x: this.metrics.dialogue.x,
                y: this.metrics.dialogue.y,
                w: this.metrics.dialogue.width,
                h: this.metrics.dialogue.height,
            },
            chars: {
                left: { x: this.W * 0.2, y: this.H, scale: 0.5 },
                right: { x: this.W * 0.8, y: this.H, scale: 0.5, flipX: true },
            },
            lines: selectedLines,
            onComplete: () => this.showDishContinueButton(),
        });
    }

    // ===================== DISH DIALOGUE COMPLETE =====================

    showDishContinueButton() {
        // Use the dialogue runner's helper to position button beneath dialogue
        this.dishContinueButton = this.dishDialogueRunner.positionContinueButton({
            scale: this.metrics.buttonScale,
            onClick: () => {
                this.dishDialogueRunner?.destroy();
                this.goToNextChallenge();
            },
            gap: Math.round(-20 * this.metrics.dpr),
        });
    }

    // ===================== NEXT CHALLENGE =====================

    goToNextChallenge() {
        const next = this.currentChallengeIndex + 1;
        if (next < this.challenges.length) {
            this.loadChallenge(next);
        } else {
            goToScene(this, "CookingChallengeCompleteScene");
        }
    }
}
