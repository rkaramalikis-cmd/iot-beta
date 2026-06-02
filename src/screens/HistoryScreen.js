// Διαδρομή: src/screens/HistoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchTelemetryHistory } from '../api/SensorService'; 
import TelemetryChart from '../components/charts'; 
import { filterTelemetryByTime } from '../utils/filtering'; // Εισαγωγή της παγκόσμιας μηχανής φιλτραρίσματος

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. STATE: Διαχείριση του ενεργού φίλτρου (Προεπιλογή: Όλα)
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTelemetryHistory();
        setHistoryData(data);
      } catch (error) {
        console.error("Σφάλμα Ανάκτησης Ιστορικού:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 2. ON-THE-FLY FILTERING: Παραγωγή των τελικών δεδομένων μόνο κατά το render
  const displayedData = filterTelemetryByTime(historyData, activeFilter);

  // Δυναμικός υπότιτλος βάσει της επιλογής
  const dynamicSubtitle = {
    '5m': 'Τελευταία 5 Λεπτά',
    '1h': 'Τελευταία 1 Ώρα',
    '12h': 'Τελευταίες 12 Ώρες',
    '24h': 'Τελευταίες 24 Ώρες',
    'all': 'Πλήρες Ιστορικό Τηλεμετρίας'
  }[activeFilter];

  // Βοηθητική λίστα (Array) για την κατασκευή των κουμπιών UI
  const filterOptions = [
    { id: '5m', label: '5m' },
    { id: '1h', label: '1h' },
    { id: '12h', label: '12h' },
    { id: '24h', label: '24h' },
    { id: 'all', label: 'All' }
  ];

  return (
    <View style={styles.mainScreen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>History & Tracking</Text>
          <Text style={styles.subGreetingText}>{dynamicSubtitle}</Text>
        </View>

        {/* 3. ΤΟ ΣΥΣΤΗΜΑ ΕΛΕΓΧΟΥ (The Filter UI) */}
        <View style={styles.filterContainer}>
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <TouchableOpacity 
                key={option.id}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => setActiveFilter(option.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <View style={StyleSheet.absoluteFillObject}>
            <Image 
              source={require('../../assets/chart1.jpg')} 
              style={styles.cardBackgroundImage}
              blurRadius={1} 
            />
            <View style={styles.cardDarkOverlay} />
          </View>

          <View style={styles.chartPadding}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            ) : displayedData.length === 0 ? (
              // Ασφάλεια σε περίπτωση που το φίλτρο δεν βρει δεδομένα (π.χ. στο 5m)
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>Μη διαθέσιμα δεδομένα για αυτό το διάστημα.</Text>
              </View>
            ) : (
              <TelemetryChart data={displayedData} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreen: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 60 },
  headerContainer: { marginBottom: 20 },
  greetingText: { fontSize: 28, fontWeight: '900', color: '#002244' },
  subGreetingText: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  
  // --- ΝΕΑ ΣΤΥΛ ΓΙΑ ΤΟΝ ΜΗΧΑΝΙΣΜΟ ΦΙΛΤΡΑΡΙΣΜΑΤΟΣ ---
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: '#F2F2F7', // Ελαφρύ γκρι φόντο για την "πλακέτα" των κουμπιών
    padding: 4,
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#002244', // Το βαθύ μπλε του τίτλου δημιουργεί οπτική αρμονία
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  
  chartCard: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    minHeight: 250, 
  },
  cardBackgroundImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardDarkOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  
  chartPadding: { paddingTop: 40, paddingBottom: 40, paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
  loaderContainer: { alignItems: 'center', justifyContent: 'center', height: 150 },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', height: 150 },
  emptyStateText: { color: '#A0A0A5', fontSize: 13, fontWeight: '600' }
});