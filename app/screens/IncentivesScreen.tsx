import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IncentivesDashboard } from '../components/incentives/IncentivesDashboard';

export function IncentivesScreen() {
  return (
    <View style={styles.container}>
      <IncentivesDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 