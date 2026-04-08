import { getResponsiveMetrics } from "./responsive.js";
import { createContinueButton } from "./buttons.js";

// ===================== COMPLETION BOARD DEBUG =====================

export function createCompletionBoard(scene, textureKey, opts = {}) {
    const { width, height, edgePadding, topInset, bottomInset, dpr } = getResponsiveMetrics(scene);
    const textureExists = scene.textures.exists(textureKey);

    const depth = opts.depth ?? 1;
    const topOffset = opts.topOffset ?? 0;
    const buttonGap = opts.buttonGap ?? Math.round(8 * dpr);
    // contentHeightRatio: fraction of boardH that contains visible content (default 1.0).
    // Set < 1 when the image has transparent padding below the board graphic so the
    // button anchors to the visual bottom rather than the mathematical bottom.
    const contentHeightRatio = opts.contentHeightRatio ?? 1;
    const maxWidth = opts.maxWidth ?? Math.min(
        width - edgePadding * 2,
        Math.round(width * (opts.maxWidthRatio ?? 0.55)),
    );
    const maxHeight = opts.maxHeight ?? Math.round(height * (opts.maxHeightRatio ?? 0.76));

    const availableTop = topInset + topOffset;
    const availableHeight = Math.max(0, height - bottomInset - availableTop);

    // Preserve texture aspect ratio so bounds.bottom matches the visual bottom of the image.
    // Without this, a landscape image displayed as a forced square pushes bounds.bottom
    // well below the visible content, making the button appear far from the modal.
    let frameWidth = 0;
    let frameHeight = 0;
    let boardW, boardH;
    if (textureExists) {
        const texture = scene.textures.get(textureKey);
        const frame = texture.get();
        frameWidth = frame.realWidth;
        frameHeight = frame.realHeight;
        const scale = Math.min(maxWidth / frame.realWidth, maxHeight / frame.realHeight, availableHeight / frame.realHeight);
        boardW = Math.round(frame.realWidth * scale);
        boardH = Math.round(frame.realHeight * scale);
    } else {
        boardW = Math.max(0, Math.min(maxWidth, maxHeight, availableHeight));
        boardH = boardW;
        frameWidth = boardW;
        frameHeight = boardH;
    }

    const centerX = width / 2;
    const centerY = availableTop + availableHeight / 2;

    const board = textureExists
        ? scene.add.image(centerX, centerY, textureKey).setDisplaySize(boardW, boardH).setDepth(depth)
        : scene.add.rectangle(centerX, centerY, boardW, boardH, 0x1f120c, 0.85)
            .setStrokeStyle(Math.round(3 * dpr), 0xf0d6a5, 0.95).setDepth(depth);

    const bounds = {
        left: centerX - boardW / 2,
        right: centerX + boardW / 2,
        top: centerY - boardH / 2,
        bottom: centerY + boardH / 2,
    };

    const visualBottom = centerY + (boardH / 2) * contentHeightRatio;

    const layout = {
        board,
        bounds,
        depth,
        textureKey,
        textureExists,
        frameWidth,
        frameHeight,
        width: boardW,
        height: boardH,
        centerX,
        centerY,
        visualBottom,
        buttonY: opts.buttonY ?? visualBottom + buttonGap,
    };

    if (opts.button) {
        const { bg } = createContinueButton(scene, centerX, layout.buttonY, opts.button);
        bg.setDepth(depth + 1);
        layout.continueButton = bg;
    }

    return layout;
}
