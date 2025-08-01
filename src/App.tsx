import { Suspense, lazy, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import Alert from './components/common/Alert';
import ConfirmationDialog from './components/common/ConfirmationDialog';
import { useAlertStore } from './store/alertStore';
import { useNotifications } from './hooks/useNotifications';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load des pages avec preload pour les plus importantes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Home = lazy(() => 
  import('./pages/Home').then(module => ({ default: module.default }))
);
const Login = lazy(() => import('./pages/Login'));
const Scan = lazy(() => 
  import('./pages/scan/Scan').then(module => ({ default: module.default }))
);
const ConversationalScan = lazy(() => 
  import('./pages/scan/ConversationalScan').then(module => ({ default: module.default }))
);
const Results = lazy(() => 
  import('./pages/Results').then(module => ({ default: module.default }))
);
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => 
  import('./pages/Dashboard').then(module => ({ default: module.default }))
);
const ScanDetails = lazy(() => import('./pages/ScanDetails'));
const About = lazy(() => import('./pages/About'));
const Help = lazy(() => import('./pages/Help'));
const Contact = lazy(() => import('./pages/Contact'));
const PremiumPlans = lazy(() => import('./pages/premium/PremiumPlans'));
const Legal = lazy(() => import('./pages/Legal'));
const ProfileSettings = lazy(() => import('./pages/profile/Settings'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const PublicProfile = lazy(() => import('./pages/profile/PublicProfile'));
const PrivacySettings = lazy(() => import('./pages/profile/PrivacySettings'));
const CommunityDirectory = lazy(() => import('./pages/community/CommunityDirectory'));
const Community = lazy(() => import('./pages/Community'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const OracleGame = lazy(() => import('./pages/OracleGame'));

const App = memo(() => {
  const { 
    isOpen, 
    message, 
    type, 
    hideAlert,
    showDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    dialogCallback,
    hideDialog
  } = useAlertStore();
  
  // Initialiser les notifications
  useNotifications();

  return (
    <Layout>
      <Alert
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={hideAlert}
      />
      
      {/* Dialogue global pour remplacer les alertes importantes */}
      <ConfirmationDialog
        isOpen={showDialog}
        onClose={() => {
          hideDialog();
          if (dialogCallback) dialogCallback();
        }}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType === 'error' ? 'warning' : dialogType === 'warning' ? 'warning' : dialogType === 'success' ? 'success' : 'info'}
        showActions={false}
      />
      
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
          <Route path="/scan-conversational" element={<ProtectedRoute><ConversationalScan /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/scan-details/:scanId" element={<ProtectedRoute><ScanDetails /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/premium" element={<PremiumPlans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/public/:userId" element={<PublicProfile />} />
          <Route path="/profile/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
          <Route path="/community/directory" element={<ProtectedRoute><CommunityDirectory /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/oracle" element={<ProtectedRoute><OracleGame /></ProtectedRoute>} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-display mb-4">Page non trouvée</h1><p className="text-neutral-dark/70">La page que vous cherchez n'existe pas.</p></div></div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
});

App.displayName = 'App';

export default App