// ===================== DIALOGUE BOX =====================
// Thin alias of createBox kept for backward compatibility.

import { createBox } from "./containers.js";

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
