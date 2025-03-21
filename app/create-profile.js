import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { 
  Text, TextInput, Button, Surface, Appbar, ProgressBar, 
  RadioButton, Chip, Divider, Card, List, Menu, Switch, 
  HelperText, IconButton, Avatar, useTheme, Snackbar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

// Datos de sectores y subcategorías
const SECTORS_DATA = {
  'Tecnología': [
    'Inteligencia Artificial',
    'Desarrollo de Software',
    'Ciberseguridad',
    'Cloud Computing',
    'Blockchain',
    'IoT',
    'Realidad Virtual/Aumentada',
    'Análisis de Datos',
    'Telecomunicaciones'
  ],
  'Salud y Bienestar': [
    'Telemedicina',
    'Dispositivos Médicos',
    'Biotecnología',
    'Salud Mental',
    'Nutrición',
    'Fitness',
    'Salud Digital',
    'Investigación Clínica',
    'Asistencia a Personas Mayores'
  ],
  'Sostenibilidad': [
    'Energías Renovables',
    'Economía Circular',
    'Gestión de Residuos',
    'Agricultura Sostenible',
    'Conservación de Ecosistemas',
    'Movilidad Sostenible',
    'Construcción Ecológica',
    'Gestión del Agua',
    'Reducción de Carbono'
  ],
  'Educación': [
    'E-learning',
    'Educación Primaria/Secundaria',
    'Educación Superior',
    'Formación Profesional',
    'Educación Corporativa',
    'Metodologías Innovadoras',
    'EdTech',
    'Accesibilidad Educativa',
    'Educación Continua'
  ],
  'Turismo y Hospitalidad': [
    'Turismo Sostenible',
    'Experiencias Digitales',
    'Gastronomía',
    'Alojamiento',
    'Transporte Turístico',
    'Turismo Cultural',
    'Eventos y Conferencias',
    'Turismo de Aventura',
    'Gestión Hotelera'
  ],
  'Innovación': [
    'Desarrollo de Productos',
    'Innovación Abierta',
    'Innovación Social',
    'Emprendimiento',
    'I+D',
    'Transformación Digital',
    'Ecosistemas de Startups',
    'Propiedad Intelectual',
    'Disrupciones de Mercado'
  ],
  'Servicios': [
    'Consultoría',
    'Servicios Financieros',
    'Marketing y Publicidad',
    'Logística y Transporte',
    'Comercio Electrónico',
    'Recursos Humanos',
    'Servicios Legales',
    'Retail',
    'Servicios TI'
  ],
  'Otros': ['Especificar']
};

// Opciones para roles profesionales
const PROFESSIONAL_ROLES = [
  'Emprendedor',
  'Inversor',
  'Consultor',
  'Especialista Técnico',
  'Académico',
  'Ejecutivo/Directivo',
  'Investigador',
  'Diseñador',
  'Desarrollador',
  'Marketing/Ventas',
  'Otro'
];

// Lista de países
const COUNTRIES = [
  'España', 'Estados Unidos', 'México', 'Colombia', 'Argentina', 
  'Chile', 'Perú', 'Brasil', 'Reino Unido', 'Francia', 
  'Alemania', 'Italia', 'China', 'Japón', 'India', 
  'Australia', 'Canadá', 'Sudáfrica', 'Emiratos Árabes Unidos', 'Singapur'
];

// Rangos de presupuesto
const BUDGET_RANGES = [
  'Menos de €10.000',
  '€10.000 - €50.000',
  '€50.000 - €100.000',
  '€100.000 - €500.000',
  '€500.000 - €1.000.000',
  'Más de €1.000.000',
  'Prefiero no especificar'
];

// Áreas de soporte
const SUPPORT_AREAS = [
  'Asesoría Técnica',
  'Asesoría Financiera',
  'Asesoría Estratégica',
  'Conexión con Expertos',
  'Acceso a Capital',
  'Marketing y Ventas',
  'Operaciones y Logística',
  'Legal y Regulatorio',
  'Recursos Humanos',
  'Internacionalización'
];

export default function CreateProfile() {
  const navigation = useNavigation();
  const theme = useTheme();
  const scrollViewRef = useRef(null);
  
  // Estado para el formulario completo
  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: '',
      username: '',
      email: '',
      isPublic: true
    },
    profileType: 'individual',
    companySize: '',
    sectors: [],
    subcategories: {},
    professionalDetails: {
      role: '',
      experienceYears: '',
      education: ''
    },
    location: {
      country: '',
      city: '',
      expansionInterest: 'local'
    },
    resources: {
      budget: '',
      description: '',
      supportAreas: []
    },
    differentiators: {
      uniqueSkills: '',
      expectations: []
    },
    privacy: {
      showSensitiveInfo: false,
      anonymousPosting: false
    },
    password: '',
    confirmPassword: '',
    bio: '',
    interests: '',
    expertise: '',
  });
  
  // Estado para los menús desplegables
  const [menuVisibility, setMenuVisibility] = useState({
    country: false,
    role: false,
    budget: false
  });
  
  // Estado para el progreso del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0.17); // 1/6 inicial
  
  // Estado para manejar la carga y mensajes
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(null);
  
  // Efectos para actualizar el progreso
  useEffect(() => {
    const calculateProgress = () => {
      return Math.min(1, currentStep / 6);
    };
    
    setProgress(calculateProgress());
  }, [currentStep]);
  
  // Funciones auxiliares para el manejo del formulario
  const updateBasicInfo = (field, value) => {
    setFormData({
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        [field]: value
      }
    });
  };
  
  const addRemoveSector = (sector) => {
    const sectorsCopy = [...formData.sectors];
    
    if (sectorsCopy.includes(sector)) {
      // Si ya está seleccionado, lo quitamos
      const updatedSectors = sectorsCopy.filter(s => s !== sector);
      
      // También eliminamos sus subcategorías
      const updatedSubcategories = {...formData.subcategories};
      delete updatedSubcategories[sector];
      
      setFormData({
        ...formData,
        sectors: updatedSectors,
        subcategories: updatedSubcategories
      });
    } else {
      // Si no está y hay menos de 3 sectores, lo añadimos
      if (sectorsCopy.length < 3) {
        setFormData({
          ...formData,
          sectors: [...sectorsCopy, sector],
          subcategories: {
            ...formData.subcategories,
            [sector]: []
          }
        });
      }
    }
  };
  
  const addRemoveSubcategory = (sector, subcategory) => {
    const sectorSubcategories = formData.subcategories[sector] || [];
    
    if (sectorSubcategories.includes(subcategory)) {
      // Si ya está seleccionada, la quitamos
      const updatedSubcategories = sectorSubcategories.filter(s => s !== subcategory);
      
      setFormData({
        ...formData,
        subcategories: {
          ...formData.subcategories,
          [sector]: updatedSubcategories
        }
      });
    } else {
      // Si no está y hay menos de 2 subcategorías, la añadimos
      if (sectorSubcategories.length < 2) {
        setFormData({
          ...formData,
          subcategories: {
            ...formData.subcategories,
            [sector]: [...sectorSubcategories, subcategory]
          }
        });
      }
    }
  };
  
  const toggleSupportArea = (area) => {
    const areas = [...formData.resources.supportAreas];
    
    if (areas.includes(area)) {
      setFormData({
        ...formData,
        resources: {
          ...formData.resources,
          supportAreas: areas.filter(a => a !== area)
        }
      });
    } else {
      setFormData({
        ...formData,
        resources: {
          ...formData.resources,
          supportAreas: [...areas, area]
        }
      });
    }
  };
  
  const toggleExpectation = (expectation) => {
    const expectations = [...formData.differentiators.expectations];
    
    if (expectations.includes(expectation)) {
      setFormData({
        ...formData,
        differentiators: {
          ...formData.differentiators,
          expectations: expectations.filter(e => e !== expectation)
        }
      });
    } else {
      setFormData({
        ...formData,
        differentiators: {
          ...formData.differentiators,
          expectations: [...expectations, expectation]
        }
      });
    }
  };
  
  // Función para continuar al siguiente paso
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };
  
  // Función para volver al paso anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };
  
  // Función para enviar el formulario completo
  const handleSubmit = async () => {
    // Activar estado de carga
    setIsLoading(true);
    
    try {
      // Almacenar los datos del perfil en AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(formData));
      
      // Desactivar carga y mostrar mensaje de éxito
      setIsLoading(false);
      setSnackbarMessage('¡Perfil creado con éxito!');
      setSnackbarVisible(true);
      
      // Navegar a la pantalla de perfil después de un breve retraso
      setTimeout(() => {
        navigation.navigate('Profile', { 
          profileCreated: true,
          profileData: formData
        });
      }, 1500);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      setIsLoading(false);
      setSnackbarMessage('Error al guardar el perfil. Inténtalo de nuevo.');
      setSnackbarVisible(true);
    }
  };
  
  // Validación para cada paso
  const validateStep = () => {
    switch(currentStep) {
      case 1: // Información básica
        return formData.basicInfo.fullName && 
               formData.basicInfo.username && 
               formData.basicInfo.email;
        
      case 2: // Tipo de perfil y sectores
        return formData.sectors.length > 0;
        
      case 3: // Detalles profesionales
        return formData.professionalDetails.role && 
               formData.professionalDetails.experienceYears;
        
      case 4: // Ubicación
        return formData.location.country;
        
      case 5: // Recursos
        return true; // Opcional
        
      case 6: // Diferenciadores y privacidad
        return formData.differentiators.uniqueSkills && 
               formData.differentiators.expectations.length > 0;
        
      default:
        return true;
    }
  };
  
  // Calcular la completitud del perfil
  const calculateCompleteness = () => {
    let completed = 0;
    let total = 6; // Número total de secciones
    
    // Verificar cada sección
    if (formData.basicInfo.fullName && 
        formData.basicInfo.username && 
        formData.basicInfo.email) {
      completed++;
    }
    
    if (formData.sectors.length > 0) {
      completed++;
    }
    
    if (formData.professionalDetails.role && 
        formData.professionalDetails.experienceYears) {
      completed++;
    }
    
    if (formData.location.country) {
      completed++;
    }
    
    if (formData.resources.budget || 
        formData.resources.description || 
        formData.resources.supportAreas.length > 0) {
      completed++;
    }
    
    if (formData.differentiators.uniqueSkills && 
        formData.differentiators.expectations.length > 0) {
      completed++;
    }
    
    return Math.round((completed / total) * 100);
  };
  
  // Renderizado condicional de los pasos del formulario
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Información Básica" />
              <Card.Content>
                <TextInput
                  label="Nombre completo"
                  value={formData.basicInfo.fullName}
                  onChangeText={(text) => updateBasicInfo('fullName', text)}
                  style={styles.input}
                  mode="outlined"
                />
                
                <TextInput
                  label="Nombre de usuario público"
                  value={formData.basicInfo.username}
                  onChangeText={(text) => updateBasicInfo('username', text)}
                  style={styles.input}
                  mode="outlined"
                />
                
                <TextInput
                  label="Correo electrónico"
                  value={formData.basicInfo.email}
                  onChangeText={(text) => updateBasicInfo('email', text)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                <View style={styles.switchContainer}>
                  <Text>Mostrar perfil público</Text>
                  <Switch
                    value={formData.basicInfo.isPublic}
                    onValueChange={(value) => updateBasicInfo('isPublic', value)}
                  />
                </View>
                
                <HelperText type="info">
                  Tu información pública será visible para otros usuarios de Nexwise.
                </HelperText>
              </Card.Content>
            </Card>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Tipo de Perfil" />
              <Card.Content>
                <RadioButton.Group
                  onValueChange={(value) => setFormData({...formData, profileType: value})}
                  value={formData.profileType}
                >
                  <RadioButton.Item label="Individual (Emprendedor, Profesional, Estudiante)" value="individual" />
                  <RadioButton.Item label="Empresarial" value="business" />
                </RadioButton.Group>
                
                {formData.profileType === 'business' && (
                  <View style={styles.companySizeContainer}>
                    <Text style={styles.label}>Tamaño de empresa:</Text>
                    <RadioButton.Group
                      onValueChange={(value) => setFormData({...formData, companySize: value})}
                      value={formData.companySize}
                    >
                      <RadioButton.Item label="Pequeña (1-50 empleados)" value="small" />
                      <RadioButton.Item label="Mediana (51-250 empleados)" value="medium" />
                      <RadioButton.Item label="Gran corporación (250+ empleados)" value="large" />
                    </RadioButton.Group>
                  </View>
                )}
              </Card.Content>
            </Card>
            
            <Card style={[styles.card, {marginTop: 16}]}>
              <Card.Title title="Sectores de Interés" subtitle="Selecciona hasta 3 sectores" />
              <Card.Content>
                <ScrollView style={styles.sectorsContainer}>
                  {Object.keys(SECTORS_DATA).map((sector) => (
                    <View key={sector}>
                      <TouchableOpacity 
                        style={[
                          styles.sectorItem,
                          formData.sectors.includes(sector) && styles.selectedSectorItem
                        ]}
                        onPress={() => addRemoveSector(sector)}
                      >
                        <Text style={[
                          styles.sectorText,
                          formData.sectors.includes(sector) && styles.selectedSectorText
                        ]}>
                          {sector}
                        </Text>
                        {formData.sectors.includes(sector) && (
                          <IconButton
                            icon="check"
                            size={20}
                            color={theme.colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                      
                      {formData.sectors.includes(sector) && (
                        <View style={styles.subcategoriesContainer}>
                          <Text style={styles.subtitleText}>
                            Selecciona hasta 2 subcategorías de {sector}:
                          </Text>
                          <View style={styles.chipsContainer}>
                            {SECTORS_DATA[sector].map((subcategory) => (
                              <Chip
                                key={subcategory}
                                selected={(formData.subcategories[sector] || []).includes(subcategory)}
                                onPress={() => addRemoveSubcategory(sector, subcategory)}
                                style={styles.chip}
                                mode="outlined"
                              >
                                {subcategory}
                              </Chip>
                            ))}
                          </View>
                        </View>
                      )}
                      
                      <Divider style={styles.divider} />
                    </View>
                  ))}
                </ScrollView>
              </Card.Content>
            </Card>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Detalles Profesionales" />
              <Card.Content>
                <Text style={styles.label}>Rol profesional:</Text>
                <Menu
                  visible={menuVisibility.role}
                  onDismiss={() => setMenuVisibility({...menuVisibility, role: false})}
                  anchor={
                    <Button 
                      mode="outlined" 
                      onPress={() => setMenuVisibility({...menuVisibility, role: true})}
                      style={styles.dropdownButton}
                    >
                      {formData.professionalDetails.role || 'Seleccionar rol'}
                    </Button>
                  }
                  style={styles.menu}
                >
                  {PROFESSIONAL_ROLES.map((role) => (
                    <Menu.Item
                      key={role}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          professionalDetails: {
                            ...formData.professionalDetails,
                            role
                          }
                        });
                        setMenuVisibility({...menuVisibility, role: false});
                      }}
                      title={role}
                    />
                  ))}
                </Menu>
                
                <TextInput
                  label="Años de experiencia laboral o empresarial"
                  value={formData.professionalDetails.experienceYears}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    professionalDetails: {
                      ...formData.professionalDetails,
                      experienceYears: text
                    }
                  })}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                />
                
                <TextInput
                  label="Educación y formación relevante (opcional)"
                  value={formData.professionalDetails.education}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    professionalDetails: {
                      ...formData.professionalDetails,
                      education: text
                    }
                  })}
                  style={styles.textArea}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                />
              </Card.Content>
            </Card>
          </View>
        );
        
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Ubicación y Preferencias de Mercado" />
              <Card.Content>
                <Text style={styles.label}>País de operación principal:</Text>
                <Menu
                  visible={menuVisibility.country}
                  onDismiss={() => setMenuVisibility({...menuVisibility, country: false})}
                  anchor={
                    <Button 
                      mode="outlined" 
                      onPress={() => setMenuVisibility({...menuVisibility, country: true})}
                      style={styles.dropdownButton}
                    >
                      {formData.location.country || 'Seleccionar país'}
                    </Button>
                  }
                  style={styles.menu}
                >
                  <ScrollView style={{maxHeight: 300}}>
                    {COUNTRIES.map((country) => (
                      <Menu.Item
                        key={country}
                        onPress={() => {
                          setFormData({
                            ...formData,
                            location: {
                              ...formData.location,
                              country
                            }
                          });
                          setMenuVisibility({...menuVisibility, country: false});
                        }}
                        title={country}
                      />
                    ))}
                  </ScrollView>
                </Menu>
                
                <TextInput
                  label="Ciudad"
                  value={formData.location.city}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      city: text
                    }
                  })}
                  style={styles.input}
                  mode="outlined"
                />
                
                <Text style={styles.label}>Interés en expansión:</Text>
                <RadioButton.Group
                  onValueChange={(value) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      expansionInterest: value
                    }
                  })}
                  value={formData.location.expansionInterest}
                >
                  <RadioButton.Item label="Local" value="local" />
                  <RadioButton.Item label="Nacional" value="national" />
                  <RadioButton.Item label="Global" value="global" />
                </RadioButton.Group>
              </Card.Content>
            </Card>
          </View>
        );
        
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Recursos y Capacidades" />
              <Card.Content>
                <Text style={styles.label}>Presupuesto aproximado para inversión/desarrollo:</Text>
                <Menu
                  visible={menuVisibility.budget}
                  onDismiss={() => setMenuVisibility({...menuVisibility, budget: false})}
                  anchor={
                    <Button 
                      mode="outlined" 
                      onPress={() => setMenuVisibility({...menuVisibility, budget: true})}
                      style={styles.dropdownButton}
                    >
                      {formData.resources.budget || 'Seleccionar rango'}
                    </Button>
                  }
                  style={styles.menu}
                >
                  {BUDGET_RANGES.map((range) => (
                    <Menu.Item
                      key={range}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          resources: {
                            ...formData.resources,
                            budget: range
                          }
                        });
                        setMenuVisibility({...menuVisibility, budget: false});
                      }}
                      title={range}
                    />
                  ))}
                </Menu>
                
                <TextInput
                  label="Recursos tecnológicos y humanos disponibles"
                  value={formData.resources.description}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    resources: {
                      ...formData.resources,
                      description: text
                    }
                  })}
                  style={styles.textArea}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  placeholder="Describe brevemente los recursos disponibles (equipo, tecnología, etc.)"
                />
                
                <Text style={styles.label}>Áreas en las que buscas soporte adicional:</Text>
                <View style={styles.chipsContainer}>
                  {SUPPORT_AREAS.map((area) => (
                    <Chip
                      key={area}
                      selected={formData.resources.supportAreas.includes(area)}
                      onPress={() => toggleSupportArea(area)}
                      style={styles.chip}
                      mode="outlined"
                    >
                      {area}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </View>
        );
        
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Card style={styles.card}>
              <Card.Title title="Diferenciadores y Objetivos" />
              <Card.Content>
                <TextInput
                  label="¿Qué te hace único?"
                  value={formData.differentiators.uniqueSkills}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    differentiators: {
                      ...formData.differentiators,
                      uniqueSkills: text
                    }
                  })}
                  style={styles.textArea}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  placeholder="Habilidades clave, ventajas competitivas, experiencia diferencial..."
                />
                
                <Text style={styles.label}>Expectativas principales al usar Nexwise:</Text>
                <View style={styles.chipsContainer}>
                  {[
                    'Buscar oportunidades',
                    'Identificar problemas estratégicos',
                    'Encontrar colaboraciones',
                    'Monetizar conocimientos',
                    'Acceder a financiación',
                    'Expandir mercado',
                    'Validar ideas',
                    'Aprender y desarrollar habilidades'
                  ].map((expectation) => (
                    <Chip
                      key={expectation}
                      selected={formData.differentiators.expectations.includes(expectation)}
                      onPress={() => toggleExpectation(expectation)}
                      style={styles.chip}
                      mode="outlined"
                    >
                      {expectation}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
            
            <Card style={[styles.card, {marginTop: 16}]}>
              <Card.Title title="Preferencias de Privacidad" />
              <Card.Content>
                <View style={styles.switchContainer}>
                  <View style={{flex: 1}}>
                    <Text>Mostrar información sensible públicamente</Text>
                    <Text style={styles.helperText}>
                      (nombre real, recursos económicos, datos de contacto)
                    </Text>
                  </View>
                  <Switch
                    value={formData.privacy.showSensitiveInfo}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      privacy: {
                        ...formData.privacy,
                        showSensitiveInfo: value
                      }
                    })}
                  />
                </View>
                
                <View style={styles.switchContainer}>
                  <View style={{flex: 1}}>
                    <Text>Permitir publicar problemas anónimamente</Text>
                  </View>
                  <Switch
                    value={formData.privacy.anonymousPosting}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      privacy: {
                        ...formData.privacy,
                        anonymousPosting: value
                      }
                    })}
                  />
                </View>
              </Card.Content>
            </Card>
            
            <Card style={[styles.card, {marginTop: 16}]}>
              <Card.Title title="Resumen del Perfil" />
              <Card.Content>
                <View style={styles.completionContainer}>
                  <Text style={styles.completionText}>
                    Perfil completado al {calculateCompleteness()}%
                  </Text>
                  <ProgressBar 
                    progress={calculateCompleteness() / 100} 
                    style={styles.completionBar}
                    color={theme.colors.primary}
                  />
                </View>
                
                <Text style={styles.summaryText}>
                  Tu perfil está casi listo para ser publicado. Revisa la información antes de finalizar.
                </Text>
                
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[styles.button, styles.submitButton]}
                  disabled={!validateStep() || isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Creando perfil...' : 'Crear Perfil'}
                </Button>
              </Card.Content>
            </Card>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Registrar usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.basicInfo.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.basicInfo.fullName,
            bio: formData.bio,
            interests: formData.interests,
            expertise: formData.expertise,
            location: formData.location.country,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      // Navegar al onboarding
      navigation.replace('Onboarding');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Crear Perfil" subtitle={`Paso ${currentStep} de 6`} />
        </Appbar.Header>
        
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} style={styles.progressBar} />
        </View>
        
        <ScrollView 
          ref={scrollViewRef} 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderStep()}
          
          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <Button mode="outlined" onPress={prevStep} style={styles.navigationButton}>
                Anterior
              </Button>
            )}
            
            {currentStep < 6 && (
              <Button 
                mode="contained" 
                onPress={nextStep} 
                style={styles.navigationButton}
                disabled={!validateStep()}
              >
                Siguiente
              </Button>
            )}
          </View>
        </ScrollView>
        
        {/* Snackbar para mensajes de éxito */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
          duration={4000}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  stepContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 16,
    height: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  navigationButton: {
    minWidth: 120,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
  },
  sectorsContainer: {
    maxHeight: 400,
  },
  sectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  selectedSectorItem: {
    backgroundColor: '#E8F5E9',
  },
  sectorText: {
    fontSize: 16,
  },
  selectedSectorText: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subcategoriesContainer: {
    marginLeft: 16,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  divider: {
    marginVertical: 8,
  },
  dropdownButton: {
    width: '100%',
    marginBottom: 16,
  },
  menu: {
    width: '80%',
  },
  companySizeContainer: {
    marginTop: 16,
  },
  completionContainer: {
    marginVertical: 16,
  },
  completionText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  completionBar: {
    height: 10,
    borderRadius: 5,
  },
  summaryText: {
    marginVertical: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 16,
  },
  button: {
    marginVertical: 8,
  },
}); 