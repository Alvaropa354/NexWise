import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, Portal, Dialog, List } from 'react-native-paper';
import { recommendationsService, UserProfile } from '../../services/recommendations';

interface UserProfileProps {
  userId: string;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showSkillDialog, setShowSkillDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await recommendationsService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      await recommendationsService.updateUserProfile(userId, profile);
      setIsEditing(false);
    } catch (err) {
      setError('Error al guardar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (newInterest && profile) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest]
      });
      setNewInterest('');
      setShowInterestDialog(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    if (profile) {
      setProfile({
        ...profile,
        interests: profile.interests.filter(i => i !== interest)
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill && profile) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill]
      });
      setNewSkill('');
      setShowSkillDialog(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(s => s !== skill)
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Button
          mode={isEditing ? 'contained' : 'outlined'}
          onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          loading={loading}
        >
          {isEditing ? 'Guardar' : 'Editar'}
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de Experiencia</Text>
        <TextInput
          label="Nivel de Experiencia"
          value={profile.experienceLevel}
          onChangeText={(text) => isEditing && setProfile({ ...profile, experienceLevel: text })}
          disabled={!isEditing}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Intereses</Text>
          {isEditing && (
            <Button onPress={() => setShowInterestDialog(true)}>
              Agregar Interés
            </Button>
          )}
        </View>
        <View style={styles.chipContainer}>
          {profile.interests.map((interest) => (
            <Chip
              key={interest}
              onClose={isEditing ? () => handleRemoveInterest(interest) : undefined}
              style={styles.chip}
            >
              {interest}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          {isEditing && (
            <Button onPress={() => setShowSkillDialog(true)}>
              Agregar Habilidad
            </Button>
          )}
        </View>
        <View style={styles.chipContainer}>
          {profile.skills.map((skill) => (
            <Chip
              key={skill}
              onClose={isEditing ? () => handleRemoveSkill(skill) : undefined}
              style={styles.chip}
            >
              {skill}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sectores Preferidos</Text>
        <View style={styles.chipContainer}>
          {profile.preferredSectors.map((sector) => (
            <Chip
              key={sector}
              onClose={isEditing ? () => {
                setProfile({
                  ...profile,
                  preferredSectors: profile.preferredSectors.filter(s => s !== sector)
                });
              } : undefined}
              style={styles.chip}
            >
              {sector}
            </Chip>
          ))}
        </View>
      </View>

      <Portal>
        <Dialog visible={showInterestDialog} onDismiss={() => setShowInterestDialog(false)}>
          <Dialog.Title>Agregar Interés</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nuevo Interés"
              value={newInterest}
              onChangeText={setNewInterest}
              style={styles.input}
            />
            <Button onPress={handleAddInterest}>Agregar</Button>
          </Dialog.Content>
        </Dialog>

        <Dialog visible={showSkillDialog} onDismiss={() => setShowSkillDialog(false)}>
          <Dialog.Title>Agregar Habilidad</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nueva Habilidad"
              value={newSkill}
              onChangeText={setNewSkill}
              style={styles.input}
            />
            <Button onPress={handleAddSkill}>Agregar</Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 