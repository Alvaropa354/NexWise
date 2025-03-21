import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar las notificaciones en AsyncStorage
const NOTIFICATIONS_STORAGE_KEY = 'user_notifications';

/**
 * Recupera todas las notificaciones almacenadas
 * @returns {Promise<Array>} Array de notificaciones
 */
export const getNotifications = async () => {
  try {
    const notificationsData = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return notificationsData ? JSON.parse(notificationsData) : [];
  } catch (error) {
    console.error('Error al recuperar notificaciones:', error);
    return [];
  }
};

/**
 * Guarda un array de notificaciones
 * @param {Array} notifications - Lista de notificaciones
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const saveNotifications = async (notifications) => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    return true;
  } catch (error) {
    console.error('Error al guardar notificaciones:', error);
    return false;
  }
};

/**
 * Añade una nueva notificación
 * @param {Object} notification - Objeto de notificación
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const addNotification = async (notification) => {
  try {
    // Asegura que la notificación tiene un ID y marca temporal
    const newNotification = {
      ...notification,
      id: notification.id || `notification_${Date.now()}`,
      createdAt: notification.createdAt || new Date().toISOString(),
      read: false
    };
    
    // Recupera las notificaciones existentes
    const currentNotifications = await getNotifications();
    
    // Añade la nueva notificación al inicio
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    // Guarda las notificaciones actualizadas
    return await saveNotifications(updatedNotifications);
  } catch (error) {
    console.error('Error al añadir notificación:', error);
    return false;
  }
};

/**
 * Marca una notificación como leída
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    return await saveNotifications(updatedNotifications);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return false;
  }
};

/**
 * Marca todas las notificaciones como leídas
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    return await saveNotifications(updatedNotifications);
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return false;
  }
};

/**
 * Elimina una notificación
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const deleteNotification = async (notificationId) => {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    return await saveNotifications(updatedNotifications);
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return false;
  }
};

/**
 * Elimina todas las notificaciones
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const clearAllNotifications = async () => {
  try {
    return await saveNotifications([]);
  } catch (error) {
    console.error('Error al eliminar todas las notificaciones:', error);
    return false;
  }
};

/**
 * Verifica si un problema coincide con los intereses del usuario
 * @param {Object} problem - Información del problema
 * @param {Object} userProfile - Perfil del usuario con intereses
 * @returns {boolean} True si hay coincidencia
 */
export const checkInterestMatch = (problem, userProfile) => {
  // Si no hay perfil o intereses, no hay coincidencia
  if (!userProfile || !userProfile.sectors || userProfile.sectors.length === 0) {
    return false;
  }
  
  // Comprueba si el sector del problema coincide con algún sector de interés del usuario
  const sectorMatch = userProfile.sectors.includes(problem.sector);
  
  // Si hay subcategorías en el problema y en el perfil, también las comprobamos
  let subcategoryMatch = false;
  if (problem.subcategory && userProfile.subcategories && userProfile.subcategories[problem.sector]) {
    subcategoryMatch = userProfile.subcategories[problem.sector].includes(problem.subcategory);
  }
  
  // Hay coincidencia si hay match en sector o subcategoría
  return sectorMatch || subcategoryMatch;
};

/**
 * Genera notificaciones para usuarios cuyos intereses coinciden con un problema
 * @param {Object} problem - El problema/comentario creado
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const generateNotificationsForProblem = async (problem) => {
  try {
    // En un entorno real, buscaríamos en una base de datos todos los usuarios
    // cuyos intereses coinciden con este problema. En esta implementación demo,
    // solo comprobamos el usuario actual.
    
    // Obtener perfil del usuario actual
    const userProfileData = await AsyncStorage.getItem('userProfile');
    
    if (!userProfileData) {
      return false;
    }
    
    const userProfile = JSON.parse(userProfileData);
    
    // Verificar si el problema coincide con los intereses del usuario
    const isMatch = checkInterestMatch(problem, userProfile);
    
    if (isMatch) {
      // Crear notificación
      const notification = {
        id: `notification_${Date.now()}`,
        title: 'Nuevo problema de interés',
        message: `Un nuevo problema de ${problem.sector} ha sido publicado: "${problem.title}"`,
        type: 'interest_match',
        problemId: problem.id,
        sector: problem.sector,
        subcategory: problem.subcategory,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Guardar la notificación
      await addNotification(notification);
    }
    
    return true;
  } catch (error) {
    console.error('Error al generar notificaciones:', error);
    return false;
  }
};

/**
 * Obtiene el número de notificaciones no leídas
 * @returns {Promise<number>} Número de notificaciones no leídas
 */
export const getUnreadCount = async () => {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.read).length;
  } catch (error) {
    console.error('Error al contar notificaciones no leídas:', error);
    return 0;
  }
}; 