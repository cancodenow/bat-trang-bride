// ===================== DIALOGUE BOX =====================
// Thin alias of createBox kept for backward compatibility.

import { createBox } from "./containers.js";
import { createCharacter } from "./characters.js";
import { getResponsiveMetrics } from "./responsive.js";

const DIALOGUE_TEXT_WIDTH_RATIO = 0.85;
const HINT_Y_RATIO = 0.35;
const CONTENT_EDGE_PADDING_RATIO = 0.24;
const TEXT_HINT_GAP_RATIO = 0.08;
const HINT_BASE_COLOR = "#fff4c2";
const HINT_STROKE_COLOR = "#6f5630";
const HINT_SHADOW_COLOR = "#000000";
const HINT_PULSE_ALPHA = 0.35;
const HINT_PULSE_SCALE = 1.08;
const HINT_PULSE_DURATION_MS = 650;

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
     * @param {Function} [config.onLineChange] - called when line changes: (lineIndex, lineData) => {}
     * @param {number} [config.skipTo=0]    - start at this line index
     * @param {boolean} [config.typewriter=true]     - enable character-by-character reveal
     * @param {number}  [config.typewriterSpeed=80]   - characters per second
     */
    constructor(scene, config) {
        this.scene = scene;
        const metrics = getResponsiveMetrics(scene);
        const responsiveBox = {
            ...config.box,
            x: config.box.x ?? metrics.dialogue.x,
            y:
                config.box.y && config.box.y < metrics.height * 0.7
                    ? config.box.y
                    : metrics.dialogue.y,
            w: Math.min(config.box.w || metrics.dialogue.width, metrics.dialogue.width),
            h: Math.max(config.box.h || metrics.dialogue.height, metrics.dialogue.height),
        };
        this.config = {
            ...config,
            typewriter: config.typewriter !== false, // default to true
            box: responsiveBox,
        };
        this.lines = config.lines || [];
        this.lineIndex = config.skipTo || 0;
        this._dialogueFontSize = parsePixelFontSize(metrics.fs(22));
        this._hintFontSize = parsePixelFontSize(metrics.fs(18), 14);
        this._textAreaWidth = Math.max(
            Math.round(responsiveBox.w * DIALOGUE_TEXT_WIDTH_RATIO),
            this._dialogueFontSize * 4,
        );
        this._boxTop = responsiveBox.y - responsiveBox.h / 2;
        this._boxBottom = responsiveBox.y + responsiveBox.h / 2;

        // Create box
        this.boxObj = createBox(scene, responsiveBox.x, responsiveBox.y, {
            textureKey: responsiveBox.textureKey || "ui-box-textbox",
            width: responsiveBox.w,
            height: responsiveBox.h,
        });

        // Create text
        this.textObj = scene.add
            .text(responsiveBox.x, responsiveBox.y, "", {
                fontSize: metrics.fs(22),
                color: "#111010",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: this._textAreaWidth },
            })
            .setOrigin(0.5);

        // Create hint
        this.hintObj = scene.add
            .text(
                responsiveBox.x,
                responsiveBox.y + responsiveBox.h * HINT_Y_RATIO,
                "▼ Tap to continue",
                {
                    fontSize: metrics.fs(18),
                    color: HINT_BASE_COLOR,
                    fontFamily: "SVN-Pequena Neo",
                    stroke: HINT_STROKE_COLOR,
                    strokeThickness: Math.round(3 * metrics.dpr),
                },
            )
            .setOrigin(0.5)
            .setShadow(0, 2, HINT_SHADOW_COLOR, Math.round(6 * metrics.dpr), false, true);

        this.hintTween = scene.tweens.add({
            targets: this.hintObj,
            alpha: HINT_PULSE_ALPHA,
            scaleX: HINT_PULSE_SCALE,
            scaleY: HINT_PULSE_SCALE,
            duration: HINT_PULSE_DURATION_MS,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
        });

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
                this.charLeft.setDepth(10); // ensure chars are below the box
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
                this.charRight.setDepth(10);
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
        this.textObj.setColor(line.color || "#111010");

        // Update characters
        if (this.charLeft && line.charLeft) {
            this.charLeft.setTexture(line.charLeft);
        }
        if (this.charRight && line.charRight) {
            this.charRight.setTexture(line.charRight);
        }

        if (this.config.typewriter) {
            this._startTypewriter(line.text);
        } else {
            this.textObj.setText(line.text);
            this._centerTextVertically();
        }

        // Trigger line change callback
        this.config.onLineChange?.(this.lineIndex, line);
    }

    /** @private */
    _startTypewriter(fullText) {
        this._typeFullText = fullText;
        this._typeCharIndex = 0;
        this._typing = true;

        this.textObj.setText("");
        this._centerTextVertically();

        this.hintTween.pause();
        this.hintObj.setAlpha(1).setText("▼ Tap to skip");

        const msPerChar = 1000 / (this.config.typewriterSpeed || 80);
        this._typeTimer = this.scene.time.addEvent({
            delay: msPerChar,
            repeat: fullText.length - 1,
            callback: () => {
                this._typeCharIndex++;
                this.textObj.setText(fullText.slice(0, this._typeCharIndex));
                this._centerTextVertically();
                if (this._typeCharIndex >= fullText.length) {
                    this._finishTypewriter();
                }
            },
        });
    }

    /** @private */
    _finishTypewriter() {
        this._typing = false;
        this._typeTimer?.remove(false);
        this._typeTimer = null;
        this.textObj.setText(this._typeFullText);
        this._centerTextVertically();
        this.hintObj.setAlpha(1).setText("▼ Tap to continue");
        this.hintTween.resume();
    }

    /**
     * Advance to next line or call onComplete.
     * If typewriter animation is running, first tap skips to full text.
     */
    advance() {
        if (this._completed) return;
        if (this._typing) {
            this._finishTypewriter();
            return;
        }
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
        const topPadding = Math.max(
            this._dialogueFontSize,
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
            this._boxBottom - this._hintFontSize,
        );
        this.textObj.setY(contentTop + (contentBottom - contentTop) / 2);
    }

    /**
     * Remove the click listener and cancel any active typewriter timer.
     */
    destroy() {
        this._typeTimer?.remove(false);
        this._typeTimer = null;
        this.hintTween?.stop();
        this.scene.input.off("pointerdown", this._clickHandler);
    }
}
