// src/components/Sidebar.jsx

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-4">
      {/* Profile / app header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
          MR
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            Sales Manager
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Mallika Rajpal
          </p>
        </div>
      </div>

      {/* What this page provides */}
      <p className="text-xs text-gray-500 leading-snug">
        Manage retail sales data with advanced search, multi-select filters,
        sorting and pagination. Review transactions by customer, product,
        payment method and store.
      </p>

      {/* Navigation sections – aligned with assignment features */}
      <nav className="mt-2 space-y-4 text-sm text-gray-700 flex-1">
        {/* Data views */}
        <div className="space-y-1">
          <SidebarItem label="Overview" icon="📊" active />
          <SidebarItem label="Transactions" icon="🧾" />
          <SidebarItem label="Customers" icon="👤" />
          <SidebarItem label="Products & Tags" icon="🏷️" />
        </div>

        {/* Operational context from dataset: stores, staff, payments */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            Operations
          </p>
          <SidebarItem label="Stores & Regions" icon="📍" indent />
          <SidebarItem label="Staff & Salespersons" icon="🧑‍💼" indent />
          <SidebarItem label="Payments & Methods" icon="💳" indent />
        </div>

        {/* Filters / insights to match search + filter + sort requirements */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            Insights
          </p>
          <SidebarItem label="Filters & Segments" icon="🎯" indent />
          <SidebarItem label="Discount & Revenue" icon="💰" indent />
        </div>
      </nav>

      {/* Small helper text */}
      <p className="text-[11px] text-gray-400">
        Use the controls on the right to combine search, filters, sorting and
        pagination exactly as specified in the TruEstate assignment.
      </p>
    </aside>
  );
}

function SidebarItem({ label, icon, indent = false, active = false }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition
        ${indent ? "pl-5" : ""}
        ${
          active
            ? "bg-gray-100 text-gray-900 font-medium"
            : "hover:bg-gray-50 text-gray-700"
        }`}
    >
      <span className="text-xs">{icon}</span>
      <span className="text-xs md:text-sm">{label}</span>
    </button>
  );
}
