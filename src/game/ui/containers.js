import { getResponsiveMetrics } from "./responsive.js";

// ===================== CONTAINER / FRAME HELPERS =====================

function hasTexture(scene, key) {
    return scene.textures.exists(key);
}

function nativeSize(scene, key, scale = 0.5) {
    const { dpr } = getResponsiveMetrics(scene);
    const frame = scene.textures.getFrame(key);
    return { w: frame.realWidth * scale * dpr, h: frame.realHeight * scale * dpr };
}

/**
 * Creates an image-backed box (textbox or infobox).
 * Falls back to a plain rectangle if the texture is missing.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-box-textbox"]  "ui-box-textbox" | "ui-box-infobox"
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.width]
 * @param {number}  [opts.height]
 * @param {number}  [opts.fillColor=0x444444]
 * @param {number}  [opts.fillAlpha=1]
 * @param {number}  [opts.strokeColor]
 * @param {number}  [opts.strokeWidth=2]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createBox(scene, x, y, opts = {}) {
    const textureKey = opts.textureKey || "ui-box-textbox";

    if (hasTexture(scene, textureKey)) {
        const { w: nw, h: nh } = nativeSize(scene, textureKey, opts.scale || 0.5);
        const w = opts.width || nw;
        const h = opts.height || nh;
        return scene.add.image(x, y, textureKey).setDisplaySize(w, h);
    }

    const fill = opts.fillColor !== undefined ? opts.fillColor : 0x444444;
    const alpha = opts.fillAlpha !== undefined ? opts.fillAlpha : 1;
    const w = opts.width || 300;
    const h = opts.height || 150;
    const rect = scene.add.rectangle(x, y, w, h, fill, alpha);
    if (opts.strokeColor !== undefined) {
        rect.setStrokeStyle(opts.strokeWidth || 2, opts.strokeColor);
    }
    return rect;
}

/**
 * Creates an image-backed result frame (good job, well done, etc.).
 * Falls back to a stroked rectangle if the texture is missing.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-frame-food"]
 *   Available: "ui-frame-food" | "ui-frame-challenge" | "ui-frame-dish-unlocked"
 *              "ui-frame-good-job" | "ui-frame-nicely-done" | "ui-frame-all-done" | "ui-frame-well"
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.width]
 * @param {number}  [opts.height]
 * @param {number}  [opts.fillColor=0x000000]
 * @param {number}  [opts.fillAlpha=0]
 * @param {number}  [opts.strokeColor=0xffcc00]
 * @param {number}  [opts.strokeWidth=3]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createFrame(scene, x, y, opts = {}) {
    const textureKey = opts.textureKey || "ui-frame-food";

    if (hasTexture(scene, textureKey)) {
        const { w: nw, h: nh } = nativeSize(scene, textureKey, opts.scale || 0.5);
        const w = opts.width || nw;
        const h = opts.height || nh;
        return scene.add.image(x, y, textureKey).setDisplaySize(w, h);
    }

    const fill = opts.fillColor !== undefined ? opts.fillColor : 0x000000;
    const alpha = opts.fillAlpha !== undefined ? opts.fillAlpha : 0;
    const strokeColor = opts.strokeColor !== undefined ? opts.strokeColor : 0xffcc00;
    const strokeWidth = opts.strokeWidth !== undefined ? opts.strokeWidth : 3;
    const w = opts.width || 300;
    const h = opts.height || 200;
    const rect = scene.add.rectangle(x, y, w, h, fill, alpha);
    rect.setStrokeStyle(strokeWidth, strokeColor);
    return rect;
}

/**
 * Renders a panel (sidebar or info panel).
 * Uses image if texture exists, otherwise a filled rectangle.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-panel"]
 * @param {number}  [opts.fillColor=0x1a2a3a]
 * @param {number}  [opts.fillAlpha=1]
 * @param {number}  [opts.strokeColor]
 * @param {number}  [opts.strokeWidth=2]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createPanel(scene, x, y, w, h, opts = {}) {
    const textureKey = opts.textureKey || "ui-panel";

    if (hasTexture(scene, textureKey)) {
        return scene.add.image(x, y, textureKey).setDisplaySize(w, h);
    }

    const fill = opts.fillColor !== undefined ? opts.fillColor : 0x1a2a3a;
    const alpha = opts.fillAlpha !== undefined ? opts.fillAlpha : 1;
    const rect = scene.add.rectangle(x, y, w, h, fill, alpha);
    if (opts.strokeColor !== undefined) {
        rect.setStrokeStyle(opts.strokeWidth || 2, opts.strokeColor);
    }
    return rect;
}

/**
 * Creates a full-screen modal overlay + centered frame container.
 *
 * @param {Phaser.Scene} scene
 * @param {number} w   frame width
 * @param {number} h   frame height
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-modal-frame"]
 * @param {number}  [opts.fillColor=0x16213e]
 * @param {number}  [opts.strokeColor=0xffcc00]
 * @param {number}  [opts.strokeWidth=3]
 * @param {number}  [opts.overlayAlpha=0.6]
 * @param {number}  [opts.depth=200]
 * @param {boolean} [opts.fitTexture=false]
 * @returns {{ overlay, frame, border, container }}
 */
export function createModalFrame(scene, w, h, opts = {}) {
    const metrics = getResponsiveMetrics(scene);
    const sw = metrics.width;
    const sh = metrics.height;
    const textureKey = opts.textureKey || "ui-modal-frame";
    const depth = opts.depth !== undefined ? opts.depth : 200;
    const frameWidth = w > 0 ? w : metrics.modal.width;
    const frameHeight = h > 0 ? h : metrics.modal.height;

    const container = scene.add.container(0, 0).setDepth(depth);

    const overlay = scene.add
        .rectangle(sw / 2, sh / 2, sw, sh, 0x000000, opts.overlayAlpha || 0.6)
        .setInteractive();
    container.add(overlay);

    let frame, border;

    if (hasTexture(scene, textureKey)) {
        frame = scene.add.image(sw / 2, sh / 2, textureKey);

        if (opts.fitTexture) {
            const sourceFrame = scene.textures.getFrame(textureKey);
            const scale = Math.min(
                frameWidth / sourceFrame.realWidth,
                frameHeight / sourceFrame.realHeight,
            );
            frame.setDisplaySize(
                sourceFrame.realWidth * scale,
                sourceFrame.realHeight * scale,
            );
        } else {
            frame.setDisplaySize(frameWidth, frameHeight);
        }

        border = null;
        container.add(frame);
    } else {
        const fillColor = opts.fillColor !== undefined ? opts.fillColor : 0x16213e;
        const strokeColor = opts.strokeColor !== undefined ? opts.strokeColor : 0xffcc00;
        const strokeWidth =
            opts.strokeWidth !== undefined ? opts.strokeWidth : Math.round(3 * metrics.dpr);

        frame = scene.add.rectangle(sw / 2, sh / 2, frameWidth, frameHeight, fillColor);
        border = scene.add
            .rectangle(sw / 2, sh / 2, frameWidth, frameHeight, 0xffffff, 0)
            .setStrokeStyle(strokeWidth, strokeColor);
        container.add([frame, border]);
    }

    return { overlay, frame, border, container };
}
