import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, CheckCircle, XCircle, AlertTriangle, RefreshCw, Code, Key, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';
import { testOpenAIConnection } from '../../utils/testOpenAI';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

const TestOpenAIPage = () => {
  const navigate = useNavigate();
  const { showAlertDialog } = useAlertStore();
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleTestConnection = async () => {
    try {
      setIsLoading(true);
      setTestResult(null);
      
      console.log('🔑 Démarrage du test OpenAI...');
      const result = await testOpenAIConnection();
      
      setTestResult(result);
      setShowResultDialog(true);
      
      console.log('📊 Résultat du test:', result);
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setTestResult({
        success: false,
        message: 'Erreur inattendue lors du test',
        details: { error: error.message }
      });
      setShowResultDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!testResult) return <Sparkles size={48} className="text-primary" />;
    return testResult.success ? 
      <CheckCircle size={48} className="text-success" /> : 
      <XCircle size={48} className="text-error" />;
  };

  const getStatusColor = () => {
    if (!testResult) return 'text-primary';
    return testResult.success ? 'text-success' : 'text-error';
  };

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft size={18} />}
                className="mb-4"
              >
                Retour au tableau de bord
              </Button>
              <h1 className="font-display text-4xl text-primary mb-2">
                🤖 Test OpenAI
              </h1>
              <p className="text-lg text-neutral-dark/80">
                Vérifiez la connectivité et la configuration de votre clé API OpenAI
              </p>
            </div>
          </div>

          {/* Zone de test principale */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral/10 mb-8">
            <div className="text-center mb-8">
              <motion.div
                animate={isLoading ? { rotate: 360 } : {}}
                transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  getStatusIcon()
                )}
              </motion.div>
              
              <h2 className={`font-display text-2xl mb-4 ${getStatusColor()}`}>
                {isLoading ? 'Test en cours...' :
                 testResult ? (testResult.success ? 'Test réussi !' : 'Test échoué') :
                 'Prêt pour le test'}
              </h2>
              
              {testResult && (
                <div className={`p-4 rounded-xl mb-6 ${
                  testResult.success ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'
                }`}>
                  <p className={`font-medium ${testResult.success ? 'text-success' : 'text-error'}`}>
                    {testResult.message}
                  </p>
                  {testResult.details && (
                    <div className="mt-4 text-left">
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium mb-2">Détails techniques</summary>
                        <pre className="bg-neutral/20 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(testResult.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant="primary"
                onClick={handleTestConnection}
                disabled={isLoading}
                size="lg"
                icon={isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {isLoading ? 'Test en cours...' : 'Tester la connexion OpenAI'}
              </Button>
            </div>
          </div>

          {/* Informations sur la configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10">
              <div className="flex items-center mb-4">
                <Key size={20} className="text-primary mr-3" />
                <h3 className="font-display text-lg">Configuration API</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Clé API :</span>
                  <span className={`font-medium ${
                    import.meta.env.VITE_OPENAI_API_KEY ? 'text-success' : 'text-error'
                  }`}>
                    {import.meta.env.VITE_OPENAI_API_KEY ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Assistant ID :</span>
                  <span className={`font-medium ${
                    import.meta.env.VITE_OPENAI_ASSISTANT_ID ? 'text-success' : 'text-warning'
                  }`}>
                    {import.meta.env.VITE_OPENAI_ASSISTANT_ID ? '✓ Configuré' : '⚠ Optionnel'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Modèle :</span>
                  <span className="font-medium text-primary">GPT-4o-mini</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral/10">
              <div className="flex items-center mb-4">
                <Code size={20} className="text-secondary mr-3" />
                <h3 className="font-display text-lg">Fonctionnalités</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Chat standard :</span>
                  <span className="font-medium text-success">✓ Disponible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Assistant Aminata :</span>
                  <span className={`font-medium ${
                    import.meta.env.VITE_OPENAI_ASSISTANT_ID ? 'text-success' : 'text-warning'
                  }`}>
                    {import.meta.env.VITE_OPENAI_ASSISTANT_ID ? '✓ Activé' : '⚠ Chat standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-dark/70">Analyse sentiment :</span>
                  <span className="font-medium text-success">✓ Intégrée</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guide de configuration */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="font-display text-2xl mb-6 text-primary text-center">
              📋 Guide de Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-neutral-dark mb-4">1. Configuration de base :</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Clé API OpenAI :</p>
                    <p className="text-neutral-dark/70">Ajoutez VITE_OPENAI_API_KEY dans votre fichier .env</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Assistant ID (optionnel) :</p>
                    <p className="text-neutral-dark/70">Ajoutez VITE_OPENAI_ASSISTANT_ID pour Aminata personnalisée</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-neutral-dark mb-4">2. Fonctionnalités activées :</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Scan conversationnel :</p>
                    <p className="text-neutral-dark/70">Dialogue intelligent avec Aminata IA</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="font-medium">Analyse prédictive :</p>
                    <p className="text-neutral-dark/70">Prédictions basées sur vos patterns</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                icon={<Key size={18} />}
                className="mr-4"
              >
                Obtenir une clé API
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/scan-conversational')}
                icon={<Sparkles size={18} />}
              >
                Tester Aminata
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogue de résultat */}
      <ConfirmationDialog
        isOpen={showResultDialog}
        onClose={() => setShowResultDialog(false)}
        title={testResult?.success ? "Test OpenAI réussi ! ✅" : "Test OpenAI échoué ❌"}
        message={testResult?.message || 'Test en cours...'}
        type={testResult?.success ? "success" : "warning"}
        showActions={false}
      />
    </div>
  );
};

export default TestOpenAIPage;