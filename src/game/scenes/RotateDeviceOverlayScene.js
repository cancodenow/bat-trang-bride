import Phaser from "phaser";
import { getSafeDevicePixelRatio } from "../UIHelpers";

const DPR = getSafeDevicePixelRatio();
const fs = (n) => `${Math.round(n * DPR)}px`;

export default class RotateDeviceOverlayScene extends Phaser.Scene {
    constructor() {
        super("RotateDeviceOverlayScene");
        this.pausedSceneKeys = new Set();
        this.overlayVisible = false;
    }

    create() {
        this.overlay = this.add.rectangle(0, 0, 0, 0, 0x04070d, 0.92).setOrigin(0.5).setDepth(1000);
        this.panel = this.add.rectangle(0, 0, 0, 0, 0x111827, 0.94).setStrokeStyle(Math.round(4 * DPR), 0xfbbf24).setDepth(1001);
        this.icon = this.add.text(0, 0, "↻", { fontSize: fs(84), color: "#f8fafc", fontFamily: "SVN-Pequena Neo" }).setOrigin(0.5).setDepth(1002);
        this.title = this.add.text(0, 0, "Rotate Your Phone", { fontSize: fs(34), fontStyle: "bold", color: "#f8fafc", fontFamily: "SVN-Pequena Neo", align: "center" }).setOrigin(0.5).setDepth(1002);
        this.message = this.add.text(0, 0, "This game is designed for landscape mode.\nPlease rotate your device to continue.", { fontSize: fs(24), color: "#dbe4ee", fontFamily: "SVN-Pequena Neo", align: "center" }).setOrigin(0.5).setDepth(1002);
        this.hint = this.add.text(0, 0, "Gameplay stays blocked until the screen is horizontal.", { fontSize: fs(18), color: "#fbbf24", fontFamily: "SVN-Pequena Neo", align: "center" }).setOrigin(0.5).setDepth(1002);

        this.refreshLayout();
        this.setOverlayVisible(this.scale.orientation === Phaser.Scale.PORTRAIT);

        this.scale.on("orientationchange", this.onOrientationChange, this);
        this.events.once("shutdown", this.onShutdown, this);
    }

    onOrientationChange(orientation) {
        this.refreshLayout();
        this.setOverlayVisible(orientation === Phaser.Scale.PORTRAIT);
    }

    onShutdown() {
        this.scale.off("orientationchange", this.onOrientationChange, this);
        this.resumePausedScenes();
    }

    refreshLayout() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        this.overlay.setPosition(centerX, centerY).setSize(width, height);
        this.panel.setPosition(centerX, centerY).setSize(Math.min(Math.round(width * 0.74), 760), Math.min(Math.round(height * 0.58), 360));
        this.icon.setPosition(centerX, centerY - Math.round(92 * DPR));
        this.title.setPosition(centerX, centerY - Math.round(18 * DPR));
        this.message.setPosition(centerX, centerY + Math.round(52 * DPR));
        this.hint.setPosition(centerX, centerY + Math.round(126 * DPR));
    }

    setOverlayVisible(visible) {
        if (this.overlayVisible === visible) return;
        this.overlayVisible = visible;

        for (const obj of [this.overlay, this.panel, this.icon, this.title, this.message, this.hint]) {
            obj.setVisible(visible);
        }

        if (visible) {
            this.overlay.setInteractive();
            this.scene.bringToTop();
            this.pauseUnderlyingScenes();
        } else {
            this.overlay.disableInteractive();
            this.resumePausedScenes();
        }
    }

    pauseUnderlyingScenes() {
        for (const s of this.scene.manager.scenes) {
            const key = s.scene.key;
            if (key === this.scene.key || !s.scene.isActive()) continue;
            s.scene.pause();
            this.pausedSceneKeys.add(key);
        }
    }

    resumePausedScenes() {
        for (const key of this.pausedSceneKeys) {
            const s = this.scene.get(key);
            if (s?.scene?.isPaused()) s.scene.resume();
        }
        this.pausedSceneKeys.clear();
    }
}
