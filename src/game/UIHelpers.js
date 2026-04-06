import Phaser from "phaser";

/**
 * UI helper utilities for the Phaser game.
 * All helpers use image assets when available and fall back to
 * plain rectangles / text so the game never breaks if assets are missing.
 *
 * Expected asset keys (loaded from public/assets/ui/):
 *   "ui-button-primary"    -> button-primary.png
 *   "ui-button-secondary"  -> button-secondary.png
 *   "ui-choice-button"     -> choice-button.png
 *   "ui-modal-frame"       -> modal-frame.png
 *   "ui-dialogue-box"      -> dialogue-box.png
 *   "ui-panel"             -> sidebar-panel.png
 *   "ui-small-toast"       -> small-toast.png
 *   "ui-success-modal"     -> success-modal.png
 */

// --------------- helpers ---------------

function hasTexture(scene, key) {
  return scene.textures.exists(key);
}

// ===================== BUTTONS =====================

/**
 * Creates an image-backed button with a text label on top.
 * Falls back to a plain text button with backgroundColor if the asset is missing.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} label        - button text
 * @param {object} opts
 * @param {string} [opts.textureKey="ui-button-primary"] - texture atlas key
 * @param {number} [opts.width]  - desired display width  (image will be scaled)
 * @param {number} [opts.height] - desired display height
 * @param {string} [opts.fontSize="20px"]
 * @param {string} [opts.fontColor="#000000"]
 * @param {string} [opts.bgColor="#ffffff"]      - fallback bg colour
 * @param {string} [opts.hoverBgColor="#dddddd"] - fallback hover bg colour
 * @param {string} [opts.fontStyle="bold"]
 * @param {object} [opts.padding]
 * @param {Function} [opts.onClick]
 * @returns {{ container, label, bg }}
 */
export function createImageButton(scene, x, y, label, opts = {}) {
  const textureKey = opts.textureKey || "ui-button-primary";
  const fontSize = opts.fontSize || "20px";
  const fontColor = opts.fontColor || "#000000";
  const bgColor = opts.bgColor || "#ffffff";
  const hoverBgColor = opts.hoverBgColor || "#dddddd";
  const fontStyle = opts.fontStyle || "bold";
  const padding = opts.padding || { left: 20, right: 20, top: 12, bottom: 12 };

  if (hasTexture(scene, textureKey)) {
    // ---- image-based button ----
    const btnW = opts.width || 260;
    const btnH = opts.height || 52;

    const img = scene.add.image(x, y, textureKey).setDisplaySize(btnW, btnH);
    img.setInteractive({ useHandCursor: true });

    const txt = scene.add
      .text(x, y, label, {
        fontSize,
        fontFamily: "Arial",
        fontStyle,
        color: fontColor,
        align: "center",
      })
      .setOrigin(0.5);

    img.on("pointerover", () => img.setTint(0xdddddd));
    img.on("pointerout", () => img.clearTint());
    if (opts.onClick) img.on("pointerdown", opts.onClick);

    return { bg: img, label: txt, container: null };
  }

  // ---- fallback: plain text button ----
  const btn = scene.add
    .text(x, y, label, {
      fontSize,
      fontFamily: "Arial",
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

// ===================== PANELS =====================

/**
 * Renders a panel (filled rectangle with optional stroke),
 * or an image-based panel if the asset exists.
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

// ===================== MODAL FRAME =====================

/**
 * Creates a modal overlay + frame.
 * Returns { overlay, frame, container } where container holds both.
 *
 * @param {Phaser.Scene} scene
 * @param {number} w   - frame width
 * @param {number} h   - frame height
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-modal-frame"]
 * @param {number}  [opts.fillColor=0x16213e]
 * @param {number}  [opts.strokeColor=0xffcc00]
 * @param {number}  [opts.strokeWidth=3]
 * @param {number}  [opts.overlayAlpha=0.6]
 * @param {number}  [opts.depth=200]
 * @returns {{ overlay, frame, border, container }}
 */
export function createModalFrame(scene, w, h, opts = {}) {
  const { width: sw, height: sh } = scene.scale;
  const textureKey = opts.textureKey || "ui-modal-frame";
  const depth = opts.depth !== undefined ? opts.depth : 200;

  const container = scene.add.container(0, 0).setDepth(depth);

  const overlay = scene.add
    .rectangle(sw / 2, sh / 2, sw, sh, 0x000000, opts.overlayAlpha || 0.6)
    .setInteractive();
  container.add(overlay);

  let frame, border;

  if (hasTexture(scene, textureKey)) {
    frame = scene.add.image(sw / 2, sh / 2, textureKey).setDisplaySize(w, h);
    border = null;
    container.add(frame);
  } else {
    const fillColor = opts.fillColor !== undefined ? opts.fillColor : 0x16213e;
    const strokeColor = opts.strokeColor !== undefined ? opts.strokeColor : 0xffcc00;
    const strokeWidth = opts.strokeWidth !== undefined ? opts.strokeWidth : 3;

    frame = scene.add.rectangle(sw / 2, sh / 2, w, h, fillColor);
    border = scene.add
      .rectangle(sw / 2, sh / 2, w, h, 0xffffff, 0)
      .setStrokeStyle(strokeWidth, strokeColor);
    container.add([frame, border]);
  }

  return { overlay, frame, border, container };
}

// ===================== DIALOGUE BOX =====================

/**
 * Creates a dialogue box panel at a given position.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-dialogue-box"]
 * @param {number}  [opts.fillColor=0x444444]
 * @param {number}  [opts.fillAlpha=1]
 * @param {number}  [opts.strokeColor]
 * @param {number}  [opts.strokeWidth=2]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createDialogueBox(scene, x, y, w, h, opts = {}) {
  const textureKey = opts.textureKey || "ui-dialogue-box";

  if (hasTexture(scene, textureKey)) {
    return scene.add.image(x, y, textureKey).setDisplaySize(w, h);
  }

  const fill = opts.fillColor !== undefined ? opts.fillColor : 0x444444;
  const alpha = opts.fillAlpha !== undefined ? opts.fillAlpha : 1;
  const rect = scene.add.rectangle(x, y, w, h, fill, alpha);

  if (opts.strokeColor !== undefined) {
    rect.setStrokeStyle(opts.strokeWidth || 2, opts.strokeColor);
  }
  return rect;
}

// ===================== CHOICE BUTTON =====================

/**
 * Creates a smaller choice / option button.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} label
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-choice-button"]
 * @param {number}  [opts.width]
 * @param {number}  [opts.height=44]
 * @param {string}  [opts.fontSize="16px"]
 * @param {string}  [opts.fontColor="#ffffff"]
 * @param {string}  [opts.bgColor]     - fallback fill colour (CSS)
 * @param {string}  [opts.hoverBgColor] - fallback hover colour (CSS)
 * @param {object}  [opts.padding]
 * @param {Function} [opts.onClick]
 * @returns {{ bg, label }}
 */
export function createChoiceButton(scene, x, y, label, opts = {}) {
  const textureKey = opts.textureKey || "ui-choice-button";
  const fontSize = opts.fontSize || "16px";
  const fontColor = opts.fontColor || "#ffffff";
  const bgColor = opts.bgColor || "#2a4a6a";
  const hoverBgColor = opts.hoverBgColor || "#3a5a7a";
  const fontStyle = opts.fontStyle || "normal";
  const padding = opts.padding || { left: 20, right: 20, top: 10, bottom: 10 };

  if (hasTexture(scene, textureKey)) {
    const btnW = opts.width || 260;
    const btnH = opts.height || 44;

    const img = scene.add.image(x, y, textureKey).setDisplaySize(btnW, btnH);
    img.setInteractive({ useHandCursor: true });

    const txt = scene.add
      .text(x, y, label, {
        fontSize,
        fontFamily: "Arial",
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
      fontFamily: "Arial",
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

// ===================== PRELOAD UI ASSETS =====================

/**
 * Call in a scene's preload() to load all UI assets.
 * Safe to call multiple times — Phaser ignores duplicate loads.
 *
 * @param {Phaser.Scene} scene
 */
export function preloadUIAssets(scene) {
  const assets = [
    { key: "ui-button-primary", file: "button-primary.png" },
    { key: "ui-button-secondary", file: "button-secondary.png" },
    { key: "ui-choice-button", file: "choice-button.png" },
    { key: "ui-modal-frame", file: "modal-frame.png" },
    { key: "ui-dialogue-box", file: "dialogue-box.png" },
    { key: "ui-panel", file: "sidebar-panel.png" },
    { key: "ui-small-toast", file: "small-toast.png" },
    { key: "ui-success-modal", file: "success-modal.png" },
  ];

  assets.forEach(({ key, file }) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, "/assets/ui/" + file);
    }
  });
}
