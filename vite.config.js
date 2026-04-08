import { defineConfig } from "vite";

function getSceneChunkName(id) {
    if (id.includes("node_modules/phaser")) {
        return "phaser-vendor";
    }

    if (id.includes("src/game/scenes/")) {
        if (
            id.includes("OpeningScene") ||
            id.includes("[Intro 0]") ||
            id.includes("[Intro 1]") ||
            id.includes("[Intro 2]") ||
            id.includes("[Intro 3]")
        ) {
            return "scene-intro";
        }

        if (id.includes("[1.")) {
            return "scene-level1";
        }

        if (id.includes("[2")) {
            return "scene-level2";
        }

        if (id.includes("[3.")) {
            return "scene-level3";
        }

        if (id.includes("[4.")) {
            return "scene-level4";
        }
    }

    if (id.includes("src/game/ui/")) {
        return "game-ui";
    }

    return null;
}

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    return getSceneChunkName(id);
                },
            },
        },
    },
});
