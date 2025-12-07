// src/components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Name, Phone no."
        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 text-sm
                   bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    </div>
  );
}
