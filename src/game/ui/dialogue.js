// ===================== DIALOGUE BOX =====================
// Thin alias of createBox kept for backward compatibility.

import { createBox } from "./containers.js";
import { createCharacter } from "./characters.js";
import { getResponsiveMetrics, getBottomButtonY, getDialogueYAboveButton } from "./responsive.js";
import { createContinueButton, getContinueButtonHeight } from "./buttons.js";

const TEXT_WIDTH_RATIO = 0.92;
const HINT_Y_RATIO = 0.35;
const CONTENT_TOP_PADDING = 0.18;
const CONTENT_BOTTOM_PADDING = 0.1;
const TEXT_HINT_GAP = 0.06;
const HINT_COLOR = "#fff4c2";
const HINT_STROKE = "#6f5630";
const HINT_SHADOW = "#000000";
const HINT_PULSE_MIN_ALPHA = 0.35;
const HINT_PULSE_SCALE = 1.08;
const HINT_PULSE_MS = 650;

function parseFontSize(fontSize, fallback = 22) {
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
 * @param {string} [opts.textureKey="ui-box-textbox"]
 * @returns {Phaser.GameObjects.Image|Phaser.GameObjects.Rectangle}
 */
export function createDialogueBox(scene, x, y, w, h, opts = {}) {
    return createBox(scene, x, y, {
        textureKey: opts.textureKey || "ui-box-textbox",
        width: w,
        height: h,
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

        // Resolve box position: use config y if provided and within upper screen area,
        // otherwise use responsive default
        const boxY = config.box.y && config.box.y < metrics.height * 0.7
            ? config.box.y
            : metrics.dialogue.y;

        const responsiveBox = {
            x: config.box.x ?? metrics.dialogue.x,
            y: boxY,
            w: Math.min(config.box.w || metrics.dialogue.width, metrics.dialogue.width),
            h: Math.max(config.box.h || metrics.dialogue.height, metrics.dialogue.height),
        };

        this.config = {
            ...config,
            typewriter: config.typewriter !== false, // default to true
            typewriterSpeed: config.typewriterSpeed || 80,
            box: responsiveBox,
        };

        this.lines = config.lines || [];
        this.lineIndex = config.skipTo || 0;
        this._dialogueFontSize = parseFontSize(metrics.fs(20));
        this._hintFontSize = parseFontSize(metrics.fs(18), 14);
        this._textAreaWidth = Math.max(
            Math.round(responsiveBox.w * TEXT_WIDTH_RATIO),
            this._dialogueFontSize * 4,
        );
        this._boxTop = responsiveBox.y - responsiveBox.h / 2;
        this._boxBottom = responsiveBox.y + responsiveBox.h / 2;

        // Create box
        this.boxObj = createBox(scene, responsiveBox.x, responsiveBox.y, {
            textureKey: "ui-box-textbox",
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
                    color: HINT_COLOR,
                    fontFamily: "SVN-Pequena Neo",
                    stroke: HINT_STROKE,
                    strokeThickness: Math.round(3 * metrics.dpr),
                },
            )
            .setOrigin(0.5)
            .setShadow(0, 2, HINT_SHADOW, Math.round(6 * metrics.dpr), false, true);

        this.hintTween = scene.tweens.add({
            targets: this.hintObj,
            alpha: HINT_PULSE_MIN_ALPHA,
            scaleX: HINT_PULSE_SCALE,
            scaleY: HINT_PULSE_SCALE,
            duration: HINT_PULSE_MS,
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

        const DEFAULT_CHAR_KEY = "char-wife";

        if (config.chars) {
            const firstLine = this.lines[this.lineIndex] || {};

            if (config.chars.left) {
                const key = config.chars.left.key || firstLine.charLeft || DEFAULT_CHAR_KEY;
                this.charLeft = createCharacter(scene, config.chars.left.x, config.chars.left.y, key, {
                    scale: config.chars.left.scale,
                    flipX: config.chars.left.flipX || false,
                });
                this.charLeft.setDepth(10);
            }

            if (config.chars.right) {
                const key = config.chars.right.key || firstLine.charRight || DEFAULT_CHAR_KEY;
                this.charRight = createCharacter(scene, config.chars.right.x, config.chars.right.y, key, {
                    scale: config.chars.right.scale,
                    flipX: config.chars.right.flipX ?? true,
                });
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

        // Pre-calculate full text height so centering stays stable during animation
        this.textObj.setText(fullText);
        const fullTextHeight = this.textObj.height;

        this.textObj.setText("");
        this._centerTextVertically(fullTextHeight);

        this.hintTween.pause();
        this.hintObj.setAlpha(1).setText("▼ Tap to skip");

        const msPerChar = 1000 / this.config.typewriterSpeed;
        this._typeTimer = this.scene.time.addEvent({
            delay: msPerChar,
            repeat: fullText.length - 1,
            callback: () => {
                this._typeCharIndex++;
                this.textObj.setText(fullText.slice(0, this._typeCharIndex));
                this._centerTextVertically(fullTextHeight);
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
        this._centerTextVertically();  // Use actual height now that text is complete
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

    _centerTextVertically(fixedHeight) {
        const box = this.config.box;

        // Margins as percentage of box height
        const TOP_MARGIN_RATIO = 0.12;      // 12% from top edge
        const BOTTOM_MARGIN_RATIO = 0.18;   // 18% from bottom (above hint)

        // Calculate available vertical space for text
        const availableTop = this._boxTop + box.h * TOP_MARGIN_RATIO;
        const availableBottom = this._boxBottom - box.h * BOTTOM_MARGIN_RATIO;
        const availableHeight = availableBottom - availableTop;

        // Use provided fixed height (for typewriter) or current text height
        const textHeight = fixedHeight ?? this.textObj.height;

        // If text is taller than available space, align to top with small margin
        // Otherwise center within available space
        let targetY;
        if (textHeight > availableHeight) {
            console.log("Larger Larger, text > avail")
            targetY = availableTop + box.h * 0.02; // Small top padding when overflowing
        } else {
            targetY = availableTop + (availableHeight - textHeight) / 2;
        }

        this.textObj.setY(targetY);
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

    /**
     * Positions a continue button beneath the dialogue box.
     * If the button would overlap with the dialogue, lifts the dialogue box higher.
     *
     * @param {object} opts
     * @param {number} [opts.scale=0.5] - button scale
     * @param {number} [opts.gap] - gap between dialogue and button (defaults to 20 * dpr)
     * @param {Function} [opts.onClick] - click handler
     * @returns {{bg: Phaser.GameObjects.Image, label: Phaser.GameObjects.Text}} the button
     */
    positionContinueButton(opts = {}) {
        const metrics = getResponsiveMetrics(this.scene);
        const scale = opts.scale ?? 0.5;
        const gap = opts.gap ?? Math.round(20 * metrics.dpr);

        const buttonHeight = getContinueButtonHeight(this.scene, scale);
        const buttonY = getBottomButtonY(metrics, buttonHeight);
        const newDialogueY = getDialogueYAboveButton(metrics, buttonY, buttonHeight, gap);

        if (newDialogueY !== this.config.box.y) {
            this._moveDialogueVertically(newDialogueY - this.config.box.y);
        }

        // Hide the tap hint since the button is now the progression affordance
        this.hintTween?.pause();
        this.hintObj.setVisible(false);

        return createContinueButton(this.scene, metrics.width / 2, buttonY, {
            scale,
            onClick: opts.onClick,
        });
    }

    /** @private Move dialogue elements vertically by delta */
    _moveDialogueVertically(deltaY) {
        this.config.box.y += deltaY;
        this._boxTop += deltaY;
        this._boxBottom += deltaY;
        this.boxObj.setY(this.config.box.y);
        this.textObj.setY(this.textObj.y + deltaY);
        this.hintObj.setY(this.hintObj.y + deltaY);
    }
}
