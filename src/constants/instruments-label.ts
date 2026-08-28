import { Instrument } from "@/types";

// Generate labels by formatting the enum keys
export const INSTRUMENTS_LABELS: Record<Instrument, string> = {
  [Instrument.FiveFretGuitar]: "5-Fret Guitar",
  [Instrument.FiveFretBass]: "5-Fret Bass",
  [Instrument.FiveFretRhythm]: "5-Fret Rhythm",
  [Instrument.FiveFretCoopGuitar]: "5-Fret Co-op Guitar",
  [Instrument.Keys]: "Keys",
  [Instrument.SixFretGuitar]: "6-Fret Guitar",
  [Instrument.SixFretBass]: "6-Fret Bass",
  [Instrument.SixFretRhythm]: "6-Fret Rhythm",
  [Instrument.SixFretCoopGuitar]: "6-Fret Co-op Guitar",
  [Instrument.FourLaneDrums]: "4-Lane Drums",
  [Instrument.ProDrums]: "Pro Drums",
  [Instrument.FiveLaneDrums]: "5-Lane Drums",
  [Instrument.EliteDrums]: "Elite Drums",
  [Instrument.ProGuitar_17Fret]: "Pro Guitar 17-Fret",
  [Instrument.ProGuitar_22Fret]: "Pro Guitar 22-Fret",
  [Instrument.ProBass_17Fret]: "Pro Bass 17-Fret",
  [Instrument.ProBass_22Fret]: "Pro Bass 22-Fret",
  [Instrument.ProKeys]: "Pro Keys",
  [Instrument.Vocals]: "Vocals",
  [Instrument.Harmony]: "Harmony",
  [Instrument.Band]: "Band",
};
