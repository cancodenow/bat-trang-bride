export const LOADING_SCENE_KEY = "SceneLoadingScene";

const SCENE_MODULE_IMPORTERS = {
    OpeningScene: () => import("./scenes/OpeningScene.js"),
    IntroScene: () => import("./scenes/[Intro 0] IntroScene.js"),
    MorningScene01: () => import("./scenes/[Intro 1] MorningScene.js"),
    BadEndingScene: () => import("./scenes/[Intro 2] BadEndingScene.js"),
    Scene02MarketInvite: () => import("./scenes/[Intro 3] Scene02MarketInvite.js"),
    TaskIntroScene: () => import("./scenes/[1.1] TaskIntroScene.js"),
    IngredientSelectionIntroScene: () => import("./scenes/[1.2] IngredientSelectionIntroScene.js"),
    MarketIngredientSelectionScene: () => import("./scenes/[1.3] MarketIngredientSelectionScene.js"),
    BuyRibsIntroScene: () => import("./scenes/[1.4] BuyRibsIntroScene.js"),
    PorkRibSelectionScene: () => import("./scenes/[1.5] PorkRibSelectionScene.js"),
    BargainScene: () => import("./scenes/[1.6] BargainScene.js"),
    BargainBadEndingScene: () => import("./scenes/[1.61] BargainBadEndingScene.js"),
    Level1PassScene: () => import("./scenes/[1.7] Level1PassScene.js"),
    Level2CookingChallengeScene: () => import("./scenes/[2] Level2CookingChallengeScene.js"),
    Level2IntroScene: () => import("./scenes/[2.1] Level2IntroScene.js"),
    Level2InstructionScene: () => import("./scenes/[2.2] Level2InstructionScene.js"),
    Level2CookingGuidedScene: () => import("./scenes/[2.3] Level2CookingGuidedScene.js"),
    CookingChallengeCompleteScene: () => import("./scenes/[2.4] CookingChallengeCompleteScene.js"),
    Level3IntroScene: () => import("./scenes/[3.1] Level3Introscene.js"),
    Level3MainChallengeScene: () => import("./scenes/[3.2] Level3mainchallenge.js"),
    Level3PassScene: () => import("./scenes/[3.3] Level3PassScene.js"),
    Level4IntroScene: () => import("./scenes/[4.1] Level4IntroScene.js"),
    Level4MainChallengeScene: () => import("./scenes/[4.2] Level4mainchallenge.js"),
    Level4PassScene: () => import("./scenes/[4.3] Level4PassScene.js"),
    FinishLevelScene: () => import("./scenes/[4.4] FinishLevelScene.js"),
};

const SCENE_ASSET_GROUPS = {
    OpeningScene: ["shared-ui", "shared-audio", "story-backgrounds"],
    IntroScene: ["shared-ui", "shared-audio", "shared-characters", "story-backgrounds"],
    MorningScene01: ["shared-ui", "shared-audio", "shared-characters", "story-backgrounds", "level-1"],
    BadEndingScene: ["shared-ui", "shared-audio"],
    Scene02MarketInvite: ["shared-ui", "shared-audio", "shared-characters", "level-1"],
    TaskIntroScene: ["shared-ui", "shared-audio", "shared-characters", "story-backgrounds", "level-1"],
    IngredientSelectionIntroScene: ["story-backgrounds"],
    MarketIngredientSelectionScene: ["shared-ui", "shared-audio", "story-backgrounds", "level-1", "market-ingredients"],
    BuyRibsIntroScene: ["shared-ui", "shared-audio", "shared-characters", "story-backgrounds", "level-1"],
    PorkRibSelectionScene: ["shared-ui", "shared-audio", "story-backgrounds", "level-1", "market-ingredients"],
    BargainScene: ["shared-ui", "shared-audio", "story-backgrounds", "level-1"],
    BargainBadEndingScene: ["shared-ui", "shared-audio"],
    Level1PassScene: ["shared-ui", "shared-audio", "story-backgrounds", "level-1"],    Level2CookingChallengeScene: ["shared-audio"],
    Level2IntroScene: ["shared-ui", "shared-audio", "shared-characters", "level-2"],
    Level2InstructionScene: ["shared-ui", "shared-audio", "level-2"],
    Level2CookingGuidedScene: ["shared-ui", "shared-audio", "level-2"],
    CookingChallengeCompleteScene: ["shared-ui", "shared-audio", "level-2"],
    Level3IntroScene: ["shared-ui", "shared-audio", "shared-characters", "level3-intro-background"],
    Level3MainChallengeScene: ["shared-ui", "shared-audio", "level-3"],
    Level3PassScene: ["shared-ui", "shared-audio", "story-backgrounds", "level-3"],
    Level4IntroScene: ["shared-ui", "shared-audio", "shared-characters", "level-4"],
    Level4MainChallengeScene: ["shared-ui", "shared-audio", "level-4"],
    Level4PassScene: ["shared-ui", "shared-audio", "level-4"],
    FinishLevelScene: ["shared-ui", "shared-audio", "finish-scene-background"],
};

export function getSceneAssetGroups(sceneKey) {
    return SCENE_ASSET_GROUPS[sceneKey] || [];
}

export function hasSceneModule(sceneKey) {
    return typeof SCENE_MODULE_IMPORTERS[sceneKey] === "function";
}

export async function importSceneModule(sceneKey) {
    const importer = SCENE_MODULE_IMPORTERS[sceneKey];

    if (!importer) {
        throw new Error(`No scene module registered for "${sceneKey}"`);
    }

    const module = await importer();

    return module.default;
}
