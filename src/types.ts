import { Song as PrismaSong } from "@/generated/prisma/client";
import { Player as PrismaPlayer } from "@/generated/prisma-scores/client";

export type Song = PrismaSong;
export type Player = PrismaPlayer;

export enum Difficulty {
  Beginner = 0,
  Easy = 1,
  Normal = 2,
  Hard = 3,
  Expert = 4,
  ExpertPlus = 5,
}

export enum Instrument {
  // 0–9: 5-fret guitar
  FiveFretGuitar = 0,
  FiveFretBass = 1,
  FiveFretRhythm = 2,
  FiveFretCoopGuitar = 3,
  Keys = 4,
  // 10–19: 6-fret guitar
  SixFretGuitar = 10,
  SixFretBass = 11,
  SixFretRhythm = 12,
  SixFretCoopGuitar = 13,
  // 20–29: drums
  FourLaneDrums = 20,
  ProDrums = 21,
  FiveLaneDrums = 22,
  EliteDrums = 23,
  // 30–39: pro instruments
  ProGuitar_17Fret = 30,
  ProGuitar_22Fret = 31,
  ProBass_17Fret = 32,
  ProBass_22Fret = 33,
  ProKeys = 34,
  // 40–49: vocals
  Vocals = 40,
  Harmony = 41,
  Band = 255,
}

export interface ScoreMetadata {
  playerId: string;
  songChecksum: string;
  instrument: Instrument;
  difficulty: Difficulty;
}

export interface CompleteScore {
  id: string;
  date: Date;
  gameVersion: string;
  score: number;
  stars: number;
  percent: number;
  notesHit: number;
  notesMissed: number;
  isFc: boolean;
}
