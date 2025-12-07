// src/utils/loadCSV.js (or similar)

const axios = require("axios");
const csv = require("csv-parser");
const { normalizeRow } = require("./normalizeRow");

const CSV_URL =
  "https://github.com/Mallika-Rajpal/TruEstate-full-stack-assignment/releases/download/v1/sales.csv";

// In-memory cache for normalized sales data
let salesData = null;
// Promise to avoid loading the CSV multiple times in parallel
let loadingPromise = null;

/**
 * Stream and load CSV from GitHub Releases.
 * - Normalizes each row
 * - Caches the result in memory
 * - Is safe to call multiple times (will reuse the same promise/cache)
 */
async function loadCSV() {
  // If already loaded, nothing to do
  if (salesData && Array.isArray(salesData) && salesData.length > 0) {
    return;
  }

  // If already loading, reuse the same promise
  if (loadingPromise) {
    return loadingPromise;
  }

  console.log("📥 CSV Source:", CSV_URL);
  console.log("⬇️ Streaming CSV from:", CSV_URL);

  loadingPromise = new Promise(async (resolve, reject) => {
    try {
      const rows = [];

      const response = await axios({
        method: "GET",
        url: CSV_URL,
        responseType: "stream",
      });

      response.data
        .pipe(csv())
        .on("data", (row) => {
          rows.push(normalizeRow(row));
        })
        .on("end", () => {
          salesData = rows;
          console.log(
            `✅ Loaded ${salesData.length.toLocaleString()} rows of sales data`
          );
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ CSV stream error:", err);
          // reset promise so we can retry on next server start if needed
          loadingPromise = null;
          reject(err);
        });
    } catch (err) {
      console.error("❌ Failed to download CSV:", err);
      loadingPromise = null;
      reject(err);
    }
  });

  return loadingPromise;
}

/**
 * Get the loaded, normalized sales data.
 * Make sure `loadCSV()` has been awaited during server startup.
 */
function getSalesData() {
  if (!salesData) {
    console.warn("⚠️ getSalesData called before CSV finished loading.");
    return [];
  }
  return salesData;
}

module.exports = { loadCSV, getSalesData };
