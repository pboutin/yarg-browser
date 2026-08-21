import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Instrument } from "@/types";

const CHART_FILE_TYPES = [
  "notes.mid",
  "notes.midi",
  "notes.chart",
  "notes.txt",
] as const;
/** Same keys as YARGMidiTrack.TRACKNAMES. */
const MIDI_TRACKS: Record<string, MidiKind> = {
  "PART GUITAR": "fiveFretGuitar",
  "T1 GEMS": "fiveFretGuitar",
  "PART BASS": "fiveFretBass",
  "PART RHYTHM": "fiveFretRhythm",
  "PART GUITAR COOP": "fiveFretCoop",
  "PART KEYS": "keys",
  "PART GUITAR GHL": "sixFretGuitar",
  "PART BASS GHL": "sixFretBass",
  "PART RHYTHM GHL": "sixFretRhythm",
  "PART GUITAR COOP GHL": "sixFretCoop",
  "PART DRUMS": "drums",
  "PART ELITE_DRUMS": "eliteDrums",
  "PART VOCALS": "vocals",
  "PART HARM1": "harm1",
  "PART HARM2": "harm2",
  "PART HARM3": "harm3",
  HARM1: "harm1",
  HARM2: "harm2",
  HARM3: "harm3",
  "PART REAL_GUITAR": "proGuitar17",
  "PART REAL_GUITAR_22": "proGuitar22",
  "PART REAL_BASS": "proBass17",
  "PART REAL_BASS_22": "proBass22",
  "PART REAL_KEYS_E": "proKeys",
  "PART REAL_KEYS_M": "proKeys",
  "PART REAL_KEYS_H": "proKeys",
  "PART REAL_KEYS_X": "proKeys",
};
/** Same suffixes as YARGChartFileReader.NOTETRACKS. */
const CHART_SECTIONS: Record<string, Instrument> = {
  Single: Instrument.FiveFretGuitar,
  DoubleGuitar: Instrument.FiveFretCoopGuitar,
  DoubleBass: Instrument.FiveFretBass,
  DoubleRhythm: Instrument.FiveFretRhythm,
  Drums: Instrument.FourLaneDrums,
  Keyboard: Instrument.Keys,
  GHLGuitar: Instrument.SixFretGuitar,
  GHLBass: Instrument.SixFretBass,
  GHLRhythm: Instrument.SixFretRhythm,
  GHLCoop: Instrument.SixFretCoopGuitar,
};
type MidiKind =
  | "fiveFretGuitar"
  | "fiveFretBass"
  | "fiveFretRhythm"
  | "fiveFretCoop"
  | "keys"
  | "sixFretGuitar"
  | "sixFretBass"
  | "sixFretRhythm"
  | "sixFretCoop"
  | "drums"
  | "eliteDrums"
  | "vocals"
  | "harm1"
  | "harm2"
  | "harm3"
  | "proGuitar17"
  | "proGuitar22"
  | "proBass17"
  | "proBass22"
  | "proKeys";
type DrumsKind = "fourLane" | "pro" | "fiveLane";
function findChartFile(songDir: string): string {
  const hasIni = existsSync(join(songDir, "song.ini"));
  const startIndex = hasIni ? 0 : 3;
  for (let i = startIndex; i < CHART_FILE_TYPES.length; i++) {
    const candidate = join(songDir, CHART_FILE_TYPES[i]);
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `No chart file found in "${songDir}". Expected one of: ${CHART_FILE_TYPES.join(
      ", ",
    )}`,
  );
}
function parseIniBool(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value == null) return defaultValue;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true";
}
function readSongIni(songDir: string): {
  fiveLaneDrums: boolean | null;
  proDrums: boolean | null;
  diffBand: number | null;
  ultraStarParts: string | null;
} {
  const path = join(songDir, "song.ini");
  if (!existsSync(path)) {
    return {
      fiveLaneDrums: null,
      proDrums: null,
      diffBand: null,
      ultraStarParts: null,
    };
  }
  const fields: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    const eq = trimmed.indexOf("=");
    if (
      eq <= 0 ||
      trimmed.startsWith("[") ||
      trimmed.startsWith(";") ||
      trimmed.startsWith("#")
    ) {
      continue;
    }
    fields[trimmed.slice(0, eq).trim().toLowerCase()] = trimmed
      .slice(eq + 1)
      .trim();
  }
  const five = fields["five_lane_drums"];
  const pro = fields["pro_drums"] ?? fields["pro_drum"];
  const band = fields["diff_band"];
  return {
    fiveLaneDrums: five == null ? null : parseIniBool(five, false),
    proDrums: pro == null ? null : parseIniBool(pro, false),
    diffBand: band == null || band === "" ? null : Number(band),
    ultraStarParts: fields["parts"] ?? null,
  };
}
export function listChartedInstruments(songDir: string): Instrument[] {
  const chartPath = findChartFile(songDir);
  const ini = readSongIni(songDir);
  const found = new Set<Instrument>();
  if (chartPath.endsWith(".chart")) {
    scanDotChart(readFileSync(chartPath, "utf8"), ini, found);
  } else if (chartPath.endsWith(".txt")) {
    found.add(Instrument.Vocals);
    if (ini.ultraStarParts === "2") found.add(Instrument.Harmony);
  } else {
    scanMidi(readFileSync(chartPath), ini, found);
  }
  // Band is not a note track; YARG activates it from song.ini diff_band != -1.
  if (ini.diffBand != null && ini.diffBand !== -1) {
    found.add(Instrument.Band);
  }
  return [...found].sort((a, b) => a - b);
}
function scanDotChart(
  text: string,
  ini: ReturnType<typeof readSongIni>,
  found: Set<Instrument>,
): void {
  let drumsKind: DrumsKind | "undecided" =
    ini.fiveLaneDrums === true
      ? "fiveLane"
      : ini.proDrums === true
      ? "pro"
      : "undecided";
  let hasDrumNotes = false;
  const sectionRe =
    /^\[(Easy|Medium|Hard|Expert)(Single|DoubleGuitar|DoubleBass|DoubleRhythm|Drums|Keyboard|GHLGuitar|GHLBass|GHLRhythm|GHLCoop)\]/gm;
  const noteRe = /^\s*\d+\s*=\s*N\s+(\d+)\s+/gm;
  let match: RegExpExecArray | null;
  while ((match = sectionRe.exec(text))) {
    const instrument = CHART_SECTIONS[match[2]];
    const bodyStart = text.indexOf("{", match.index);
    const bodyEnd = text.indexOf("}", bodyStart);
    if (bodyStart < 0 || bodyEnd < 0) continue;
    const body = text.slice(bodyStart, bodyEnd);
    if (instrument !== Instrument.FourLaneDrums) {
      noteRe.lastIndex = 0;
      let note: RegExpExecArray | null;
      while ((note = noteRe.exec(body))) {
        const lane = Number(note[1]);
        const sixFret =
          instrument >= Instrument.SixFretGuitar &&
          instrument <= Instrument.SixFretCoopGuitar;
        if (lane <= 4 || lane === 7 || (sixFret && lane === 8)) {
          found.add(instrument);
          break;
        }
      }
      continue;
    }
    noteRe.lastIndex = 0;
    let note: RegExpExecArray | null;
    while ((note = noteRe.exec(body))) {
      const lane = Number(note[1]);
      if (lane <= 4) hasDrumNotes = true;
      else if (lane === 5 && drumsKind !== "pro") {
        drumsKind = "fiveLane";
        hasDrumNotes = true;
      } else if (lane >= 66 && lane <= 68 && drumsKind !== "fiveLane") {
        drumsKind = "pro";
      }
    }
  }
  if (hasDrumNotes)
    applyDrums(found, drumsKind === "undecided" ? "fourLane" : drumsKind);
}
function scanMidi(
  buf: Buffer,
  ini: ReturnType<typeof readSongIni>,
  found: Set<Instrument>,
): void {
  // .mid defaults to pro drums when song.ini omits pro_drums; .chart does not.
  let drumsKind: DrumsKind | "undecided" =
    ini.fiveLaneDrums === true
      ? "fiveLane"
      : ini.proDrums === false
      ? "fourLane"
      : "pro";
  let hasFourLaneNotes = false;
  let hasEliteNotes = false;
  let harm1 = false;
  let harm2 = false;
  let harm3 = false;
  for (const track of parseMidiTracks(buf)) {
    const kind =
      MIDI_TRACKS[track.name.trim().replace(/\0+$/, "").toUpperCase()];
    if (!kind) continue;
    switch (kind) {
      case "fiveFretGuitar":
        if (hasCompletedNote(track, isFiveFretGem))
          found.add(Instrument.FiveFretGuitar);
        break;
      case "fiveFretBass":
        if (hasCompletedNote(track, isFiveFretGem))
          found.add(Instrument.FiveFretBass);
        break;
      case "fiveFretRhythm":
        if (hasCompletedNote(track, isFiveFretGem))
          found.add(Instrument.FiveFretRhythm);
        break;
      case "fiveFretCoop":
        if (hasCompletedNote(track, isFiveFretGem))
          found.add(Instrument.FiveFretCoopGuitar);
        break;
      case "keys":
        if (hasCompletedNote(track, isFiveFretGem)) found.add(Instrument.Keys);
        break;
      case "sixFretGuitar":
        if (hasCompletedNote(track, isSixFretGem))
          found.add(Instrument.SixFretGuitar);
        break;
      case "sixFretBass":
        if (hasCompletedNote(track, isSixFretGem))
          found.add(Instrument.SixFretBass);
        break;
      case "sixFretRhythm":
        if (hasCompletedNote(track, isSixFretGem))
          found.add(Instrument.SixFretRhythm);
        break;
      case "sixFretCoop":
        if (hasCompletedNote(track, isSixFretGem))
          found.add(Instrument.SixFretCoopGuitar);
        break;
      case "drums": {
        const drums = scanDrumTrack(track);
        if (drums.hasNotes) hasFourLaneNotes = true;
        if (drums.fiveLane && drumsKind !== "fourLane") drumsKind = "fiveLane";
        else if (drums.pro && drumsKind !== "fiveLane") drumsKind = "pro";
        break;
      }
      case "eliteDrums":
        if (hasCompletedNote(track, (n) => n <= 82 || n === 73))
          hasEliteNotes = true;
        break;
      case "vocals":
        if (hasLeadVocals(track, true)) found.add(Instrument.Vocals);
        break;
      case "harm1":
        harm1 = hasLeadVocals(track, true);
        break;
      case "harm2":
        harm2 = hasLeadVocals(track, false);
        break;
      case "harm3":
        harm3 = hasLeadVocals(track, false);
        break;
      case "proGuitar17":
        if (hasProGuitarNotes(track, 117))
          found.add(Instrument.ProGuitar_17Fret);
        break;
      case "proGuitar22":
        if (hasProGuitarNotes(track, 122))
          found.add(Instrument.ProGuitar_22Fret);
        break;
      case "proBass17":
        if (hasProGuitarNotes(track, 117)) found.add(Instrument.ProBass_17Fret);
        break;
      case "proBass22":
        if (hasProGuitarNotes(track, 122)) found.add(Instrument.ProBass_22Fret);
        break;
      case "proKeys":
        if (hasCompletedNote(track, (n) => n >= 48 && n <= 72))
          found.add(Instrument.ProKeys);
        break;
    }
  }
  if (harm1) found.add(Instrument.Harmony);
  if (hasEliteNotes) {
    found.add(Instrument.EliteDrums);
    if (!hasFourLaneNotes) hasFourLaneNotes = true;
  }
  if (hasFourLaneNotes) {
    applyDrums(found, drumsKind);
  }
  void harm2;
  void harm3;
}
function applyDrums(found: Set<Instrument>, kind: DrumsKind): void {
  if (kind === "fiveLane") {
    found.add(Instrument.FiveLaneDrums);
    return;
  }
  found.add(Instrument.FourLaneDrums);
  if (kind === "pro") found.add(Instrument.ProDrums);
}
function isFiveFretGem(note: number): boolean {
  if (note < 59 || note > 100) return false;
  const lane = (note - 59) % 12;
  return lane >= 1 && lane <= 5;
}
function isSixFretGem(note: number): boolean {
  if (note < 58 || note > 103) return false;
  const lane = (note - 58) % 12;
  return lane <= 6;
}
function scanDrumTrack(track: MidiTrack): {
  hasNotes: boolean;
  pro: boolean;
  fiveLane: boolean;
} {
  let hasNotes = false;
  let pro = false;
  let fiveLane = false;
  const open = new Set<number>();
  for (const ev of track.notes) {
    if (ev.on) open.add(ev.note);
    else if (open.delete(ev.note)) {
      if (
        ev.note === 95 ||
        (ev.note >= 60 && ev.note <= 101 && (ev.note - 60) % 12 !== 1)
      ) {
        hasNotes = true;
        if ((ev.note - 60) % 12 === 5) fiveLane = true;
      }
    }
    if (ev.on && ev.note >= 110 && ev.note <= 112) pro = true;
  }
  return { hasNotes, pro, fiveLane };
}
function hasCompletedNote(
  track: MidiTrack,
  playable: (note: number) => boolean,
): boolean {
  const open = new Set<number>();
  for (const ev of track.notes) {
    if (ev.on) open.add(ev.note);
    else if (playable(ev.note) && open.delete(ev.note)) return true;
  }
  return false;
}
function hasProGuitarNotes(track: MidiTrack, maxVelocity: number): boolean {
  const open = new Set<number>();
  for (const ev of track.notes) {
    if (ev.channel === 1) continue; // arpeggio channel is not playable
    if (ev.on) {
      if (
        ev.note >= 24 &&
        ev.note <= 119 &&
        ev.velocity >= 100 &&
        ev.velocity <= maxVelocity
      ) {
        open.add(ev.note);
      }
    } else if (open.delete(ev.note)) {
      return true;
    }
  }
  return false;
}
function hasLeadVocals(track: MidiTrack, needsPhrase: boolean): boolean {
  let vocalOn = false;
  let phraseOpen = false;
  let phraseJustClosedTick = -1;
  for (const ev of track.notes) {
    const isPitch = ev.note >= 36 && ev.note <= 84;
    const isPhrase = ev.note === 105 || ev.note === 106;
    const isPercussion = ev.note === 96;
    if (ev.on) {
      if (isPitch) vocalOn = true;
      if (isPhrase) phraseOpen = true;
    } else {
      if (
        isPitch &&
        vocalOn &&
        (!needsPhrase || phraseOpen || ev.tick <= phraseJustClosedTick)
      ) {
        return true;
      }
      if (isPitch) vocalOn = false;
      if (isPhrase) {
        phraseOpen = false;
        phraseJustClosedTick = ev.tick;
      }
      if (
        isPercussion &&
        needsPhrase &&
        (phraseOpen || ev.tick <= phraseJustClosedTick)
      ) {
        return true;
      }
    }
  }
  return false;
}
type MidiTrack = {
  name: string;
  notes: {
    tick: number;
    note: number;
    velocity: number;
    channel: number;
    on: boolean;
  }[];
};
function parseMidiTracks(buf: Buffer): MidiTrack[] {
  if (buf.toString("ascii", 0, 4) !== "MThd")
    throw new Error("Not a MIDI file");
  let pos = 8 + buf.readUInt32BE(4);
  const trackCount = buf.readUInt16BE(10);
  const tracks: MidiTrack[] = [];
  const readVlq = (): number => {
    let value = 0;
    while (true) {
      const b = buf[pos++];
      value = (value << 7) | (b & 0x7f);
      if (b < 0x80) return value;
    }
  };
  for (let t = 0; t < trackCount; t++) {
    if (buf.toString("ascii", pos, pos + 4) !== "MTrk")
      throw new Error("Invalid MIDI track");
    const length = buf.readUInt32BE(pos + 4);
    pos += 8;
    const end = pos + length;
    let tick = 0;
    let running = 0;
    let name = "";
    const notes: MidiTrack["notes"] = [];
    while (pos < end) {
      tick += readVlq();
      let status = buf[pos];
      if (status >= 0x80) {
        running = status;
        pos++;
      } else {
        status = running;
      }
      if (status === 0xff) {
        const type = buf[pos++];
        const len = readVlq();
        if (type === 0x03) name = buf.toString("latin1", pos, pos + len);
        pos += len;
        if (type === 0x2f) break;
      } else if (status === 0xf0 || status === 0xf7) {
        pos += readVlq();
      } else {
        const eventType = status & 0xf0;
        const channel = status & 0x0f;
        if (eventType === 0xc0 || eventType === 0xd0) {
          pos += 1;
        } else {
          const a = buf[pos++];
          const b = buf[pos++];
          if (eventType === 0x90 || eventType === 0x80) {
            notes.push({
              tick,
              note: a,
              velocity: b,
              channel,
              on: eventType === 0x90 && b > 0,
            });
          }
        }
      }
    }
    tracks.push({ name, notes });
    pos = end;
  }
  return tracks;
}
