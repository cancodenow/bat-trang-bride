import Phaser from "phaser";
import OpeningScene from "./game/scenes/OpeningScene";
import IntroScene from "./game/scenes/[Intro 0] IntroScene";
import MorningScene01 from "./game/scenes/[Intro 1] MorningScene";
import BadEndingScene from "./game/scenes/[Intro 2] BadEndingScene";
import Scene02MarketInvite from "./game/scenes/[Intro 3] Scene02MarketInvite";
import TaskIntroScene from "./game/scenes/[1.1] TaskIntroScene";
import IngredientSelectionIntroScene from "./game/scenes/[1.2] IngredientSelectionIntroScene";
import MarketIngredientSelectionScene from "./game/scenes/[1.3] MarketIngredientSelectionScene";
import CookingChallengePlaceholderScene from "./game/scenes/[2] CookingChallenge";
import BuyRibsIntroScene from "./game/scenes/[1.4] BuyRibsIntroScene";
import PorkRibSelectionScene from "./game/scenes/[1.5] PorkRibSelectionScene";
import BargainScene from "./game/scenes/[1.6] BargainScene";
import BargainBadEndingScene from "./game/scenes/[1.61] BargainBadEndingScene";
import Level1PassScene from "./game/scenes/[1.7] Level1PassScene";
import Level2IntroScene from "./game/scenes/[2.1] Level2IntroScene";
import Level2InstructionScene from "./game/scenes/[2.2] Level2InstructionScene";
import Level2CookingGuidedScene from "./game/scenes/[2.3] Level2CookingGuidedScene";
import CookingChallengeCompleteScene from "./game/scenes/[2.4] CookingChallengeCompleteScene";
import Level3IntroScene from "./game/scenes/[3.1] Level3Introscene";
import Level3MainChallengeScene from "./game/scenes/[3.2] Level3mainchallenge";
import Level3PassScene from "./game/scenes/[3.3] Level3PassScene";
import Level4IntroScene from "./game/scenes/[4.1] Level4IntroScene";
import Level4MainChallengeScene from "./game/scenes/[4.2] Level4mainchallenge";
import Level4PassScene from "./game/scenes/[4.3] Level4PassScene";

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
        Level3IntroScene,
        Level3MainChallengeScene,
        Level3PassScene,
        Level4IntroScene,
        Level4MainChallengeScene,
        Level4PassScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(config);
