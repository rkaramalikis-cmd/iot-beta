

// Replace this with the actual IP address of your Database Server or ESP32
//const DATABASE_URL = 'http://192.168.1.XXX/api/environment';

export const fetchEnvironmentData = async () => {
  try {
    /* // THE REAL FETCH MECHANISM (Activate this when your database is online)
    const response = await fetch(DATABASE_URL);
    if (!response.ok) {
      throw new Error('Database connection failed.');
    }
    const data = await response.json();
    return data; 
    */

    const checkStatus = (val) => {
      return (val !== null && val !== undefined) ? 'Active' : 'Offline';
    }
    
    const telemetry = {
      temperature: 25.8,
      humidity: 48,
      luminosity: 920,
      pressure: 76,
      isLive: true,
    };

    return {
      telemetry,
      sensors: [
        { id: '1', name: 'ESP32 DHT22 (Temp)', status: checkStatus(telemetry.temperature) },
        { id: '2', name: 'ESP32 DHT22 (Hum)', status: checkStatus(telemetry.humidity) },
        { id: '3', name: 'ESP32 Photoresistor (Lum)', status: checkStatus(telemetry.luminosity) },
      ]
    };


  } 
   catch (error) {
    console.error('Fetch Error:', error);
    
    // In case of total failure, we return an offline state to protect the UI
    return {
      telemetry: { temperature: 0, humidity: 0, luminosity: 0, pressure: 0, isLive: false },
      sensors: []
    };
  } 
};


// Διαδρομή: src/api/sensorService.js

export const fetchTelemetryHistory = async () => {
  return new Promise((resolve) => {
    
    // Δημιουργούμε πραγματικούς χρόνους βάσει της τρέχουσας ώρας
    const now = new Date();
    const createTime = (hoursAgo, minutesAgo) => {
      const d = new Date(now);
      d.setHours(d.getHours() - hoursAgo);
      d.setMinutes(d.getMinutes() - minutesAgo);
      return d.toISOString(); // Εξαγωγή σε μορφή '2026-05-25T14:30:00.000Z'
    };

    // Μορφοποίηση ώρας για την UI οθόνη (π.χ. "14:30")
    const formatTime = (isoString) => {
      const d = new Date(isoString);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      resolve([
        // Πριν 24 ώρες
        { value: 20, timestamp: createTime(24, 0), time: formatTime(createTime(24, 0)), humidity: '45%' },
        // Πριν 12 ώρες
        { value: 22, timestamp: createTime(12, 0), time: formatTime(createTime(12, 0)), humidity: '42%' },
        // Πριν 1 ώρα
        { value: 24, timestamp: createTime(1, 0),  time: formatTime(createTime(1, 0)), humidity: '38%' }, 
        // Πριν 10 λεπτά
        { value: 27, timestamp: createTime(0, 10), time: formatTime(createTime(0, 10)), humidity: '35%' },
        // Πριν 2 λεπτά (Εντός του 5m filter)
        { value: 27, timestamp: createTime(0, 2),  time: formatTime(createTime(0, 2)), humidity: '40%' }, 
        // Τώρα
        { value: 28, timestamp: createTime(0, 0),  time: formatTime(createTime(0, 0)), humidity: '46%' },
      ]);
    }, 800);
  });
};