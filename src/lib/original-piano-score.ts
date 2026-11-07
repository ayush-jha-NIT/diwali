/**
 * An original gentle piano composition for The Last Spark.
 * This music does NOT reproduce or sample the copyrighted song "Heeriye".
 * All pitches and timing are authored for this website.
 */
export type PianoNote = {
  at: number;
  frequency: number;
  duration: number;
  role: "melody" | "arpeggio" | "bass" | "pad";
};

export const BEATS_PER_MINUTE = 78;
export const BEAT_SECONDS = 60 / BEATS_PER_MINUTE;
export const BAR_SECONDS = BEAT_SECONDS * 4;
export const LOOP_SECONDS = BAR_SECONDS * 8;

const NOTES: Record<string, number> = {
  B2: 123.47, D3: 146.83, E3: 164.81, "F#3": 185,
  G2: 98, A2: 110, A3: 220, B3: 246.94, D4: 293.66,
  E4: 329.63, "F#4": 369.99, G3: 196, G4: 392, A4: 440,
  B4: 493.88, D5: 587.33, E5: 659.25, "F#5": 739.99,
  G5: 783.99, A5: 880,
};

// Eight slow bars in B minor / D major. This is an original chord sequence.
const CHORDS: ReadonlyArray<{
  bass: string;
  notes: readonly [string, string, string, string];
}> = [
  { bass: "B2", notes: ["B3", "D4", "F#4", "D5"] },
  { bass: "G2", notes: ["G3", "B3", "D4", "G4"] },
  { bass: "D3", notes: ["D4", "F#4", "A4", "D5"] },
  { bass: "A2", notes: ["A3", "E4", "A4", "E5"] },
  { bass: "G2", notes: ["G3", "B3", "D4", "F#4"] },
  { bass: "D3", notes: ["D4", "F#4", "A4", "D5"] },
  { bass: "E3", notes: ["E4", "G4", "B4", "E5"] },
  { bass: "A2", notes: ["A3", "E4", "A4", "E5"] },
];

const MELODY: ReadonlyArray<ReadonlyArray<string | null>> = [
  ["F#5", null, "E5", "D5", null, "B4", "D5", null],
  ["G5", null, "F#5", "D5", null, "B4", "A4", null],
  ["F#5", "E5", null, "D5", "A4", null, "B4", null],
  ["E5", null, "F#5", "E5", null, "D5", "B4", null],
  ["D5", null, "B4", "D5", null, "G5", "F#5", null],
  ["A5", null, "F#5", "E5", null, "D5", "F#5", null],
  ["G5", "F#5", null, "E5", "D5", null, "B4", null],
  ["E5", null, "D5", null, "B4", "A4", null, null],
];

function pitch(note: string) {
  const result = NOTES[note];
  if (result === undefined) throw new Error("Missing piano note " + note);
  return result;
}

export const PIANO_SCORE: readonly PianoNote[] = CHORDS.flatMap((chord, bar) => {
  const offset = bar * BAR_SECONDS;
  const notes: PianoNote[] = [];
  notes.push({ at: offset, frequency: pitch(chord.bass), duration: BEAT_SECONDS * 3.7, role: "bass" });
  notes.push({ at: offset, frequency: pitch(chord.notes[1]), duration: BEAT_SECONDS * 3.6, role: "pad" });
  notes.push({ at: offset, frequency: pitch(chord.notes[2]), duration: BEAT_SECONDS * 3.6, role: "pad" });

  for (let step = 0; step < 8; step++) {
    notes.push({
      at: offset + step * BEAT_SECONDS / 2,
      frequency: pitch(chord.notes[[0, 1, 2, 1, 3, 2, 1, 2][step]]),
      duration: BEAT_SECONDS * .91,
      role: "arpeggio",
    });
    const melodic = MELODY[bar][step];
    if (melodic) {
      notes.push({
        at: offset + step * BEAT_SECONDS / 2,
        frequency: pitch(melodic),
        duration: BEAT_SECONDS * (step === 7 ? .75 : 1.16),
        role: "melody",
      });
    }
  }
  return notes;
});
