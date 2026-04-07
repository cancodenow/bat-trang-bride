// ===================== DIALOGUE BOX =====================
// Thin alias of createBox kept for backward compatibility.

import { createBox } from "./containers.js";
import { createCharacter } from "./characters.js";

const DEFAULT_DIALOGUE_FONT_SIZE = "22px";
const DEFAULT_HINT_FONT_SIZE = "14px";
const DIALOGUE_TEXT_WIDTH_RATIO = 0.85;
const HINT_Y_RATIO = 0.35;
const CONTENT_EDGE_PADDING_RATIO = 0.12;
const TEXT_HINT_GAP_RATIO = 0.08;

function parsePixelFontSize(fontSize, fallback = 22) {
    if (typeof fontSize === "number") return fontSize;
    const parsed = Number.parseFloat(fontSize);
    return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Creates a dialogue box panel at a given position.
 * Alias of createBox — prefer createBox in new code.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} w   - desired display width
 * @param {number} h   - desired display height
 * @param {object} opts
 * @param {string}  [opts.textureKey="ui-box-textbox"]
 * @param {number}  [opts.fillColor=0x444444]
 * @param {number}  [opts.fillAlpha=1]
 * @param {number}  [opts.strokeColor]
 * @param {number}  [opts.strokeWidth=2]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createDialogueBox(scene, x, y, w, h, opts = {}) {
    return createBox(scene, x, y, {
        textureKey: opts.textureKey || "ui-box-textbox",
        width: w,
        height: h,
        fillColor: opts.fillColor,
        fillAlpha: opts.fillAlpha,
        strokeColor: opts.strokeColor,
        strokeWidth: opts.strokeWidth,
    });
}

// ===================== DIALOGUE RUNNER =====================
/**
 * DialogueRunner manages dialogue flow, text display, character switching, and click advancement.
 *
 * @class DialogueRunner
 */
export class DialogueRunner {
    /**
     * @param {Phaser.Scene} scene
     * @param {object} config
     * @param {object} config.box           - { x, y, w, h, textureKey? }
     * @param {object} [config.chars]       - { left: { x, y, key?, scale?, flipX? }, right: { x, y, key?, scale?, flipX? } }
     *                                        key: initial texture key. Defaults to first displayed line's charLeft/charRight.
     *                                        If omitted entirely, no characters are created.
     * @param {Array}  config.lines         - [{ text, charLeft?, charRight?, color? }]
     * @param {Function} config.onComplete  - called when all lines are exhausted
     * @param {number} [config.skipTo=0]    - start at this line index
     * @param {boolean} [config.typewriter=false]     - reserved for future use, no-op for now
     * @param {number}  [config.typewriterSpeed=40]   - reserved for future use
     */
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.lines = config.lines || [];
        this.lineIndex = config.skipTo || 0;
        this._dialogueFontSize = parsePixelFontSize(DEFAULT_DIALOGUE_FONT_SIZE);
        this._hintFontSize = parsePixelFontSize(DEFAULT_HINT_FONT_SIZE, 14);
        this._textAreaWidth = Math.max(
            Math.round(config.box.w * DIALOGUE_TEXT_WIDTH_RATIO),
            this._dialogueFontSize * 4,
        );
        this._boxTop = config.box.y - config.box.h / 2;
        this._boxBottom = config.box.y + config.box.h / 2;

        // Create box
        this.boxObj = createBox(scene, config.box.x, config.box.y, {
            textureKey: config.box.textureKey || "ui-box-textbox",
            width: config.box.w,
            height: config.box.h,
        });

        // Create text
        this.textObj = scene.add
            .text(config.box.x, config.box.y, "", {
                fontSize: DEFAULT_DIALOGUE_FONT_SIZE,
                color: "#111010",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: this._textAreaWidth },
            })
            .setOrigin(0.5);

        // Create hint
        this.hintObj = scene.add
            .text(
                config.box.x,
                config.box.y + config.box.h * HINT_Y_RATIO,
                "▼ Click to continue",
                {
                    fontSize: DEFAULT_HINT_FONT_SIZE,
                    color: "#aaaaaa",
                    fontFamily: "SVN-Pequena Neo",
                },
            )
            .setOrigin(0.5);

        // Create characters if config provided
        // chars.left.key / chars.right.key set the initial texture;
        // falls back to the first displayed line's charLeft/charRight so
        // scenes don't have to repeat the key.
        this.charLeft = null;
        this.charRight = null;
        if (config.chars) {
            const firstLine = this.lines[this.lineIndex] || {};
            if (config.chars.left) {
                const key =
                    config.chars.left.key || firstLine.charLeft || "char-wife";
                this.charLeft = createCharacter(
                    scene,
                    config.chars.left.x,
                    config.chars.left.y,
                    key,
                    {
                        scale: config.chars.left.scale,
                        flipX: config.chars.left.flipX || false,
                    },
                );
            }
            if (config.chars.right) {
                const key =
                    config.chars.right.key ||
                    firstLine.charRight ||
                    "char-wife";
                this.charRight = createCharacter(
                    scene,
                    config.chars.right.x,
                    config.chars.right.y,
                    key,
                    {
                        scale: config.chars.right.scale,
                        flipX: config.chars.right.flipX !== false,
                    },
                );
            }
        }

        // Click anywhere on screen to advance
        this._clickHandler = () => this.advance();
        scene.input.on("pointerdown", this._clickHandler);

        // Show initial line
        this._showLine();
    }

    /**
     * Show current line, swap chars if present
     * @private
     */
    _showLine() {
        if (this.lineIndex >= this.lines.length) {
            return;
        }

        const line = this.lines[this.lineIndex];

        // Update text
        this.textObj.setText(line.text);
        this.textObj.setColor(line.color || "#111010");
        this._centerTextVertically();

        // Update characters
        if (this.charLeft && line.charLeft) {
            this.charLeft.setTexture(line.charLeft);
        }
        if (this.charRight && line.charRight) {
            this.charRight.setTexture(line.charRight);
        }
    }

    /**
     * Advance to next line or call onComplete
     */
    advance() {
        if (this._completed) return;
        this.lineIndex++;
        if (this.lineIndex < this.lines.length) {
            this._showLine();
        } else {
            this._completed = true;
            this.config.onComplete?.();
        }
    }

    /**
     * Manually update dialogue text (used by BargainScene walk-away phase).
     * @param {string} text
     * @param {string} [color]
     */
    setText(text, color) {
        this.textObj.setText(text);
        if (color) {
            this.textObj.setColor(color);
        }
        this._centerTextVertically();
    }

    _centerTextVertically() {
        const textHeight = this.textObj.height;
        const topPadding = Math.max(
            this._dialogueFontSize,
            this.config.box.h * CONTENT_EDGE_PADDING_RATIO,
        );
        const bottomPadding = Math.max(
            this._hintFontSize,
            this.config.box.h * CONTENT_EDGE_PADDING_RATIO,
        );
        const hintGap = Math.max(
            this._hintFontSize,
            this.config.box.h * TEXT_HINT_GAP_RATIO,
        );
        const hintTop = this.hintObj.y - this.hintObj.height / 2;
        const contentTop = this._boxTop + topPadding;
        const contentBottom = Math.min(
            hintTop - hintGap,
            this._boxBottom - bottomPadding,
        );
        const availableHeight = Math.max(contentBottom - contentTop, textHeight);
        const contentCenterY = contentTop + availableHeight / 2;

        this.textObj.setY(contentCenterY);
    }

    /**
     * Remove the click listener
     */
    destroy() {
        this.scene.input.off("pointerdown", this._clickHandler);
    }
}
