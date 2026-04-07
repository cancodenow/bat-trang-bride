import { getResponsiveMetrics } from "./responsive.js";

// ===================== IMAGE COMPONENT HELPERS =====================
// Every function reads the PNG's real dimensions via nativeSize() and
// applies a scale factor — identical approach to buttons.js.
//
// Usage:
//   createUIImage(this, x, y, "ui-frame-food")
//   createOptionButton(this, x, y, "lv1-opt-bargain", { onClick: () => {} })
//   createHUDWidget(this, x, y, "ui-hud-money")
//   createDishCard(this, x, y, "lv1-dish-card-chicken")
//   createHowToPlay(this, x, y, "lv1-how-to-play")

function hasTexture(scene, key) {
    return scene.textures.exists(key);
}

function nativeSize(scene, key, scale = 0.5) {
    const { dpr } = getResponsiveMetrics(scene);
    const frame = scene.textures.getFrame(key);
    return { w: frame.realWidth * scale * dpr, h: frame.realHeight * scale * dpr };
}

// ─────────────────────────────────────────────────────────────
// Generic image — any registered texture key, non-interactive
// ─────────────────────────────────────────────────────────────

/**
 * Places any loaded texture at its native size × scale.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key   - any registered texture key
 * @param {object} opts
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.width]    - override display width
 * @param {number}  [opts.height]   - override display height
 * @param {number}  [opts.depth]
 * @param {number[]} [opts.origin=[0.5,0.5]]
 * @returns {Phaser.GameObjects.Image|null}  null if texture not loaded
 */
export function createUIImage(scene, x, y, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);
    const w = opts.width ?? nw;
    const h = opts.height ?? nh;
    const [ox, oy] = opts.origin ?? [0.5, 0.5];

    const img = scene.add
        .image(x, y, key)
        .setDisplaySize(w, h)
        .setOrigin(ox, oy);

    if (opts.depth !== undefined) img.setDepth(opts.depth);
    return img;
}

/**
 * Add a full-screen background image using "cover" scaling.
 * This preserves the texture aspect ratio and crops overflow instead
 * of stretching the asset to fit the canvas.
 *
 * @param {Phaser.Scene} scene
 * @param {string} key
 * @param {object} opts
 * @param {number} [opts.x]
 * @param {number} [opts.y]
 * @param {number} [opts.width]
 * @param {number} [opts.height]
 * @param {number} [opts.depth]
 * @returns {Phaser.GameObjects.Image|null}
 */
export function addCoverBg(scene, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { width: sceneWidth, height: sceneHeight } =
        getResponsiveMetrics(scene);
    const x = opts.x ?? sceneWidth / 2;
    const y = opts.y ?? sceneHeight / 2;
    const width = opts.width ?? sceneWidth;
    const height = opts.height ?? sceneHeight;

    const frame = scene.textures.getFrame(key);
    const coverScale = Math.max(
        width / frame.realWidth,
        height / frame.realHeight,
    );
    const coverWidth = Math.round(frame.realWidth * coverScale);
    const coverHeight = Math.round(frame.realHeight * coverScale);

    const img = scene.add
        .image(x, y, key)
        .setDisplaySize(coverWidth, coverHeight);
    if (opts.depth !== undefined) img.setDepth(opts.depth);
    return img;
}

// ─────────────────────────────────────────────────────────────
// Option button  (lv1-opt-*, lv3-dish-opt-*, lv3-opt-cl1-*, etc.)
// ─────────────────────────────────────────────────────────────

/**
 * Places an option / choice image that responds to clicks.
 * Falls back to a plain text button when the texture is missing.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key
 * @param {object} opts
 * @param {number}   [opts.scale=0.5]
 * @param {number}   [opts.width]
 * @param {number}   [opts.height]
 * @param {string}   [opts.fallbackLabel=""]  - text shown when texture missing
 * @param {Function} [opts.onClick]
 * @param {number}   [opts.depth]
 * @returns {{ img }}
 */
export function createOptionButton(scene, x, y, key, opts = {}) {
    const metrics = getResponsiveMetrics(scene);

    if (hasTexture(scene, key)) {
        const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);
        const w = opts.width ?? nw;
        const h = opts.height ?? nh;

        const img = scene.add
            .image(x, y, key)
            .setDisplaySize(w, h)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        if (opts.depth !== undefined) img.setDepth(opts.depth);

        img.on("pointerover", () => img.setTint(0xdddddd));
        img.on("pointerout", () => img.clearTint());
        if (opts.onClick) img.on("pointerdown", opts.onClick);

        return { img };
    }

    // fallback
    const btn = scene.add
        .text(x, y, opts.fallbackLabel ?? "", {
            fontSize: metrics.fs(16),
            fontFamily: "SVN-Pequena Neo",
            color: "#ffffff",
            backgroundColor: "#2a4a6a",
            padding: {
                left: Math.round(20 * metrics.dpr),
                right: Math.round(20 * metrics.dpr),
                top: Math.round(10 * metrics.dpr),
                bottom: Math.round(10 * metrics.dpr),
            },
            align: "center",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    if (opts.onClick) btn.on("pointerdown", opts.onClick);
    return { img: btn };
}

// ─────────────────────────────────────────────────────────────
// HUD widget  (ui-hud-money, ui-hud-time)
// ─────────────────────────────────────────────────────────────

/**
 * Places a HUD element (money or time widget) at native size × scale.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key   - "ui-hud-money" | "ui-hud-time"
 * @param {object} opts
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.depth=10]
 * @returns {Phaser.GameObjects.Image|null}
 */
export function createHUDWidget(scene, x, y, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);

    return scene.add
        .image(x, y, key)
        .setDisplaySize(nw, nh)
        .setOrigin(0.5)
        .setDepth(opts.depth ?? 10);
}

// ─────────────────────────────────────────────────────────────
// Dish info card  (lv1-dish-card-*)
// ─────────────────────────────────────────────────────────────

/**
 * Places a dish info card image at native size × scale.
 * Optionally interactive (e.g. click to select).
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key   - e.g. "lv1-dish-card-chicken"
 * @param {object} opts
 * @param {number}   [opts.scale=0.5]
 * @param {number}   [opts.width]
 * @param {number}   [opts.height]
 * @param {Function} [opts.onClick]
 * @param {number}   [opts.depth]
 * @returns {Phaser.GameObjects.Image|null}
 */
export function createDishCard(scene, x, y, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);
    const w = opts.width ?? nw;
    const h = opts.height ?? nh;

    const img = scene.add.image(x, y, key).setDisplaySize(w, h).setOrigin(0.5);

    if (opts.depth !== undefined) img.setDepth(opts.depth);

    if (opts.onClick) {
        img.setInteractive({ useHandCursor: true });
        img.on("pointerover", () => img.setTint(0xeeeeee));
        img.on("pointerout", () => img.clearTint());
        img.on("pointerdown", opts.onClick);
    }

    return img;
}

// ─────────────────────────────────────────────────────────────
// How-to-play screen  (lv1-how-to-play, lv2-how-to-play, etc.)
// ─────────────────────────────────────────────────────────────

/**
 * Places a how-to-play image centred at (x, y) at native size × scale.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key   - e.g. "lv1-how-to-play"
 * @param {object} opts
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.width]
 * @param {number}  [opts.height]
 * @param {number}  [opts.depth=50]
 * @returns {Phaser.GameObjects.Image|null}
 */
export function createHowToPlay(scene, x, y, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);
    const w = opts.width ?? nw;
    const h = opts.height ?? nh;

    return scene.add
        .image(x, y, key)
        .setDisplaySize(w, h)
        .setOrigin(0.5)
        .setDepth(opts.depth ?? 50);
}

// ─────────────────────────────────────────────────────────────
// DEV skip button (top-right, visible only during development)
// ─────────────────────────────────────────────────────────────

/**
 * Adds a red [DEV] Skip button fixed to the top-right corner.
 * Click instantly starts the given next scene.
 *
 * @param {Phaser.Scene} scene
 * @param {string} nextScene  - scene key to jump to
 */
export function createDevSkipButton(scene, nextScene) {
    const metrics = getResponsiveMetrics(scene);
    scene.add
        .text(
            metrics.width - metrics.edgePadding,
            metrics.topInset,
            "[DEV] Skip",
            {
                fontSize: metrics.fs(14),
                fontFamily: "SVN-Pequena Neo",
                color: "#ffffff",
                backgroundColor: "#cc2222",
                padding: {
                    left: Math.round(8 * metrics.dpr),
                    right: Math.round(8 * metrics.dpr),
                    top: Math.round(4 * metrics.dpr),
                    bottom: Math.round(4 * metrics.dpr),
                },
            },
        )
        .setOrigin(1, 0)
        .setDepth(500)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => scene.scene.start(nextScene));
}

// ─────────────────────────────────────────────────────────────
// Dish unlocked / compliment  (lv2-dish-unlocked-*, lv2-compliment-*)
// ─────────────────────────────────────────────────────────────

/**
 * Places a dish-unlocked or compliment splash image.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key   - e.g. "lv2-dish-unlocked-1" | "lv2-compliment-1"
 * @param {object} opts
 * @param {number}  [opts.scale=0.5]
 * @param {number}  [opts.depth=100]
 * @returns {Phaser.GameObjects.Image|null}
 */
export function createSplashImage(scene, x, y, key, opts = {}) {
    if (!hasTexture(scene, key)) return null;

    const { w: nw, h: nh } = nativeSize(scene, key, opts.scale ?? 0.5);

    return scene.add
        .image(x, y, key)
        .setDisplaySize(nw, nh)
        .setOrigin(0.5)
        .setDepth(opts.depth ?? 100);
}

// ─────────────────────────────────────────────────────────────
// Scene history — back button support
// ─────────────────────────────────────────────────────────────

/**
 * Navigate to a scene and push the current scene onto the history stack.
 * Use instead of scene.scene.start() when you want back-button support.
 *
 * @param {Phaser.Scene} scene  - current scene
 * @param {string} key          - scene key to go to
 */
export function goToScene(scene, key) {
    const history = scene.game.registry.get("sceneHistory") || [];
    history.push(scene.scene.key);
    scene.game.registry.set("sceneHistory", history);
    scene.scene.start(key);
}

/**
 * Creates a back button fixed to the top-left corner.
 * Goes to the previous scene in history, or fallbackScene if history is empty.
 *
 * @param {Phaser.Scene} scene
 * @param {string} [fallbackScene]  - scene key to use if no history (default: "OpeningScene")
 */
export function createBackButton(scene, fallbackScene = "OpeningScene") {
    const metrics = getResponsiveMetrics(scene);
    scene.add
        .text(metrics.edgePadding, metrics.topInset, "← Back", {
            fontSize: metrics.fs(16),
            fontFamily: "SVN-Pequena Neo",
            color: "#ffffff",
            backgroundColor: "#1a3a5a",
            padding: {
                left: Math.round(10 * metrics.dpr),
                right: Math.round(10 * metrics.dpr),
                top: Math.round(5 * metrics.dpr),
                bottom: Math.round(5 * metrics.dpr),
            },
        })
        .setOrigin(0, 0)
        .setDepth(500)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", function () {
            this.setStyle({ backgroundColor: "#2a5a8a" });
        })
        .on("pointerout", function () {
            this.setStyle({ backgroundColor: "#1a3a5a" });
        })
        .on("pointerdown", () => {
            const history = scene.game.registry.get("sceneHistory") || [];
            const prev = history.pop() || fallbackScene;
            scene.game.registry.set("sceneHistory", history);
            scene.scene.start(prev);
        });
}
