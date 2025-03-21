import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Appbar, Surface, Chip, Button, Divider, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Datos simulados para problemas en tendencia
const TRENDING_PROBLEMS = [
  {
    id: '1',
    number: 1,
    title: 'Sistema de filtración de agua para zonas rurales',
    description: 'Sistema de bajo costo para filtrar agua contaminada sin electricidad',
    tags: ['Salud', 'Sostenibilidad', 'Rural'],
    creator: {
      name: 'María García',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    comments: 81,
    upvotes: 492,
    sector: 'Salud',
  },
  {
    id: '2',
    number: 2,
    title: 'Plataforma educativa para escuelas sin internet',
    description: 'Solución offline para llevar educación digital a zonas sin conectividad',
    tags: ['Educación', 'Tecnología', 'Inclusión'],
    creator: {
      name: 'Carlos Flores',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    comments: 49,
    upvotes: 488,
    sector: 'Educación',
  },
  {
    id: '3',
    number: 3,
    title: 'Microcréditos comunitarios para emprendedores',
    description: 'Sistema de financiamiento colectivo para pequeños negocios en comunidades vulnerables',
    tags: ['Finanzas', 'Emprendimiento', 'Inclusión'],
    creator: {
      name: 'Ana Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
    comments: 67,
    upvotes: 421,
    sector: 'Finanzas',
  },
];

// Datos de hilos de discusión en tendencia
const TRENDING_THREADS = [
  {
    id: 't1',
    community: 'n/impacto-social',
    title: 'Cómo hacer que tu solución llegue a más comunidades - Entrevista con expertos',
    upvotes: 27,
    comments: 24,
  },
  {
    id: 't2',
    community: 'n/sostenibilidad',
    title: '¿Cómo integrar objetivos de desarrollo sostenible en tu proyecto?',
    upvotes: 18,
    comments: 12,
  },
  {
    id: 't3',
    community: 'n/tecnologia-social',
    title: 'Tecnologías low-tech para problemas high-impact: ¿Dónde está el balance?',
    upvotes: 15,
    comments: 9,
  },
];

export default function Trending() {
  const navigation = useNavigation();
  
  // Renderiza un problema en tendencia
  const renderTrendingProblem = (problem) => (
    <Card key={problem.id} style={styles.problemCard}>
      <View style={styles.problemHeader}>
        <View style={styles.leftContent}>
          <Text style={styles.problemNumber}>{problem.number}.</Text>
          <View style={styles.problemAvatarContainer}>
            <Image source={{ uri: problem.creator.avatar }} style={styles.avatar} />
          </View>
        </View>
        <View style={styles.problemContent}>
          <Text style={styles.problemTitle}>{problem.title}</Text>
          <Text style={styles.problemDescription}>{problem.description}</Text>
          
          <View style={styles.tagContainer}>
            {problem.tags.map((tag, index) => (
              <Chip key={index} style={styles.tag} textStyle={styles.tagText} small>
                {tag}
              </Chip>
            ))}
          </View>
          
          <View style={styles.creatorContainer}>
            <Text style={styles.creatorName}>{problem.creator.name}</Text>
            <Text style={styles.creatorTitle}>
              {`Soy ${problem.creator.name}, proponente de este problema. Busco colaboradores con experiencia en ${problem.sector.toLowerCase()} y desarrollo sostenible.`}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.problemActions}>
        <Button 
          icon="message-outline" 
          mode="outlined" 
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
        >
          {problem.comments}
        </Button>
        <Button 
          icon="arrow-up-bold-outline" 
          mode="outlined"
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
        >
          {problem.upvotes}
        </Button>
      </View>
    </Card>
  );
  
  // Renderiza un hilo de discusión en tendencia
  const renderTrendingThread = (thread) => (
    <Card key={thread.id} style={styles.threadCard}>
      <Card.Content>
        <View style={styles.threadHeader}>
          <Chip style={styles.communityChip}>{thread.community}</Chip>
        </View>
        <Text style={styles.threadTitle}>{thread.title}</Text>
        
        <View style={styles.threadActions}>
          <View style={styles.threadStat}>
            <Ionicons name="arrow-up-circle-outline" size={16} color="#555" />
            <Text style={styles.threadStatText}>Upvote ({thread.upvotes})</Text>
          </View>
          <View style={styles.threadStat}>
            <Ionicons name="chatbubble-outline" size={16} color="#555" />
            <Text style={styles.threadStatText}>{thread.comments}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <View style={styles.logo}>
          <Text style={styles.logoText}>N</Text>
        </View>
        <Appbar.Content title="Nexwise" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
        <Appbar.Action icon="account-circle-outline" onPress={() => {}} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.bannerContainer}>
          <Surface style={styles.banner}>
            <Ionicons name="bulb-outline" size={24} color="#FFF" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>¡Bienvenido a Nexwise!</Text>
              <Text style={styles.bannerText}>El lugar para identificar y resolver problemas con impacto.</Text>
            </View>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explorar</Text>
            </TouchableOpacity>
          </Surface>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problemas Destacados Hoy</Text>
          
          {TRENDING_PROBLEMS.map(renderTrendingProblem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discusiones en Tendencia</Text>
          
          {TRENDING_THREADS.map(renderTrendingThread)}
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    padding: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f5ff',
    borderRadius: 8,
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bannerTitle: {
    fontWeight: 'bold',
  },
  bannerText: {
    fontSize: 12,
    color: '#555',
  },
  bannerButton: {
    borderRadius: 4,
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  problemCard: {
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
  },
  problemHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  leftContent: {
    width: 40,
    alignItems: 'center',
  },
  problemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  problemAvatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  problemContent: {
    flex: 1,
    paddingLeft: 12,
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  problemDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  tagText: {
    fontSize: 10,
  },
  creatorContainer: {
    marginTop: 4,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  creatorTitle: {
    fontSize: 12,
    color: '#666',
  },
  problemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 4,
    borderColor: '#eee',
  },
  actionButtonLabel: {
    fontSize: 12,
  },
  threadCard: {
    marginBottom: 8,
  },
  threadHeader: {
    marginBottom: 8,
  },
  communityChip: {
    height: 24,
    alignSelf: 'flex-start',
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  threadActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  threadStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  threadStatText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
  },
  footer: {
    height: 60,
  },
}); 