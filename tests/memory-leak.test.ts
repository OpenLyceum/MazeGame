/**
 * Fleet-standard memory-leak regression suite.
 */

import { Property } from "scenerystack/axon";
import { Node } from "scenerystack/scenery";
import { describe, expect, it } from "vitest";
import { MazeGameDescriber } from "../src/maze-game/a11y/MazeGameDescriber.js";
import { MazeGameModel } from "../src/maze-game/model/MazeGameModel.js";
import { Particle } from "../src/maze-game/model/Particle.js";
import { MazeGameInfoDialog } from "../src/maze-game/view/MazeGameInfoDialog.js";
import { MazeGameScreenSummaryContent } from "../src/maze-game/view/MazeGameScreenSummaryContent.js";
import { describeDisposalLeaks, forceGC } from "./helpers/memoryLeak.js";

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
]);
