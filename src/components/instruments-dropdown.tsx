"use client";

import { Instrument } from "@/types";
import { INSTRUMENTS_LABELS } from "@/constants/instruments-label";

interface Props {
  label?: string;
  blankLabel?: string;
  selectedInstruments?: Instrument[];
  onChange: (instruments: Instrument[]) => void;
}

const ALL_INSTRUMENTS = Object.keys(INSTRUMENTS_LABELS).map((key) =>
  parseInt(key, 10),
) as Instrument[];

const InstrumentsDropdown = ({
  label = "Instruments",
  blankLabel = "None",
  selectedInstruments = [],
  onChange,
}: Props) => {
  const handleSelect = (instrument: Instrument) => {
    const newInstruments = selectedInstruments.includes(instrument)
      ? selectedInstruments.filter((i) => i !== instrument)
      : [...selectedInstruments, instrument];

    onChange(newInstruments.sort());
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
        <span className="text-gray-400 text-sm">{label}:</span>
        <span className="font-semibold text-primary">
          {selectedInstruments.length === 0
            ? blankLabel
            : selectedInstruments.length}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-current opacity-70"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-200 rounded-box z-50 mt-2 w-56 p-2 shadow-lg"
      >
        {ALL_INSTRUMENTS.map((instrument) => {
          const label = INSTRUMENTS_LABELS[instrument];
          const isSelected = selectedInstruments.includes(instrument);

          return (
            <li key={instrument}>
              <button
                type="button"
                onClick={() => handleSelect(instrument)}
                className={`flex justify-between items-center ${
                  isSelected ? "active font-bold" : ""
                }`}
              >
                <span>{label}</span>
                {isSelected && <span>✓</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InstrumentsDropdown;
