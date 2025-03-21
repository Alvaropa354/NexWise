import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Cuenta</List.Subheader>
        <List.Item
          title="Editar Perfil"
          description="Modificar información personal"
          left={props => <List.Icon {...props} icon="account-edit" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/profile/edit')}
        />
        <Divider />
        <List.Item
          title="Seguridad"
          description="Configuración de seguridad y 2FA"
          left={props => <List.Icon {...props} icon="shield-lock" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/settings/security')}
        />
        <Divider />
        <List.Item
          title="Cambiar Contraseña"
          description="Actualizar contraseña de acceso"
          left={props => <List.Icon {...props} icon="lock-reset" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/profile/password')}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Privacidad</List.Subheader>
        <List.Item
          title="Política de Privacidad"
          description="Leer política de privacidad"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/privacy')}
        />
        <Divider />
        <List.Item
          title="Términos de Servicio"
          description="Leer términos de servicio"
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/terms')}
        />
      </List.Section>

      <List.Section>
        <List.Item
          title="Cerrar Sesión"
          description="Salir de la aplicación"
          left={props => <List.Icon {...props} icon="logout" />}
          onPress={signOut}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 