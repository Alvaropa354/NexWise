import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Text, Card, Chip, IconButton, Button, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Datos simulados para categorías y conjuntos de datos
const CATEGORIES = [
  'Todos los problemas',
  'Sociales',
  'Ambientales',
  'Salud',
  'Educación',
  'Tecnología',
  'Movilidad',
  'Data Visualization',
];

const DATASETS = [
  {
    id: 'dataset1',
    title: 'Acceso a Agua Potable Mundial',
    thumbnail: 'https://images.unsplash.com/photo-1581724443622-38a7e756fee6?q=80&w=150',
    author: 'María Fernández',
    updatedDays: 5,
    usability: '10.0',
    fileSize: '97 KB',
    fileCount: 1,
    fileType: 'CSV',
    upvotes: 14,
    description: 'Datos sobre acceso a agua potable por país, región y nivel socioeconómico'
  },
  {
    id: 'dataset2',
    title: 'Brecha Digital por Regiones',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=150',
    author: 'Carlos Vega',
    updatedDays: 2,
    usability: '8.8',
    fileSize: '75 MB',
    fileCount: 659,
    fileType: 'other',
    upvotes: 17,
    description: 'Análisis de la brecha de acceso a internet y tecnologías digitales'
  },
  {
    id: 'dataset3',
    title: 'Datos de Salud Comunitaria',
    thumbnail: 'https://images.unsplash.com/photo-1579154341098-e4e7a7a88f89?q=80&w=150',
    author: 'Mohammed Arfath R',
    updatedMonths: 1,
    usability: '10.0',
    fileSize: '391 KB',
    fileCount: 1,
    fileType: 'CSV',
    upvotes: 12,
    description: 'Indicadores de salud en comunidades vulnerables y su evolución'
  },
  {
    id: 'dataset4',
    title: 'Deserción Escolar en Latinoamérica',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=150',
    author: 'Ana Suárez',
    updatedDays: 8,
    usability: '9.5',
    fileSize: '2.3 MB',
    fileCount: 3,
    fileType: 'CSV, XLS',
    upvotes: 22,
    description: 'Estadísticas de deserción escolar por país, edad y factores socioeconómicos'
  },
];

export default function Explore() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los problemas');
  const [menuVisible, setMenuVisible] = useState(false);
  const [filteredDatasets, setFilteredDatasets] = useState(DATASETS);
  
  // Renderiza una categoría
  const renderCategory = (category) => (
    <Chip
      key={category}
      selected={selectedCategory === category}
      onPress={() => setSelectedCategory(category)}
      style={styles.categoryChip}
      selectedColor="#2196F3"
      mode="outlined"
    >
      {category}
    </Chip>
  );
  
  // Renderiza un dataset
  const renderDataset = (dataset) => (
    <Card key={dataset.id} style={styles.datasetCard}>
      <Card.Content style={styles.datasetCardContent}>
        <Image source={{ uri: dataset.thumbnail }} style={styles.datasetImage} />
        
        <View style={styles.datasetInfo}>
          <Text style={styles.datasetTitle}>{dataset.title}</Text>
          
          <View style={styles.datasetMeta}>
            <Text style={styles.authorText}>{dataset.author}</Text>
            <Text style={styles.updatedText}>
              • Actualizado {dataset.updatedDays 
                ? `hace ${dataset.updatedDays} días` 
                : `hace ${dataset.updatedMonths} ${dataset.updatedMonths === 1 ? 'mes' : 'meses'}`
              }
            </Text>
          </View>
          
          <View style={styles.datasetStats}>
            <View style={styles.usabilityStat}>
              <Text style={styles.usabilityLabel}>Usability</Text>
              <Text style={styles.usabilityValue}>{dataset.usability}</Text>
            </View>
            <View style={styles.sizeStat}>
              <Text style={styles.sizeLabel}>Tamaño</Text>
              <Text style={styles.sizeValue}>{dataset.fileSize}</Text>
            </View>
          </View>
          
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoText}>
              {dataset.fileCount} {dataset.fileCount === 1 ? 'Archivo' : 'Archivos'} ({dataset.fileType})
            </Text>
          </View>
        </View>
      </Card.Content>
      
      <Divider />
      
      <Card.Actions style={styles.datasetActions}>
        <TouchableOpacity style={styles.upvoteButton}>
          <Ionicons name="arrow-up" size={16} color="#666" />
          <Text style={styles.upvoteCount}>{dataset.upvotes}</Text>
        </TouchableOpacity>
        
        <View style={styles.actionAvatars}>
          <View style={[styles.avatar, { backgroundColor: '#F44336' }]} />
          <View style={[styles.avatar, { backgroundColor: '#2196F3' }]} />
        </View>
      </Card.Actions>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://picsum.photos/id/1025/40' }} 
            style={styles.logo}
          />
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conjuntos de datos"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filtersButton}
          onPress={() => setMenuVisible(true)}
        >
          <View style={styles.filtersRow}>
            <Ionicons name="options" size={18} color="#333" />
            <Text style={styles.filtersText}>Filtros</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map(renderCategory)}
      </ScrollView>
      
      <ScrollView style={styles.content}>
        <View style={styles.datasetsContainer}>
          {filteredDatasets.map(renderDataset)}
        </View>
        
        <Button 
          mode="outlined" 
          style={styles.loadMoreButton}
          labelStyle={styles.loadMoreButtonLabel}
        >
          Cargar más
        </Button>
      </ScrollView>
      
      <View style={styles.sideNavContainer}>
        <View style={styles.sideNav}>
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="add-circle-outline" size={28} color="#2196F3" />
            <Text style={styles.sideNavLabel}>Crear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="home-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Inicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="trophy-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Logros</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="layers-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Datos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="stats-chart-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Modelos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="code-slash-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Código</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="chatbubbles-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Discusiones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sideNavItem}>
            <Ionicons name="school-outline" size={28} color="#666" />
            <Text style={styles.sideNavLabel}>Aprender</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: 40,
  },
  filtersButton: {
    padding: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersText: {
    marginLeft: 4,
    fontSize: 14,
  },
  categoriesScroll: {
    maxHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  datasetsContainer: {
    padding: 16,
  },
  datasetCard: {
    marginBottom: 24,
    elevation: 2,
  },
  datasetCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  datasetImage: {
    width: 100,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  datasetInfo: {
    flex: 1,
  },
  datasetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  datasetMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 12,
    color: '#666',
  },
  updatedText: {
    fontSize: 12,
    color: '#888',
  },
  datasetStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  usabilityStat: {
    marginRight: 16,
  },
  usabilityLabel: {
    fontSize: 10,
    color: '#888',
  },
  usabilityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sizeStat: {
    marginRight: 16,
  },
  sizeLabel: {
    fontSize: 10,
    color: '#888',
  },
  sizeValue: {
    fontSize: 14,
  },
  fileInfo: {
    marginTop: 4,
  },
  fileInfoText: {
    fontSize: 12,
    color: '#666',
  },
  datasetActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  actionAvatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 4,
  },
  loadMoreButton: {
    margin: 16,
    borderColor: '#2196F3',
  },
  loadMoreButtonLabel: {
    color: '#2196F3',
  },
  sideNavContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 64,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sideNav: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  sideNavItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sideNavLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#666',
  },
}); 