import { Slot, usePathname, router } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthenticatedLayout() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  
  // Determina el título según la ruta actual
  function getTitle() {
    if (pathname === '/(authenticated)/dashboard') return 'Dashboard';
    if (pathname === '/(authenticated)/profile') return 'Mi Perfil';
    if (pathname.startsWith('/(authenticated)/problem/new')) return 'Nuevo Problema';
    if (pathname.startsWith('/(authenticated)/problem/')) return 'Detalles del Problema';
    if (pathname === '/(authenticated)/problem') return 'Problemas';
    return 'Nexwise';
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title={getTitle()} />
        <Appbar.Action icon="account" onPress={() => router.push('/(authenticated)/profile')} />
        <Appbar.Action icon="logout" onPress={signOut} />
      </Appbar.Header>
      <Slot />
    </SafeAreaView>
  );
} 