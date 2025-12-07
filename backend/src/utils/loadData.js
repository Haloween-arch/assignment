const axios = require("axios");
const csv = require("csv-parser");
const { normalizeRow } = require("./normalizeRow");

let salesData = [];

const CSV_URL = process.env.CSV_URL; 
// example: https://github.com/Mallika-Rajpal/TruEstate-full-stack-assignment/releases/download/v1/sales.csv

async function loadCSV() {
  if (!CSV_URL) throw new Error("CSV_URL environment variable is missing");

  console.log("⬇️ Downloading sales.csv from:", CSV_URL);

  const response = await axios({
    method: "get",
    url: CSV_URL,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    response.data
      .pipe(csv())
      .on("data", (row) => salesData.push(normalizeRow(row)))
      .on("end", () => {
        console.log(`✅ Loaded ${salesData.length} records`);
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ CSV parsing failed:", err);
        reject(err);
      });
  });
}

function getSalesData() {
  return salesData;
}

module.exports = { loadCSV, getSalesData };
