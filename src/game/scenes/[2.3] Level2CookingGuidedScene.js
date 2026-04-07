import Phaser from "phaser";
import {
  preloadUIAssets,
  preloadLevelAssets,
  createImageButton,
  createModalFrame,
  createDevSkipButton,
  createBackButton } from "../UIHelpers";

export default class Level2CookingGuidedScene extends Phaser.Scene {
  constructor() {
    super("Level2CookingGuidedScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 2);
  }

  create() {
    const { width, height } = this.scale;
    this.W = width;
    this.H = height;

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

    // Build full distractor pool: all icon keys across all challenges
    this.allIconKeys = [];
    this.challenges.forEach((ch) => {
      ch.steps.forEach((s) => {
        if (!this.allIconKeys.includes(s.icon)) {
          this.allIconKeys.push(s.icon);
        }
      });
    });

    this.currentChallengeIndex = 0;
    this.currentStepIndex = 0;

    // Background visible behind the instruction modal
    this.add.image(this.W / 2, this.H / 2, "lv2-cl1-bg-start").setDisplaySize(this.W, this.H).setDepth(0);
    this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x000000, 0.35).setDepth(1);

    createDevSkipButton(this, "CookingChallengeCompleteScene");
    createBackButton(this);
    this.showInstructionModal();
  }

  // ===================== INSTRUCTION MODAL =====================

  showInstructionModal() {
    const { container } = createModalFrame(this, 0, 0, { overlayAlpha: 0.7 });
    this.instructionModal = container;

    const howToPlay = this.add
      .image(this.W / 2, this.H / 2 - 40, "lv2-how-to-play")
      .setDisplaySize(700, 420);

    const BUTTON_SCALE = 0.2;
    const startBtn = this.add
      .image(this.W / 2, this.H / 2 + 230, "continue_button")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => {
        this.instructionModal.destroy();
        this.loadChallenge(0);
      });

    this.instructionModal.add([howToPlay, startBtn]);
  }

  // ===================== LOAD CHALLENGE =====================

  loadChallenge(index) {
    this.children.removeAll(true);
    this.currentChallengeIndex = index;
    this.currentStepIndex = 0;

    const challenge = this.challenges[index];

    // Show bg_start, click to begin step 1
    this.bgImage = this.add
      .image(this.W / 2, this.H / 2, challenge.bgStart)
      .setDisplaySize(this.W, this.H);

    // Progress label
    this.add
      .text(
        this.W - 20,
        20,
        `Challenge ${index + 1} / ${this.challenges.length}`,
        { fontSize: "16px", color: "#ffffff", fontFamily: "SVN-Pequena Neo", stroke: "#000000", strokeThickness: 3 }
      )
      .setOrigin(1, 0);

    // Click anywhere to start step 1
    const clickHint = this.add
      .text(this.W / 2, this.H - 60, "Click to start", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "SVN-Pequena Neo",
        stroke: "#000000",
        strokeThickness: 4,
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

    // Delay registration so the click that triggered this screen doesn't fire it immediately
    this.time.delayedCall(200, () => {
      this.input.once("pointerdown", () => {
        this.tweens.killAll();
        this.loadStep(0);
      });
    });
  }

  // ===================== LOAD STEP =====================

  loadStep(stepIndex) {
    this.children.removeAll(true);
    this.currentStepIndex = stepIndex;

    const challenge = this.challenges[this.currentChallengeIndex];
    const step = challenge.steps[stepIndex];

    // Background for this step
    this.bgImage = this.add
      .image(this.W / 2, this.H / 2, step.bg)
      .setDisplaySize(this.W, this.H);

    // Progress label
    this.add
      .text(
        this.W - 20,
        20,
        `Challenge ${this.currentChallengeIndex + 1} / ${this.challenges.length}  ·  Step ${stepIndex + 1} / ${challenge.steps.length}`,
        { fontSize: "16px", color: "#ffffff", fontFamily: "SVN-Pequena Neo", stroke: "#000000", strokeThickness: 3 }
      )
      .setOrigin(1, 0);

    // Step progress dots
    this.drawProgressDots(challenge.steps.length, stepIndex);

    // Render icon choices
    this.renderIconChoices(step.icon, step.instruction, step.choices);
  }

  // ===================== PROGRESS DOTS =====================

  drawProgressDots(total, current) {
    const dotY = 60;
    const dotGap = 32;
    const startX = this.W / 2 - ((total - 1) * dotGap) / 2;
    for (let i = 0; i < total; i++) {
      const color =
        i < current ? 0x66ff66 : i === current ? 0xffcc00 : 0xaaaaaa;
      const dot = this.add.circle(startX + i * dotGap, dotY, 10, color);
      dot.setStrokeStyle(2, 0x000000);
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

    const iconSize = 160;
    const gap = 30;
    const totalW = choices.length * iconSize + (choices.length - 1) * gap;
    const startX = this.W / 2 - totalW / 2 + iconSize / 2;
    const iconY = this.H - 120;

    // Instruction text (custom per step, or fallback)
    this.add
      .text(this.W / 2, iconY - iconSize / 2 - 20, instruction || "Pick the next step:", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "SVN-Pequena Neo",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    choices.forEach((key, i) => {
      const x = startX + i * (iconSize + gap);
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
          this.time.delayedCall(600, () => this.onCorrect());
        } else {
          icon.setTint(0xff4444);
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

    const challenge = this.challenges[this.currentChallengeIndex];

    // Restore background, then overlay
    this.add.image(this.W / 2, this.H / 2, challenge.bgStart).setDisplaySize(this.W, this.H);
    this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x000000, 0.4);

    // Dish unlocked image
    this.add
      .image(this.W / 2, this.H / 2 - 60, challenge.dishUnlocked)
      .setScale(0.5);

    // Continue button
    const BUTTON_SCALE = 0.15;
    this.add
      .image(this.W / 2, this.H / 2 +300, "continue_button")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.goToNextChallenge());
  }

  // ===================== NEXT CHALLENGE =====================

  goToNextChallenge() {
    const next = this.currentChallengeIndex + 1;
    if (next < this.challenges.length) {
      this.loadChallenge(next);
    } else {
      this.scene.start("CookingChallengeCompleteScene");
    }
  }
}
