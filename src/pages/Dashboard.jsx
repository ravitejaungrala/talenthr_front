import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    feedbackCount: 0,
    pendingLeaves: 0,
    skillsCount: 0,
    employeesCount: 0,
    announcementsCount: 0,
    documentsCount: 0,
    goalsCount: 0,
    recognitionsCount: 0,
    surveysCount: 0,
    trainingCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch data from all endpoints
      const requests = [
        api.get('/api/feedback'),
        api.get('/api/leaves'),
        api.get('/api/skills'),
        api.get('/api/announcements'),
        api.get('/api/documents'),
        api.get('/api/goals'),
        api.get('/api/recognition'),
        api.get('/api/surveys'),
        api.get('/api/training')
      ];

      // Add employees endpoint only for admin/hr
      if (user?.role === 'admin' || user?.role === 'hr') {
        requests.push(api.get('/api/employees'));
      } else {
        requests.push(Promise.resolve({ data: [] }));
      }

      const [
        feedbackRes, 
        leavesRes, 
        skillsRes, 
        announcementsRes,
        documentsRes,
        goalsRes,
        recognitionRes,
        surveysRes,
        trainingRes,
        employeesRes
      ] = await Promise.all(requests.map(p => p.catch(e => ({ data: [] }))));

      // Count pending leaves
      const pendingLeaves = leavesRes.data.filter ? 
        leavesRes.data.filter(leave => leave.status === 'pending').length : 0;

      // Set stats
      setStats({
        feedbackCount: feedbackRes.data?.length || 0,
        pendingLeaves,
        skillsCount: skillsRes.data?.length || 0,
        employeesCount: employeesRes.data?.length || 0,
        announcementsCount: announcementsRes.data?.length || 0,
        documentsCount: documentsRes.data?.length || 0,
        goalsCount: goalsRes.data?.length || 0,
        recognitionsCount: recognitionRes.data?.length || 0,
        surveysCount: surveysRes.data?.length || 0,
        trainingCount: trainingRes.data?.length || 0
      });

      // Create recent activity from existing data
      const activity = [
        ...(feedbackRes.data?.slice(0, 3) || []).map(f => ({
          type: 'feedback',
          message: `New feedback ${f.isAnonymous ? 'anonymously' : `from ${f.fromEmployee?.name || 'Unknown'}`}`,
          time: f.createdAt,
          id: f._id,
          icon: 'fa-comments',
          color: 'text-primary'
        })),
        ...(leavesRes.data?.slice(0, 2) || []).map(l => ({
          type: 'leave',
          message: `Leave request from ${l.employee?.name || 'Unknown'}`,
          time: l.createdAt,
          id: l._id,
          icon: 'fa-calendar-alt',
          color: 'text-warning'
        })),
        ...(announcementsRes.data?.slice(0, 2) || []).map(a => ({
          type: 'announcement',
          message: `New announcement: ${a.title}`,
          time: a.createdAt,
          id: a._id,
          icon: 'fa-bullhorn',
          color: 'text-info'
        })),
        ...(documentsRes.data?.slice(0, 2) || []).map(d => ({
          type: 'document',
          message: `New document: ${d.title}`,
          time: d.createdAt,
          id: d._id,
          icon: 'fa-file',
          color: 'text-success'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStatClick = (type) => {
    navigate(`/${type}`);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          {/* Welcome Section */}
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="h2 fw-bold text-primary mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-muted mb-0">
                  Here's what's happening in your HR dashboard today.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <div className="badge bg-primary fs-6 p-2">
                    <i className="fas fa-user-tie me-2"></i>
                    {user?.role?.toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-3 mb-5">
            {/* Feedback Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('feedback')}
              >
                <div className="stats-icon text-primary">
                  <i className="fas fa-comments"></i>
                </div>
                <div className="stats-number">{stats.feedbackCount}</div>
                <p className="text-muted mb-0">Total Feedback</p>
              </div>
            </div>

            {/* Pending Leaves */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('leaves')}
              >
                <div className="stats-icon text-warning">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stats-number">{stats.pendingLeaves}</div>
                <p className="text-muted mb-0">Pending Leaves</p>
              </div>
            </div>

            {/* Skills Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('skills')}
              >
                <div className="stats-icon text-success">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="stats-number">{stats.skillsCount}</div>
                <p className="text-muted mb-0">Skills Tracked</p>
              </div>
            </div>

            {/* Employees Count (Admin/HR only) */}
            {(user?.role === 'admin' || user?.role === 'hr') && (
              <div className="col-xl-2 col-md-4 col-sm-6">
                <div 
                  className="dashboard-card stats-card hover-lift cursor-pointer"
                  onClick={() => handleStatClick('employees')}
                >
                  <div className="stats-icon text-secondary">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stats-number">{stats.employeesCount}</div>
                  <p className="text-muted mb-0">Employees</p>
                </div>
              </div>
            )}

            {/* Announcements Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('announcements')}
              >
                <div className="stats-icon text-pink">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <div className="stats-number">{stats.announcementsCount}</div>
                <p className="text-muted mb-0">Announcements</p>
              </div>
            </div>

            {/* Documents Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('documents')}
              >
                <div className="stats-icon text-info">
                  <i className="fas fa-file"></i>
                </div>
                <div className="stats-number">{stats.documentsCount}</div>
                <p className="text-muted mb-0">Documents</p>
              </div>
            </div>

            {/* Goals Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('goals')}
              >
                <div className="stats-icon text-purple">
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="stats-number">{stats.goalsCount}</div>
                <p className="text-muted mb-0">Goals</p>
              </div>
            </div>

            {/* Recognition Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('recognition')}
              >
                <div className="stats-icon text-warning">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stats-number">{stats.recognitionsCount}</div>
                <p className="text-muted mb-0">Recognitions</p>
              </div>
            </div>

            {/* Surveys Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('surveys')}
              >
                <div className="stats-icon text-teal">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="stats-number">{stats.surveysCount}</div>
                <p className="text-muted mb-0">Surveys</p>
              </div>
            </div>

            {/* Training Count */}
            <div className="col-xl-2 col-md-4 col-sm-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('training')}
              >
                <div className="stats-icon text-indigo">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="stats-number">{stats.trainingCount}</div>
                <p className="text-muted mb-0">Training</p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Recent Activity */}
            <div className="col-lg-8">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-history me-2 text-primary"></i>
                    Recent Activity
                  </h3>
                </div>
                <div className="card-body">
                  {recentActivity.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center border-0 py-3">
                          <div className={`flex-shrink-0 ${activity.color} me-3`}>
                            <i className={`fas ${activity.icon} fa-lg`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-medium">{activity.message}</p>
                            <small className="text-muted">
                              {new Date(activity.time).toLocaleDateString()} at{' '}
                              {new Date(activity.time).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No recent activity</p>
                      <small className="text-muted">Activity will appear here as you use the system</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Profile */}
            <div className="col-lg-4">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-bolt me-2 text-success"></i>
                    Quick Actions
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-12">
                      <Link to="/feedback" className="btn btn-outline-primary w-100 text-start mb-2">
                        <i className="fas fa-comment me-2"></i>
                        Give Feedback
                      </Link>
                    </div>
                    <div className="col-12">
                      <Link to="/leaves" className="btn btn-outline-warning w-100 text-start mb-2">
                        <i className="fas fa-calendar-plus me-2"></i>
                        Request Leave
                      </Link>
                    </div>
                    <div className="col-12">
                      <Link to="/skills" className="btn btn-outline-success w-100 text-start mb-2">
                        <i className="fas fa-plus-circle me-2"></i>
                        Add Skills
                      </Link>
                    </div>
                    <div className="col-12">
                      <Link to="/documents" className="btn btn-outline-info w-100 text-start mb-2">
                        <i className="fas fa-file me-2"></i>
                        View Documents
                      </Link>
                    </div>
                    <div className="col-12">
                      <Link to="/goals" className="btn btn-outline-purple w-100 text-start mb-2">
                        <i className="fas fa-bullseye me-2"></i>
                        Set Goals
                      </Link>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'hr') && (
                      <>
                        <div className="col-12">
                          <Link to="/employees" className="btn btn-outline-secondary w-100 text-start mb-2">
                            <i className="fas fa-users me-2"></i>
                            Manage Employees
                          </Link>
                        </div>
                        <div className="col-12">
                          <Link to="/announcements" className="btn btn-outline-pink w-100 text-start mb-2">
                            <i className="fas fa-bullhorn me-2"></i>
                            Post Announcement
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;