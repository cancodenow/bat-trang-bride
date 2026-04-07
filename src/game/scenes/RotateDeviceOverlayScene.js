import Phaser from "phaser";
import { shouldShowRotateOverlay, getResponsiveMetrics } from "../UIHelpers";

export default class RotateDeviceOverlayScene extends Phaser.Scene {
    constructor() {
        super("RotateDeviceOverlayScene");
        this.pausedSceneKeys = new Set();
        this.overlayVisible = false;
    }

    create() {
        this.metrics = getResponsiveMetrics(this);
        this.dpr = this.metrics.dpr;
        this.overlay = this.add
            .rectangle(0, 0, 0, 0, 0x04070d, 0.92)
            .setOrigin(0.5)
            .setDepth(1000);
        this.panel = this.add
            .rectangle(0, 0, 0, 0, 0x111827, 0.94)
            .setStrokeStyle(Math.round(4 * this.dpr), 0xfbbf24)
            .setDepth(1001);
        this.icon = this.add
            .text(0, 0, "↻", {
                fontSize: this.metrics.fs(84),
                color: "#f8fafc",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(0.5)
            .setDepth(1002);
        this.title = this.add
            .text(0, 0, "Rotate Your Phone", {
                fontSize: this.metrics.fs(34),
                fontStyle: "bold",
                color: "#f8fafc",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(1002);
        this.message = this.add
            .text(0, 0, "This game is designed for landscape mode.\nPlease rotate your device to continue.", {
                fontSize: this.metrics.fs(24),
                color: "#dbe4ee",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(1002);
        this.hint = this.add
            .text(0, 0, "Gameplay stays blocked until the screen is horizontal.", {
                fontSize: this.metrics.fs(18),
                color: "#fbbf24",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(1002);

        this.refreshLayout();
        this.setOverlayVisible(shouldShowRotateOverlay(this));

        this.refreshHandler = () => {
            this.refreshLayout();
            this.setOverlayVisible(shouldShowRotateOverlay(this));
        };

        this.scale.on("resize", this.refreshHandler);
        this.scale.on("orientationchange", this.refreshHandler);

        this.events.once("shutdown", () => {
            this.scale.off("resize", this.refreshHandler);
            this.scale.off("orientationchange", this.refreshHandler);
            this.resumePausedScenes();
        });
    }

    refreshLayout() {
        const width = this.scale.width;
        const height = this.scale.height;
        const panelWidth = Math.min(Math.round(width * 0.74), 760);
        const panelHeight = Math.min(Math.round(height * 0.58), 360);
        const centerX = width / 2;
        const centerY = height / 2;

        this.overlay.setPosition(centerX, centerY).setSize(width, height);
        this.panel.setPosition(centerX, centerY).setSize(panelWidth, panelHeight);
        this.icon.setPosition(centerX, centerY - Math.round(92 * this.dpr));
        this.title.setPosition(centerX, centerY - Math.round(18 * this.dpr));
        this.message.setPosition(centerX, centerY + Math.round(52 * this.dpr));
        this.hint.setPosition(centerX, centerY + Math.round(126 * this.dpr));
    }

    setOverlayVisible(visible) {
        if (this.overlayVisible === visible) {
            return;
        }

        this.overlayVisible = visible;
        this.overlay.setVisible(visible);
        this.panel.setVisible(visible);
        this.icon.setVisible(visible);
        this.title.setVisible(visible);
        this.message.setVisible(visible);
        this.hint.setVisible(visible);

        if (visible) {
            this.overlay.setInteractive();
            this.scene.bringToTop();
            this.pauseUnderlyingScenes();
            return;
        }

        this.overlay.disableInteractive();
        this.resumePausedScenes();
    }

    pauseUnderlyingScenes() {
        for (const activeScene of this.scene.manager.scenes) {
            const key = activeScene.scene.key;

            if (key === this.scene.key || !activeScene.scene.isActive()) {
                continue;
            }

            activeScene.scene.pause();
            this.pausedSceneKeys.add(key);
        }
    }

    resumePausedScenes() {
        for (const key of this.pausedSceneKeys) {
            const targetScene = this.scene.get(key);

            if (targetScene?.scene?.isPaused()) {
                targetScene.scene.resume();
            }
        }

        this.pausedSceneKeys.clear();
    }
}
