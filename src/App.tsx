import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Activity, LogOut, Eye, Plus, Trash2, Search, Clock } from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  discord_username?: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface Log {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  code: string;
}

interface Activity {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  details: string;
  created_at: string;
}

interface AdminApplication {
  id: string;
  email: string;
  discord_username: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'logs' | 'admin' | 'apply-admin'>('login');
  const [logs, setLogs] = useState<Log[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [adminApplications, setAdminApplications] = useState<AdminApplication[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [viewingLog, setViewingLog] = useState<Log | null>(null);
  
  // Admin panel states
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogContent, setNewLogContent] = useState('');
  const [showCreateLog, setShowCreateLog] = useState(false);

  // Application states
  const [applicationEmail, setApplicationEmail] = useState('');
  const [applicationDiscord, setApplicationDiscord] = useState('');

  // Mock data - In real app, this would come from database
  useEffect(() => {
    // Initialize with admin user
    const adminUser: User = {
      id: '1',
      email: 'admin@logs.com',
      discord_username: 'admin#0001',
      role: 'admin',
      created_at: new Date().toISOString()
    };

    // Sample logs
    const sampleLogs: Log[] = [
      {
        id: '1',
        title: 'Initial Conflict Documentation',
        content: 'This log documents the initial phases of the conflict with detailed analysis of events and participants involved.',
        created_by: '1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        code: 'WAR001'
      },
      {
        id: '2',
        title: 'Strategic Analysis Report',
        content: 'Comprehensive analysis of strategic movements and decisions made during the ongoing situation.',
        created_by: '1',
        created_at: new Date(Date.now() - 43200000).toISOString(),
        code: 'WAR002'
      }
    ];

    // Sample activities
    const sampleActivities: Activity[] = [
      {
        id: '1',
        user_id: '1',
        user_email: 'admin@logs.com',
        action: 'Created Log',
        details: 'Created log: Strategic Analysis Report',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        user_id: '2',
        user_email: 'user@example.com',
        action: 'Viewed Log',
        details: 'Viewed log: Initial Conflict Documentation with code WAR001',
        created_at: new Date(Date.now() - 1800000).toISOString()
      }
    ];

    setLogs(sampleLogs);
    setActivities(sampleActivities);

    // Set admin as current user for demo
    setCurrentUser(adminUser);
    setCurrentView('admin');
  }, []);

  // Keyboard shortcut for admin application
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === 'Q') {
          e.preventDefault();
          setCurrentView('apply-admin');
        } else if (e.key === 'A' && currentUser?.role === 'admin') {
          e.preventDefault();
          setCurrentView('admin');
        } else if (e.key === 'U' && currentUser?.role === 'admin' && currentView === 'admin') {
          e.preventDefault();
          setCurrentView('logs');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser, currentView]);

  const handleLogin = (email: string) => {
    const user: User = {
      id: Date.now().toString(),
      email,
      role: 'user',
      created_at: new Date().toISOString()
    };
    setCurrentUser(user);
    setCurrentView('logs');
  };

  const handleLogSearch = () => {
    const log = logs.find(l => l.code.toLowerCase() === searchCode.toLowerCase());
    if (log) {
      setViewingLog(log);
      // Add activity
      const activity: Activity = {
        id: Date.now().toString(),
        user_id: currentUser?.id || 'anonymous',
        user_email: currentUser?.email || 'anonymous',
        action: 'Viewed Log',
        details: `Viewed log: ${log.title} with code ${log.code}`,
        created_at: new Date().toISOString()
      };
      setActivities([activity, ...activities]);
    } else {
      alert('Log not found with that code.');
    }
  };

  const handleCreateLog = () => {
    if (!newLogTitle || !newLogContent) return;
    
    const newLog: Log = {
      id: Date.now().toString(),
      title: newLogTitle,
      content: newLogContent,
      created_by: currentUser?.id || '',
      created_at: new Date().toISOString(),
      code: `WAR${String(logs.length + 1).padStart(3, '0')}`
    };
    
    setLogs([...logs, newLog]);
    
    const activity: Activity = {
      id: Date.now().toString(),
      user_id: currentUser?.id || '',
      user_email: currentUser?.email || '',
      action: 'Created Log',
      details: `Created log: ${newLog.title}`,
      created_at: new Date().toISOString()
    };
    setActivities([activity, ...activities]);
    
    setNewLogTitle('');
    setNewLogContent('');
    setShowCreateLog(false);
  };

  const handleDeleteLog = (logId: string) => {
    const log = logs.find(l => l.id === logId);
    if (log) {
      setLogs(logs.filter(l => l.id !== logId));
      
      const activity: Activity = {
        id: Date.now().toString(),
        user_id: currentUser?.id || '',
        user_email: currentUser?.email || '',
        action: 'Deleted Log',
        details: `Deleted log: ${log.title}`,
        created_at: new Date().toISOString()
      };
      setActivities([activity, ...activities]);
    }
  };

  const handleAdminApplication = () => {
    if (!applicationEmail || !applicationDiscord) return;
    
    const application: AdminApplication = {
      id: Date.now().toString(),
      email: applicationEmail,
      discord_username: applicationDiscord,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    setAdminApplications([...adminApplications, application]);
    setApplicationEmail('');
    setApplicationDiscord('');
    alert('Admin application submitted successfully!');
    setCurrentView(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'logs') : 'login');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (currentView === 'apply-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900 font-courier">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Apply for Admin Role</h1>
              <p className="text-gray-300">Submit your application to become an administrator</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={applicationEmail}
                  onChange={(e) => setApplicationEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discord Username</label>
                <input
                  type="text"
                  value={applicationDiscord}
                  onChange={(e) => setApplicationDiscord(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="username#1234"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAdminApplication}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => setCurrentView(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'logs') : 'login')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login' && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900 font-fira">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">War Logs Access</h1>
              <h2 className="text-lg text-gray-300">The Official Logs Regarding War Against Oh/My and Harry Choi</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter your email to continue</label>
                <input
                  type="email"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <button
                onClick={(e) => {
                  const input = document.querySelector('input[type="email"]') as HTMLInputElement;
                  if (input.value) {
                    handleLogin(input.value);
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Access System
              </button>
              
              <p className="text-center text-gray-400 text-sm">
                Press Ctrl+Shift+Q to apply for admin access<br/>
                Use any email with "admin" in it to get admin access
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'logs' || (currentView === 'login' && currentUser && currentUser.role === 'user')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Header */}
        <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-white">The Official Logs Regarding War Against Oh/My and Harry Choi</h1>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!viewingLog ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Access War Logs</h2>
              
              <div className="flex space-x-4 mb-8">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter log code (e.g., WAR001)"
                  />
                </div>
                <button
                  onClick={handleLogSearch}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
              
              <div className="text-gray-300">
                <p className="mb-4">Available log codes:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <code className="text-emerald-400 font-courier">{log.code}</code>
                      <p className="text-sm text-gray-400 mt-1 truncate">{log.title}</p>
                    </div>
                  ))}
                </div>
                {currentUser?.role === 'admin' && (
                  <p className="text-center text-gray-400 text-sm mt-6">
                    Press Ctrl+Shift+A to access admin panel
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{viewingLog.title}</h2>
                  <p className="text-gray-400">Code: <span className="font-courier">{viewingLog.code}</span> • {formatTime(viewingLog.created_at)}</p>
                </div>
                <button
                  onClick={() => setViewingLog(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  Back to Search
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{viewingLog.content}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Header */}
        <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              </div>
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-white">The Official Logs Regarding War Against Oh/My and Harry Choi</h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('logs')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>User View</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-gray-400 text-sm">
                Ctrl+Shift+U for user view • Ctrl+Shift+Q for admin applications
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Logs Management */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 text-emerald-400 mr-3" />
                    Logs Management
                  </h3>
                  <button
                    onClick={() => setShowCreateLog(!showCreateLog)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Log</span>
                  </button>
                </div>

                {showCreateLog && (
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newLogTitle}
                        onChange={(e) => setNewLogTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Log title"
                      />
                      <textarea
                        value={newLogContent}
                        onChange={(e) => setNewLogContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        placeholder="Log content"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCreateLog}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => setShowCreateLog(false)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{log.title}</h4>
                          <p className="text-gray-400 text-sm">Code: <span className="font-courier">{log.code}</span> • {formatTime(log.created_at)}</p>
                          <p className="text-gray-300 mt-2 line-clamp-2">{log.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Applications */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white flex items-center mb-6">
                  <Users className="w-6 h-6 text-blue-400 mr-3" />
                  Admin Applications
                </h3>
                
                <div className="space-y-4">
                  {adminApplications.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No pending applications</p>
                  ) : (
                    adminApplications.map((app) => (
                      <div key={app.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{app.email}</p>
                            <p className="text-gray-400 text-sm">Discord: {app.discord_username}</p>
                            <p className="text-gray-400 text-sm">{formatTime(app.created_at)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded transition-colors duration-200">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Activity Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-fit">
                <h3 className="text-xl font-bold text-white flex items-center mb-6">
                  <Activity className="w-6 h-6 text-yellow-400 mr-3" />
                  Recent Activity
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-400 truncate">{activity.user_email}</p>
                          <p className="text-xs text-gray-300 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;