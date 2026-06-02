// Διαδρομή: src/utils/filterEngine.js

/**
 * Global Time-Series Filter
 * Δέχεται μια Λίστα (Array) δεδομένων και ένα χρονικό πλαίσιο (String).
 * Επιστρέφει την φιλτραρισμένη Λίστα.
 * * Αναμένει κάθε αντικείμενο στη Λίστα να έχει μια ιδιότητα `timestamp` (συμβατή με Date).
 */
export const filterTelemetryByTime = (data, timeFrame) => {
  // Αν δεν υπάρχουν δεδομένα, επιστρέφει άμεσο κενό για ασφάλεια
  if (!data || data.length === 0) return [];

  const now = new Date();
  let thresholdTime = new Date();

  // Υπολογισμός του κατωφλίου (Threshold) βάσει της παραμέτρου
  switch (timeFrame) {
    case '5m':
      thresholdTime.setMinutes(now.getMinutes() - 5);
      break;
    case '1h':
      thresholdTime.setHours(now.getHours() - 1);
      break;
    case '12h':
      thresholdTime.setHours(now.getHours() - 12);
      break;
    case '24h':
      thresholdTime.setHours(now.getHours() - 24);
      break;
    case 'all':
    default:
      // Παράκαμψη φίλτρου: Επιστροφή όλων των δεδομένων
      return data; 
  }

  // Εκτέλεση του Φίλτρου: Κρατάμε μόνο όσα σημεία είναι νεότερα από το κατώφλι
  return data.filter((item) => {
    // Μετατροπή του timestamp της Βάσης σε πραγματικό αντικείμενο Date της JS
    const itemDate = new Date(item.timestamp);
    return itemDate >= thresholdTime;
  });
};