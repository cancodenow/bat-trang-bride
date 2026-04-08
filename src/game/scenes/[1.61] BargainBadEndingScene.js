import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadSoundAssets,
    createImageButton,
    createDevSkipButton,
    createBackButton,
    createTryAgainButton,
    getResponsiveMetrics,
    crossfadeMusic,
    playSFX,
    playMusic,
} from "../UIHelpers";

export default class BargainBadEndingScene extends Phaser.Scene {
    constructor() {
        super("BargainBadEndingScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadSoundAssets(this);
    }

    create() {
        const metrics = getResponsiveMetrics(this);
        const { width, height, fs, dpr, buttonScale } = metrics;

        playSFX(this, "wrong");
        playMusic(this, "bgm");

        this.cameras.main.setBackgroundColor("#000000");

        // Big title
        this.add
            .text(width / 2, height / 2 - Math.round(100 * dpr), "BAD ENDING", {
                fontSize: fs(48),
                color: "#ff4444",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        // Body text
        this.add
            .text(
                width / 2,
                height / 2,
                "You do not know how to bargain.\nYou spend all your pocket money on the ribs.",
                {
                    fontSize: fs(22),
                    color: "#cccccc",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    wordWrap: { width: Math.round(600 * dpr) },
                    lineSpacing: Math.round(10 * dpr),
                },
            )
            .setOrigin(0.5);

        // Restart button
        createTryAgainButton(this, width / 2, height / 2 + 180, {
            onClick: () =>
                this.scene.start("BargainScene", { skipToChoice: "choice1" }),
            scale: buttonScale
        });
        createDevSkipButton(this, "BuyRibsIntroScene");
        createBackButton(this);
    }
}
