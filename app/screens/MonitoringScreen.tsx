import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SystemMetricsDashboard } from '../components/monitoring/SystemMetricsDashboard';

export const MonitoringScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Monitoreo del Sistema" />
        <Appbar.Action icon="refresh" onPress={() => {}} />
      </Appbar.Header>
      <SystemMetricsDashboard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 