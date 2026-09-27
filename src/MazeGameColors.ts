/**
 * MazeGameColors.ts
 *
 * All dynamic colors for the simulation. Each ProfileColorProperty has a
 * "default" (dark theme) and "projector" (light theme) value; SceneryStack
 * switches profiles automatically when the user toggles Projector Mode.
 */
import { Color, ProfileColorProperty } from "scenerystack/scenery";
import MazeGameNamespace from "./MazeGameNamespace.js";

const { BLACK, WHITE } = Color;

const PANEL_FILL_DARK = new Color(40, 40, 40);
const PANEL_FILL_LIGHT = new Color(240, 240, 240);
const PANEL_STROKE_DARK = "rgba(255, 255, 255, 0.4)";
const PANEL_STROKE_LIGHT = "rgba(0, 0, 0, 0.4)";

/** Fully transparent fill/stop used for gradient fades and placeholder rectangles. */
export const TRANSPARENT_COLOR = "rgba(0,0,0,0)";

const MazeGameColors = {
  // Screen background.
  backgroundColorProperty: new ProfileColorProperty(MazeGameNamespace, "background", {
    default: "#1a1a2e",
    projector: WHITE,
  }),

  // Default text / labels.
  foregroundColorProperty: new ProfileColorProperty(MazeGameNamespace, "foreground", {
    default: WHITE,
    projector: BLACK,
  }),

  // Maze tiles.
  floorColorProperty: new ProfileColorProperty(MazeGameNamespace, "floor", {
    default: "#2a2a44",
    projector: "#eeeeee",
  }),
  wallColorProperty: new ProfileColorProperty(MazeGameNamespace, "wall", { default: "#bdbdbd", projector: "#424242" }),
  wallShadowColorProperty: new ProfileColorProperty(MazeGameNamespace, "wallShadow", {
    default: "rgba(0,0,0,0.5)",
    projector: "rgba(0,0,0,0.18)",
  }),

  // Finish tile colors (cycle by game state).
  finishColorProperty: new ProfileColorProperty(MazeGameNamespace, "finish", {
    default: "#4caf50",
    projector: "#2e7d32",
  }),
  finishClosedColorProperty: new ProfileColorProperty(MazeGameNamespace, "finishClosed", {
    default: "#e64a19",
    projector: "#bf360c",
  }),
  finishWonColorProperty: new ProfileColorProperty(MazeGameNamespace, "finishWon", {
    default: "#ffeb3b",
    projector: "#fbc02d",
  }),

  // The player particle.
  particleColorProperty: new ProfileColorProperty(MazeGameNamespace, "particle", {
    default: "#e53935",
    projector: "#b71c1c",
  }),
  particleHighlightColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleHighlight", {
    default: "#ff8a80",
    projector: "#ef5350",
  }),
  particleShadeColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleShade", {
    default: "#c62828",
    projector: "#7f0000",
  }),
  particleStrokeColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleStroke", {
    default: "#5d1010",
    projector: "#4a0000",
  }),
  particleSpecularColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleSpecular", {
    default: "rgba(255,255,255,0.75)",
    projector: "rgba(255,255,255,0.85)",
  }),
  particleGlowColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleGlow", {
    default: "rgba(229,57,53,0.35)",
    projector: "rgba(183,28,28,0.3)",
  }),
  particleTraceColorProperty: new ProfileColorProperty(MazeGameNamespace, "particleTrace", {
    default: "rgba(229,57,53,0.55)",
    projector: "rgba(183,28,28,0.5)",
  }),

  // Goal tile overlay (rings, star, stripes).
  goalMarkerColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalMarker", {
    default: "rgba(255,255,255,0.85)",
    projector: "rgba(255,255,255,0.9)",
  }),
  goalStarFillColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalStarFill", {
    default: "rgba(255,235,120,0.9)",
    projector: "rgba(255,248,180,0.95)",
  }),
  goalTileSheenColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalTileSheen", {
    default: "rgba(255,255,255,0.28)",
    projector: "rgba(255,255,255,0.4)",
  }),
  goalTileShadowColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalTileShadow", {
    default: "rgba(0,0,0,0.28)",
    projector: "rgba(0,0,0,0.18)",
  }),
  goalBackdropGlowColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalBackdropGlow", {
    default: "rgba(255,255,255,0.35)",
    projector: "rgba(255,255,255,0.45)",
  }),
  goalBackdropGlowMidColorProperty: new ProfileColorProperty(MazeGameNamespace, "goalBackdropGlowMid", {
    default: "rgba(255,255,255,0.1)",
    projector: "rgba(255,255,255,0.15)",
  }),

  // Control-pad colors. Dark mode uses lighter/brighter variants for contrast against dark buttons.
  positionVectorProperty: new ProfileColorProperty(MazeGameNamespace, "positionVector", {
    default: "#6EB5FF",
    projector: "#1A5B9E",
  }),
  velocityVectorProperty: new ProfileColorProperty(MazeGameNamespace, "velocityVector", {
    default: "#FF7572",
    projector: "#A51A16",
  }),
  accelerationVectorProperty: new ProfileColorProperty(MazeGameNamespace, "accelerationVector", {
    default: "#5CD65C",
    projector: "#1B6B1B",
  }),

  // Radio button fill for the mode tabs.
  tabButtonFillProperty: new ProfileColorProperty(MazeGameNamespace, "tabButtonFill", {
    default: new Color(58, 58, 58),
    projector: new Color(245, 245, 245),
  }),

  // Drag-pad surface inside the control panel.
  padFillProperty: new ProfileColorProperty(MazeGameNamespace, "padFill", {
    default: "rgba(255,255,255,0.5)",
    projector: "rgba(255,255,255,0.85)",
  }),

  // Control-pad knob outline.
  knobStrokeProperty: new ProfileColorProperty(MazeGameNamespace, "knobStroke", {
    default: "rgba(0,0,0,0.4)",
    projector: "rgba(0,0,0,0.35)",
  }),

  // Panels.
  panelFillProperty: new ProfileColorProperty(MazeGameNamespace, "panelFill", {
    default: PANEL_FILL_DARK,
    projector: PANEL_FILL_LIGHT,
  }),
  panelStrokeProperty: new ProfileColorProperty(MazeGameNamespace, "panelStroke", {
    default: PANEL_STROKE_DARK,
    projector: PANEL_STROKE_LIGHT,
  }),

  // Start tile marker (semi-transparent blue).
  startTileColorProperty: new ProfileColorProperty(MazeGameNamespace, "startTile", {
    default: "rgba(100,160,255,0.5)",
    projector: "rgba(50,100,200,0.35)",
  }),

  // Warning text when a collision locks the player out of winning.
  collisionWarningColorProperty: new ProfileColorProperty(MazeGameNamespace, "collisionWarning", {
    default: "#ff7043",
    projector: "#b71c1c",
  }),

  // Reset Level button — slightly darker in projector for contrast on white chrome.
  resetLevelButtonColorProperty: new ProfileColorProperty(MazeGameNamespace, "resetLevelButton", {
    default: "#f6e652",
    projector: "#d4c020",
  }),

  // Next Level button.
  nextLevelButtonColorProperty: new ProfileColorProperty(MazeGameNamespace, "nextLevelButton", {
    default: "#66bb6a",
    projector: "#388e3c",
  }),

  // Level selector radio button highlight states.
  levelButtonSelectedColorProperty: new ProfileColorProperty(MazeGameNamespace, "levelButtonSelected", {
    default: "#66bb6a",
    projector: "#388e3c",
  }),
  levelButtonUnselectedColorProperty: new ProfileColorProperty(MazeGameNamespace, "levelButtonUnselected", {
    default: "#f2ffcc",
    projector: "#e8f5e9",
  }),

  // Reset All button (bottom-right).
  resetAllButtonColorProperty: new ProfileColorProperty(MazeGameNamespace, "resetAllButton", {
    default: "#ff9800",
    projector: "#ef6c00",
  }),

  // Preferences toggle switch (on state) — darker green in projector for white backgrounds.
  toggleSwitchTrackFillRightProperty: new ProfileColorProperty(MazeGameNamespace, "toggleSwitchTrackFillRight", {
    default: "#64bd5a",
    projector: "#3d9b45",
  }),

  // Fleet-standard aliases for shared Panel + ButtonOptions modules.
  panelBackgroundColorProperty: new ProfileColorProperty(MazeGameNamespace, "panelBackground", {
    default: PANEL_FILL_DARK,
    projector: PANEL_FILL_LIGHT,
  }),
  panelBorderColorProperty: new ProfileColorProperty(MazeGameNamespace, "panelBorder", {
    default: PANEL_STROKE_DARK,
    projector: PANEL_STROKE_LIGHT,
  }),
  textColorProperty: new ProfileColorProperty(MazeGameNamespace, "text", { default: WHITE, projector: BLACK }),

  // ── Light control surfaces ───────────────────────────────────────────────────
  // White chrome (combo boxes, flat push buttons, editable input fields) stays light
  // in both profiles; its text stays dark.

  /** Fill of light control surfaces: combo-box button/list, editable input fields. */
  controlSurfaceColorProperty: new ProfileColorProperty(MazeGameNamespace, "controlSurface", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /** Fill of a disabled control surface (grayed-out editable input field). */
  controlSurfaceDisabledColorProperty: new ProfileColorProperty(MazeGameNamespace, "controlSurfaceDisabled", {
    default: "#cccccc",
    projector: "#cccccc",
  }),

  /** Text on light control surfaces: combo items, flat-button labels, field values, preferences. */
  controlSurfaceTextColorProperty: new ProfileColorProperty(MazeGameNamespace, "controlSurfaceText", {
    default: "#1a1a1a",
    projector: "#1a1a1a",
  }),
};

export default MazeGameColors;
