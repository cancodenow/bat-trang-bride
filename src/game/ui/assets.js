// ===================== UI ASSET LOADING =====================
// Call these in a scene's preload(). Phaser skips duplicate loads automatically.

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
    const assets = [
        // buttons
        { key: "start_journey", file: "button/start-the-journey.png" },
        { key: "continue_button", file: "button/button-continue.png" },
        { key: "ui-btn-cancel", file: "button/cancel-button.png" },
        { key: "ui-btn-pause", file: "button/pause-button.png" },
        { key: "ui-btn-finish", file: "button/button-finish.png" },
        { key: "ui-btn-ok", file: "button/button-ok.png" },
        { key: "ui-btn-done", file: "button/button-done.png" },
        { key: "ui-btn-try-again", file: "button/button-try-again.png" },
        { key: "ui-hud-money", file: "button/ui-money.png" },
        { key: "ui-hud-time", file: "button/ui-time.png" },
        { key: "ui-choice-button", file: "frame/frame-food.png" },
        // boxes (fixed: was pointing to non-existent infoframe.png / texbox.png)
        { key: "ui-box-textbox", file: "box/textbox.png" },
        { key: "ui-box-infobox", file: "box/infobox.png" },
        { key: "ui-modal-frame", file: "box/infobox.png" },
        { key: "ui-dialogue-box", file: "box/textbox.png" },
        { key: "ui-panel", file: "box/infobox.png" },
        // frames
        { key: "ui-success-modal", file: "frame/challenge-complete.png" },
        { key: "ui-frame-food", file: "frame/frame-food.png" },
        { key: "ui-frame-challenge", file: "frame/challenge-complete.png" },
        { key: "ui-frame-dish-unlocked", file: "frame/dish-unlocked-frame.png" },
        { key: "ui-frame-good-job", file: "frame/challenge-complete.png" },
        { key: "ui-frame-nicely-done", file: "frame/challenge-complete.png" },
        { key: "ui-frame-all-done", file: "frame/challenge-complete.png" },
        { key: "ui-frame-well", file: "frame/challenge-complete.png" },
    ];

    assets.forEach(({ key, file }) => {
        if (!scene.textures.exists(key)) {
            scene.load.image(key, "/assets/ui/" + file);
        }
    });
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

/**
 * Loads all image assets for a specific level.
 * Call alongside preloadUIAssets() in a scene's preload().
 *
 * @param {Phaser.Scene} scene
 * @param {1|2|3|4} level
 */
export function preloadLevelAssets(scene, level) {
    const assets = LEVEL_ASSETS[level];
    if (!assets) return;
    assets.forEach(({ key, file }) => {
        if (!scene.textures.exists(key)) {
            scene.load.image(key, "/assets/" + file);
        }
    });
}

// --------------- sound assets ---------------

const SOUND_ASSETS = {
    // Shared sounds used across multiple levels
    shared: [
        { key: "bgm", file: "sound/bgm.mp3" },
        { key: "intro-music", file: "sound/intro.mp3" },
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
    const load = ({ key, file }) => {
        if (!scene.cache.audio.exists(key)) {
            scene.load.audio(key, "/assets/" + file);
        }
    };
    SOUND_ASSETS.shared.forEach(load);
    if (level && SOUND_ASSETS[level]) {
        SOUND_ASSETS[level].forEach(load);
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
 */
export function crossfadeMusic(scene, newKey, duration = 1000) {
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

    // Fade in new music
    if (scene.cache.audio.exists(newKey)) {
        const newMusic = scene.sound.add(newKey, { loop: true, volume: 0 });
        scene._currentMusic = newMusic;
        newMusic.play();
        scene.tweens.add({
            targets: newMusic,
            volume: 0.5,
            duration: duration,
        });
    }
}
