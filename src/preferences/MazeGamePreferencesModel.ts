/**
 * MazeGamePreferencesModel.ts
 *
 * Model for the simulation-specific preferences shown in Preferences →
 * Simulation. Each preference Property takes its initial value from the
 * corresponding query parameter in mazeGameQueryParameters.
 */

import { BooleanProperty } from "scenerystack/axon";
import type { Tandem } from "scenerystack/tandem";
import MazeGameNamespace from "../MazeGameNamespace.js";
import mazeGameQueryParameters from "./mazeGameQueryParameters.js";

export class MazeGamePreferencesModel {
  /** Whether the particle leaves a path trace. Initial value comes from `particleTrace`. */
  public readonly particleTraceEnabledProperty: BooleanProperty;

  public constructor(tandem?: Tandem) {
    this.particleTraceEnabledProperty = new BooleanProperty(
      mazeGameQueryParameters.particleTrace,
      tandem ? { tandem: tandem.createTandem("particleTraceEnabledProperty") } : undefined,
    );
  }

  public reset(): void {
    this.particleTraceEnabledProperty.reset();
  }
}

MazeGameNamespace.register("MazeGamePreferencesModel", MazeGamePreferencesModel);
