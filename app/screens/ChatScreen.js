import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chat" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Text style={styles.text}>Funcionalidad de chat en desarrollo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 