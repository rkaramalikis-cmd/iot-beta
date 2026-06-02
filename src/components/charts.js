// Διαδρομή: src/components/TelemetryChart.js

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

export default function TelemetryChart({ data }) {
  const screenWidth = Dimensions.get('window').width;

  // 1. Δημιουργία των δεδομένων του γραφήματος με τα custom components
  const chartData = data.map((item) => ({
    value: item.value,
    
    // ΑΘΙΚΤΟ: Το Temperature Stamp με το native shifting (χωρίς CSS transforms)
    dataPointLabelComponent: () => (
      <View style={styles.tempStampContainer}>
        <Text style={styles.tempStampText}>{item.value}</Text>
        <Text style={styles.degreeSymbol}>°</Text>
      </View>
    ),

    // ΑΘΙΚΤΟ: Το Grid-Aligned Bottom Label
    labelComponent: () => (
      <View style={styles.bottomLabelContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={styles.humidityRow}>
          <Text style={styles.humidityText}>{item.humidity}</Text>
        </View>
      </View>
    ),
  }));

  // 2. Επιστροφή μόνο του καθαρού SVG γραφήματος
  return (
    <LineChart
      data={chartData}
      width={screenWidth - 80}
      height={150} 
      
      curved={false} 
      thickness={2.5}
      color="#FFFFFF"
      
      dataPointsRadius={4.5}
      dataPointsColor="#FFFFFF"
      
      // Native SVG shifting για το Temperature Stamp
      dataPointLabelShiftY={-30}
      dataPointLabelShiftX={-12}
      
      spacing={50} 
      initialSpacing={35}
      hideRules={true}
      hideYAxisText={true}
      yAxisColor="transparent"
      xAxisColor="transparent"
      
      showVerticalLines={true}
      verticalLinesColor="rgba(255, 255, 255, 0.15)"
      verticalLinesThickness={1}
      
      maxValue={38}
      minValue={10}

      paddingTop={15}
      paddingBottom={15} 
    />
  );
}

// 3. Στυλ αποκλειστικά για τα εσωτερικά στοιχεία του γραφήματος
const styles = StyleSheet.create({
  tempStampContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    width: 35, 
    zIndex: 100, 
  },
  tempStampText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  degreeSymbol: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', marginTop: -2 },
  
  bottomLabelContainer: { 
    width: 60, 
    transform: [{ translateX: -20 }], 
    marginTop: 4, 
    alignItems: 'center' 
  },
  timeText: { color: '#A0A0A5', fontSize: 11, fontWeight: '700' },
  humidityRow: { marginTop: 2 }, 
  humidityText: { color: '#66D1FF', fontSize: 11, fontWeight: '900' }
});