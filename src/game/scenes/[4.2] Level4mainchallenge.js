import Phaser from "phaser";
import {
  preloadUIAssets,
  preloadLevelAssets,
  createContinueButton,
  createImageButton,
  createModalFrame,
  createCompletionBoard,
  createBackButton,
  getResponsiveMetrics,
  preloadSoundAssets,
  playMusic,
  playSFX,
  goToScene,
} from "../UIHelpers";
import { getAnalytics } from "../analytics";
import { updateCheckpoint } from "../progress.js";

// ─────────────────────────────────────────────────────────────────────────────
// TUNING — edit these to adjust layout & feel
// ─────────────────────────────────────────────────────────────────────────────

// ── UI positions ─────────────────────────────────────────────────────────────
const BOWL_X      = 0.18;  // clean-bowls image X as fraction of screen width
const BOWL_Y      = 0.5;   // clean-bowls image Y as fraction of screen height
const DISH_X      = 0.5;   // dirty/clean plate X as fraction of screen width
const DISH_Y      = 0.5;   // dirty/clean plate Y as fraction of screen height

// ── Image scales ─────────────────────────────────────────────────────────────
const DISH_SCALE  = 0.7;   // dirty/clean plate scale
const BOWL_SCALE  = 0.6;   // clean-bowls image scale

// ── Circle tracing ───────────────────────────────────────────────────────────
const INNER_RADIUS    = 110;  // px — inner circle path radius
const OUTER_RADIUS    = 185;  // px — outer circle path radius
const CIRCLE_WIDTH    = 14;   // px — visible stroke width of the guide rings
const PROGRESS_WIDTH  = 14;   // px — stroke width of the progress arc
const TOLERANCE       = 16;   // px — allowed distance either side of the circle path
const ANGLE_STEP      = 6;    // degrees per progress bucket (60 buckets = full circle)

// ── Wobble (circle path shifts over time) ────────────────────────────────────
// The circle center drifts on a slow sine wave, making it harder to stay on track.
const WOBBLE_AMOUNT = 30;     // px — max offset from dish center
const WOBBLE_SPEED  = 0.004; // how fast the wobble cycles (higher = faster)

// ── Inertia (lagging cursor) ──────────────────────────────────────────────────
// The virtual cursor smoothly follows the real mouse with a delay.
// INERTIA closer to 1.0 = very sluggish. Closer to 0 = instant (no lag).
const INERTIA = 1;         // lerp factor per frame toward real cursor

// ── Error messages ───────────────────────────────────────────────────────────
const ERROR_THROTTLE_MS  = 1500;  // min ms between error messages
const ERROR_MESSAGES = [
  "Gently, dear. The bowl is delicate.",
  "Slowly, dear. Keep your hand steady.",
  "Careful, dear. A lighter touch.",
];

// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_BUCKETS = Math.round(360 / ANGLE_STEP);

export default class Level4MainChallengeScene extends Phaser.Scene {
  constructor() {
    super("Level4MainChallengeScene");
  }

  preload() {
    preloadUIAssets(this);
    preloadLevelAssets(this, 4);
    preloadSoundAssets(this);
  }

  create() {
    updateCheckpoint("Level4MainChallengeScene", "level4.washing.start");
    const { width, height } = this.scale;
    const metrics = getResponsiveMetrics(this);
      this.metrics = metrics;

    // ── State ────────────────────────────────────────────────────
    this._activeRing    = "inner";
    this._progress      = { inner: new Set(), outer: new Set() };
    this._tracing       = false;
    this._realX         = width / 2;
    this._realY         = height / 2;
    this._virtualX      = width / 2;
    this._virtualY      = height / 2;
    this._errorMsgIndex = 0;
    this._lastErrorTime = -Infinity;
    this._errorText     = null;
    this._innerDone     = false;
    this._completed     = false;

    // ── Background ───────────────────────────────────────────────
    this.add
      .image(width / 2, height / 2, "lv4-bg")
      .setDisplaySize(width, height)
      .setDepth(0);

    // ── Clean bowls (left) ───────────────────────────────────────
    this._bowlScale = BOWL_SCALE * metrics.dpr;
    this.add
      .image(width * BOWL_X, height * BOWL_Y, "lv4-clean-bowls")
      .setScale(this._bowlScale)
      .setDepth(1);

    // ── Dirty / clean plate (center) ─────────────────────────────
    this._baseDishX = width * DISH_X;
    this._baseDishY = height * DISH_Y;
    // Current wobbled center (updated each frame)
    this._dishX = this._baseDishX;
    this._dishY = this._baseDishY;
    this._dishScale = DISH_SCALE * metrics.dpr;

    this._dirtyPlate = this.add
      .image(this._dishX, this._dishY, "lv4-dirty-plate")
      .setScale(this._dishScale)
      .setDepth(1);

    playMusic(this, "bgm");

    this._cleanPlate = this.add
      .image(this._dishX, this._dishY, "lv4-clean-plate")
      .setScale(this._dishScale)
      .setDepth(1)
      .setAlpha(0);

    // ── Ring graphics ────────────────────────────────────────────
    this._ringGfx = this.add.graphics().setDepth(2);
    this._drawRings();

    // ── Instruction text ─────────────────────────────────────────
    this._instructionText = this.add
        .text(width / 2, height - Math.round(48 * this.metrics.dpr), "Hold and trace the INNER circle with your mouse", {
            fontSize: this.metrics.fs(20),
        color: "#ffffff",
        fontFamily: "SVN-Pequena Neo",
        stroke: "#000000",
            strokeThickness: Math.round(4 * this.metrics.dpr),
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(10);

    // ── Pointer events ───────────────────────────────────────────
    this.input.on("pointerdown", (ptr) => {
      this._tracing  = true;
      this._realX    = ptr.x;
      this._realY    = ptr.y;
      this._virtualX = ptr.x;
      this._virtualY = ptr.y;
    });

    this.input.on("pointermove", (ptr) => {
      this._realX = ptr.x;
      this._realY = ptr.y;
    });

    this.input.on("pointerup", () => {
      this._tracing = false;
    });

    // ── How-to-play ──────────────────────────────────────────────
    this._showHowToPlay();

    // ── Dev skip ─────────────────────────────────────────────────
    // createDevSkipButton(this, "Level4PassScene");
    createBackButton(this);
  }

  // ── Per-frame update ──────────────────────────────────────────

  update(time) {
    if (this._completed) return;

    // Wobble: circle center drifts on a slow sine/cosine path
    this._dishX = this._baseDishX + Math.sin(time * WOBBLE_SPEED) * WOBBLE_AMOUNT * this.metrics.dpr;
    this._dishY = this._baseDishY + Math.cos(time * WOBBLE_SPEED * 0.7) * WOBBLE_AMOUNT * this.metrics.dpr;

    // Inertia: virtual cursor lags behind real mouse
    this._virtualX += (this._realX - this._virtualX) * INERTIA;
    this._virtualY += (this._realY - this._virtualY) * INERTIA;

    // Progress tracking — only while pointer is held
    if (this._tracing) {
      const dx   = this._virtualX - this._dishX;
      const dy   = this._virtualY - this._dishY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const activeRadius = this._activeRing === "inner" ? this._innerRadius : this._outerRadius;
      const inBand = Math.abs(dist - activeRadius) <= TOLERANCE * this.metrics.dpr;

      if (inBand) {
        let angleDeg = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
        if (angleDeg < 0) angleDeg += 360;
        const bucket = Math.floor(angleDeg / ANGLE_STEP);
        this._progress[this._activeRing].add(bucket);

        if (this._activeRing === "inner" && this._progress.inner.size >= TOTAL_BUCKETS) {
          this._innerDone  = true;
          this._activeRing = "outer";
          this._instructionText.setText("Great! Now trace the OUTER circle");
          getAnalytics().markCheckpoint({
            sceneKey: this.scene.key,
            checkpointId: "level4.washing.outer-ring",
            level: 4,
          });
        } else if (this._activeRing === "outer" && this._progress.outer.size >= TOTAL_BUCKETS) {
          this._completed = true;
          this._drawRings();
          this._onComplete();
          return;
        }
      } else {
        if (time - this._lastErrorTime > ERROR_THROTTLE_MS) {
          this._lastErrorTime = time;
          this._showErrorText(this._virtualX, this._virtualY);
          playSFX(this, "wrong");
        }
      }
    }

    this._drawRings();
  }

  // ── Ring drawing ──────────────────────────────────────────────

  _drawRings() {
    const gfx = this._ringGfx;
    gfx.clear();

    this._innerRadius = INNER_RADIUS * this.metrics.dpr;
    this._outerRadius = OUTER_RADIUS * this.metrics.dpr;

    // Guide rings — thick, semi-transparent, wobble with dish center
    gfx.lineStyle(CIRCLE_WIDTH * this.metrics.dpr, 0xffffff, 0.18);
    gfx.strokeCircle(this._dishX, this._dishY, this._innerRadius);
    gfx.strokeCircle(this._dishX, this._dishY, this._outerRadius);

    // Inner progress arc (blue → green when done)
    const innerColor = this._innerDone ? 0x44ff88 : 0x44aaff;
    this._drawProgressArc(gfx, this._innerRadius, this._progress.inner, innerColor);

    // Outer progress arc (only visible once inner is done)
    if (this._innerDone) {
      this._drawProgressArc(gfx, this._outerRadius, this._progress.outer, 0x44aaff);
    }
  }

  _drawProgressArc(gfx, radius, progressSet, color) {
    if (progressSet.size === 0) return;
    gfx.lineStyle(PROGRESS_WIDTH * this.metrics.dpr, color, 0.9);
    for (const bucket of progressSet) {
      const startRad = Phaser.Math.DegToRad(bucket * ANGLE_STEP);
      const endRad   = Phaser.Math.DegToRad((bucket + 1) * ANGLE_STEP);
      gfx.beginPath();
      gfx.arc(this._dishX, this._dishY, radius, startRad, endRad, false);
      gfx.strokePath();
    }
  }

  // ── How-to-play ───────────────────────────────────────────────

  _showHowToPlay() {
      const { width, height, modal, buttonScale } = this.metrics;
      const { container } = createModalFrame(this, modal.width, modal.heigth, { overlayAlpha: 0.7, fitTexture: true, textureKey: "lv4-how-to-play" });
    this._instructionModal = container;

      const { bg: startBtn } = createContinueButton(this, width / 2, modal.buttonY, {
          scale: buttonScale,
      onClick: () => {
        this._instructionModal.destroy();
        getAnalytics().markCheckpoint({
          sceneKey: this.scene.key,
          checkpointId: "level4.washing.start",
          level: 4,
        });
      },
    });

      this._instructionModal.add([startBtn]);
  }

  // ── Error text ────────────────────────────────────────────────

  _showErrorText(x, y) {
    this._clearErrorText();
    const msg = ERROR_MESSAGES[this._errorMsgIndex % ERROR_MESSAGES.length];
    this._errorMsgIndex++;

    const txt = this.add
      .text(x, y - Math.round(50 * this.metrics.dpr), msg, {
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

  _onComplete() {
    playSFX(this, "clap");
    this._ringGfx.clear();
    this._instructionText.destroy();
    this._dirtyPlate.destroy();

    this.tweens.add({
      targets: this._cleanPlate,
      alpha: 1,
      scaleX: this._dishScale * 1.2,
      scaleY: this._dishScale * 1.2,
      duration: 200,
      ease: "Back.Out",
      onComplete: () => this._cleanPlate.setScale(this._dishScale),
    });

    this.time.delayedCall(900, () => this._showSuccessModal());
  }

  _showSuccessModal() {
      const { width, height, buttonScale } = this.metrics;
      createCompletionBoard(this, "lv4-finish", {
          contentHeightRatio: 0.5,
          button: { scale: buttonScale, onClick: () => goToScene(this, "FinishLevelScene") },
      });
  }
}
