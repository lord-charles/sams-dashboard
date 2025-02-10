export const BEARER_AUTHORIZATION = "authorization";
export function generateYearOptions(endYear) {
  const currentYear = endYear || new Date().getFullYear();
  const startYear = 2023;
  const years = [];

  for (let year = currentYear; year >= startYear; year--) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years;
}
