// backend/src/services/applyFilters.js

function applyFilters(data, filters = {}) {
  let result = data;

  const {
    gender = [],
    region = [],
    category = [],
    payment = [],
    tags = [],
    ageMin,
    ageMax,
    startDate,
    endDate,
  } = filters;

  // Normalize ranges
  let minAge = isFiniteNumber(ageMin) ? Number(ageMin) : null;
  let maxAge = isFiniteNumber(ageMax) ? Number(ageMax) : null;

  if (minAge !== null && maxAge !== null && minAge > maxAge) {
    [minAge, maxAge] = [maxAge, minAge];
  }

  let start = startDate ? new Date(startDate) : null;
  let end = endDate ? new Date(endDate) : null;

  if (start && end && start > end) {
    [start, end] = [end, start];
  }

  // 1) Gender
  if (gender.length) {
    const set = new Set(gender.map((g) => g.toLowerCase()));
    result = result.filter((item) =>
      set.has((item.gender || "").toLowerCase())
    );
  }

  // 2) Region
  if (region.length) {
    const set = new Set(region.map((r) => r.toLowerCase()));
    result = result.filter((item) =>
      set.has((item.customerRegion || "").toLowerCase())
    );
  }

  // 3) Product Category
  if (category.length) {
    const set = new Set(category.map((c) => c.toLowerCase()));
    result = result.filter((item) =>
      set.has((item.productCategory || "").toLowerCase())
    );
  }

  // 4) Payment Method
  if (payment.length) {
    const set = new Set(payment.map((p) => p.toLowerCase()));
    result = result.filter((item) =>
      set.has((item.paymentMethod || "").toLowerCase())
    );
  }

  // 5) Tags (data stored as "tag1, tag2, tag3")
  if (tags.length) {
    const tagSet = new Set(tags.map((t) => t.toLowerCase()));
    result = result.filter((item) => {
      if (!item.tags) return false;
      const rowTags = String(item.tags)
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      return rowTags.some((t) => tagSet.has(t));
    });
  }

  // 6) Age range
  if (minAge !== null || maxAge !== null) {
    result = result.filter((item) => {
      const age = Number(item.age);
      if (Number.isNaN(age)) return false;
      if (minAge !== null && age < minAge) return false;
      if (maxAge !== null && age > maxAge) return false;
      return true;
    });
  }

  // 7) Date range
  if (start || end) {
    result = result.filter((item) => {
      if (!item.date) return false;
      const d = new Date(item.date);
      if (Number.isNaN(d.getTime())) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }

  return result;
}

function isFiniteNumber(n) {
  return n !== null && n !== undefined && !Number.isNaN(Number(n));
}

module.exports = applyFilters;
