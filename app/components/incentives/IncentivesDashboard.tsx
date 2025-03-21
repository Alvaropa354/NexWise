import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { BadgesList } from './BadgesList';
import { UserRank } from './UserRank';
import { RedeemableCredits } from './RedeemableCredits';
import { PopularityBonuses } from './PopularityBonuses';
import { SpecialEvents } from './SpecialEvents';

export function IncentivesDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Centro de Incentivos</Text>
      </View>

      <UserRank />
      <BadgesList />
      <RedeemableCredits />
      <PopularityBonuses />
      <SpecialEvents />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
}); 