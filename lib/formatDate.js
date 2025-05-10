/**
 * Converts an ISO date string to a traditional date format (DD/MM/YYYY) with optional time (hh:mm AM/PM).
 * @param {string} isoDate - The ISO date string (e.g., "2025-04-25T00:46:52.341Z").
 * @param {boolean} [includeTime=false] - Whether to include the time in the output.
 * @returns {string} Formatted date string (e.g., "25/04/2025" or "25/04/2025 12:46 AM").
 * @throws {Error} if the input date is invalid.
 */

export function formatDate(isoDate, includeTime = false) {
  const date = new Date(isoDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Format date as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const datePart = `${day}/${month}/${year}`;

  if (!includeTime) {
    return datePart;
  }

  // Format time as hh:mm AM/PM
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  const timePart = `${hours12}:${minutes} ${ampm}`;

  return `${datePart} at ${timePart}`;
}
