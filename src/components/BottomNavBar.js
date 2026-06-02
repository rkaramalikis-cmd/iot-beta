import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNavBar({ activeTab, onTabPress }) {
  const officeBlue = '#002244';
  const inactiveGray = '#8E8E93';

  return (
    <View style={styles.navContainer}>
      {/* Dashboard Button */}
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => onTabPress('dashboard')}
      >
        <Ionicons 
          name="grid-outline" // Upgraded to minimal grid
          size={24} 
          color={activeTab === 'dashboard' ? officeBlue : inactiveGray} 
        />
        <Text style={[
          styles.navText, 
          { color: activeTab === 'dashboard' ? officeBlue : inactiveGray }
        ]}>
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* History Button */}
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => onTabPress('history')}
      >
        <Ionicons 
          name="stats-chart-outline" // Upgraded to 3 stats lines
          size={24} 
          color={activeTab === 'history' ? officeBlue : inactiveGray} 
        />
        <Text style={[
          styles.navText, 
          { color: activeTab === 'history' ? officeBlue : inactiveGray }
        ]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingBottom: 25, 
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  }
});