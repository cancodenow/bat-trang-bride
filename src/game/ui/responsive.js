const LANDSCAPE_GAME_SIZE = Object.freeze({ width: 1600, height: 900 });
const PORTRAIT_GAME_SIZE = Object.freeze({ width: 900, height: 1600 });
const PHONE_SMALL_MAX = 430;
const PHONE_LARGE_MAX = 820;
const LANDSCAPE_MODAL_BASE_SIZE = Object.freeze({ width: 860, height: 498 });

export const DPR = window.devicePixelRatio || 1;

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
        dialogue: Object.freeze({
            widthRatio: 0.9,
            height: 240,
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
            widthRatio: 0.68,
            maxWidth: 860,
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

export function getOrientationGameSize() {
    return LANDSCAPE_GAME_SIZE;
}

export function shouldShowRotateOverlay(sceneOrScale) {
    const scale = getScaleManager(sceneOrScale);
    const viewportWidth = scale.parentSize?.width || window.innerWidth || scale.width;
    const viewportHeight = scale.parentSize?.height || window.innerHeight || scale.height;
    const viewportShortSide = Math.min(viewportWidth, viewportHeight);

    return viewportHeight > viewportWidth && viewportShortSide <= PHONE_LARGE_MAX;
}

export function getResponsiveMetrics(sceneOrScale) {
    const scale = getScaleManager(sceneOrScale);
    const width = scale.width;
    const height = scale.height;
    const viewportWidth = scale.parentSize?.width || width;
    const viewportHeight = scale.parentSize?.height || height;
    const isPortrait = height > width;
    const shortSide = Math.min(width, height);
    const viewportShortSide = Math.min(viewportWidth, viewportHeight);
    const bucket =
        viewportShortSide <= PHONE_SMALL_MAX
            ? "phone-small"
            : viewportShortSide <= PHONE_LARGE_MAX
                ? "phone-large"
                : "desktop";
    const rules = isPortrait ? RESPONSIVE_RULES.portrait : RESPONSIVE_RULES.landscape;
    const { spacing, typography, touch, dialogue, modal, buttons, sidebar, challengeChoices } = rules;
    const dpr = DPR;

    const edgePadding = Math.round(width * spacing.edgePaddingRatio);
    const topInset = spacing.topInset != null ? Math.round(spacing.topInset * dpr) : Math.round(height * spacing.topInsetRatio);
    const bottomInset = spacing.bottomInset != null ? Math.round(spacing.bottomInset * dpr) : Math.round(height * spacing.bottomInsetRatio);
    const gutter = Math.round(width * spacing.gutterRatio);
    const fontScale = typography.fontScale;
    const minTouchTarget = Math.round(touch.minTouchTarget * dpr);

    const dialogueWidth = Math.min(
        Math.round(width * dialogue.widthRatio),
        dialogue.maxWidth ?? Math.round(width * dialogue.widthRatio),
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

export function createResponsiveDebugText(scene, opts = {}) {
    const metrics = getResponsiveMetrics(scene);
    const x = opts.x ?? metrics.edgePadding;
    const y = opts.y ?? metrics.topInset + 34;
    const canvas = scene.game.canvas;
    const dpr = window.devicePixelRatio || 1;
    const lines = [
        `[DEV] logical: ${metrics.width}x${metrics.height}`,
        `[DEV] canvas buffer: ${canvas.width}x${canvas.height}`,
        `[DEV] bucket: ${metrics.bucket}`,
        `[DEV] devicePixelRatio: ${dpr}`,
        `[DEV] resolution effective: ${canvas.width === metrics.width * dpr ? "YES" : "NO (no-op)"}`,
        `[DEV] isPortrait: ${metrics.isPortrait}`,
    ];

    return scene.add
        .text(x, y, lines.join("\n"), {
            fontSize: opts.fontSize ?? "14px",
            fontFamily: "monospace",
            color: opts.color ?? "#ffffff",
            backgroundColor: opts.backgroundColor ?? "#000000aa",
            padding: opts.padding ?? { left: 8, right: 8, top: 6, bottom: 6 },
            align: "left",
        })
        .setOrigin(0, 0)
        .setDepth(opts.depth ?? 500);
}

export function bindResponsiveScene(scene, onChange) {
    const handler = () => onChange();

    scene.scale.on("resize", handler);
    scene.scale.on("orientationchange", handler);

    const cleanup = () => {
        scene.scale.off("resize", handler);
        scene.scale.off("orientationchange", handler);
    };

    scene.events.once("shutdown", cleanup);
    scene.events.once("destroy", cleanup);
}
