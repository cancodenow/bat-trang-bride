import Phaser from "phaser";
import {
    preloadAssetGroups,
    preloadUIAssets,
    preloadSoundAssets,
    createImageButton,
    createDevSkipButton,
    addCoverBg,
    getResponsiveMetrics,
    bindResponsiveScene,
    playMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

export default class OpeningScene extends Phaser.Scene {
    constructor() {
        super("OpeningScene");
    }

    preload() {
        preloadAssetGroups(this, ["story-backgrounds"]);
        preloadUIAssets(this);
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("OpeningScene", "opening.start");
        const metrics = getResponsiveMetrics(this);

        // Play intro music
        playMusic(this, "intro-music");

        const bgImg = addCoverBg(this, "openingbg");
        this.cameras.main.setBackgroundColor("#151fe0");

        const startButton = createImageButton(this, 0, 0, "", {
            textureKey: "start_journey",
            scale: 0.5,
            onClick: () => goToScene(this, "IntroScene"),
        });

        const buttonX = bgImg.x + bgImg.displayWidth * 0.1;
        const buttonY = bgImg.y + bgImg.displayHeight * 0.1;

        startButton.bg.setPosition(buttonX, buttonY);
        startButton.label.setPosition(buttonX, buttonY);

        createDevSkipButton(this, "IntroScene");
    }
}
