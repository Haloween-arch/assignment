const BASE_URL = "https://assignment-j50b.onrender.com";

export async function fetchSales(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/sales?${query}`);
  return res.json();
}
