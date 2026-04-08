import Phaser from "phaser";
import { loadProgress } from "../progress.js";
import { startManagedScene } from "../sceneLoading.js";

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
                startManagedScene(this, "OpeningScene");
            } else {
                const data = {};
                if (challengeIndex != null) data.currentChallengeIndex = challengeIndex;
                if (stepIndex != null) data.currentStepIndex = stepIndex;
                startManagedScene(this, sceneKey, Object.keys(data).length ? data : undefined);
            }
        } else {
            startManagedScene(this, "OpeningScene");
        }
    }
}
