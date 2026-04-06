import Phaser from "phaser";
import OpeningScene from "./game/scenes/OpeningScene";
import IntroScene from "./game/scenes/IntroScene";
import MorningScene01 from "./game/scenes/[Intro] MorningScene";
import BadEndingScene from "./game/scenes/[Intro] BadEndingScene";
import Scene02MarketInvite from "./game/scenes/[Intro] Scene02MarketInvite";
import TaskIntroScene from "./game/scenes/[1] TaskIntroScene";
import IngredientSelectionIntroScene from "./game/scenes/[1] IngredientSelectionIntroScene";
import MarketIngredientSelectionScene from "./game/scenes/[1] MarketIngredientSelectionScene";
import CookingChallengePlaceholderScene from "./game/scenes/[1] CookingChallenge";
import BuyRibsIntroScene from "./game/scenes/[1] BuyRibsIntroScene";
import PorkRibSelectionScene from "./game/scenes/[1] PorkRibSelectionScene";
import BargainScene from "./game/scenes/[1] BargainScene";
import BargainBadEndingScene from "./game/scenes/[1] BargainBadEndingScene";
import Level1PassScene from "./game/scenes/[1] Level1PassScene";
import Level2IntroScene from "./game/scenes/[2] Level2IntroScene";
import Level2InstructionScene from "./game/scenes/[2] Level2InstructionScene";
import Level2CookingGuidedScene from "./game/scenes/[2] Level2CookingGuidedScene";
import CookingChallengeCompleteScene from "./game/scenes/[2] CookingChallengeCompleteScene";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 1600,
  height: 900,
  backgroundColor: "#000000",
  scene: [
    OpeningScene,
    IntroScene,
    MorningScene01,
    BadEndingScene,
    Scene02MarketInvite,
    TaskIntroScene,
    IngredientSelectionIntroScene,
    MarketIngredientSelectionScene,
    BuyRibsIntroScene,
    PorkRibSelectionScene,
    BargainScene,
    BargainBadEndingScene,
    Level1PassScene,
    Level2IntroScene,
    Level2InstructionScene,
    Level2CookingGuidedScene,
    CookingChallengeCompleteScene,
    CookingChallengePlaceholderScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);