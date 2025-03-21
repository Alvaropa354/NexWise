import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Badge, IconButton, Divider, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  clearAllNotifications
} from './services/notifications';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Cargar notificaciones al inicio y cuando se actualiza la pantalla
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Función para cargar notificaciones
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar notificaciones (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };
  
  // Marcar notificación como leída
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };
  
  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  };
  
  // Eliminar notificación
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };
  
  // Eliminar todas las notificaciones
  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Error al eliminar todas las notificaciones:', error);
    }
  };
  
  // Navegar al problema relacionado con la notificación
  const navigateToProblem = (problemId) => {
    // Aquí navegaríamos a la pantalla de detalle del problema
    // navigation.navigate('ProblemDetails', { problemId });
    console.log(`Navegando al problema ${problemId}`);
  };
  
  // Renderizar una notificación individual
  const renderNotificationItem = ({ item }) => {
    const isUnread = !item.read;
    
    return (
      <Card 
        style={[
          styles.notificationCard, 
          isUnread && styles.unreadNotificationCard
        ]}
        onPress={() => {
          handleMarkAsRead(item.id);
          if (item.problemId) {
            navigateToProblem(item.problemId);
          }
        }}
      >
        <Card.Content>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, isUnread && styles.unreadText]}>
              {item.title}
            </Text>
            <View style={styles.notificationActions}>
              {isUnread && <Badge size={8} style={styles.unreadBadge} />}
              <IconButton 
                icon="delete" 
                size={18} 
                onPress={() => handleDeleteNotification(item.id)} 
                style={styles.deleteButton}
              />
            </View>
          </View>
          
          <Text style={styles.notificationMessage}>{item.message}</Text>
          
          <View style={styles.notificationFooter}>
            <Chip 
              style={styles.sectorChip}
              textStyle={styles.chipText}
            >
              {item.sector}
            </Chip>
            
            <Text style={styles.notificationDate}>
              {new Date(item.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notificaciones" />
      </Appbar.Header>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando notificaciones...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
          <Button 
            mode="outlined" 
            style={styles.refreshButton}
            onPress={loadNotifications}
          >
            Actualizar
          </Button>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  refreshButton: {
    marginTop: 16,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  unreadNotificationCard: {
    backgroundColor: '#e8f4fd',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#2196F3',
    marginRight: 8,
  },
  deleteButton: {
    margin: 0,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectorChip: {
    height: 28,
  },
  chipText: {
    fontSize: 12,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
}); 