import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, NavLink, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ActiveAgentsPage from './pages/ActiveAgentsPage';
import TotalCallsPage from './pages/TotalCallsPage';
import AvgSentimentPage from './pages/AvgSentimentPage';
import CompliancePage from './pages/CompliancePage';
import AvgHandleTimePage from './pages/AvgHandleTimePage';
import ResolutionRatePage from './pages/ResolutionRatePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';
import {
  BarChart3,
  Headphones,
  Users,
  Bell,
  Search,
  Phone,
  Heart,
  Settings,
  Clock,
  ThumbsUp,
  Shield,
  Menu,
  X,
} from 'lucide-react';

const sidebarItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { title: 'Active Agents', path: '/active-agents', icon: <Users className="h-5 w-5" /> },
  { title: 'Total Calls', path: '/total-calls', icon: <Phone className="h-5 w-5" /> },
  { title: 'Avg Sentiment', path: '/avg-sentiment', icon: <Heart className="h-5 w-5" /> },
  { title: 'Compliance', path: '/compliance', icon: <Shield className="h-5 w-5" /> },
  { title: 'Avg Handle Time', path: '/avg-handle-time', icon: <Clock className="h-5 w-5" /> },
  { title: 'Resolution Rate', path: '/resolution-rate', icon: <ThumbsUp className="h-5 w-5" /> },
];

const headerConfig = {
  '/': { title: 'QA Monitoring Dashboard', icon: <BarChart3 className="h-6 w-6 text-indigo-600" /> },
  '/dashboard': { title: 'QA Monitoring Dashboard', icon: <BarChart3 className="h-6 w-6 text-indigo-600" /> },
  '/active-agents': { title: 'Active Agents', icon: <Users className="h-6 w-6 text-blue-500" /> },
  '/total-calls': { title: 'Total Calls', icon: <Phone className="h-6 w-6 text-green-500" /> },
  '/avg-sentiment': { title: 'Average Sentiment', icon: <Heart className="h-6 w-6 text-red-500" /> },
  '/compliance': { title: 'Compliance', icon: <Shield className="h-6 w-6 text-purple-500" /> },
  '/avg-handle-time': { title: 'Average Handle Time', icon: <Clock className="h-6 w-6 text-yellow-500" /> },
  '/resolution-rate': { title: 'Resolution Rate', icon: <ThumbsUp className="h-6 w-6 text-indigo-500" /> },
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log('Profile updated with name:', name);
    onClose();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onClose();
    window.location.href = '/login';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <img
            src={user?.image || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="h-10 w-10 rounded-full mr-3"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} // Fallback if image fails
          />
          <span className="text-gray-900 font-medium">{user?.email}</span>
        </div>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-600">Do you want to log out?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Layout Component
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [metrics] = useState({
    activeAgents: 24,
    totalCalls: 856,
    avgSentiment: 78,
    complianceScore: 95,
    avgHandleTime: "4:32",
    resolutionRate: 92,
  });
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const currentHeader = headerConfig[location.pathname] || headerConfig['/'];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    setIsSidebarOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isSidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && isAuthenticated() && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {isAuthenticated() && (
        <aside className={`sidebar-container fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-64`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Headphones className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">QA Dashboard</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {isAuthenticated() && (
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="sidebar-toggle lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <Link to="/" className="flex items-center space-x-3">
                {currentHeader.icon}
                <h1 className="text-xl font-bold text-gray-900">{currentHeader.title}</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              {isAuthenticated() && (
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.image || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} // Fallback if image fails
                  />
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Settings className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard metrics={metrics} timeRange={timeRange} setTimeRange={setTimeRange} /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard metrics={metrics} timeRange={timeRange} setTimeRange={setTimeRange} /></ProtectedRoute>} />
              <Route path="/active-agents" element={<ProtectedRoute><ActiveAgentsPage /></ProtectedRoute>} />
              <Route path="/total-calls" element={<ProtectedRoute><TotalCallsPage /></ProtectedRoute>} />
              <Route path="/avg-sentiment" element={<ProtectedRoute><AvgSentimentPage /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
              <Route path="/avg-handle-time" element={<ProtectedRoute><AvgHandleTimePage /></ProtectedRoute>} />
              <Route path="/resolution-rate" element={<ProtectedRoute><ResolutionRatePage /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="132446576172-7fppfejsg51fl6bol556fp44maehunqq.apps.googleusercontent.com">
      <Router>
        <AppLayout />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;