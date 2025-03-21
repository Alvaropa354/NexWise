import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { UserProfileComponent } from './UserProfile';
import { RecommendationsList } from './RecommendationsList';

interface RecommendationsDashboardProps {
  userId: string;
}

type TabType = 'profile' | 'recommendations';

export const RecommendationsDashboard: React.FC<RecommendationsDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={value => setActiveTab(value as TabType)}
        buttons={[
          { value: 'profile', label: 'Mi Perfil' },
          { value: 'recommendations', label: 'Recomendaciones' },
        ]}
        style={styles.tabs}
      />

      <ScrollView style={styles.content}>
        {activeTab === 'profile' ? (
          <UserProfileComponent userId={userId} />
        ) : (
          <RecommendationsList userId={userId} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    margin: 16,
  },
  content: {
    flex: 1,
  },
}); 