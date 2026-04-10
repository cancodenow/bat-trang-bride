import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    createModalFrame,
    createContinueButton,
    createCompletionBoard,
    createHowToPlay,
    createBackButton,
    getResponsiveMetrics,
    addCoverBg,
    preloadSoundAssets,
    playMusic,
    playSFX,
    crossfadeMusic,
    goToScene,
} from "../UIHelpers";
import { getAnalytics } from "../analytics";
import { updateCheckpoint } from "../progress.js";

// ─────────────────────────────────────────────────────────────────────────────
// TUNING — change these to adjust layout
// ─────────────────────────────────────────────────────────────────────────────

// Set true to draw numbered circles at every slot & token position for tuning
const DEBUG_POSITIONS = false;

// Scale of food tokens at rest, while dragging, and when placed
const TOKEN_SCALE = 0.2;
const TOKEN_DRAG_SCALE = 0.1;
const TOKEN_PLACED_SCALE = 0.3;
const INFO_CARD_SCALE = 0.15;
const INFO_CARD_OFFSET_X = 120;
const INFO_CARD_OFFSET_Y = -80;
const INFO_CARD_DEPTH = 20;

// Scale of the dish tray image (center of screen)
const TRAY_SCALE = 1.2;

// Scale of the board image (left side)
const BOARD_SCALE = 0.3 * 2.8;

// Drop zone offsets relative to tray center — one entry per slot (6 total).
// Positive dx → right, positive dy → down.
const SLOT_OFFSETS = [
    { dx: -210, dy: -90 }, // slot 0 — top-left
    { dx: 150, dy: -120 }, // slot 1 — top-right
    { dx: -210, dy: 90 }, // slot 2 — mid-left
    { dx: 150, dy: 75 }, // slot 3 — mid-right
    { dx: -15, dy: 165 }, // slot 4 — bot-left
    { dx: -15, dy: -225 }, // slot 5 — bot-right
];
const DROP_RADIUS = 90; // px — how close to a slot center counts as a drop

// Grid layout for food tokens on the board (2 cols × 3 rows)
const BOARD_TOKEN_COL_GAP = 250; // horizontal distance between columns (px)
const BOARD_TOKEN_ROW_GAP = 200; // vertical distance between rows (px)

// Scale of each food token image (separate from the drop-zone radius)
const FOOD_TOKEN_SCALE = TOKEN_SCALE;

const DISH_CARD_KEYS = [
    "lv3-dish-card-bamboo",
    "lv3-dish-card-shrimp-rolls",
    "lv3-dish-card-chicken",
    "lv3-dish-card-pork-puff",
    "lv3-dish-card-pigeon",
    "lv3-dish-card-kohlrabi",
];

// ─────────────────────────────────────────────────────────────────────────────

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
        preloadSoundAssets(this);
    }

    create() {
        updateCheckpoint("Level3MainChallengeScene", "level3.arrangement.start");
        playMusic(this, "bgm");

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
        addCoverBg(this, "lv3-bg-cl2", { depth: 0 });

        // ── Board (left side) ────────────────────────────────────────
        const boardX = width * 0.18;
        const boardY = height * 0.5;
        this._boardScale = BOARD_SCALE * metrics.dpr;
        this.add
            .image(boardX, boardY, "lv3-cl2-board_dishes")
            .setScale(this._boardScale)
            .setDepth(1);

        // ── Tray (center) ────────────────────────────────────────────
        const trayX = width * 0.62 - 20; // nudge left to better align with tokens
        const trayY = height * 0.5 + 10; // nudge down to better align with tokens
        this._trayScale = TRAY_SCALE * metrics.dpr;
        this._emptyTray = this.add
            .image(trayX, trayY, "lv3-cl2-empty_trade")
            .setScale(this._trayScale)
            .setDepth(1);

        this._fullTray = this.add
            .image(trayX, trayY, "lv3-cl2-trade_full_of_food")
            .setScale(this._trayScale)
            .setDepth(1)
            .setAlpha(0);

        // ── Slot positions ────────────────────────────────────────────
        this._slots = SLOT_OFFSETS.map((off, i) => ({
            index: i,
            x: trayX + Math.round(off.dx * metrics.dpr),
            y: trayY + Math.round(off.dy * metrics.dpr),
            filled: false,
        }));

        // ── Debug: visualize slot & token positions ───────────────────
        if (DEBUG_POSITIONS) {
            // Tray slots — red circles with slot index
            this._slots.forEach((slot) => {
                this.add.circle(slot.x, slot.y, DROP_RADIUS * metrics.dpr, 0xff0000, 0.25).setDepth(50);
                this.add.circle(slot.x, slot.y, 8 * metrics.dpr, 0xff0000, 0.9).setDepth(51);
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
                const _colGap = Math.round(BOARD_TOKEN_COL_GAP * metrics.dpr);
                const _rowGap = Math.round(BOARD_TOKEN_ROW_GAP * metrics.dpr);
                const tx = boardX - _colGap * 0.5 + col * _colGap;
                const ty = boardY - _rowGap + row * _rowGap;
                this.add.circle(tx, ty, Math.round(20 * metrics.dpr), 0x4488ff, 0.35).setDepth(50);
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
        const colGap = Math.round(BOARD_TOKEN_COL_GAP * metrics.dpr);
        const rowGap = Math.round(BOARD_TOKEN_ROW_GAP * metrics.dpr);
        const startX = boardX - colGap * 0.5;
        const startY = boardY - rowGap;

        this._dropRadius = DROP_RADIUS * metrics.dpr;
        this._foodTokenScale = FOOD_TOKEN_SCALE * metrics.dpr;

        this._tokens = [];
        for (let i = 0; i < 6; i++) {
            const col = i % tokenCols;
            const row = Math.floor(i / tokenCols);
            const tx = startX + col * colGap;
            const ty = startY + row * rowGap;

            const token = this.add
                .image(tx, ty, `lv3-food-plate-${i + 1}`)
                .setScale(this._foodTokenScale)
                .setDepth(10)
                .setInteractive({ useHandCursor: true });

            token.slotIndex = i;         // the one correct slot for this token
            token.homeX = tx;
            token.homeY = ty;
            token.placed = false;

            token.on("pointerover", () => {
                if (!token.placed && this._dragging === null) {
                    token.setScale(this._foodTokenScale * 1.1);
                    this._showInfoCard(token);
                }
            });
            token.on("pointerout", () => {
                if (!token.placed && this._dragging === null) {
                    token.setScale(this._foodTokenScale);
                    this._hideInfoCard(token);
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
        // createDevSkipButton(this, "Level4IntroScene");
        createBackButton(this);
    }

    // ── Instruction modal ─────────────────────────────────────────

    _showHowToPlay() {
        const { width, modal, buttonScale } = this.metrics;
        const { container } = createModalFrame(this, modal.width, modal.height, { overlayAlpha: 0.7, fitTexture: true, textureKey: "lv3-how-to-play-2" });
        this._instructionModal = container;

        const { bg: startBtn } = createContinueButton(this, width / 2, modal.buttonY, {
            scale: buttonScale,
            onClick: () => {
                this._instructionModal.destroy();
                getAnalytics().markCheckpoint({
                    sceneKey: this.scene.key,
                    checkpointId: "level3.arrangement.start",
                    level: 3,
                });
            },
        });

        this._instructionModal.add([startBtn]);
    }

    // ── Drag logic ────────────────────────────────────────────────

    _startDrag(token) {
        if (token.placed) return;
        this._dragging = token;
        this._hideInfoCard(token);
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
        if (nearest && nearestDist <= this._dropRadius && nearest.index === token.slotIndex) {
            this._placeToken(token, nearest);
        } else {
            this._returnToken(token, ptr.x, ptr.y);
        }
    }

    // ── Correct placement ─────────────────────────────────────────

    _placeToken(token, slot) {
        this._hideInfoCard(token);
        playSFX(this, "correct");
        slot.filled = true;
        token.placed = true;
        token.disableInteractive();

        this._placeTokenScale = TOKEN_PLACED_SCALE * this.metrics.dpr;
        // Snap + scale pop tween
        this.tweens.add({
            targets: token,
            x: slot.x,
            y: slot.y,
            scaleX: this._placeTokenScale * 1.2,
            scaleY: this._placeTokenScale * 1.2,
            duration: 120,
            ease: "Back.Out",
            onComplete: () => {
                token.setScale(this._placeTokenScale);
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
        this._hideInfoCard(token);
        playSFX(this, "wrong");
        token.setDepth(10);

        // Show error text near where the player dropped
        this._showErrorText(fromX, fromY);

        this.tweens.add({
            targets: token,
            x: token.homeX,
            y: token.homeY,
            scaleX: this._foodTokenScale,
            scaleY: this._foodTokenScale,
            duration: 300,
            ease: "Quad.Out",
        });
    }

    _showErrorText(x, y) {
        this._clearErrorText();
        const msg = ERROR_MESSAGES[this._errorMsgIndex % ERROR_MESSAGES.length];
        this._errorMsgIndex++;

        const txt = this.add
            .text(x, y + Math.round(50 * this.metrics.dpr), msg, {
                fontSize: this.metrics.fs(18),
                color: "#ff4444",
                fontFamily: "SVN-Pequena Neo",
                stroke: "#000000",
                strokeThickness: Math.round(3 * this.metrics.dpr),
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
        playSFX(this, "win");
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
                onClick: () => goToScene(this, "Level4IntroScene"),
            },
        });
    }

    _showInfoCard(token) {
        this._hideInfoCard(token);
        const { width, height } = this.metrics;

        const cardKey = DISH_CARD_KEYS[token.slotIndex];
        const cardScale = INFO_CARD_SCALE * this.metrics.dpr;
        const cardX = token.x + (INFO_CARD_OFFSET_X * this.metrics.dpr);
        const cardY = token.y + (INFO_CARD_OFFSET_Y * this.metrics.dpr);

        const card = this.add
            .image(cardX, cardY, cardKey)
            .setScale(cardScale)
            .setOrigin(0, 0.5)
            .setDepth(INFO_CARD_DEPTH);

        token._infoCard = card;
    }

    _hideInfoCard(token) {
        if (token._infoCard && token._infoCard.active) {
            token._infoCard.destroy();
            token._infoCard = null;
        }
    }

    shutdown() {
        // Clean up any remaining info cards on all tokens
        this._tokens.forEach(token => this._hideInfoCard(token));
    }
}
