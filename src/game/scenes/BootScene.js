import Phaser from "phaser";
import { loadProgress } from "../progress.js";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    create() {
        const progress = loadProgress();
        if (progress && progress.started && !progress.finished && progress.resumeTarget?.sceneKey) {
            const { sceneKey, challengeIndex, stepIndex } = progress.resumeTarget;
            // Don't resume into bad ending scenes directly
            const badEndingScenes = ["BadEndingScene", "BargainBadEndingScene"];
            if (badEndingScenes.includes(sceneKey)) {
                this.scene.start("OpeningScene");
            } else {
                const data = {};
                if (challengeIndex != null) data.currentChallengeIndex = challengeIndex;
                if (stepIndex != null) data.currentStepIndex = stepIndex;
                this.scene.start(sceneKey, Object.keys(data).length ? data : undefined);
            }
        } else {
            this.scene.start("OpeningScene");
        }
    }
}
