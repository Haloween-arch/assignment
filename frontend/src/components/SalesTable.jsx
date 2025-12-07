// src/components/SalesTable.jsx

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/* -------------------------------------------------------
   Format phone number → always "+91 XXXXX XXXXX"
------------------------------------------------------- */
function formatPhone(num) {
  if (!num) return "";

  let clean = String(num)
    .replace(/\D/g, "")  // remove everything except digits
    .replace(/^91/, ""); // remove leading 91 if present

  // force last 10 digits
  clean = clean.slice(-10);

  return `+91 ${clean}`;
}

/* -------------------------------------------------------
   Copy phone number button
------------------------------------------------------- */
function CopyButton({ value }) {
  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded-md hover:bg-gray-100 border border-transparent hover:border-gray-200"
      title="Copy phone number"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <rect x="4" y="4" width="11" height="11" rx="2" />
      </svg>
    </button>
  );
}

/* -------------------------------------------------------
   MAIN TABLE
------------------------------------------------------- */
export default function SalesTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No results found. Try adjusting filters or search.
      </div>
    );
  }

  return (
    <div className="overflow-auto border rounded-xl">
      <table className="w-full border-collapse text-sm min-w-max">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 border text-left">Transaction ID</th>
            <th className="p-3 border text-left">Date</th>
            <th className="p-3 border text-left">Customer ID</th>
            <th className="p-3 border text-left">Customer name</th>
            <th className="p-3 border text-left">Phone Number</th>
            <th className="p-3 border text-left">Gender</th>
            <th className="p-3 border text-left">Age</th>
            <th className="p-3 border text-left">Product Category</th>
            <th className="p-3 border text-right">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => {
            // FIX: Transaction ID
            const transactionId =
              row.transactionId ||
              row["Transaction ID"] ||
              row.transaction_id ||
              row.TransactionId ||
              "-";

            // Normalize phone
            const phoneRaw = row.phoneNumber || row.phone || "";
            const phoneFormatted = formatPhone(phoneRaw);

            return (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border">{transactionId}</td>
                <td className="p-3 border">{row.date}</td>
                <td className="p-3 border">{row.customerId}</td>
                <td className="p-3 border">{row.customerName}</td>

                {/* PHONE NUMBER + COPY */}
                <td className="p-3 border">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 whitespace-nowrap">
                      {phoneFormatted}
                    </span>
                    {phoneRaw && <CopyButton value={phoneFormatted} />}
                  </div>
                </td>

                <td className="p-3 border">{row.gender}</td>
                <td className="p-3 border">{row.age}</td>
                <td className="p-3 border">{row.productCategory}</td>
                <td className="p-3 border text-right">{row.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
