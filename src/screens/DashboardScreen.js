import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchEnvironmentData } from '../api/SensorService';

export default function DashboardScreen() {
  const inactiveGray = '#8E8E93';

  // This state acts as the receiving terminal for the API
  const [telemetry, setTelemetry] = useState({
    temperature: 0,
    humidity: 0,
    luminosity: 0,
    pressure: 0,
    isLive: false, 
  });

  const [activeSensors, setActiveSensors] = useState([]);
  

  useEffect(() => {
    const loadData = async () => {
      const payload = await fetchEnvironmentData();
      if(payload) {
        setTelemetry(payload.telemetry);
        setActiveSensors(payload.sensors);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greetingText}>Environment Data</Text>
          <Text style={styles.subGreetingText}>Processing device: esp32</Text>
        </View>
      </View>

      <View style={[styles.card, styles.unifiedCard]}>
        
        <View style={StyleSheet.absoluteFillObject}>
          <Image 
            source={require('../../assets/clouds.jpg')} 
            style={styles.backgroundImage}
            blurRadius={2} 
          />
          <View style={styles.backgroundOverlay} />
        </View>

        <View style={styles.contentLayer}>
          
          <View style={styles.liveHeaderRow}>
            <View style={[styles.liveDotSmall, { backgroundColor: telemetry.isLive ? '#4ADE80' : inactiveGray }]} />
            <Text style={styles.liveHeaderTextSmall}>
              {telemetry.isLive ? 'LIVE DATA' : 'OFFLINE'}
            </Text>
          </View>

          <View style={styles.primaryMetricsContainer}>
            
            <View style={styles.metricRowPremium}>
              <Ionicons name="thermometer-outline" size={18} color="#FF3B30" style={styles.iconMarginRight} />
              <Text style={styles.sectionHeaderPremium}>TEMPERATURE</Text>
            </View>
            <Text style={styles.heroDataTextLarge}>
              {telemetry.temperature}
              <Text style={styles.unitTextLarge}>°C</Text>
            </Text>

            <View style={styles.humiditySubContainer}>
              <View style={styles.metricRowPremium}>
                <Ionicons name="water-outline" size={14} color="#007AFF" style={styles.iconMarginRight} />
                <Text style={styles.sectionHeaderPremiumSmall}>HUMIDITY</Text>
              </View>
              
              <View style={styles.verticalToolContainer}>
                <Text style={styles.metricDataTextSub}>
                  {telemetry.humidity}
                  <Text style={styles.unitTextSub}>%</Text>
                </Text>
                
                <View style={styles.verticalGaugeBackground}>
                  <View style={[styles.gaugeTick, { bottom: '25%' }]} />
                  <View style={[styles.gaugeTick, { bottom: '50%' }]} />
                  <View style={[styles.gaugeTick, { bottom: '75%' }]} />
                  
                  <View style={[styles.verticalGaugeFill, { height: `${telemetry.humidity}%` }]} />
                </View>
              </View>
            </View>
            
          </View>

          <View style={styles.dividerSubtle} />

          <View style={styles.splitMetricsRow}>
            
            <View style={styles.halfWidthMetricSection}>
              <View style={styles.metricRowPremium}>
                <Ionicons name="sunny-outline" size={16} color="#FFCC00" style={styles.iconMarginRight} />
                <Text style={styles.sectionHeaderPremiumSmall}>LUMINOSITY</Text>
              </View>
              <Text style={styles.metricDataTextMedium}>
                {telemetry.luminosity}
                <Text style={styles.unitTextMedium}> lx</Text>
              </Text>
            </View>

            <View style={styles.halfWidthMetricSection}>
              <View style={styles.metricRowPremium}>
                <Ionicons name="speedometer-outline" size={16} color="#8A2BE2" style={styles.iconMarginRight} />
                <Text style={styles.sectionHeaderPremiumSmall}>PRESSURE</Text>
              </View>
              <Text style={styles.metricDataTextMedium}>
                {telemetry.pressure}
                <Text style={styles.unitTextMedium}>/100</Text>
              </Text>
            </View>

          </View>

        </View>
      </View>

      <View style={styles.sensorsContainer}>
        <Text style={styles.sectionHeaderList}>ACTIVE SENSORS</Text>
        
        <View style={styles.card}>
          {activeSensors.map((sensor, index) => (
            <View 
              key={sensor.id} 
              style={[
                styles.sensorRow, 
                index === activeSensors.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={styles.sensorInfo}>
                <Ionicons 
                  name="hardware-chip-outline" 
                  size={20} 
                  color={sensor.status === 'Active' ? '#007AFF' : inactiveGray} 
                  style={styles.sensorIcon} 
                />
                <Text style={styles.sensorName}>{sensor.name}</Text>
              </View>
              
              <View style={[styles.statusBadge, sensor.status !== 'Active' && { backgroundColor: '#F2F2F7' }]}>
                <Text style={[styles.statusText, sensor.status !== 'Active' && { color: inactiveGray }]}>
                  {sensor.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%',
  },
  scrollContent: { 
    padding: 20, 
    paddingTop: 40, 
    paddingBottom: 40,
  },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
  },
  greetingText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#002244', 
    letterSpacing: -0.5,
  },
  subGreetingText: { 
    fontSize: 14, 
    color: '#8E8E93', 
    marginTop: 4,
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 4,
  },
  unifiedCard: { 
    width: '100%', 
    marginBottom: 15, 
    padding: 0, 
    overflow: 'hidden',
  },
  backgroundImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover',
  },
  backgroundOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentLayer: { 
    zIndex: 2, 
    padding: 25, 
    width: '100%',
  },
  liveHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  liveDotSmall: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    marginRight: 6, 
    shadowColor: '#4ADE80', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 4,
  },
  liveHeaderTextSmall: { 
    color: '#002244', 
    fontSize: 11, 
    fontWeight: 'bold', 
    letterSpacing: 1.5,
  },
  primaryMetricsContainer: { 
    alignItems: 'flex-start', 
    marginBottom: 5,
  },
  metricRowPremium: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4,
  },
  iconMarginRight: { 
    marginRight: 6,
  },
  sectionHeaderPremium: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#334155', 
    letterSpacing: 1.5, 
    textTransform: 'uppercase',
  },
  heroDataTextLarge: { 
    fontSize: 64, 
    fontWeight: '900', 
    color: '#002244', 
    marginTop: -4,
  },
  unitTextLarge: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: '#475569',
  },
  humiditySubContainer: { 
    marginTop: 15,
  },
  sectionHeaderPremiumSmall: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#334155', 
    letterSpacing: 1.2, 
    textTransform: 'uppercase',
  },
  metricDataTextSub: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#002244',
  },
  unitTextSub: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#475569',
  },
  verticalToolContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 0,
  },
  verticalGaugeBackground: { 
    width: 12, 
    height: 36, 
    backgroundColor: 'rgba(0, 122, 255, 0.15)', 
    borderRadius: 6, 
    marginLeft: 10, 
    justifyContent: 'flex-end', 
    overflow: 'hidden', 
    position: 'relative',
  },
  verticalGaugeFill: { 
    width: '100%', 
    backgroundColor: '#007AFF', 
    borderRadius: 6,
  },
  gaugeTick: { 
    position: 'absolute', 
    width: '100%', 
    height: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    zIndex: 10,
  },
  dividerSubtle: { 
    height: 1, 
    backgroundColor: 'rgba(0, 34, 68, 0.1)', 
    marginVertical: 20, 
    width: '100%',
  },
  splitMetricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%',
  },
  halfWidthMetricSection: { 
    width: '48%', 
    alignItems: 'flex-start',
  },
  metricDataTextMedium: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#002244',
  },
  unitTextMedium: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#475569',
  },
  sensorsContainer: { 
    width: '100%', 
    marginTop: 10,
  },
  sectionHeaderList: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#8E8E93', 
    letterSpacing: 1.2, 
    marginBottom: 12, 
    marginLeft: 8,
  },
  sensorRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F4F8',
  },
  sensorInfo: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  sensorIcon: { 
    marginRight: 12,
  },
  sensorName: { 
    fontSize: 16, 
    color: '#333333', 
    fontWeight: '600',
  },
  statusBadge: { 
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8,
  },
  statusText: { 
    color: '#2E7D32', 
    fontSize: 12, 
    fontWeight: 'bold',
  }
});