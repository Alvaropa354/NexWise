import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Appbar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Datos simulados para las categorías y colecciones
const COLLECTIONS = [
  { id: 'all', name: 'Todos los Problemas', count: 54 },
  { id: 'trending', name: 'Problemas Destacados', count: 12 },
  { id: 'saved', name: 'Guardados', count: 8 },
  { id: 'recommended', name: 'Recomendados Para Ti', count: 15 },
  { id: 'followed', name: 'De personas que sigues', count: 7 },
];

const BOOKMARKS = [
  { id: 'tech', name: 'Tecnología', count: 18 },
  { id: 'health', name: 'Salud', count: 12 },
  { id: 'education', name: 'Educación', count: 9 },
];

const CATEGORIES = [
  { id: 'tech', name: 'Tecnología', count: 348 },
  { id: 'health', name: 'Salud', count: 276 },
  { id: 'education', name: 'Educación', count: 189 },
  { id: 'finance', name: 'Finanzas', count: 122 },
  { id: 'sustainability', name: 'Sostenibilidad', count: 98 },
  { id: 'mobility', name: 'Movilidad', count: 87 },
  { id: 'food', name: 'Alimentación', count: 64 },
];

export default function Categories() {
  const navigation = useNavigation();
  
  const handleCategorySelect = (category) => {
    // Navegar al dashboard con el filtro de categoría aplicado
    navigation.navigate('Dashboard', { filterCategory: category });
  };
  
  // Renderiza un item de lista
  const renderItem = (item, index, section) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.item}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      {item.count && <Text style={styles.itemCount}>{item.count}</Text>}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Explorar" subtitle="Todos los Problemas ▾" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colecciones</Text>
          {COLLECTIONS.map((item, index) => renderItem(item, index, 'collections'))}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marcadores</Text>
          {BOOKMARKS.map((item, index) => renderItem(item, index, 'bookmarks'))}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {CATEGORIES.map((item, index) => renderItem(item, index, 'categories'))}
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginTop: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    height: 40,
  },
}); 