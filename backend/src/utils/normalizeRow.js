/**
 * Normalize raw CSV row to consistent camelCase keys and proper types.
 */
function normalizeRow(raw) {
    // Adjust keys if needed based on your CSV headers
    const quantity = Number(raw["Quantity"] || 0);
    const pricePerUnit = Number(raw["Price per Unit"] || 0);
    const discountPercentage = Number(raw["Discount Percentage"] || 0);
    const totalAmount = Number(raw["Total Amount"] || 0);
    const finalAmount = Number(raw["Final Amount"] || 0);
    const age = Number(raw["Age"] || 0);

    const transactionId =
    raw["Transaction ID"] ||
    raw["Transaction Id"] ||
    raw["transaction_id"] ||
    null;
  
    return {
      transactionId,
      customerId: raw["Customer ID"] || null,
      customerName: raw["Customer Name"] || "",
      phoneNumber: raw["Phone Number"] || "",
      gender: raw["Gender"] || "",
      age,
      customerRegion: raw["Customer Region"] || "",
      customerType: raw["Customer Type"] || "",
  
      productId: raw["Product ID"] || null,
      productName: raw["Product Name"] || "",
      brand: raw["Brand"] || "",
      productCategory: raw["Product Category"] || "",
      tags: raw["Tags"] || "",
  
      quantity,
      pricePerUnit,
      discountPercentage,
      totalAmount,
      finalAmount,
  
      date: raw["Date"] || "",
      paymentMethod: raw["Payment Method"] || "",
      orderStatus: raw["Order Status"] || "",
      deliveryType: raw["Delivery Type"] || "",
      storeId: raw["Store ID"] || "",
      storeLocation: raw["Store Location"] || "",
      salespersonId: raw["Salesperson ID"] || "",
      employeeName: raw["Employee Name"] || ""
    };
  }
  
  module.exports = { normalizeRow };
  