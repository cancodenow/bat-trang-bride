import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadSoundAssets,
    getResponsiveMetrics,
    createTryAgainButton,
    playSFX,
    playMusic,
    createBackButton,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint, markBadEnding } from "../progress.js";

export default class BadEndingScene extends Phaser.Scene {
    constructor() {
        super("BadEndingScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("BadEndingScene", "intro.bad-ending");
        markBadEnding("introTikTok", { sceneKey: "MorningScene01", checkpointId: "intro.morning.choice" });
        const metrics = getResponsiveMetrics(this);
        const { width, height, fs, dpr, buttonScale } = metrics;

        // Play wrong sound then TikTok music
        playSFX(this, "wrong");
        playMusic(this, "tiktok-music");

        this.cameras.main.setBackgroundColor("#000000");

        // Title
        this.add
            .text(width / 2, height / 2 - Math.round(100 * dpr), "BAD ENDING", {
                fontSize: fs(48),
                color: "#ff4444",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        // Body
        this.add
            .text(width / 2, height / 2, "You accidentally watched TikTok for 5 hours\nand failed to wake up in time to help with lunch.", {
                fontSize: fs(22),
                color: "#cccccc",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: Math.round(600 * dpr) },
                lineSpacing: Math.round(10 * dpr),
            })
            .setOrigin(0.5);

        // Restart button
        createTryAgainButton(this, width / 2, height / 2 + 120 * dpr, {
            onClick: () =>
                goToScene(this, "MorningScene01", { skipToChoice: true }),
            scale: buttonScale
        });

        // Back button uses progress to return to retry target
        createBackButton(this, "OpeningScene", { badEndingKey: "introTikTok" });

        // createDevSkipButton(this, "MorningScene01");
    }
}
