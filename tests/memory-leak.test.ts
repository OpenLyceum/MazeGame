/**
 * Fleet-standard memory-leak regression suite.
 */

import { describe, expect, it } from "vitest";
import { TimeModel } from "../src/common/TimeModel.js";
import { MazeGameModel } from "../src/maze-game/model/MazeGameModel.js";
import { describeDisposalLeaks, forceGC } from "./helpers/memoryLeak.js";

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
  { name: "TimeModel", create: () => new TimeModel(), idempotentDispose: true },
]);
