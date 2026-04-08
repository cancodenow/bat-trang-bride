import Phaser from "phaser";
import { ensureSceneLoaded } from "../sceneLoading.js";
import { getSceneAssetGroups, LOADING_SCENE_KEY } from "../sceneRegistry.js";
import { preloadAssetGroups } from "../ui/assets.js";

export default class SceneLoadingScene extends Phaser.Scene {
    constructor() {
        super(LOADING_SCENE_KEY);
    }

    init(data = {}) {
        this.targetKey = data.targetKey || "OpeningScene";
        this.targetData = data.targetData ?? null;
    }

    preload() {
        preloadAssetGroups(this, getSceneAssetGroups(this.targetKey));
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor("#101820");

        this.add
            .rectangle(width / 2, height / 2, width, height, 0x101820, 1)
            .setDepth(0);

        this.loadingText = this.add
            .text(width / 2, height / 2, "Loading...", {
                fontSize: "32px",
                color: "#f7d89c",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(1);

        this.loadTargetScene();
    }

    async loadTargetScene() {
        try {
            await ensureSceneLoaded(this.game, this.targetKey);

            if (this.targetData) {
                this.scene.start(this.targetKey, this.targetData);
            } else {
                this.scene.start(this.targetKey);
            }
        } catch (error) {
            console.error("[scene-loader] failed to load scene", this.targetKey, error);

            this.loadingText.setText("Failed to load scene.\nTap to retry.");

            this.input.once("pointerdown", () => {
                this.scene.restart({
                    targetKey: this.targetKey,
                    targetData: this.targetData,
                });
            });
        }
    }
}
