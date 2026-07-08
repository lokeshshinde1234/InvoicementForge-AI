export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value || 0));

export const shortDate = (value) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
};

export const apiError = (error, fallback = "Something went wrong") => {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(", ");
  return detail || fallback;
};

export async function downloadBlob(request, filename) {
  const { data } = await request;
  const url = URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
