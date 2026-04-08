import { getSceneAssetGroups, importSceneModule, LOADING_SCENE_KEY } from "./sceneRegistry.js";
import { areAssetGroupsAvailable } from "./ui/assets.js";

const sceneLoadPromises = new WeakMap();

function getScenePromiseMap(game) {
    let promiseMap = sceneLoadPromises.get(game);

    if (!promiseMap) {
        promiseMap = new Map();
        sceneLoadPromises.set(game, promiseMap);
    }

    return promiseMap;
}

export function getSceneLoadPayload(targetKey, targetData) {
    return {
        targetKey,
        targetData: targetData ?? null,
    };
}

export function shouldLoadScene(game, targetKey) {
    if (!game.scene.keys[targetKey]) {
        return true;
    }

    const assetGroups = getSceneAssetGroups(targetKey);

    return !areAssetGroupsAvailable(game, assetGroups);
}

export async function ensureSceneLoaded(game, targetKey) {
    if (game.scene.keys[targetKey]) {
        return game.scene.keys[targetKey];
    }

    const promiseMap = getScenePromiseMap(game);

    if (!promiseMap.has(targetKey)) {
        promiseMap.set(
            targetKey,
            importSceneModule(targetKey).then((SceneClass) => {
                if (!game.scene.keys[targetKey]) {
                    game.scene.add(targetKey, SceneClass, false);

                    const instrumentSceneLifecycle = game.registry.get("__instrumentSceneLifecycle");
                    const loadedScene = game.scene.keys[targetKey];

                    if (typeof instrumentSceneLifecycle === "function" && loadedScene) {
                        instrumentSceneLifecycle(loadedScene);
                    }
                }

                return game.scene.keys[targetKey];
            }),
        );
    }

    return promiseMap.get(targetKey);
}

export function startManagedScene(scene, targetKey, targetData = null) {
    if (!targetKey) {
        return;
    }

    if (shouldLoadScene(scene.game, targetKey)) {
        scene.scene.start(LOADING_SCENE_KEY, getSceneLoadPayload(targetKey, targetData));
        return;
    }

    if (targetData) {
        scene.scene.start(targetKey, targetData);
    } else {
        scene.scene.start(targetKey);
    }
}
