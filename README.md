# Retail Sales Management — Assignment Submission

## 1. Overview (3–5 lines)
This project provides a Retail Sales Management dashboard where users can search, filter, sort and paginate through sales transactions.  
It features multi-select filters, range-based filtering, real-time search, server-side data normalization, and an optimized React UI.  
The goal is to support fast exploration of customer, product, store and payment-related sales records.

---

## 2. Tech Stack
- **Frontend:** React, Vite, TailwindCSS  
- **Backend:** Node.js, Express  
- **Other:** CSV parsing, custom filter/sort utilities

---

## 3. Search Implementation Summary
The search bar performs a case-insensitive match across customer name and phone number.  
Search parameters are stored in a shared state and passed to the backend through the `useSales` hook.  
The backend normalizes CSV data and applies includes-based search before pagination.

---

## 4. Filter Implementation Summary
Filters support both **multi-select** (Region, Gender, Category, Tags, Payment Method) and **range-based** filtering (Age & Date).  
Each filter updates a central `params` object and triggers a fresh data fetch.  
The backend filter service (`applyFilters`) applies filters independently and in combination.

---

## 5. Sorting Implementation Summary
Sorting is controlled through a dropdown with predefined sort keys.  
The selected sort key is stored in `params.sort` and applied before pagination.  
Sorting supports ascending/descending order and works seamlessly with search + filters.

---

## 6. Pagination Implementation Summary
Pagination is fully controlled by `params.page`.  
The backend slices filtered/sorted results into pages and returns `meta` information (current page, total pages, total results).  
The frontend `Pagination` component navigates pages without losing filter/search state.

---

## 7. Setup Instructions

### Backend
```sh
cd backend
npm install
npm start
```
### Frontend
```sh
cd frontend
npm install
npm run dev
```
#### Access the application at the URL printed by the frontend (https://assignment-gamma-nine-64.vercel.app/)

