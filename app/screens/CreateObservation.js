import { analyzeObservation } from '../services/analysis';

// En el componente:
const handleAnalysis = async () => {
  try {
    setAnalyzing(true);
    const analysis = await analyzeObservation(observationData);
    setAnalysisResults(analysis);
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'No se pudo completar el análisis');
  } finally {
    setAnalyzing(false);
  }
}; 