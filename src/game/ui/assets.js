// ===================== UI ASSET LOADING =====================
// Shared asset groups are deduplicated across scenes so gameplay scenes can
// keep their existing preload calls without re-enqueueing the same files.

const assetRuntimeState = new WeakMap();

function getAssetRuntimeState(game) {
    let state = assetRuntimeState.get(game);

    if (!state) {
        state = {
            queuedKeys: new Set(),
            loadedGroups: new Set(),
        };
        assetRuntimeState.set(game, state);
    }

    return state;
}

function queueImage(scene, key, file) {
    const state = getAssetRuntimeState(scene.game);
    const assetKey = `image:${key}`;

    if (scene.textures.exists(key) || state.queuedKeys.has(assetKey)) {
        return false;
    }

    state.queuedKeys.add(assetKey);
    scene.load.image(key, "/assets/" + file);

    return true;
}

function queueAudio(scene, key, file) {
    const state = getAssetRuntimeState(scene.game);
    const assetKey = `audio:${key}`;

    if (scene.cache.audio.exists(key) || state.queuedKeys.has(assetKey)) {
        return false;
    }

    state.queuedKeys.add(assetKey);
    scene.load.audio(key, "/assets/" + file);

    return true;
}

function isAssetAvailable(scene, asset) {
    if (asset.type === "audio") {
        return scene.cache.audio.exists(asset.key);
    }

    return scene.textures.exists(asset.key);
}

function areGroupAssetsAvailable(sceneOrGame, groupName) {
    const scene =
        sceneOrGame && sceneOrGame.textures && sceneOrGame.cache
            ? sceneOrGame
            : sceneOrGame.scene.getScenes(false)[0];
    const assets = ASSET_GROUPS[groupName] || [];

    if (!assets.length) {
        return true;
    }

    return assets.every((asset) => isAssetAvailable(scene, asset));
}

export function areAssetGroupsAvailable(game, groupNames = []) {
    const scene = game.scene.getScenes(false)[0] || game.scene.keys.BootScene || null;

    if (!scene) {
        return false;
    }

    return groupNames.every((groupName) => areGroupAssetsAvailable(scene, groupName));
}

// --------------- shared UI assets (buttons, boxes, frames) ---------------

/**
 * Loads all shared UI assets from public/assets/ui/.
 * Call in every scene's preload().
 *
 * Keys:
 *   Buttons:  start_journey, continue_button, ui-btn-cancel, ui-btn-pause,
 *             ui-btn-finish, ui-btn-ok, ui-btn-done, ui-btn-try-again,
 *             ui-hud-money, ui-hud-time, ui-choice-button
 *   Boxes:    ui-box-textbox, ui-box-infobox
 *             ui-modal-frame (→ infobox), ui-dialogue-box (→ textbox), ui-panel (→ infobox)
 *   Frames:   ui-frame-food, ui-frame-challenge, ui-frame-dish-unlocked,
 *             ui-frame-good-job, ui-frame-nicely-done, ui-frame-all-done, ui-frame-well
 *             ui-success-modal
 *
 * @param {Phaser.Scene} scene
 */
export function preloadUIAssets(scene) {
    preloadAssetGroups(scene, ["shared-ui"]);
}

// --------------- per-level assets ---------------

const LEVEL_ASSETS = {
    1: [
        // finish screen
        { key: "lv1-finish", file: "level-1/finish-level-1.png" },
        // backgrounds
        { key: "lv1-bg-kitchen", file: "level-1/bg-lv1/kitchen.png" },
        { key: "lv1-bg-market", file: "level-1/bg-lv1/market.png" },
        { key: "lv1-bg-wedding", file: "level-1/bg-lv1/wedding-room.png" },
        { key: "lv1-bg-homeyard", file: "level-1/bg-lv1/home-yard.png" },
        // dish info cards
        { key: "lv1-dish-card-pork-puff", file: "level-1/dish-hover-info-card/infor-card-pork-puff-skin-soup.png" },
        { key: "lv1-dish-card-shrimp-rolls", file: "level-1/dish-hover-info-card/infor-card-crispy-shrimp-rolls.png" },
        { key: "lv1-dish-card-pigeon", file: "level-1/dish-hover-info-card/infor-card-slow-braised-pigeon-with-lotus-seeds.png" },
        { key: "lv1-dish-card-bamboo", file: "level-1/dish-hover-info-card/infor-card-bamboo-shoot-shredded-squid-soup.png" },
        { key: "lv1-dish-card-chicken", file: "level-1/dish-hover-info-card/infor-card-poached-chicken-with-lime-leaves.png" },
        { key: "lv1-dish-card-kohlrabi", file: "level-1/dish-hover-info-card/infor-card-stir-fried-kohlrabi-with-squid.png" },

        // how-to-play
        { key: "lv1-how-to-play", file: "level-1/how-to-play-lv1.png" },
        { key: "lv1-how-to-play-ribs", file: "level-1/how-to-play-buy-pork-ribs.png" },
        // option buttons
        { key: "lv1-opt-bargain", file: "level-1/ui-lv1/option-bargain/option-bargain.png" },
        { key: "lv1-opt-no-bargain", file: "level-1/ui-lv1/option-bargain/option-no-bargain.png" },
        { key: "lv1-opt-buy-check", file: "level-1/ui-lv1/option-buy/check-ingredients.png" },
        { key: "lv1-opt-buy-frame", file: "level-1/ui-lv1/option-buy/frame-purchase.png" },
        { key: "lv1-opt-buy-view", file: "level-1/ui-lv1/option-buy/view-dish-details.png" },
        { key: "lv1-opt-ribs-yes", file: "level-1/ui-lv1/option-buy-ribs/yes-i-want-to-bargain.png" },
        { key: "lv1-opt-ribs-mom", file: "level-1/ui-lv1/option-buy-ribs/yes-mom.png" },
        { key: "lv1-opt-tasks-of-course", file: "level-1/ui-lv1/option-tasks/of-course.png" },
        { key: "lv1-opt-wake-get-up", file: "level-1/ui-lv1/option-wake-up/option-get-up.png" },
        { key: "lv1-opt-wake-tiktok", file: "level-1/ui-lv1/option-wake-up/option-scrolling-tiktok.png" },
    ],
    2: [
        // finish screen
        { key: "lv2-finish", file: "level-2/finish-level-2.png" },
        // intro background
        { key: "lv2-intro-bg", file: "level-1/bg-lv1/home-yard.png" },
        // challenge 1
        { key: "lv2-cl1-bg-start", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-start.png" },
        { key: "lv2-cl1-bg-step1", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-step1.png" },
        { key: "lv2-cl1-bg-step2", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-step2.png" },
        { key: "lv2-cl1-bg-step3", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-step3.png" },
        { key: "lv2-cl1-bg-step4", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-step4.png" },
        { key: "lv2-cl1-bg-step5", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-step5.png" },
        { key: "lv2-cl1-step1", file: "level-2/cl1-lv2/ui-level-2/cl1-lv2-step1.png" },
        { key: "lv2-cl1-step2", file: "level-2/cl1-lv2/ui-level-2/cl1-lv2-step2.png" },
        { key: "lv2-cl1-step3", file: "level-2/cl1-lv2/ui-level-2/cl1-lv2-step3.png" },
        { key: "lv2-cl1-step4", file: "level-2/cl1-lv2/ui-level-2/cl1-lv2-step4.png" },
        { key: "lv2-cl1-step5", file: "level-2/cl1-lv2/ui-level-2/cl1-lv2-step5.png" },
        // challenge 2
        { key: "lv2-cl2-bg-start", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-start.png" },
        { key: "lv2-cl2-bg-step1", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-step1.png" },
        { key: "lv2-cl2-bg-step2", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-step2.png" },
        { key: "lv2-cl2-bg-step3", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-step3.png" },
        { key: "lv2-cl2-bg-step4", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-step4.png" },
        { key: "lv2-cl2-bg-step5", file: "level-2/cl2-lv2/bg-level-2/cl2-lv2-bg-step5.png" },
        { key: "lv2-cl2-step1", file: "level-2/cl2-lv2/ui-level-2/cl2-lv2-step1.png" },
        { key: "lv2-cl2-step2", file: "level-2/cl2-lv2/ui-level-2/cl2-lv2-step2.png" },
        { key: "lv2-cl2-step3", file: "level-2/cl2-lv2/ui-level-2/cl2-lv2-step3.png" },
        { key: "lv2-cl2-step4", file: "level-2/cl2-lv2/ui-level-2/cl2-lv2-step4.png" },
        { key: "lv2-cl2-step5", file: "level-2/cl2-lv2/ui-level-2/cl2-lv2-step5.png" },
        // challenge 3
        { key: "lv2-cl3-bg-start", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-start.png" },
        { key: "lv2-cl3-bg-step1", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-step1.png" },
        { key: "lv2-cl3-bg-step2", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-step2.png" },
        { key: "lv2-cl3-bg-step3", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-step3.png" },
        { key: "lv2-cl3-bg-step4", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-step4.png" },
        { key: "lv2-cl3-bg-step5", file: "level-2/cl3-lv2/cl3-lv2-bg/cl3-lv2-bg-step5.png" },
        { key: "lv2-cl3-step1", file: "level-2/cl3-lv2/cl3-lv2-ui/cl3-lv2-step1.png" },
        { key: "lv2-cl3-step2", file: "level-2/cl3-lv2/cl3-lv2-ui/cl3-lv2-step2.png" },
        { key: "lv2-cl3-step3", file: "level-2/cl3-lv2/cl3-lv2-ui/cl3-lv2-step3.png" },
        { key: "lv2-cl3-step4", file: "level-2/cl3-lv2/cl3-lv2-ui/cl3-lv2-step4.png" },
        { key: "lv2-cl3-step5", file: "level-2/cl3-lv2/cl3-lv2-ui/cl3-lv2-step5.png" },
        // dish unlocked + compliments
        { key: "lv2-dish-unlocked-bamboo", file: "level-2/dish-unlocked/dish-unlocked-bamboo-shoot-shredded-squid-soup.png" },
        { key: "lv2-dish-unlocked-pork", file: "level-2/dish-unlocked/dish-unlocked-pork-puff-skin-soup.png" },
        { key: "lv2-dish-unlocked-kohlrabi", file: "level-2/dish-unlocked/dish-unlocked-stir-fried-kohlrabi-with-squid.png" },
        { key: "lv2-dish-unlocked-crispy-shrimp-rolls", file: "level-2/dish-unlocked/dish-unlocked-crispy-shrimp-rolls.png" },
        { key: "lv2-compliment-1", file: "level-2/ui-lv2/compliment/mom-compliment-1.png" },
        { key: "lv2-compliment-2", file: "level-2/ui-lv2/compliment/mom-compliment-2.png" },
        { key: "lv2-how-to-play", file: "level-2/how-to-play-lv2.png" },
    ],
    3: [
        // finish screen
        { key: "lv3-finish", file: "level-3/finish-level-3.png" },
        // backgrounds
        { key: "lv3-bg-cl2", file: "level-3/cl2-lv3/bg-cl2-lv3/table.png" },
        // UI elements
        // dish options (English labels)
        { key: "lv3-dish-opt-eng-1", file: "level-3/cl1-lv3/option/eng/eng-canh-bong.png" },
        { key: "lv3-dish-opt-eng-2", file: "level-3/cl1-lv3/option/eng/eng-canh-mang.png" },
        { key: "lv3-dish-opt-eng-3", file: "level-3/cl1-lv3/option/eng/eng-chim.png" },
        { key: "lv3-dish-opt-eng-4", file: "level-3/cl1-lv3/option/eng/eng-ga.png" },
        { key: "lv3-dish-opt-eng-5", file: "level-3/cl1-lv3/option/eng/eng-nem.png" },
        { key: "lv3-dish-opt-eng-6", file: "level-3/cl1-lv3/option/eng/eng-su-hao-xao.png" },
        // dish options (Vietnamese labels)
        { key: "lv3-dish-opt-viet-1", file: "level-3/cl1-lv3/option/viet/canh-bong.png" },
        { key: "lv3-dish-opt-viet-2", file: "level-3/cl1-lv3/option/viet/canh-mang.png" },
        { key: "lv3-dish-opt-viet-3", file: "level-3/cl1-lv3/option/viet/chim-ham.png" },
        { key: "lv3-dish-opt-viet-4", file: "level-3/cl1-lv3/option/viet/ga-hap.png" },
        { key: "lv3-dish-opt-viet-5", file: "level-3/cl1-lv3/option/viet/nem-tom.png" },
        { key: "lv3-dish-opt-viet-6", file: "level-3/cl1-lv3/option/viet/su-hao-xao.png" },
        // cl2 UI
        { key: "lv3-cl2-board_dishes", file: "level-3/cl2-lv3/ui-cl2-lv3/board-dishes.png" },
        { key: "lv3-cl2-empty_trade", file: "level-3/cl2-lv3/ui-cl2-lv3/empty-tray.png" },
        { key: "lv3-cl2-trade_full_of_food", file: "level-3/cl2-lv3/ui-cl2-lv3/tray-full-of-food.png" },
        // food with/without plate
        { key: "lv3-food-plate-1", file: "level-3/food/have-plate/bamboo-shoot-shredded-squid-soup.png" },
        { key: "lv3-food-plate-2", file: "level-3/food/have-plate/crispy-shrimp-rolls.png" },
        { key: "lv3-food-plate-3", file: "level-3/food/have-plate/poached-chicken-with-lime-leaves.png" },
        { key: "lv3-food-plate-4", file: "level-3/food/have-plate/pork-puff-skin-soup.png" },
        { key: "lv3-food-plate-5", file: "level-3/food/have-plate/slow-braised-pigeon-with-lotus-seeds.png" },
        { key: "lv3-food-plate-6", file: "level-3/food/have-plate/stir-fried-kohlrabi-with-squid.png" },
        { key: "lv3-food-1", file: "level-3/food/no-plate/no-plate-poached-chicken-with-lime-leaves.png" },
        { key: "lv3-food-2", file: "level-3/food/no-plate/no-plate-crispy-shrimp-rolls.png" },
        { key: "lv3-food-3", file: "level-3/food/no-plate/no-plate-stir-fried-kohlrabi-with-squid.png" },
        // infor cards
        { key: "lv3-dish-card-pork-puff", file: "level-1/dish-hover-info-card/infor-card-pork-puff-skin-soup.png" },
        { key: "lv3-dish-card-shrimp-rolls", file: "level-1/dish-hover-info-card/infor-card-crispy-shrimp-rolls.png" },
        { key: "lv3-dish-card-pigeon", file: "level-1/dish-hover-info-card/infor-card-slow-braised-pigeon-with-lotus-seeds.png" },
        { key: "lv3-dish-card-bamboo", file: "level-1/dish-hover-info-card/infor-card-bamboo-shoot-shredded-squid-soup.png" },
        { key: "lv3-dish-card-chicken", file: "level-1/dish-hover-info-card/infor-card-poached-chicken-with-lime-leaves.png" },
        { key: "lv3-dish-card-kohlrabi", file: "level-1/dish-hover-info-card/infor-card-stir-fried-kohlrabi-with-squid.png" },
        // how-to-play
        { key: "lv3-how-to-play-1", file: "level-3/how-to-play-lv3-1.png" },
        { key: "lv3-how-to-play-2", file: "level-3/how-to-play-lv3-2.png" },
    ],
    4: [
        // intro background
        { key: "lv4-intro-bg", file: "level-4/bg-lv4/bg-eating-room.png" },
        // finish screen
        { key: "lv4-finish", file: "level-4/finish-level-4.png" },
        { key: "lv4-bg", file: "level-4/bg-lv4/bg-lv4.png" },
        { key: "lv4-clean-bowls", file: "level-4/ui-lv4/clean-bowls.png" },
        { key: "lv4-clean-plate", file: "level-4/ui-lv4/clean-plate.png" },
        { key: "lv4-dirty-plate", file: "level-4/ui-lv4/dirty-plate.png" },
        { key: "lv4-how-to-play", file: "level-4/how-to-play-lv4.png" },
        { key: "lv4-family-meal", file: "level-4/family-meal.png" },
    ],
};

const STORY_ASSETS = [
    { key: "openingbg", file: "background/opening-bg.png" },
    { key: "introBg", file: "background/intro-bg.png" },
    { key: "morningBg", file: "background/morning-bg.png" },
    { key: "ingredientIntroBg", file: "background/ingredient-intro-bg.png" },
    { key: "taskBg", file: "background/task-bg.png" },
    { key: "marketBg", file: "background/market-bg.png" },
];

const MARKET_INGREDIENT_ASSETS = [
    { key: "vietnamese-chicken", file: "ingredients/vietnamese-chicken.png" },
    { key: "lime-leaves", file: "ingredients/lime-leaves.png" },
    { key: "kohlrabi", file: "ingredients/kohlrabi.png" },
    { key: "dried-squid", file: "ingredients/dried-squid.png" },
    { key: "fresh-shrimp", file: "ingredients/fresh-shrimp.png" },
    { key: "carrot", file: "ingredients/carrot.png" },
    { key: "pigeon", file: "ingredients/pigeon.png" },
    { key: "dried-lotus-seeds", file: "ingredients/dried-lotus-seeds.png" },
    { key: "dried-bamboo-shoots", file: "ingredients/dried-bamboo-shoots.png" },
    { key: "dried-pork-skin", file: "ingredients/dried-pork-skin.png" },
    { key: "shiitake-mushrooms", file: "ingredients/shiitake-mushrooms.png" },
    { key: "pork-ribs", file: "ingredients/pork-ribs.png" },
];

const CHARACTER_ASSETS = [
    { key: "char-wife", file: "characters/wife/wife.png" },
    { key: "char-wife-angry", file: "characters/wife/wife-angry.png" },
    { key: "char-wife-cooking", file: "characters/wife/wife-cooking.png" },
    { key: "char-wife-cry", file: "characters/wife/wife-cry.png" },
    { key: "char-wife-curious", file: "characters/wife/wife-curious.png" },
    { key: "char-wife-giggle", file: "characters/wife/wife-giggle.png" },
    { key: "char-wife-surprised", file: "characters/wife/wife-surprised.png" },
    { key: "char-husband", file: "characters/husband/husband.png" },
    { key: "char-husband-sleepy", file: "characters/husband/sleepy-husband.png" },
    { key: "char-mom", file: "characters/husband-mom/mom.png" },
    { key: "char-mom-annoyed", file: "characters/husband-mom/mom-annoyed.png" },
    { key: "char-mom-cook", file: "characters/husband-mom/mom-cook.png" },
    { key: "char-mom-happy", file: "characters/husband-mom/mom-happy.png" },
    { key: "char-mom-thrilled", file: "characters/husband-mom/mom-thrilled.png" },
    { key: "char-seller", file: "characters/seller/seller.png" },
    { key: "char-seller-annoyed", file: "characters/seller/seller-annoyed.png" },
];

/**
 * Loads all image assets for a specific level.
 * Call alongside preloadUIAssets() in a scene's preload().
 *
 * @param {Phaser.Scene} scene
 * @param {1|2|3|4} level
 */
export function preloadLevelAssets(scene, level) {
    preloadAssetGroups(scene, [`level-${level}`]);
}

// --------------- sound assets ---------------

const SOUND_ASSETS = {
    // Shared sounds used across multiple levels
    shared: [
        { key: "bgm", file: "sound/bgm.mp3" },
        { key: "intro-music", file: "sound/intro.mp3" },
        { key: "wedding", file: "sound/wedding.mp3" },
        { key: "market-music", file: "sound/market.mp3" },
        { key: "bed-music", file: "sound/bed.mp3" },
        { key: "tiktok-music", file: "sound/tiktok.mp3" },
        { key: "clap", file: "sound/clap.mp3" },
        { key: "correct", file: "sound/correct.mp3" },
        { key: "conversation", file: "sound/conversation-noise.mp3" },
        { key: "eating", file: "sound/eating-noise.mp3" },
        { key: "food-step", file: "sound/food-step.mp3" },
        { key: "pan", file: "sound/pan.mp3" },
        { key: "unlock", file: "sound/unlock.mp3" },
        { key: "win", file: "sound/win.mp3" },
        { key: "wrong", file: "sound/wrong.mp3" },
    ],
    // Level-specific sounds (empty for now, add as needed)
    1: [],
    2: [],
    3: [],
    4: [],
};

/**
 * Loads sound assets for shared + a specific level.
 * Silently skips files that haven't been added yet.
 *
 * @param {Phaser.Scene} scene
 * @param {1|2|3|4} [level]
 */
export function preloadSoundAssets(scene, level) {
    const groupNames = ["shared-audio"];

    if (level && SOUND_ASSETS[level]) {
        groupNames.push(`level-${level}-audio`);
    }

    preloadAssetGroups(scene, groupNames);
}

const ASSET_GROUPS = {
    "shared-ui": [
        { key: "start_journey", file: "ui/button/start-the-journey.png" },
        { key: "continue_button", file: "ui/button/button-continue.png" },
        { key: "ui-btn-cancel", file: "ui/button/cancel-button.png" },
        { key: "ui-btn-pause", file: "ui/button/pause-button.png" },
        { key: "ui-btn-finish", file: "ui/button/button-finish.png" },
        { key: "ui-btn-ok", file: "ui/button/button-ok.png" },
        { key: "ui-btn-done", file: "ui/button/button-done.png" },
        { key: "ui-btn-try-again", file: "ui/button/button-try-again.png" },
        { key: "ui-hud-money", file: "ui/button/ui-money.png" },
        { key: "ui-hud-time", file: "ui/button/ui-time.png" },
        { key: "ui-choice-button", file: "ui/frame/frame-food.png" },
        { key: "ui-box-textbox", file: "ui/box/textbox.png" },
        { key: "ui-box-infobox", file: "ui/box/infobox.png" },
        { key: "ui-modal-frame", file: "ui/box/infobox.png" },
        { key: "ui-dialogue-box", file: "ui/box/textbox.png" },
        { key: "ui-panel", file: "ui/box/infobox.png" },
        { key: "ui-success-modal", file: "ui/frame/challenge-complete.png" },
        { key: "ui-frame-food", file: "ui/frame/frame-food.png" },
        { key: "ui-frame-challenge", file: "ui/frame/challenge-complete.png" },
        { key: "ui-frame-dish-unlocked", file: "ui/frame/dish-unlocked-frame.png" },
        { key: "ui-frame-good-job", file: "ui/frame/challenge-complete.png" },
        { key: "ui-frame-nicely-done", file: "ui/frame/challenge-complete.png" },
        { key: "ui-frame-all-done", file: "ui/frame/challenge-complete.png" },
        { key: "ui-frame-well", file: "ui/frame/challenge-complete.png" },
    ],
    "shared-audio": SOUND_ASSETS.shared.map(({ key, file }) => ({ key, file, type: "audio" })),
    "shared-characters": CHARACTER_ASSETS,
    "story-backgrounds": STORY_ASSETS,
    "market-ingredients": MARKET_INGREDIENT_ASSETS,
    "level-1": LEVEL_ASSETS[1],
    "level-2": LEVEL_ASSETS[2],
    "level-3": LEVEL_ASSETS[3],
    "level-4": LEVEL_ASSETS[4],
    "level-1-audio": [],
    "level-2-audio": [],
    "level-3-audio": [],
    "level-4-audio": [],
    "level3-intro-background": [
        { key: "lv2-cl1-bg-start", file: "level-2/cl1-lv2/bg-level2/cl1-lv2-bg-start.png" },
    ],
    "finish-scene-background": [
        { key: "lv3-bg-cl2", file: "level-3/cl2-lv3/bg-cl2-lv3/table.png" },
    ],
};

export function preloadAssetGroups(scene, groupNames = []) {
    const state = getAssetRuntimeState(scene.game);
    const pendingGroups = [];

    groupNames.forEach((groupName) => {
        if (state.loadedGroups.has(groupName)) {
            return;
        }

        const groupAssets = ASSET_GROUPS[groupName] || [];
        let queuedAny = false;

        groupAssets.forEach((asset) => {
            if (asset.type === "audio") {
                queuedAny = queueAudio(scene, asset.key, asset.file) || queuedAny;
                return;
            }

            queuedAny = queueImage(scene, asset.key, asset.file) || queuedAny;
        });

        if (queuedAny) {
            pendingGroups.push(groupName);
        } else if (groupAssets.every((asset) => isAssetAvailable(scene, asset))) {
            state.loadedGroups.add(groupName);
        }
    });

    if (pendingGroups.length) {
        scene.load.once("complete", () => {
            pendingGroups.forEach((groupName) => {
                if (areGroupAssetsAvailable(scene, groupName)) {
                    state.loadedGroups.add(groupName);
                }
            });
        });
    }
}

// --------------- sound playback helpers ---------------

/**
 * Plays background music in a scene.
 * Stops ALL currently playing music first (from any scene).
 * Waits for audio to be decoded before playing to avoid delays.
 *
 * @param {Phaser.Scene} scene
 * @param {string} key - Audio key (e.g., "bgm", "intro-music", "market-music")
 * @param {object} config - Optional Phaser sound config (loop, volume, etc.)
 */
export function playMusic(scene, key, config = {}) {
    // Stop ALL currently playing sounds to ensure clean transition
    const soundManager = scene.sound;

    // Stop ALL currently playing sounds (including same key to prevent duplicates)
    soundManager.getAllPlaying().forEach((sound) => {
        sound.stop();
    });

    // Check if sound exists before playing
    if (!scene.cache.audio.exists(key)) {
        console.warn(`Sound key "${key}" not found in cache`);
        return;
    }

    const defaultConfig = { loop: true, volume: 0.5 };
    scene._currentMusic = scene.sound.add(key, { ...defaultConfig, ...config });

    // Wait for audio to be decoded before playing to avoid delay
    if (scene.cache.audio.get(key).isDecoding) {
        scene.cache.audio.once(`${key}decoded`, () => {
            if (scene._currentMusic && scene._currentMusic.key === key) {
                scene._currentMusic.play();
            }
        });
    } else {
        scene._currentMusic.play();
    }
}

/**
 * Stops the currently playing background music.
 *
 * @param {Phaser.Scene} scene
 */
export function stopMusic(scene) {
    if (scene._currentMusic) {
        scene._currentMusic.stop();
        scene._currentMusic = null;
    }
}

/**
 * Plays a one-shot sound effect.
 * Waits for audio to be decoded before playing to avoid delays.
 *
 * @param {Phaser.Scene} scene
 * @param {string} key - Audio key (e.g., "correct", "wrong", "clap", "win")
 * @param {object} config - Optional Phaser sound config (volume, etc.)
 */
export function playSFX(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) {
        console.warn(`SFX key "${key}" not found in cache`);
        return;
    }

    const defaultConfig = { volume: 0.6 };
    const sound = scene.sound.add(key, { ...defaultConfig, ...config });

    // Wait for audio to be decoded before playing to avoid delay
    const audioCache = scene.cache.audio.get(key);
    if (audioCache && audioCache.isDecoding) {
        scene.cache.audio.once(`${key}decoded`, () => {
            sound.play();
        });
    } else {
        sound.play();
    }
}

/**
 * Fades out ALL currently playing music and fades in new music.
 * Useful for smooth transitions between scenes.
 *
 * @param {Phaser.Scene} scene
 * @param {string} newKey - New music key to fade in
 * @param {number} duration - Fade duration in ms (default: 1000)
 * @param {object} config - Optional Phaser sound config for the new music (loop, volume, etc.)
 */
export function crossfadeMusic(scene, newKey, duration = 1000, config = {}) {
    // Stop ALL currently playing sounds to ensure clean transition
    const soundManager = scene.sound;
    const currentlyPlaying = [];

    // Collect ALL playing sounds (including same key to prevent duplicates)
    soundManager.getAllPlaying().forEach((sound) => {
        currentlyPlaying.push(sound);
    });

    if (currentlyPlaying.length > 0) {
        // Fade out all playing music
        currentlyPlaying.forEach((sound) => {
            scene.tweens.add({
                targets: sound,
                volume: 0,
                duration: duration,
                onComplete: () => sound.stop(),
            });
        });
    }

    const defaultConfig = { volume: 0.5 };

    // Fade in new music
    if (scene.cache.audio.exists(newKey)) {
        const newMusic = scene.sound.add(newKey, { loop: true, volume: 0 });
        scene._currentMusic = newMusic;
        newMusic.play();
        scene.tweens.add({
            targets: newMusic,
            volume: config.volume || defaultConfig.volume,
            duration: duration,
        });
    }
}
