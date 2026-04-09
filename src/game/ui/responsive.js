const LANDSCAPE_GAME_SIZE = Object.freeze({ width: 1600, height: 900 });
const PORTRAIT_GAME_SIZE = Object.freeze({ width: 900, height: 1600 });
const PHONE_SMALL_MAX = 430;
const PHONE_LARGE_MAX = 820;
const LANDSCAPE_MODAL_BASE_SIZE = Object.freeze({ width: 860, height: 498 });
const RESPONSIVE_CHANGE_DEBOUNCE_MS = 120;
const MOBILE_UA_REGEX = /iPhone|iPad|iPod|Android|Mobile/i;

export const RAW_DPR = window.devicePixelRatio || 1;

export function isMobileDevice() {
    const userAgent = navigator.userAgent || "";

    return MOBILE_UA_REGEX.test(userAgent);
}

export function getSafeDevicePixelRatio() {
    if (isMobileDevice()) {
        return 1;
    }

    return RAW_DPR;
}

export function getSafeRenderResolution(baseHeight = LANDSCAPE_GAME_SIZE.height) {
    const rawDpr = RAW_DPR;

    if (!isMobileDevice()) {
        return rawDpr;
    }

    const viewportHeight = Math.max(window.innerHeight || 0, window.innerWidth || 0);
    const targetCanvasHeight = Math.max(baseHeight, Math.min(1400, Math.round(viewportHeight * 1.6)));
    const heightBoundDpr = targetCanvasHeight / baseHeight;

    return Math.max(1, Math.min(rawDpr, heightBoundDpr));
}

export const DPR = getSafeRenderResolution();

const RESPONSIVE_RULES = Object.freeze({
    portrait: Object.freeze({
        spacing: Object.freeze({
            edgePaddingRatio: 0.045,
            topInsetRatio: 0.035,
            bottomInsetRatio: 0.035,
            gutterRatio: 0.04,
        }),
        typography: Object.freeze({
            fontScale: 0.9,
        }),
        touch: Object.freeze({
            minTouchTarget: 86,
        }),
        modal: Object.freeze({
            widthRatio: 0.9,
            heightRatio: 0.52,
            mediaWidthRatio: 0.82,
            mediaHeightRatio: 0.22,
            mediaYOffset: -90,
            buttonOffset: 65,
        }),
        buttons: Object.freeze({
            primaryScale: 0.18,
            secondaryScale: 0.22,
        }),
        sidebar: Object.freeze({
            mode: "stacked",
            topPanelHeightRatio: 0.23,
            bottomPanelHeightRatio: 0.17,
        }),
        challengeChoices: Object.freeze({
            iconShortSideRatio: 0.19,
            gapShortSideRatio: 0.03,
            columns: 2,
        }),
    }),
    landscape: Object.freeze({
        spacing: Object.freeze({
            edgePaddingRatio: 0.02,
            topInset: 18,
            bottomInset: 24,
            gutterRatio: 0.025,
        }),
        typography: Object.freeze({
            fontScale: 1,
        }),
        touch: Object.freeze({
            minTouchTarget: 58,
        }),
        dialogue: Object.freeze({
            widthRatio: 0.8,
            maxWidth: 800,
            height: 150,
        }),
        modal: Object.freeze({
            baseWidth: LANDSCAPE_MODAL_BASE_SIZE.width,
            baseHeight: LANDSCAPE_MODAL_BASE_SIZE.height,
            mediaWidthRatio: 0.44,
            mediaHeightRatio: 0.42,
            mediaYOffset: -40,
            buttonOffset: 50,
        }),
        buttons: Object.freeze({
            primaryScale: 0.15,
            secondaryScale: 0.2,
        }),
        sidebar: Object.freeze({
            mode: "rail",
            widthRatio: 0.26,
            maxWidth: 400,
        }),
        challengeChoices: Object.freeze({
            iconSize: 160,
            gap: 30,
            columns: 4,
        }),
    }),
});

function getScaleManager(sceneOrScale) {
    return sceneOrScale?.scale ? sceneOrScale.scale : sceneOrScale;
}

function getViewportSize(scale) {
    return {
        width: Math.round(scale.parentSize?.width || window.innerWidth || scale.width),
        height: Math.round(scale.parentSize?.height || window.innerHeight || scale.height),
    };
}

function getResponsiveChangeSignature(sceneOrScale) {
    const scale = getScaleManager(sceneOrScale);
    const { width: viewportWidth, height: viewportHeight } = getViewportSize(scale);
    const { bucket } = getResponsiveMetrics(scale);

    return [
        viewportWidth,
        viewportHeight,
        bucket,
        shouldShowRotateOverlay(scale) ? "rotate" : "game",
    ].join(":");
}

export function getOrientationGameSize() {
    return LANDSCAPE_GAME_SIZE;
}

export function shouldShowRotateOverlay(sceneOrScale) {
    const scale = getScaleManager(sceneOrScale);
    const { width: viewportWidth, height: viewportHeight } = getViewportSize(scale);
    const viewportShortSide = Math.min(viewportWidth, viewportHeight);

    return viewportHeight > viewportWidth && viewportShortSide <= PHONE_LARGE_MAX;
}

export function getResponsiveMetrics(sceneOrScale) {
    const scale = getScaleManager(sceneOrScale);
    const width = scale.width;
    const height = scale.height;
    const { width: viewportWidth, height: viewportHeight } = getViewportSize(scale);
    const isPortrait = height > width;
    const shortSide = Math.min(width, height);
    const viewportShortSide = Math.min(viewportWidth, viewportHeight);
    const bucket =
        viewportShortSide <= PHONE_SMALL_MAX
            ? "phone-small"
            : viewportShortSide <= PHONE_LARGE_MAX
                ? "phone-large"
                : "desktop";
    const rules = RESPONSIVE_RULES.landscape;
    const { spacing, typography, touch, modal, buttons, sidebar, challengeChoices } = rules;
    const dialogue = RESPONSIVE_RULES.landscape.dialogue;
    const dpr = getSafeDevicePixelRatio();

    const edgePadding = Math.round(width * spacing.edgePaddingRatio);
    const topInset = spacing.topInset != null ? Math.round(spacing.topInset * dpr) : Math.round(height * spacing.topInsetRatio);
    const bottomInset = spacing.bottomInset != null ? Math.round(spacing.bottomInset * dpr) : Math.round(height * spacing.bottomInsetRatio);
    const gutter = Math.round(width * spacing.gutterRatio);
    const fontScale = typography.fontScale;
    const minTouchTarget = Math.round(touch.minTouchTarget * dpr);

    const dialogueWidth = Math.min(
        Math.round(width * dialogue.widthRatio),
        dialogue.maxWidth * dpr ?? Math.round(width * dialogue.widthRatio),
    );
    const dialogueHeight = Math.round(dialogue.height * dpr);
    const dialogueY = height - bottomInset - Math.round(dialogueHeight / 2);

    const modalWidth = Math.min(
        modal.baseWidth
            ? Math.round(
                  modal.baseWidth *
                      Math.min(
                          width / LANDSCAPE_GAME_SIZE.width,
                          height / LANDSCAPE_GAME_SIZE.height,
                      ),
              )
            : Math.round(width * modal.widthRatio),
        modal.maxWidth ??
            (modal.baseWidth
                ? Math.round(
                      modal.baseWidth *
                          Math.min(
                              width / LANDSCAPE_GAME_SIZE.width,
                              height / LANDSCAPE_GAME_SIZE.height,
                          ),
                  )
                : Math.round(width * modal.widthRatio)),
    );
    const modalHeight = Math.min(
        modal.baseHeight
            ? Math.round(
                  modal.baseHeight *
                      Math.min(
                          width / LANDSCAPE_GAME_SIZE.width,
                          height / LANDSCAPE_GAME_SIZE.height,
                      ),
              )
            : Math.round(height * modal.heightRatio),
        modal.maxHeight ??
            (modal.baseHeight
                ? Math.round(
                      modal.baseHeight *
                          Math.min(
                              width / LANDSCAPE_GAME_SIZE.width,
                              height / LANDSCAPE_GAME_SIZE.height,
                          ),
                  )
                : Math.round(height * modal.heightRatio)),
    );

    const mediaWidth = Math.min(modalWidth - gutter * 2, Math.round(width * modal.mediaWidthRatio));
    const mediaHeight = Math.min(modalHeight - 170, Math.round(height * modal.mediaHeightRatio));
    const primaryButtonScale = buttons.primaryScale;
    const secondaryButtonScale = buttons.secondaryScale;

    return {
        width,
        height,
        viewportWidth,
        viewportHeight,
        shortSide,
        bucket,
        isPortrait,
        isLandscape: !isPortrait,
        edgePadding,
        topInset,
        bottomInset,
        gutter,
        fontScale,
        minTouchTarget,
        buttonScale: primaryButtonScale,
        secondaryButtonScale,
        dialogue: {
            x: width / 2,
            y: dialogueY,
            width: dialogueWidth,
            height: dialogueHeight,
        },
        modal: {
            width: modalWidth,
            height: modalHeight,
            mediaWidth,
            mediaHeight,
            mediaY: height / 2 + Math.round(modal.mediaYOffset * dpr),
            buttonY: height / 2 + modalHeight / 2 + Math.round(modal.buttonOffset * dpr),
        },
        sidebar: {
            mode: sidebar.mode,
            width:
                sidebar.mode === "stacked"
                    ? width - gutter * 2
                    : Math.min(sidebar.maxWidth, Math.round(width * sidebar.widthRatio)),
            topPanelHeight:
                sidebar.mode === "stacked"
                    ? Math.round(height * sidebar.topPanelHeightRatio)
                    : height,
            bottomPanelHeight:
                sidebar.mode === "stacked"
                    ? Math.round(height * sidebar.bottomPanelHeightRatio)
                    : 0,
        },
        challengeChoices: {
            iconSize: challengeChoices.iconSize
                ? Math.round(challengeChoices.iconSize * dpr)
                : Math.round(shortSide * challengeChoices.iconShortSideRatio),
            gap: challengeChoices.gap
                ? Math.round(challengeChoices.gap * dpr)
                : Math.round(shortSide * challengeChoices.gapShortSideRatio),
            columns: challengeChoices.columns,
        },
        dpr,
        fs: (n) => `${Math.round(n * dpr)}px`,
    };
}

/**
 * Calculates the safe Y position for a button at the bottom of the screen,
 * ensuring it stays above the bottom inset (safe area).
 *
 * @param {object} metrics - from getResponsiveMetrics()
 * @param {number} buttonHeight - button display height in pixels
 * @param {number} [minPadding] - minimum padding from edge (defaults to 12 * dpr)
 * @returns {number} the Y coordinate for the button center
 */
export function getBottomButtonY(metrics, buttonHeight, minPadding) {
    const padding = minPadding ?? Math.round(12 * metrics.dpr);
    const safeBottom = metrics.height - Math.max(metrics.bottomInset, padding);
    // Button center Y = safe bottom minus half the button height so it sits above the inset
    return safeBottom - buttonHeight / 2;
}

/**
 * Calculates dialogue Y position that avoids overlapping with a bottom button.
 * If the default dialogue position would overlap, lifts the dialogue higher.
 *
 * @param {object} metrics - from getResponsiveMetrics()
 * @param {number} buttonY - the Y position of the button center
 * @param {number} buttonHeight - button display height
 * @param {number} [gap] - gap between dialogue and button (defaults to 20 * dpr)
 * @returns {number} the Y coordinate for the dialogue box center
 */
export function getDialogueYAboveButton(metrics, buttonY, buttonHeight, gap) {
    const minGap = gap ?? Math.round(20 * metrics.dpr);
    const dialogueHalfHeight = metrics.dialogue.height / 2;
    const buttonHalfHeight = buttonHeight / 2;

    // The top of where the button sits (including its gap requirement)
    const buttonEffectiveTop = buttonY - buttonHalfHeight - minGap;

    // Default dialogue Y from metrics
    const defaultDialogueY = metrics.dialogue.y;
    const dialogueBottomAtDefault = defaultDialogueY + dialogueHalfHeight;

    // If dialogue at default position would overlap with button+gap, lift it
    if (dialogueBottomAtDefault > buttonEffectiveTop) {
        // Position dialogue so its bottom is at buttonEffectiveTop
        return buttonEffectiveTop - dialogueHalfHeight;
    }

    return defaultDialogueY;
}

export function bindResponsiveScene(scene, onChange) {
    let rafId = null;
    let timeoutId = null;
    let disposed = false;
    let lastSignature = getResponsiveChangeSignature(scene);

    const flush = () => {
        if (disposed) {
            return;
        }

        const nextSignature = getResponsiveChangeSignature(scene);

        if (nextSignature === lastSignature) {
            return;
        }

        lastSignature = nextSignature;
        onChange();
    };

    const handler = () => {
        if (disposed) {
            return;
        }

        if (rafId != null) {
            window.cancelAnimationFrame(rafId);
        }

        if (timeoutId != null) {
            window.clearTimeout(timeoutId);
        }

        rafId = window.requestAnimationFrame(() => {
            rafId = null;
            timeoutId = window.setTimeout(() => {
                timeoutId = null;
                flush();
            }, RESPONSIVE_CHANGE_DEBOUNCE_MS);
        });
    };

    scene.scale.on("resize", handler);
    scene.scale.on("orientationchange", handler);

    const cleanup = () => {
        disposed = true;

        if (rafId != null) {
            window.cancelAnimationFrame(rafId);
        }

        if (timeoutId != null) {
            window.clearTimeout(timeoutId);
        }

        scene.scale.off("resize", handler);
        scene.scale.off("orientationchange", handler);
    };

    scene.events.once("shutdown", cleanup);
    scene.events.once("destroy", cleanup);
}
