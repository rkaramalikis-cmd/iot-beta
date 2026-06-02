import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from './src/components/BottomNavBar';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.mainContent}>
        {/* Conditional Rendering: Controls the visual Διαδρομή (Route) */}
        {activeTab === 'dashboard' ? (
          <DashboardScreen />
        ) : (
          <HistoryScreen />
        )}
      </View>

      <BottomNavBar 
        activeTab={activeTab} 
        onTabPress={(tabName) => setActiveTab(tabName)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Off-white background for high contrast
  },
  mainContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center', // Centers the temporary History text
    justifyContent: 'center',
  },
  tempText: {
    color: '#005B9F',
    fontSize: 18,
    fontWeight: 'bold',
  }
});