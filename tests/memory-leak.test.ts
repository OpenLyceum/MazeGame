/**
 * Fleet-standard memory-leak regression suite.
 */

import { BooleanProperty, Property } from "scenerystack/axon";
import { Bounds2, Vector2 } from "scenerystack/dot";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Node } from "scenerystack/scenery";
import { describe, expect, it } from "vitest";
import { StringManager } from "../src/i18n/StringManager.js";
import { MazeGameDescriber } from "../src/maze-game/a11y/MazeGameDescriber.js";
import { ControlMode } from "../src/maze-game/model/ControlMode.js";
import { MazeGameModel } from "../src/maze-game/model/MazeGameModel.js";
import { Particle } from "../src/maze-game/model/Particle.js";
import { ArenaNode } from "../src/maze-game/view/ArenaNode.js";
import { MazeGameInfoDialog } from "../src/maze-game/view/MazeGameInfoDialog.js";
import { MazeGameScreenSummaryContent } from "../src/maze-game/view/MazeGameScreenSummaryContent.js";
import { describeDisposalLeaks, expectNoListenerGrowth, forceGC } from "./helpers/memoryLeak.js";

type MutableGlobal = Record<string, Record<string, Record<string, unknown>>>;

/** Minimal phet.joist.sim stub so Dialog can construct under happy-dom. */
function installSimStub(): void {
  const globals = globalThis as unknown as MutableGlobal;
  globals["phet"] = globals["phet"] ?? {};
  globals["phet"]["joist"] = globals["phet"]["joist"] ?? {};
  if (globals["phet"]["joist"]["sim"] !== undefined) {
    return;
  }
  const noop = (): void => {
    /* popups are never shown in tests */
  };
  globals["phet"]["joist"]["sim"] = {
    boundsProperty: new Property(null),
    screenBoundsProperty: new Property(null),
    scaleProperty: new Property(null),
    selectedScreenProperty: new Property(null),
    isConstructionCompleteProperty: new Property(true),
    topLayer: new Node(),
    showPopup: noop,
    hidePopup: noop,
  };
}

installSimStub();

const sharedModel = new MazeGameModel();
const descriptionAlertNode = new Node();

// ArenaNode is built against a model and preference that outlive it, like the ScreenView's.
const arenaTraceEnabledProperty = new BooleanProperty(true);
const arenaTransform = ModelViewTransform2.createSinglePointScaleMapping(Vector2.ZERO, new Vector2(300, 300), 40);
const arenaBounds = new Bounds2(0, 0, 600, 600);
const a11yStrings = StringManager.getInstance().getA11yStrings();

/** Sim-lifetime string, accessible-name, preference and model Properties ArenaNode links to. */
const arenaLinkedProperties: readonly object[] = [
  StringManager.getInstance().getHudStrings().wonStringProperty,
  a11yStrings.levelCompleteStringProperty,
  a11yStrings.particleStringProperty,
  a11yStrings.particleHelpPositionStringProperty,
  a11yStrings.particleHelpVelocityStringProperty,
  a11yStrings.particleHelpAccelerationStringProperty,
  arenaTraceEnabledProperty,
  sharedModel.particle.positionProperty,
  sharedModel.particle.velocityProperty,
  sharedModel.particle.accelerationProperty,
  sharedModel.controlModeProperty,
  sharedModel.collisionsProperty,
  sharedModel.wonProperty,
  sharedModel.gameGenerationProperty,
  sharedModel.levelProperty,
];

function createArenaNode(): ArenaNode {
  const node = new ArenaNode(sharedModel, arenaTransform, arenaBounds, arenaTraceEnabledProperty);
  // Rebuild the level and the mode-dependent help text once before release.
  node.setLayout(arenaTransform, arenaBounds);
  sharedModel.setControlMode(ControlMode.ACCELERATION);
  sharedModel.setControlMode(ControlMode.POSITION);
  return node;
}

function createAndDispose(): WeakRef<object> {
  const model = new MazeGameModel();
  const ref = new WeakRef<object>(model);
  model.dispose();
  return ref;
}

describe("Memory leak regression", () => {
  it("MazeGameModel is collected after dispose", async () => {
    const ref = createAndDispose();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("repeated create/dispose cycles leave no survivors", async () => {
    const refs: WeakRef<object>[] = [];
    for (let i = 0; i < 10; i++) {
      refs.push(createAndDispose());
    }
    await forceGC(refs);
    const survivors = refs.filter((r) => r.deref() !== undefined).length;
    expect(survivors).toBe(0);
  });
});

describeDisposalLeaks([
  { name: "MazeGameModel", create: () => new MazeGameModel() },
  { name: "Particle", create: () => new Particle() },
  {
    name: "MazeGameDescriber",
    create: () => new MazeGameDescriber(sharedModel, descriptionAlertNode),
    keepAlive: () => [sharedModel, descriptionAlertNode],
  },
  {
    name: "MazeGameScreenSummaryContent",
    create: () => new MazeGameScreenSummaryContent(sharedModel),
    keepAlive: () => [sharedModel],
  },
  { name: "MazeGameInfoDialog", create: () => new MazeGameInfoDialog() },
  {
    name: "ArenaNode",
    create: createArenaNode,
    keepAlive: () => [sharedModel, ...arenaLinkedProperties],
  },
]);

describe("ArenaNode", () => {
  it("leaves no listeners on string, accessible-name, preference or model Properties", async () => {
    await expectNoListenerGrowth(arenaLinkedProperties, () => {
      createArenaNode().dispose();
    });
  });
});
