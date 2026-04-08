import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createModalFrame,
    createContinueButton,
    createCompletionBoard,
    createHowToPlay,
    createDevSkipButton,
    createBackButton,
    getResponsiveMetrics
} from "../UIHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// TUNING — change these to adjust layout
// ─────────────────────────────────────────────────────────────────────────────

// Set true to draw numbered circles at every slot & token position for tuning
const DEBUG_POSITIONS = false;

// Scale of food tokens at rest, while dragging, and when placed
const TOKEN_SCALE = 0.2;
const TOKEN_DRAG_SCALE = 0.1;
const TOKEN_PLACED_SCALE = 0.20;

// Scale of the dish tray image (center of screen)
const TRAY_SCALE = 0.7;

// Scale of the board image (left side)
const BOARD_SCALE = 0.3 * 2.8;

// Drop zone offsets relative to tray center — one entry per slot (6 total).
// Positive dx → right, positive dy → down.
const SLOT_OFFSETS = [
    { dx: -120, dy: -60 }, // slot 0 — top-left
    { dx: 80, dy: -50 }, // slot 1 — top-right
    { dx: -100, dy: 30 }, // slot 2 — mid-left
    { dx: 80, dy: 40 }, // slot 3 — mid-right
    { dx: -10, dy: 95 }, // slot 4 — bot-left
    { dx: -10, dy: -120 }, // slot 5 — bot-right
];

// Grid layout for food tokens on the board (2 cols × 3 rows)
const BOARD_TOKEN_COL_GAP = 250; // horizontal distance between columns (px)
const BOARD_TOKEN_ROW_GAP = 200; // vertical distance between rows (px)

// Scale of each food token image (separate from the drop-zone radius)
const FOOD_TOKEN_SCALE = TOKEN_SCALE;

// ─────────────────────────────────────────────────────────────────────────────

const DROP_RADIUS = 40; // px — how close to a slot center counts as a drop
const ERROR_MESSAGES = [
    "Not here, dear. Try another spot.",
    "Almost, dear. Look at the tray again.",
    "This dish goes somewhere else, dear.",
];

export default class Level3MainChallengeScene extends Phaser.Scene {
    constructor() {
        super("Level3MainChallengeScene");
    }

    preload() {
        preloadUIAssets(this);
        preloadLevelAssets(this, 3);
    }

    create() {
        const { width, height } = this.scale;
        const metrics = getResponsiveMetrics(this);
        this.metrics = metrics;
        this.W = width;
        this.H = height;

        this._dragging = null;       // currently dragged token
        this._errorMsgIndex = 0;     // cycles through ERROR_MESSAGES
        this._errorText = null;      // active error text object
        this._filledCount = 0;

        // ── Background ──────────────────────────────────────────────
        this.add
            .image(width / 2, height / 2, "lv3-bg-cl2")
            .setDisplaySize(width, height)
            .setDepth(0);

        // ── Board (left side) ────────────────────────────────────────
        const boardX = width * 0.18;
        const boardY = height * 0.5;
        this.add
            .image(boardX, boardY, "lv3-cl2-board_dishes")
            .setScale(BOARD_SCALE)
            .setDepth(1);

        // ── Tray (center) ────────────────────────────────────────────
        const trayX = width * 0.62;
        const trayY = height * 0.5;
        this._emptyTray = this.add
            .image(trayX, trayY, "lv3-cl2-empty_trade")
            .setScale(TRAY_SCALE)
            .setDepth(1);

        this._fullTray = this.add
            .image(trayX, trayY, "lv3-cl2-trade_full_of_food")
            .setScale(TRAY_SCALE)
            .setDepth(1)
            .setAlpha(0);

        // ── Slot positions ────────────────────────────────────────────
        this._slots = SLOT_OFFSETS.map((off, i) => ({
            index: i,
            x: trayX + off.dx,
            y: trayY + off.dy,
            filled: false,
        }));

        // ── Debug: visualize slot & token positions ───────────────────
        if (DEBUG_POSITIONS) {
            // Tray slots — red circles with slot index
            this._slots.forEach((slot) => {
                this.add.circle(slot.x, slot.y, DROP_RADIUS, 0xff0000, 0.25).setDepth(50);
                this.add.circle(slot.x, slot.y, 8, 0xff0000, 0.9).setDepth(51);
                this.add
                    .text(slot.x, slot.y - 14, `S${slot.index}`, {
                        fontSize: metrics.fs(13), color: "#ff4444",
                        stroke: "#000", strokeThickness: Math.round(3 * metrics.dpr),
                    })
                    .setOrigin(0.5)
                    .setDepth(52);
            });

            // Board token homes — blue circles with token index
            for (let i = 0; i < 6; i++) {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const tx = boardX - BOARD_TOKEN_COL_GAP * 0.5 + col * BOARD_TOKEN_COL_GAP;
                const ty = boardY - BOARD_TOKEN_ROW_GAP + row * BOARD_TOKEN_ROW_GAP;
                this.add.circle(tx, ty, 20, 0x4488ff, 0.35).setDepth(50);
                this.add
                    .text(tx, ty, `T${i}`, {
                        fontSize: metrics.fs(13), color: "#88ccff",
                        stroke: "#000", strokeThickness: Math.round(3 * metrics.dpr),
                    })
                    .setOrigin(0.5)
                    .setDepth(52);
            }
        }

        // ── Food tokens on board ──────────────────────────────────────
        const tokenCols = 2;
        const startX = boardX - BOARD_TOKEN_COL_GAP * 0.5;
        const startY = boardY - BOARD_TOKEN_ROW_GAP;

        this._tokens = [];
        for (let i = 0; i < 6; i++) {
            const col = i % tokenCols;
            const row = Math.floor(i / tokenCols);
            const tx = startX + col * BOARD_TOKEN_COL_GAP;
            const ty = startY + row * BOARD_TOKEN_ROW_GAP;

            const token = this.add
                .image(tx, ty, `lv3-food-plate-${i + 1}`)
                .setScale(FOOD_TOKEN_SCALE)
                .setDepth(10)
                .setInteractive({ useHandCursor: true });

            token.slotIndex = i;         // the one correct slot for this token
            token.homeX = tx;
            token.homeY = ty;
            token.placed = false;

            token.on("pointerover", () => {
                if (!token.placed && this._dragging === null) {
                    token.setScale(FOOD_TOKEN_SCALE * 1.1);
                }
            });
            token.on("pointerout", () => {
                if (!token.placed && this._dragging === null) {
                    token.setScale(FOOD_TOKEN_SCALE);
                }
            });
            token.on("pointerdown", () => this._startDrag(token));

            this._tokens.push(token);
        }

        // ── Scene-level pointer events for drag ───────────────────────
        this.input.on("pointermove", (ptr) => this._onDragMove(ptr));
        this.input.on("pointerup", (ptr) => this._onDragEnd(ptr));

        // ── Instruction modal ─────────────────────────────────────────
        this._showHowToPlay();

        // ── Dev skip ─────────────────────────────────────────────────
        createDevSkipButton(this, "Level4IntroScene");
        createBackButton(this);
    }

    // ── Instruction modal ─────────────────────────────────────────

    _showHowToPlay() {
        const { width, modal, buttonScale } = this.metrics;
        const { container } = createModalFrame(this, modal.width, modal.height, { overlayAlpha: 0.7, fitTexture: true, textureKey: "lv3-how-to-play-2" });
        this._instructionModal = container;

        const { bg: startBtn } = createContinueButton(this, width / 2, modal.buttonY, {
            scale: buttonScale,
            onClick: () => this._instructionModal.destroy(),
        });

        this._instructionModal.add([startBtn]);
    }

    // ── Drag logic ────────────────────────────────────────────────

    _startDrag(token) {
        if (token.placed) return;
        this._dragging = token;
        token.setDepth(100).setScale(TOKEN_DRAG_SCALE);
        this._clearErrorText();
    }

    _onDragMove(ptr) {
        if (!this._dragging) return;
        this._dragging.setPosition(ptr.x, ptr.y);
    }

    _onDragEnd(ptr) {
        const token = this._dragging;
        if (!token) return;
        this._dragging = null;

        // Find nearest unoccupied slot
        let nearest = null;
        let nearestDist = Infinity;
        for (const slot of this._slots) {
            if (slot.filled) continue;
            const dist = Phaser.Math.Distance.Between(ptr.x, ptr.y, slot.x, slot.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = slot;
            }
        }

        // Check: close enough AND correct slot
        if (nearest && nearestDist <= DROP_RADIUS && nearest.index === token.slotIndex) {
            this._placeToken(token, nearest);
        } else {
            this._returnToken(token, ptr.x, ptr.y);
        }
    }

    // ── Correct placement ─────────────────────────────────────────

    _placeToken(token, slot) {
        slot.filled = true;
        token.placed = true;
        token.disableInteractive();

        // Snap + scale pop tween
        this.tweens.add({
            targets: token,
            x: slot.x,
            y: slot.y,
            scaleX: TOKEN_PLACED_SCALE * 1.25,
            scaleY: TOKEN_PLACED_SCALE * 1.25,
            duration: 120,
            ease: "Back.Out",
            onComplete: () => {
                token.setScale(TOKEN_PLACED_SCALE);
                token.setDepth(5);
            },
        });

        this._filledCount++;
        if (this._filledCount === 6) {
            this.time.delayedCall(400, () => this._onAllPlaced());
        }
    }

    // ── Wrong drop — return to board ──────────────────────────────

    _returnToken(token, fromX, fromY) {
        token.setDepth(10);

        // Show error text near where the player dropped
        this._showErrorText(fromX, fromY);

        this.tweens.add({
            targets: token,
            x: token.homeX,
            y: token.homeY,
            scaleX: FOOD_TOKEN_SCALE,
            scaleY: FOOD_TOKEN_SCALE,
            duration: 300,
            ease: "Quad.Out",
        });
    }

    _showErrorText(x, y) {
        this._clearErrorText();
        const msg = ERROR_MESSAGES[this._errorMsgIndex % ERROR_MESSAGES.length];
        this._errorMsgIndex++;

        const txt = this.add
            .text(x, y + 50, msg, {
                fontSize: metrics.fs(18),
                color: "#ff4444",
                fontFamily: "SVN-Pequena Neo",
                stroke: "#000000",
                strokeThickness: Math.round(3 * metrics.dpr),
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(150);

        this._errorText = txt;
        this.tweens.add({
            targets: txt,
            alpha: 0,
            delay: 1200,
            duration: 400,
            onComplete: () => txt.destroy(),
        });
    }

    _clearErrorText() {
        if (this._errorText && this._errorText.active) {
            this._errorText.destroy();
            this._errorText = null;
        }
    }

    // ── Completion ────────────────────────────────────────────────

    _onAllPlaced() {
        // Remove empty tray, bring full tray on top
        this._emptyTray.destroy();
        this._fullTray.setAlpha(1).setDepth(10);

        // Success modal after tray swap
        this.time.delayedCall(900, () => this._showSuccessModal());
    }

    _showSuccessModal() {
        const { width, height } = this.scale;
        const metrics = getResponsiveMetrics(this);

        this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setDepth(199);

        createCompletionBoard(this, "lv3-finish", {
            depth: 200,
            maxWidthRatio: 0.68,
            maxHeightRatio: 0.56,
            contentHeightRatio: 0.5,
            buttonGap: Math.round(20 * metrics.dpr),
            button: {
                scale: metrics.buttonScale,
                onClick: () => this.scene.start("Level4IntroScene"),
            },
        });
    }
}
