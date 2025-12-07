const axios = require("axios");
const csv = require("csv-parser");
const { normalizeRow } = require("./normalizeRow");

let salesData = [];

const CSV_URL =
  "https://github.com/Mallika-Rajpal/TruEstate-full-stack-assignment/releases/download/v1/sales.csv";

// Always download CSV from GitHub Releases (no local path)
async function loadCSV() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("📥 CSV Source:", CSV_URL);
      console.log("⬇️ Streaming CSV from:", CSV_URL);

      const response = await axios({
        method: "GET",
        url: CSV_URL,
        responseType: "stream",
      });

      response.data
        .pipe(csv())
        .on("data", (row) => {
          salesData.push(normalizeRow(row));
        })
        .on("end", () => {
          console.log(`✅ Loaded ${salesData.length.toLocaleString()} rows of sales data`);
          resolve();
        })
        .on("error", reject);

    } catch (err) {
      console.error("❌ Failed to download CSV:", err);
      reject(err);
    }
  });
}

function getSalesData() {
  return salesData;
}

module.exports = { loadCSV, getSalesData };
