import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createContinueButton,
    createModalFrame,
    createDevSkipButton,
    createBackButton,
    getResponsiveMetrics,
    preloadSoundAssets,
    playMusic,
    crossfadeMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class Level2InstructionScene extends Phaser.Scene {
    constructor() {
        super("Level2InstructionScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 2);
        preloadSoundAssets(this);
    }

    create(data = {}) {
        updateCheckpoint("Level2InstructionScene", "level2.instruction");
        this.metrics = getResponsiveMetrics(this);
        this._hasInstructionModal = data.showInstruction !== false;

        playMusic(this, "bgm");

        this.cameras.main.setBackgroundColor("#1a1a2e");

        if (this._hasInstructionModal) {
            this.showInstructionModal();
        } else {
            goToScene(this, "Level2CookingGuidedScene");
        }

        createDevSkipButton(this, "Level2CookingGuidedScene");
        createBackButton(this);
    }

    showInstructionModal() {
        const { width, modal, buttonScale } = this.metrics;

        const { container } = createModalFrame(this, modal.width, modal.height, {
            overlayAlpha: 0.7,
            textureKey: "lv2-how-to-play",
            fitTexture: true,
        });
        this.instructionModal = container;

        const { bg: startButton } = createContinueButton(this, width / 2, modal.buttonY, {
            onClick: () => {
                this._hasInstructionModal = false;
                this.instructionModal.destroy();
                goToScene(this, "Level2CookingGuidedScene");
            },
            scale: buttonScale,
        });

        this.instructionModal.add([startButton]);
    }
}
