import { getResponsiveMetrics } from "./responsive.js";

// ===================== BUTTON HELPERS =====================
//
// Specific button creators — each wraps createImageButton with the correct
// texture key. All accept (scene, x, y, opts) where opts supports:
//   scale, width, height, fontSize, fontColor, onClick
// ─────────────────────────────────────────────────────────

/**
 * Attaches scale-based hover feedback to any Phaser GameObject.
 * Replaces the repetitive pointerover/pointerout pattern in scenes.
 *
 * @param {Phaser.GameObjects.GameObject} obj
 * @param {number} baseScale  - the object's normal scale
 * @param {number} [mult=1.08]
 */
export function addScaleHover(obj, baseScale, mult = 1.08) {
    obj.on("pointerover", () => obj.setScale(baseScale * mult));
    obj.on("pointerout", () => obj.setScale(baseScale));
}

function hasTexture(scene, key) {
    return scene.textures.exists(key);
}

function nativeSize(scene, key, scale = 0.5) {
    const { dpr } = getResponsiveMetrics(scene);
    const frame = scene.textures.getFrame(key);
    return { w: frame.realWidth * scale * dpr, h: frame.realHeight * scale * dpr };
}

/**
 * Creates an image-backed button with an optional text label on top.
 * Falls back to a plain text button if the texture is missing.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} label        - button text (can be empty "")
 * @param {object} opts
 * @param {string}   [opts.textureKey="ui-button-primary"]
 * @param {number}   [opts.scale=0.5]   - scale relative to native image size
 * @param {number}   [opts.width]       - override display width
 * @param {number}   [opts.height]      - override display height
 * @param {string}   [opts.fontSize="20px"]
 * @param {string}   [opts.fontColor="#000000"]
 * @param {string}   [opts.fontStyle="bold"]
 * @param {string}   [opts.bgColor="#ffffff"]       - fallback bg color
 * @param {string}   [opts.hoverBgColor="#dddddd"]  - fallback hover color
 * @param {boolean}  [opts.hoverScale=true]              - whether to apply scale hover effect (if texture exists)
 * @param {object}   [opts.padding]
 * @param {Function} [opts.onClick]
 * @returns {{ bg, label, container }}
 */
export function createImageButton(scene, x, y, label, opts = {}) {
    const metrics = getResponsiveMetrics(scene);
    const textureKey = opts.textureKey || "ui-button-primary";
    const fontSize = opts.fontSize || metrics.fs(20);
    const fontColor = opts.fontColor || "#000000";
    const bgColor = opts.bgColor || "#ffffff";
    const hoverBgColor = opts.hoverBgColor || "#dddddd";
    const fontStyle = opts.fontStyle || "bold";
    const padding = opts.padding || {
        left: Math.round(20 * metrics.dpr),
        right: Math.round(20 * metrics.dpr),
        top: Math.round(12 * metrics.dpr),
        bottom: Math.round(12 * metrics.dpr),
    };

    if (hasTexture(scene, textureKey)) {
        const { w: nw, h: nh } = nativeSize(scene, textureKey, opts.scale || 0.5);
        const btnW = Math.max(opts.width || nw, metrics.minTouchTarget);
        const btnH = Math.max(opts.height || nh, Math.round(metrics.minTouchTarget * 0.7));

        const img = scene.add.image(x, y, textureKey).setDisplaySize(btnW, btnH);
        img.setInteractive({ useHandCursor: true });

        const txt = scene.add
            .text(x, y, label, {
                fontSize,
                fontFamily: "SVN-Pequena Neo",
                fontStyle,
                color: fontColor,
                align: "center",
            })
            .setOrigin(0.5);

        if (opts.hoverScale) {
            addScaleHover(img, img.scaleX);
        } else {
            img.on("pointerover", () => img.setTint(0xdddddd));
            img.on("pointerout", () => img.clearTint());
        }
        if (opts.onClick) img.on("pointerdown", opts.onClick);

        return { bg: img, label: txt, container: null };
    }

    // fallback: plain text button
    const btn = scene.add
        .text(x, y, label, {
            fontSize,
            fontFamily: "SVN-Pequena Neo",
            fontStyle,
            color: fontColor,
            backgroundColor: bgColor,
            padding,
            align: "center",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: hoverBgColor }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: bgColor }));
    if (opts.onClick) btn.on("pointerdown", opts.onClick);

    return { bg: btn, label: btn, container: null };
}

/**
 * Creates a smaller choice / option button.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} label
 * @param {object} opts
 * @param {string}   [opts.textureKey="ui-choice-button"]
 * @param {number}   [opts.scale=0.5]
 * @param {number}   [opts.width]
 * @param {number}   [opts.height]
 * @param {string}   [opts.fontSize="16px"]
 * @param {string}   [opts.fontColor="#ffffff"]
 * @param {string}   [opts.bgColor="#2a4a6a"]
 * @param {string}   [opts.hoverBgColor="#3a5a7a"]
 * @param {object}   [opts.wordWrap]
 * @param {Function} [opts.onClick]
 * @returns {{ bg, label }}
 */
// ── Specific button creators ──────────────────────────────────────────────────

/** "START THE JOURNEY" button */
export function createStartJourneyButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "start_journey", scale: 0.5, ...opts });
}

/** "Continue" button */
export function createContinueButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "continue_button", scale: 0.5, hoverScale: true, ...opts });
}

/** "Cancel" button */
export function createCancelButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-cancel", scale: 0.5, ...opts });
}

/** "Pause" button */
export function createPauseButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-pause", scale: 0.5, ...opts });
}

/** "Finish" button */
export function createFinishButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-finish", scale: 0.5, ...opts });
}

/** "OK" button */
export function createOkButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-ok", scale: 0.5, ...opts });
}

/** "Done" button */
export function createDoneButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-done", scale: 0.5, ...opts });
}

/** "Try Again" button */
export function createTryAgainButton(scene, x, y, opts = {}) {
    return createImageButton(scene, x, y, "", { textureKey: "ui-btn-try-again", scale: 0.5, ...opts });
}

// ─────────────────────────────────────────────────────────────────────────────

export function createChoiceButton(scene, x, y, label, opts = {}) {
    const metrics = getResponsiveMetrics(scene);
    const textureKey = opts.textureKey || "ui-choice-button";
    const fontSize = opts.fontSize || metrics.fs(16);
    const fontColor = opts.fontColor || "#ffffff";
    const bgColor = opts.bgColor || "#2a4a6a";
    const hoverBgColor = opts.hoverBgColor || "#3a5a7a";
    const fontStyle = opts.fontStyle || "normal";
    const padding = opts.padding || {
        left: Math.round(20 * metrics.dpr),
        right: Math.round(20 * metrics.dpr),
        top: Math.round(10 * metrics.dpr),
        bottom: Math.round(10 * metrics.dpr),
    };

    if (hasTexture(scene, textureKey)) {
        const { w: nw, h: nh } = nativeSize(scene, textureKey, opts.scale || 0.5);
        const btnW = Math.max(opts.width || nw, metrics.minTouchTarget);
        const btnH = Math.max(opts.height || nh, Math.round(metrics.minTouchTarget * 0.72));

        const img = scene.add.image(x, y, textureKey).setDisplaySize(btnW, btnH);
        img.setInteractive({ useHandCursor: true });

        const txt = scene.add
            .text(x, y, label, {
                fontSize,
                fontFamily: "SVN-Pequena Neo",
                fontStyle,
                color: fontColor,
                align: "center",
                wordWrap: opts.wordWrap,
            })
            .setOrigin(0.5);

        img.on("pointerover", () => img.setTint(0xaaaaaa));
        img.on("pointerout", () => img.clearTint());
        if (opts.onClick) img.on("pointerdown", opts.onClick);

        return { bg: img, label: txt };
    }

    // fallback
    const btn = scene.add
        .text(x, y, label, {
            fontSize,
            fontFamily: "SVN-Pequena Neo",
            fontStyle,
            color: fontColor,
            backgroundColor: bgColor,
            padding,
            align: opts.align || "center",
            wordWrap: opts.wordWrap,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ backgroundColor: hoverBgColor }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: bgColor }));
    if (opts.onClick) btn.on("pointerdown", opts.onClick);

    return { bg: btn, label: btn };
}
