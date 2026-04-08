import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadCharacters,
    createImageButton,
    createDevSkipButton,
    addCoverBg,
    getResponsiveMetrics,
    bindResponsiveScene,
} from "../UIHelpers";

export default class OpeningScene extends Phaser.Scene {
    constructor() {
        super("OpeningScene");
    }

    preload() {
        this.load.image("openingbg", "/assets/background/opening-bg.png");
        this.load.image("introBg", "/assets/background/intro-bg.png");
        this.load.image("morningBg", "/assets/background/morning-bg.png");
        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadCharacters(this);
    }

    create() {
        const metrics = getResponsiveMetrics(this);

        const bgImg = addCoverBg(this, "openingbg");
        this.cameras.main.setBackgroundColor("#151fe0");

        const startButton = createImageButton(this, 0, 0, "", {
            textureKey: "start_journey",
            scale: 0.5,
            onClick: () => this.scene.start("IntroScene"),
        });

        const buttonX = bgImg.x + bgImg.displayWidth * 0.1;
        const buttonY = bgImg.y + bgImg.displayHeight * 0.1;

        startButton.bg.setPosition(buttonX, buttonY);
        startButton.label.setPosition(buttonX, buttonY);

        createDevSkipButton(this, "IntroScene");
    }
}
