import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import ActiveAgentsPage from './pages/ActiveAgentsPage';
import TotalCallsPage from './pages/TotalCallsPage';
import AvgSentimentPage from './pages/AvgSentimentPage';
import CompliancePage from './pages/CompliancePage';
import AvgHandleTimePage from './pages/AvgHandleTimePage';
import ResolutionRatePage from './pages/ResolutionRatePage';
import Dashboard from './pages/Dashboard';
import {
  BarChart3,
  Headphones,
  Users,
  AlertTriangle,
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
  { title: 'Dashboard', path: '/', icon: <BarChart3 className="h-5 w-5" /> },
  { title: 'Active Agents', path: '/active-agents', icon: <Users className="h-5 w-5" /> },
  { title: 'Total Calls', path: '/total-calls', icon: <Phone className="h-5 w-5" /> },
  { title: 'Avg Sentiment', path: '/avg-sentiment', icon: <Heart className="h-5 w-5" /> },
  { title: 'Compliance', path: '/compliance', icon: <Shield className="h-5 w-5" /> },
  { title: 'Avg Handle Time', path: '/avg-handle-time', icon: <Clock className="h-5 w-5" /> },
  { title: 'Resolution Rate', path: '/resolution-rate', icon: <ThumbsUp className="h-5 w-5" /> },
];

const headerConfig = {
  '/': { title: 'QA Monitoring Dashboard', icon: <BarChart3 className="h-6 w-6 text-indigo-600" /> },
  '/active-agents': { title: 'Active Agents', icon: <Users className="h-6 w-6 text-blue-500" /> },
  '/total-calls': { title: 'Total Calls', icon: <Phone className="h-6 w-6 text-green-500" /> },
  '/avg-sentiment': { title: 'Average Sentiment', icon: <Heart className="h-6 w-6 text-red-500" /> },
  '/compliance': { title: 'Compliance', icon: <Shield className="h-6 w-6 text-purple-500" /> },
  '/avg-handle-time': { title: 'Average Handle Time', icon: <Clock className="h-6 w-6 text-yellow-500" /> },
  '/resolution-rate': { title: 'Resolution Rate', icon: <ThumbsUp className="h-6 w-6 text-indigo-500" /> },
};

// Create a layout component that uses the router hooks
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics] = useState({
    activeAgents: 24,
    totalCalls: 856,
    avgSentiment: 78,
    complianceScore: 95,
    avgHandleTime: "4:32",
    resolutionRate: 92,
  });
  const location = useLocation();
  const currentHeader = headerConfig[location.pathname] || headerConfig['/'];
  
  // Close sidebar when clicking outside or navigating on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    // Close sidebar when route changes on mobile
    setIsSidebarOpen(false);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  // Handle clicks outside the sidebar to close it
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
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="sidebar-toggle lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
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
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard metrics={metrics} timeRange={timeRange} setTimeRange={setTimeRange} />} />
              <Route path="/active-agents" element={<ActiveAgentsPage />} />
              <Route path="/total-calls" element={<TotalCallsPage />} />
              <Route path="/avg-sentiment" element={<AvgSentimentPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/avg-handle-time" element={<AvgHandleTimePage />} />
              <Route path="/resolution-rate" element={<ResolutionRatePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;