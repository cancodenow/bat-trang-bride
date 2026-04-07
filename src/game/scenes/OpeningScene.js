import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, preloadCharacters, createImageButton, createDevSkipButton } from "../UIHelpers";

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
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "openingbg").setDisplaySize(width, height);
    this.cameras.main.setBackgroundColor("#151fe0");


    createImageButton(this, width - 650, height - 360, "", {
      textureKey: "start_journey",
      onClick: () => this.scene.start("IntroScene"),
    });

    createDevSkipButton(this, "IntroScene");
  }
}