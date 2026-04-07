// ===================== CHARACTER HELPERS =====================

/**
 * All character texture keys and their asset paths.
 * Used by preloadCharacters() and as reference when calling createCharacter().
 */
export const CHARACTER_KEYS = {
    // wife
    "char-wife": "characters/wife/wife.png",
    "char-wife-angry": "characters/wife/wife-angry.png",
    "char-wife-cooking": "characters/wife/wife-cooking.png",
    "char-wife-cry": "characters/wife/wife-cry.png",
    "char-wife-curious": "characters/wife/wife-curious.png",
    "char-wife-giggle": "characters/wife/wife-giggle.png",
    "char-wife-surprised": "characters/wife/wife-surprised.png",
    // husband
    "char-husband": "characters/husband/husband.png",
    "char-husband-sleepy": "characters/husband/sleepy-husband.png",
    // mom
    "char-mom": "characters/husband-mom/mom.png",
    "char-mom-annoyed": "characters/husband-mom/mom-annoyed.png",
    "char-mom-cook": "characters/husband-mom/mom-cook.png",
    "char-mom-happy": "characters/husband-mom/mom-happy.png",
    "char-mom-thrilled": "characters/husband-mom/mom-thrilled.png",
    // seller
    "char-seller": "characters/seller/seller.png",
    "char-seller-annoyed": "characters/seller/seller-annoyed.png",
};

/**
 * Loads all 16 character sprites.
 * Call in a scene's preload().
 *
 * @param {Phaser.Scene} scene
 */
export function preloadCharacters(scene) {
    Object.entries(CHARACTER_KEYS).forEach(([key, file]) => {
        if (!scene.textures.exists(key)) {
            scene.load.image(key, "/assets/" + file);
        }
    });
}

/**
 * Places a character sprite in the scene.
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} key  - one of the CHARACTER_KEYS (e.g. "char-mom-happy")
 * @param {object} opts
 * @param {number}  [opts.scale=0.5]
 * @param {boolean} [opts.flipX=false]
 * @param {number}  [opts.depth]
 * @returns {Phaser.GameObjects.Image}
 */
export function createCharacter(scene, x, y, key, opts = {}) {
    const scale = opts.scale !== undefined ? opts.scale : 0.5;
    const img = scene.add.image(x, y, key).setOrigin(0.5, 1);

    img.setScale(scale);
    if (opts.flipX) img.setFlipX(true);
    if (opts.depth !== undefined) img.setDepth(opts.depth);

    return img;
}
