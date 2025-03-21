import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import {
  Text,
  Appbar,
  Avatar,
  Surface,
  Divider,
  IconButton,
  Button,
  Badge,
  Card
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Datos de ejemplo para contactos
const MOCK_CONTACTS = [
  {
    id: '1',
    name: 'Elena García',
    lastMessage: 'Me interesa colaborar en tu proyecto',
    time: '10:30',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    unread: 2,
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    lastMessage: '¿Podemos hablar sobre la idea de sostenibilidad?',
    time: 'Ayer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    unread: 0,
  },
  {
    id: '3',
    name: 'Sofía Martínez',
    lastMessage: 'Gracias por la información',
    time: 'Lun',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    unread: 0,
  },
  {
    id: '4',
    name: 'Miguel Ángel Ruiz',
    lastMessage: 'Revisaré la propuesta y te contacto',
    time: '28/02',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    unread: 0,
  },
  {
    id: '5',
    name: 'Laura Fernández',
    lastMessage: '¿Te parece si nos reunimos virtualmente?',
    time: '25/02',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    unread: 0,
  },
];

// Datos de ejemplo para mensajes de una conversación
const MOCK_CONVERSATION = {
  contactId: '1',
  contactName: 'Elena García',
  contactAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  messages: [
    {
      id: 'm1',
      text: 'Hola, vi tu proyecto sobre la escasez de agua potable',
      sender: 'them',
      timestamp: '10:22',
    },
    {
      id: 'm2',
      text: 'Me parece muy interesante, especialmente la propuesta de filtros sostenibles',
      sender: 'them',
      timestamp: '10:23',
    },
    {
      id: 'm3',
      text: 'Hola Elena, gracias por tu interés',
      sender: 'me',
      timestamp: '10:25',
    },
    {
      id: 'm4',
      text: 'Estamos buscando colaboradores con experiencia en proyectos hídricos',
      sender: 'me',
      timestamp: '10:25',
    },
    {
      id: 'm5',
      text: 'Me interesa colaborar en tu proyecto. Tengo experiencia en implementación de sistemas de filtración en comunidades rurales',
      sender: 'them',
      timestamp: '10:30',
    },
  ],
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // Cargar el perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          setUserProfile(JSON.parse(profileData));
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    
    loadProfile();
  }, []);
  
  // Función para cargar la conversación con un contacto
  const loadConversation = (contactId) => {
    // En una app real, aquí harías una llamada a la API o base de datos
    // Para este ejemplo, solo cargamos la conversación de muestra
    setConversation(MOCK_CONVERSATION);
    
    // Marcar mensajes como leídos
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, unread: 0 } 
          : contact
      )
    );
  };
  
  // Función para seleccionar un contacto y cargar su conversación
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    loadConversation(contact.id);
  };
  
  // Función para enviar un mensaje
  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;
    
    // Crear nuevo mensaje
    const newMessageObj = {
      id: `m${Date.now()}`,
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Actualizar la conversación
    setConversation(prevConversation => ({
      ...prevConversation,
      messages: [...prevConversation.messages, newMessageObj],
    }));
    
    // Actualizar el último mensaje en la lista de contactos
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === selectedContact.id 
          ? { 
              ...contact, 
              lastMessage: newMessage,
              time: 'Ahora',
            } 
          : contact
      )
    );
    
    // Limpiar el campo de entrada
    setNewMessage('');
  };
  
  // Renderizar un contacto
  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.contactAvatar}>
        <Avatar.Image size={50} source={{ uri: item.avatar }} />
        {item.unread > 0 && (
          <Badge style={styles.contactBadge}>{item.unread}</Badge>
        )}
      </View>
      
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactTime}>{item.time}</Text>
        </View>
        <Text 
          style={styles.contactMessage}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  // Renderizar un mensaje
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <Surface style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
      </Surface>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={selectedContact ? selectedContact.name : "Chats"} />
        {selectedContact && (
          <>
            <Appbar.Action icon="phone" onPress={() => {}} />
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
          </>
        )}
      </Appbar.Header>
      
      {!selectedContact ? (
        // Lista de contactos
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Divider />}
          style={styles.contactsList}
        />
      ) : (
        // Vista de conversación
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          <FlatList
            data={conversation?.messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            inverted={false}
            contentContainerStyle={styles.messagesContent}
          />
          
          <View style={styles.inputContainer}>
            <IconButton 
              icon="paperclip" 
              size={24} 
              onPress={() => {}}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <IconButton 
              icon="send" 
              size={24} 
              onPress={handleSendMessage}
              style={styles.sendButton}
              disabled={!newMessage.trim()}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contactAvatar: {
    marginRight: 12,
    position: 'relative',
  },
  contactBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0088ff',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactTime: {
    fontSize: 12,
    color: '#666',
  },
  contactMessage: {
    fontSize: 14,
    color: '#666',
  },
  
  // Estilos para la vista de conversación
  chatContainer: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputIcon: {
    margin: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
    backgroundColor: '#0088ff',
    borderRadius: 50,
  },
}); 