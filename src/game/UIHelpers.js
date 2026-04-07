// UIHelpers.js — backward-compatibility shim
// All logic has moved to src/game/ui/
// Scenes that import from "../UIHelpers" continue to work unchanged.
// New scenes should import from "../ui" directly.
export * from "./ui/index.js";
