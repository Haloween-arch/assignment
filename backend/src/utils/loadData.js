// backend/src/utils/loadData.js

const axios = require("axios");
const csv = require("csv-parser");
const { normalizeRow } = require("./normalizeRow");

const CSV_URL =
  process.env.CSV_URL ||
  "https://github.com/Mallika-Rajpal/TruEstate-full-stack-assignment/releases/download/v1/sales.csv";

// Limit rows to stay within Render's 512Mi memory
const MAX_ROWS = Number(process.env.MAX_ROWS || 50000);

let salesData = null;
let loadingPromise = null;

/**
 * Download + stream CSV from GitHub, normalize rows, and cache in memory.
 * Uses a MAX_ROWS cap to avoid exhausting memory on Render.
 */
async function loadCSV() {
  // Already loaded
  if (salesData && Array.isArray(salesData) && salesData.length > 0) {
    return;
  }

  // Already loading, reuse the same promise
  if (loadingPromise) {
    return loadingPromise;
  }

  console.log("📥 CSV Source:", CSV_URL);
  console.log("⬇️ Streaming CSV from:", CSV_URL);
  console.log(`📊 MAX_ROWS = ${MAX_ROWS}`);

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
        .on("data", (raw) => {
          // Only store up to MAX_ROWS in memory
          if (rows.length < MAX_ROWS) {
            rows.push(normalizeRow(raw));
          }
          // extra rows beyond MAX_ROWS are just read and ignored
        })
        .on("end", () => {
          salesData = rows;
          console.log(
            `✅ Loaded ${salesData.length.toLocaleString()} rows of sales data (capped by MAX_ROWS)`
          );
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ CSV stream error:", err);
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

function getSalesData() {
  if (!salesData) {
    console.warn("⚠️ getSalesData called before CSV finished loading.");
    return [];
  }
  return salesData;
}

module.exports = { loadCSV, getSalesData };
