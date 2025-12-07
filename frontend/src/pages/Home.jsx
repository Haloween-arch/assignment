// src/pages/Home.jsx
import { useMemo, useState } from "react";
import useSales from "../hooks/useSales";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import SortDropdown from "../components/SortDropdown";
import SalesTable from "../components/SalesTable";
import Pagination from "../components/Pagination";

const INITIAL_PARAMS = {
  search: "",
  page: 1,
  sort: "",
  // multi-select filters are arrays
  gender: [],
  region: [],
  category: [],
  payment: [],
  tags: [],
  // range filters
  ageMin: "",
  ageMax: "",
  startDate: "",
  endDate: "",
};

export default function Home() {
  const [params, setParams] = useState(INITIAL_PARAMS);

  const update = (key, value) => {
    // special case: clear all filters
    if (key === "reset") {
      setParams((prev) => ({
        ...INITIAL_PARAMS,
        // keep current search & sort when clearing (optional)
        search: prev.search,
        sort: prev.sort,
      }));
      return;
    }

    setParams((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const { data, meta, loading } = useSales(params);

  // Build distinct values for each filter from the loaded data
  const filterOptions = useMemo(() => {
    const genders = new Set();
    const regions = new Set();
    const categories = new Set();
    const payments = new Set();
    const tagSet = new Set();

    (data || []).forEach((row) => {
      if (row.gender) genders.add(row.gender);
      if (row.customerRegion) regions.add(row.customerRegion);
      if (row.productCategory) categories.add(row.productCategory);
      if (row.paymentMethod) payments.add(row.paymentMethod);
      if (row.tags) {
        String(row.tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => tagSet.add(t));
      }
    });

    return {
      genders: Array.from(genders),
      regions: Array.from(regions),
      categories: Array.from(categories),
      payments: Array.from(payments),
      tags: Array.from(tagSet),
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Top bar: title left, search right (matches Figma) */}
      <section className="flex items-center justify-between gap-4 pb-3 border-b">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Sales Management System
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Search, filter, sort and paginate retail transactions.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <SearchBar
            value={params.search}
            onChange={(v) => update("search", v)}
          />
        </div>
      </section>

      {/* Filters bar (dropdown row like Figma) */}
      <section>
        <Filters params={params} update={update} options={filterOptions} />
      </section>

      {/* Sorting dropdown aligned to right */}
      <section className="flex justify-end">
        <SortDropdown
          value={params.sort}
          onChange={(v) => update("sort", v)}
        />
      </section>

      {/* Table */}
      <section>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <SalesTable data={data} />
        )}
      </section>

      {/* Pagination */}
      <section>
        <Pagination meta={meta} onPageChange={(p) => update("page", p)} />
      </section>
    </div>
  );
}
