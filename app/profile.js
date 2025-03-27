import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Surface, Divider, Button, IconButton, Badge, Avatar, Card, Chip, Appbar, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ROUTES from './routes';

// Datos de usuario por defecto (se utilizarán si no hay perfil guardado)
const DEFAULT_USER = {
  name: 'Usuario de Nexwise',
  status: 'Disponible',
  avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
};

// Servicios disponibles
const SERVICES = [
  { id: 's1', name: 'Problemas', icon: 'bulb-outline' },
  { id: 's2', name: 'Soluciones', icon: 'flash-outline' },
  { id: 's3', name: 'Editar Perfil', icon: 'shield-outline' },
  { id: 's4', name: 'Red', icon: 'grid-outline' },
];

// Grupos de usuario
const GROUPS = [
  { 
    id: 'g1', 
    title: 'Colaboradores', 
    expanded: true,
    items: [
      { id: 'g1i1', name: 'Equipo de diseño', icon: 'people-circle-outline', count: 6 },
      { id: 'g1i2', name: 'Inversores sociales', icon: 'cash-outline', count: 3 },
    ] 
  },
  { 
    id: 'g2', 
    title: 'Conexiones', 
    expanded: false,
    items: [
      { id: 'g2i1', name: 'Mentores', icon: 'school-outline', count: 2 },
      { id: 'g2i2', name: 'Colaboradores tecnología', icon: 'code-slash-outline', count: 4 },
    ] 
  },
];

export default function ProfileScreen({ navigation }) {
  const route = useRoute();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(DEFAULT_USER.avatar);
  const [userComments, setUserComments] = useState([]);
  const [marketStudies, setMarketStudies] = useState([]);
  const [showMarketStudies, setShowMarketStudies] = useState(false);
  
  // Cargar el perfil de usuario desde AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        const savedProfileImage = await AsyncStorage.getItem('profileImage');
        
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          setUserProfile(parsedProfile);
        } else if (route.params?.profileData) {
          // Si hay datos de perfil en los parámetros de navegación, los usamos
          setUserProfile(route.params.profileData);
        }
        
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        }
        
        // Cargar comentarios y estudios de mercado
        loadUserComments();
        loadMarketStudies();
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [route.params]);
  
  // Cargar los comentarios del usuario
  const loadUserComments = async () => {
    try {
      // Intentar cargar los comentarios guardados
      const savedComments = await AsyncStorage.getItem('userComments');
      
      if (savedComments) {
        setUserComments(JSON.parse(savedComments));
        return;
      }
      
      // Si no hay comentarios guardados, cargamos los datos de ejemplo
      const mockComments = [
        {
          id: '1',
          title: 'Integración de IA en salud preventiva',
          description: 'Desarrollar sistemas de IA que puedan detectar problemas de salud antes de que se manifiesten síntomas graves, especialmente en poblaciones de riesgo.',
          date: '2023-10-28',
          sector: 'Salud y Bienestar',
        },
        {
          id: '2',
          title: 'Plataforma para reducir desperdicio alimentario',
          description: 'Sistema que conecte restaurantes y supermercados con excedentes de comida a organizaciones sociales o usuarios interesados en adquirirla a precio reducido.',
          date: '2023-10-15',
          sector: 'Sostenibilidad',
        },
        {
          id: '3',
          title: 'Herramienta de capacitación con RV para personal sanitario',
          description: 'Crear simulaciones de realidad virtual para entrenar a profesionales sanitarios en procedimientos complejos o situaciones de emergencia sin riesgo.',
          date: '2023-09-30',
          sector: 'Educación',
        }
      ];
      
      // Guardar los comentarios de ejemplo para futuras sesiones
      await AsyncStorage.setItem('userComments', JSON.stringify(mockComments));
      setUserComments(mockComments);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      // Si hay un error, al menos mostramos comentarios de ejemplo
      setUserComments([]);
    }
  };
  
  // Cargar los estudios de mercado
  const loadMarketStudies = async () => {
    try {
      const savedStudies = await AsyncStorage.getItem('marketStudies');
      if (savedStudies) {
        const studies = JSON.parse(savedStudies);
        // Asegurarnos de que cada estudio tenga la estructura correcta
        const validStudies = studies.map(study => ({
          id: study.id || Date.now(),
          date: study.date || new Date().toISOString(),
          title: `Estudio de Mercado - ${new Date(study.date).toLocaleDateString()}`,
          study: study.study || {}
        }));
        setMarketStudies(validStudies);
      }
    } catch (error) {
      console.error('Error al cargar estudios de mercado:', error);
      setMarketStudies([]);
    }
  };
  
  // Función para eliminar un comentario
  const deleteComment = async (commentId) => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Filtrar los comentarios para eliminar el seleccionado
              const updatedComments = userComments.filter(comment => comment.id !== commentId);
              
              // Actualizar el estado
              setUserComments(updatedComments);
              
              // Actualizar AsyncStorage
              await AsyncStorage.setItem('userComments', JSON.stringify(updatedComments));
              
              // Mostrar confirmación
              Alert.alert('Éxito', 'Comentario eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar comentario:', error);
              Alert.alert('Error', 'No se pudo eliminar el comentario. Inténtalo de nuevo.');
            }
          }
        }
      ]
    );
  };
  
  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería para cambiar la foto de perfil.');
        return;
      }
      
      // Lanzar el selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newProfileImage = result.assets[0].uri;
        setProfileImage(newProfileImage);
        
        // Guardar la imagen en AsyncStorage
        await AsyncStorage.setItem('profileImage', newProfileImage);
        
        // Actualizar el perfil si existe
        if (userProfile) {
          await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo cambiar la foto de perfil. Inténtalo de nuevo.');
    }
  };
  
  // Función para tomar una foto con la cámara
  const takePhoto = async () => {
    try {
      // Solicitar permisos para acceder a la cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu cámara para cambiar la foto de perfil.');
        return;
      }
      
      // Lanzar la cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newProfileImage = result.assets[0].uri;
        setProfileImage(newProfileImage);
        
        // Guardar la imagen en AsyncStorage
        await AsyncStorage.setItem('profileImage', newProfileImage);
        
        // Actualizar el perfil si existe
        if (userProfile) {
          await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo cambiar la foto de perfil. Inténtalo de nuevo.');
    }
  };
  
  // Mostrar opciones para cambiar la foto
  const showImageOptions = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      '¿Cómo quieres cambiar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar foto', onPress: takePhoto },
        { text: 'Elegir de la galería', onPress: pickImage },
      ]
    );
  };
  
  // Renderizar un comentario del usuario
  const renderUserComment = (comment) => (
    <Card key={comment.id} style={styles.commentCard}>
      <Card.Content>
        <View style={styles.commentHeader}>
          <Text style={styles.commentTitle}>{comment.title}</Text>
          <IconButton
            icon="trash-outline"
            iconColor="#FF5252"
            size={20}
            onPress={() => deleteComment(comment.id)}
            style={styles.deleteButton}
          />
        </View>
        <Text style={styles.commentDescription} numberOfLines={2}>
          {comment.description}
        </Text>
        <View style={styles.commentFooter}>
          <Chip style={styles.sectorChip}>{comment.sector}</Chip>
          <Text style={styles.commentDate}>{comment.date}</Text>
        </View>
      </Card.Content>
    </Card>
  );
  
  // Rendeiza un servicio
  const renderService = (service) => (
    <TouchableOpacity 
      key={service.id} 
      style={styles.serviceItem}
      onPress={() => {
        if (service.name === 'Editar Perfil') {
          navigation.navigate('CreateProfile');
        }
      }}
    >
      <Ionicons name={service.icon} size={24} color="#444" />
      <Text style={styles.serviceText}>{service.name}</Text>
    </TouchableOpacity>
  );
  
  // Renderiza un grupo expandible
  const renderGroup = (group) => (
    <View key={group.id} style={styles.groupContainer}>
      <TouchableOpacity style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        <Ionicons 
          name={group.expanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
          size={20} 
          color="#555" 
        />
      </TouchableOpacity>
      
      {group.expanded && (
        <View style={styles.groupItems}>
          {group.items.map(item => renderGroupItem(item))}
        </View>
      )}
    </View>
  );
  
  // Renderiza un elemento de un grupo
  const renderGroupItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.groupItem}>
      <View style={styles.groupItemLeft}>
        <Ionicons name={item.icon} size={20} color="#444" />
        <Text style={styles.groupItemText}>{item.name}</Text>
      </View>
      <Badge style={styles.groupItemBadge}>{item.count}</Badge>
    </TouchableOpacity>
  );
  
  // Renderizar la información del perfil
  const renderProfileInfo = () => {
    if (!userProfile) return null;
    
    return (
      <Card style={styles.profileCard}>
        <Card.Content>
          <Text style={styles.profileTitle}>Información de Perfil</Text>
          
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Datos Básicos</Text>
            <Text style={styles.profileField}>Nombre: {userProfile.basicInfo.fullName}</Text>
            <Text style={styles.profileField}>Usuario: {userProfile.basicInfo.username}</Text>
            <Text style={styles.profileField}>Email: {userProfile.basicInfo.email}</Text>
            <Text style={styles.profileField}>Perfil: {userProfile.profileType === 'individual' ? 'Individual' : 'Empresarial'}</Text>
          </View>
          
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Sectores de Interés</Text>
            <View style={styles.chipsContainer}>
              {userProfile.sectors.map(sector => (
                <Chip key={sector} style={styles.chip}>{sector}</Chip>
              ))}
            </View>
          </View>
          
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Experiencia Profesional</Text>
            <Text style={styles.profileField}>Rol: {userProfile.professionalDetails.role}</Text>
            <Text style={styles.profileField}>Años de experiencia: {userProfile.professionalDetails.experienceYears}</Text>
            {userProfile.professionalDetails.education && (
              <Text style={styles.profileField}>Educación: {userProfile.professionalDetails.education}</Text>
            )}
          </View>
          
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Ubicación</Text>
            <Text style={styles.profileField}>País: {userProfile.location.country}</Text>
            {userProfile.location.city && (
              <Text style={styles.profileField}>Ciudad: {userProfile.location.city}</Text>
            )}
            <Text style={styles.profileField}>
              Interés en expansión: {
                userProfile.location.expansionInterest === 'local' ? 'Local' :
                userProfile.location.expansionInterest === 'national' ? 'Nacional' : 'Global'
              }
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  // Renderizar un estudio de mercado individual
  const renderMarketStudy = (study) => {
    if (!study || !study.study) return null;

    const viabilityScore = study.study.viability?.score || 0;
    const marketSize = study.study.marketSize?.total?.toLocaleString() || 'No disponible';
    const location = study.study.optimalLocation?.city || 'No especificada';

    return (
      <Card key={study.id} style={styles.studyCard}>
        <Card.Content>
          <View style={styles.studyHeader}>
            <Text style={styles.studyTitle}>
              Estudio de Mercado - {new Date(study.date).toLocaleDateString()}
            </Text>
            <Chip mode="outlined" style={styles.scoreChip}>
              {viabilityScore}% viable
            </Chip>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.studyDetails}>
            <Text style={styles.detailText}>Tamaño de mercado: €{marketSize}</Text>
            <Text style={styles.detailText}>Ubicación óptima: {location}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="text" 
            onPress={() => {
              // Aquí puedes implementar la navegación al detalle del estudio
              navigation.navigate('MarketStudyDetail', { study: study.study });
            }}
          >
            Ver Detalles
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Mi Perfil" />
        <Appbar.Action
          icon="chart-bar"
          onPress={() => setShowMarketStudies(true)}
        />
      </Appbar.Header>
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile ? userProfile.basicInfo.fullName : DEFAULT_USER.name}</Text>
            <Text style={styles.userStatus}>{DEFAULT_USER.status}</Text>
          </View>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        </View>
        <TouchableOpacity onPress={showImageOptions} style={styles.avatarContainer}>
          <Avatar.Image 
            size={80} 
            source={{ uri: profileImage }} 
            style={styles.userAvatar}
          />
          <View style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Buscar</Text>
        </View>
        <IconButton icon="options-outline" size={24} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        ) : (
          <>
            {renderProfileInfo()}
            
            {/* Sección de Comentarios/Problemas del usuario */}
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Mis Comentarios y Observaciones</Text>
              {userComments.length > 0 ? (
                userComments.map(comment => renderUserComment(comment))
              ) : (
                <Text style={styles.noCommentsText}>
                  Aún no has publicado ningún comentario u observación.
                </Text>
              )}
            </View>
            
            <Text style={styles.sectionTitle}>Servicios</Text>
            <View style={styles.servicesContainer}>
              {SERVICES.map(renderService)}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.groupsSection}>
              {GROUPS.map(renderGroup)}
            </View>
            
            <View style={styles.addFriendsSection}>
              <Text style={styles.addFriendsTitle}>¿Listo para añadir colaboradores?</Text>
              <Text style={styles.addFriendsText}>
                Encuentra colaboradores mediante código QR o búsqueda.
              </Text>
              <Button 
                mode="outlined" 
                icon="person-add-outline" 
                style={styles.addFriendsButton}
                labelStyle={styles.addFriendsButtonLabel}
              >
                Añadir colaboradores
              </Button>
            </View>
            
            {/* Sección de Estudios de Mercado */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estudios de Mercado</Text>
              {marketStudies.length > 0 ? (
                marketStudies.map(renderMarketStudy)
              ) : (
                <Text style={styles.emptyText}>
                  No tienes estudios de mercado generados
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="home-outline" size={26} color="#555" />
          <Text style={styles.bottomNavText}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem} 
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <View style={styles.badgeContainer}>
            <Ionicons name="chatbubble-outline" size={26} color="#555" />
            <Badge style={styles.badge}>2</Badge>
          </View>
          <Text style={styles.bottomNavText}>Chats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="call-outline" size={26} color="#555" />
          <Text style={styles.bottomNavText}>Llamadas</Text>
        </TouchableOpacity>
      </View>
      
      {/* Diálogo de Estudios de Mercado */}
      <Portal>
        <Dialog
          visible={showMarketStudies}
          onDismiss={() => setShowMarketStudies(false)}
          style={styles.studyDialog}
        >
          <Dialog.Title>Estudios de Mercado</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView>
              {marketStudies.map(renderMarketStudy)}
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  servicesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  serviceText: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  groupsSection: {
    marginTop: 8,
  },
  groupContainer: {
    marginBottom: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  groupItems: {
    paddingHorizontal: 16,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItemText: {
    fontSize: 14,
  },
  groupItemBadge: {
    backgroundColor: '#4CAF50',
    size: 16,
  },
  addFriendsSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  addFriendsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addFriendsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  addFriendsButton: {
    width: '100%',
    borderColor: '#2196F3',
  },
  addFriendsButtonLabel: {
    color: '#2196F3',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  bottomNavItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#F44336',
    size: 16,
  },
  bottomNavText: {
    fontSize: 12,
    marginTop: 2,
  },
  profileCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 10,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileSection: {
    marginBottom: 16,
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  profileField: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    margin: 4,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
  avatarContainer: {
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  commentsSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentDescription: {
    fontSize: 14,
    color: '#555',
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectorChip: {
    height: 30,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  studyCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  studyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreChip: {
    marginLeft: 8,
  },
  studyDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  studyDialog: {
    maxHeight: '90%'
  },
  dialogScrollArea: {
    maxHeight: '80%'
  }
}); 