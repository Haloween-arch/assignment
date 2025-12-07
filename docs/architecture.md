# Architecture Document

This document describes the overall architecture of the Retail Sales Management assignment, including backend and frontend structure, data flow, folder layout, and key module responsibilities.

---

## 1. Backend Architecture

The backend is a **Node.js + Express** service responsible for:

- Loading and normalizing the CSV dataset.
- Applying **search**, **multi-select / range filters**, **sorting**, and **pagination**.
- Exposing a REST API consumed by the React frontend.

### 1.1 Backend Folder Structure

```text
backend/
├── src/
│ ├── controllers/
│ │ └── sales.controller.js # Handles HTTP requests for sales data
│ ├── data/ # Raw CSV and derived data (if needed)
│ ├── routes/
│ │ └── sales.routes.js # Defines /api/sales routes
│ ├── services/
│ │ ├── filter.service.js # Filtering logic (multi-select + ranges)
│ │ ├── pagination.service.js # Pagination helpers
│ │ ├── sales.service.js # Orchestration of search/filter/sort/paginate
│ │ ├── search.service.js # Search implementation
│ │ └── sort.service.js # Sorting implementation
│ ├── utils/
│ │ ├── loadData.js # Loads and caches CSV data into memory
│ │ └── normalizeRow.js # Normalizes raw CSV rows to typed objects
│ └── index.js # Express app entry point
├── package.json
└── README.md
```

### 1.2 Backend Components

- **`index.js`**
  - Creates the Express app.
  - Attaches middleware (JSON parsing, CORS if needed).
  - Mounts `sales.routes.js` under `/api/sales`.
  - Starts the HTTP server.

- **`routes/sales.routes.js`**
  - Declares the main endpoint (e.g. `GET /api/sales`).
  - Forwards requests to `sales.controller.js`.

- **`controllers/sales.controller.js`**
  - Extracts query parameters (search, filters, sort, page, pageSize).
  - Calls `sales.service.js` with normalized query options.
  - Returns a JSON response with `data` and `meta` (pagination info).

- **`services/sales.service.js`**
  - Acts as the central orchestration layer.
  - Uses `loadData.js` to get all rows.
  - Applies the pipeline in order:
    1. **normalizeRow** (on initial load)
    2. **search.service.js**
    3. **filter.service.js**
    4. **sort.service.js**
    5. **pagination.service.js`
  - Returns `{ data, meta }` to the controller.

- **`utils/loadData.js`**
  - Loads CSV from `src/data/` once (at startup or on-demand).
  - Caches the parsed dataset in memory for fast subsequent requests.

- **`utils/normalizeRow.js`**
  - Converts raw CSV keys (e.g. `"Customer ID"`) into camelCase (`customerId`).
  - Casts numeric fields (age, quantity, amounts) to `Number`.
  - Adds a normalized `transactionId` field.

- **`services/search.service.js`**
  - Implements case-insensitive search over `customerName` and `phoneNumber`.
  - Returns only rows matching the search term.

- **`services/filter.service.js`**
  - Applies multi-select filters (gender, region, productCategory, paymentMethod, tags).
  - Applies range filters (ageMin/ageMax, startDate/endDate).
  - Each filter is independent and composable (can be used in any combination).

- **`services/sort.service.js`**
  - Sorts the filtered result by a chosen key (e.g. date, quantity, customerName).
  - Supports ascending/descending options depending on the sort code.

- **`services/pagination.service.js`**
  - Slices the sorted results based on `page` and `pageSize`.
  - Returns `data` for the current page plus `meta`:
    - `page`, `pageSize`
    - `totalItems`
    - `totalPages`

---

## 2. Frontend Architecture

The frontend is a **React + Vite + TailwindCSS** single-page application that consumes the backend API and renders the Sales Management UI.

### 2.1 Frontend Folder Structure

```text
frontend/
├── public/
│ └── vite.svg
├── src/
│ ├── assets/
│ │ └── react.svg
│ ├── components/
│ │ ├── Filters.jsx # Multi-select + range filters bar
│ │ ├── Pagination.jsx # Pagination controls
│ │ ├── SalesTable.jsx # Data table (transactions)
│ │ ├── SearchBar.jsx # Top search input
│ │ ├── Sidebar.jsx # Left sidebar (Mallika Rajpal, navigation/info)
│ │ └── SortDropdown.jsx # Sorting dropdown
│ ├── hooks/
│ │ └── useSales.js # Fetches sales data based on params
│ ├── pages/
│ │ └── Home.jsx # Main page combining all components
│ ├── services/
│ │ └── api.js # API helper (HTTP client to backend)
│ ├── App.jsx # Root layout (Sidebar + Home)
│ ├── index.css # Global styles + Tailwind base
│ └── main.jsx # React entry point
├── package.json
└── README.md
```


### 2.2 Frontend Components

- **`main.jsx`**
  - React entry point.
  - Renders `<App />` into the root DOM element.

- **`App.jsx`**
  - Top-level layout.
  - Displays `<Sidebar />` on the left and `<Home />` as the main content card.

- **`pages/Home.jsx`**
  - Maintains a single `params` state containing:
    - `search`, `page`, `sort`
    - `gender[]`, `region[]`, `category[]`, `payment[]`, `tags[]`
    - `ageMin`, `ageMax`, `startDate`, `endDate`
  - Passes `params` and `update` function to `SearchBar`, `Filters`, `SortDropdown`, `Pagination`.
  - Uses `useSales(params)` to fetch and render `SalesTable`.

- **`hooks/useSales.js`**
  - Accepts `params` object as input.
  - Builds query string / request body.
  - Calls `services/api.js` to fetch `/api/sales`.
  - Returns `{ data, meta, loading, error }` to the `Home` page.

- **`services/api.js`**
  - Small abstraction over `fetch` or `axios`.
  - Encodes query parameters and sends HTTP requests to the backend.
  - Central place to configure base URL.

- **`components/SearchBar.jsx`**
  - Controlled input bound to `params.search`.
  - On change, calls `update("search", value)`.

- **`components/Filters.jsx`**
  - Renders the horizontal filter bar:
    - Multi-select dropdowns for Region, Gender, Category, Tags, Payment Method.
    - Range controls for Age and Date.
    - “Reset” icon button to clear all filters.
  - Calls `update(key, value)` to modify `params` in `Home.jsx`.

- **`components/SortDropdown.jsx`**
  - Dropdown with sort keys (e.g. date, quantity, customer name).
  - Updates `params.sort`.

- **`components/Pagination.jsx`**
  - Uses `meta.totalPages` and `meta.page` to render pagination controls.
  - Calls `onPageChange(page)` -> `update("page", page)` in `Home.jsx`.

- **`components/SalesTable.jsx`**
  - Displays transactions with columns:
    - Transaction ID, Date, Customer ID, Customer name, Phone number, Gender, Age, Product Category, Quantity.
  - Formats phone numbers as `+91 XXXXX XXXXX` and provides a copy-to-clipboard button.
  - Uses alternating row colors to match the design.

- **`components/Sidebar.jsx`**
  - Static sidebar for **Mallika Rajpal**, describing the page purpose.
  - Shows navigation-like items that reflect dataset dimensions (Transactions, Customers, Products, Stores, etc.).

---

## 3. Data Flow

### 3.1 High-Level Flow

1. **User interacts with the UI**
   - Types in search box.
   - Selects filters (multi-select chips or dropdowns).
   - Adjusts age/date ranges.
   - Changes sorting.
   - Clicks pagination controls.

2. **Frontend updates state**
   - `Home.jsx` updates the shared `params` object via `update(key, value)`.
   - Every change (except `page`) resets `page` to `1` so pagination is consistent.

3. **Data fetching (`useSales`)**
   - `useSales(params)` converts `params` into query parameters.
   - Calls `api.get("/api/sales", { params })`.
   - While the request is in-flight, `loading` is `true`.

4. **Backend processing (`sales.service.js`)**
   - `loadData.js` returns full dataset (cached).
   - `search.service.js` filters rows by name/phone if `search` is provided.
   - `filter.service.js` applies multi-select and range filters.
   - `sort.service.js` orders the filtered set according to `params.sort`.
   - `pagination.service.js` slices into a single page and builds `meta`.

5. **Response → UI**
   - Backend returns `{ data, meta }`.
   - `useSales` sets `data` and `meta`, and `loading` becomes `false`.
   - `Home.jsx` renders:
     - `<SalesTable data={data} />`
     - `<Pagination meta={meta} />`
   - Filters and sort controls continue to reflect `params`.

### 3.2 Data Consistency Rules

- All filtering, sorting, and pagination is done on the backend to keep the client responsive.
- `params` is the **single source of truth** for view state on the frontend.
- Backend never mutates the original CSV rows; it works on normalized copies.

---

## 4. Folder Structure (Monorepo)

```text
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles (via index.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
└── README.md            # Root readme for assignment
```
## 5. Module Responsibilities (Summary Table)

| Module / File                                | Responsibility                                                                 |
|----------------------------------------------|-------------------------------------------------------------------------------|
| `backend/src/index.js`                       | Bootstraps Express server and mounts API routes.                              |
| `backend/src/routes/sales.routes.js`         | Defines `/api/sales` endpoint and connects controller.                         |
| `backend/src/controllers/sales.controller.js`| Reads query params, calls service layer, returns JSON response.               |
| `backend/src/utils/loadData.js`              | Loads and caches CSV dataset from `src/data/`.                                |
| `backend/src/utils/normalizeRow.js`          | Normalizes CSV rows into typed camelCase objects, adds transactionId.         |
| `backend/src/services/search.service.js`     | Implements case-insensitive search by name and phone number.                  |
| `backend/src/services/filter.service.js`     | Applies multi-select filters and numeric/date range filters.                  |
| `backend/src/services/sort.service.js`       | Implements sorting logic for supported fields.                                |
| `backend/src/services/pagination.service.js` | Slices results into pages and computes pagination metadata.                   |
| `backend/src/services/sales.service.js`      | Orchestrates search → filters → sort → pagination pipeline.                   |
| `frontend/src/main.jsx`                      | React entry point; renders `<App />`.                                         |
| `frontend/src/App.jsx`                       | Main layout wrapper (Sidebar + Home page).                                    |
| `frontend/src/pages/Home.jsx`                | Manages global params, triggers data fetch, composes search/filter UI.        |
| `frontend/src/hooks/useSales.js`             | Fetches sales data using current params; returns data/meta/loading states.    |
| `frontend/src/services/api.js`               | Wraps HTTP requests to backend `/api/sales`.                                  |
| `frontend/src/components/SearchBar.jsx`      | Controlled search input bound to `params.search`.                             |
| `frontend/src/components/Filters.jsx`        | Renders multi-select + range filters with reset option.                       |
| `frontend/src/components/SortDropdown.jsx`   | Dropdown for selecting sort order.                                            |
| `frontend/src/components/Pagination.jsx`     | Controls page navigation using backend metadata.                              |
| `frontend/src/components/SalesTable.jsx`     | Displays transaction data, formats phone, shows copy button.                 |
| `frontend/src/components/Sidebar.jsx`        | Displays Mallika Rajpal sidebar + contextual menu and page summary.           |
