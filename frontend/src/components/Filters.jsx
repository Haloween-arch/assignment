import { useState } from "react";

/**
 * Multi-select menu with checkboxes (for Region, Gender, etc.)
 */
function MultiSelectMenu({ label, options = [], selected = [], onChange }) {
  const toggle = (value) => {
    const exists = selected.includes(value);
    const next = exists
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };

  if (!options.length) {
    return (
      <div className="text-xs text-gray-500">
        No {label.toLowerCase()} options available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-auto">
      <span className="text-xs font-semibold text-gray-600">
        {label} (multi-select)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-xs text-gray-700"
          >
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Age range menu (Min / Max)
 */
function AgeRangeMenu({ ageMin, ageMax, update }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-600">Age Range</span>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={ageMin}
          onChange={(e) => update("ageMin", e.target.value)}
          className="border rounded-lg px-2 py-1.5 text-xs w-1/2 bg-white"
        />
        <input
          type="number"
          placeholder="Max"
          value={ageMax}
          onChange={(e) => update("ageMax", e.target.value)}
          className="border rounded-lg px-2 py-1.5 text-xs w-1/2 bg-white"
        />
      </div>
    </div>
  );
}

/**
 * Date range menu (start / end)
 */
function DateRangeMenu({ startDate, endDate, update }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-600">Date Range</span>
      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => update("startDate", e.target.value)}
          className="border rounded-lg px-2 py-1.5 text-xs w-1/2 bg-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => update("endDate", e.target.value)}
          className="border rounded-lg px-2 py-1.5 text-xs w-1/2 bg-white"
        />
      </div>
    </div>
  );
}

/**
 * Main Filters bar – matches the Figma row of dropdown buttons.
 *
 * props:
 *  - params: full filters state (gender[], region[], category[], payment[], tags[], ageMin, ageMax, startDate, endDate)
 *  - update: (key, value) => void  (same as your Home.jsx)
 *  - options: { genders, regions, categories, payments, tags }
 */
export default function Filters({ params, update, options = {} }) {
  const {
    genders = [],
    regions = [],
    categories = [],
    payments = [],
    tags = [],
  } = options;

  const [open, setOpen] = useState(null); // which dropdown is open

  const toggleOpen = (id) => {
    setOpen((prev) => (prev === id ? null : id));
  };

  // config describing all filter buttons in the row
  const filtersConfig = [
    { id: "region", label: "Customer Region", type: "multi", opts: regions },
    { id: "gender", label: "Gender", type: "multi", opts: genders },
    { id: "age", label: "Age Range", type: "age" },
    {
      id: "category",
      label: "Product Category",
      type: "multi",
      opts: categories,
    },
    { id: "tags", label: "Tags", type: "multi", opts: tags },
    {
      id: "payment",
      label: "Payment Method",
      type: "multi",
      opts: payments,
    },
    { id: "date", label: "Date", type: "date" },
  ];

  return (
    <div className="bg-gray-50 border rounded-xl px-4 py-3">
      {/* Top row: all filter dropdown buttons + Clear all on the right */}
      <div className="flex items-center gap-2 flex-wrap">
        {filtersConfig.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} className="relative">
              <button
                type="button"
                onClick={() => toggleOpen(f.id)}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs md:text-sm bg-white hover:bg-gray-100 ${
                  isOpen ? "ring-1 ring-gray-400" : ""
                }`}
              >
                <span>{f.label}</span>
                <span className="text-[10px]">▾</span>
              </button>

              {/* dropdown panel */}
              {isOpen && (
                <div className="absolute left-0 mt-1 z-20 w-64 rounded-lg border bg-white shadow-lg p-3">
                  {f.type === "multi" && (
                    <MultiSelectMenu
                      label={f.label}
                      options={f.opts}
                      selected={params[f.id] || []}
                      onChange={(next) => update(f.id, next)}
                    />
                  )}

                  {f.type === "age" && (
                    <AgeRangeMenu
                      ageMin={params.ageMin}
                      ageMax={params.ageMax}
                      update={update}
                    />
                  )}

                  {f.type === "date" && (
                    <DateRangeMenu
                      startDate={params.startDate}
                      endDate={params.endDate}
                      update={update}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Spacer pushes button to the right */}
        <div className="flex-1" />

        <button
          type="button"
          onClick={() => update("reset", true)}
          className="text-xs md:text-sm text-gray-600 border border-gray-300 px-4 py-1.5 rounded-lg bg-white hover:bg-gray-100"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
