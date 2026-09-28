/**
 * main.ts
 *
 * Entry point for the simulation. Initializes SceneryStack, creates the
 * screens, and starts the main event loop.
 *
 * !! CRITICAL IMPORT ORDER !!
 * brand.js MUST be the first import. Each module imports the next, so the import nesting is
 *
 *   main → brand → splash → assert → init
 *
 * and therefore the actual EXECUTION order (deepest import runs first) is the reverse:
 *
 *   init → assert → splash → brand → main
 *
 * SceneryStack requires this exact load order. Never reorder these imports.
 */

// brand.js MUST be first; importing it runs the whole chain (init→assert→splash→brand) before main.
import "./brand.js";

import { onReadyToLaunch, PreferencesModel, Sim } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import { StringManager } from "./i18n/StringManager.js";
import MazeGameColors from "./MazeGameColors.js";
import { MazeGameScreen } from "./maze-game/MazeGameScreen.js";
import { MazeGamePreferencesModel } from "./preferences/MazeGamePreferencesModel.js";
import { MazeGamePreferencesNode } from "./preferences/MazeGamePreferencesNode.js";

onReadyToLaunch(() => {
  const stringManager = StringManager.getInstance();
  const mazeGamePreferences = new MazeGamePreferencesModel(Tandem.ROOT.createTandem("preferences"));

  const screens = [
    new MazeGameScreen({
      // The screen name Property updates automatically when the locale changes
      name: stringManager.getScreenNames().mazeGameStringProperty,
      tandem: Tandem.ROOT.createTandem("mazeGameScreen"),
      backgroundColorProperty: MazeGameColors.backgroundColorProperty,
      preferences: mazeGamePreferences,
    }),
  ];

  const sim = new Sim(stringManager.getTitleStringProperty(), screens, {
    preferencesModel: new PreferencesModel({
      visualOptions: {
        // Adds a "Projector Mode" toggle in Preferences → Visual
        supportsProjectorMode: true,
        // Enables keyboard-navigation highlight outlines
        supportsInteractiveHighlights: true,
        customPreferences: [{ createContent: (tandem) => new MazeGamePreferencesNode(mazeGamePreferences, tandem) }],
      },
      localizationOptions: {
        // Adds a language picker in Preferences → Language
        supportsDynamicLocale: true,
      },
      audioOptions: {
        // Initializes tambo and the Audio preferences. Pair with supportsSound in src/init.ts.
        supportsSound: true,
        supportsVoicing: true,
      },
    }),

    // Optional: fill in credits shown in Help → About
    credits: {
      leadDesign: "PhET Interactive Simulations (original)",
      softwareDevelopment: "SceneryStack port",
      team: "PhET Interactive Simulations",
      qualityAssurance: "",
    },
  });

  sim.start();
});
