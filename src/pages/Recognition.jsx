import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Recognition = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recognitions, setRecognitions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    toEmployee: '',
    category: 'excellence',
    message: '',
    points: 10,
    isPublic: true,
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRecognitions();
    fetchEmployees();
    fetchLeaderboard();
  }, []);

  const fetchRecognitions = async () => {
    try {
      const response = await api.get('/api/recognition');
      console.log('Fetched recognitions:', response.data);
      setRecognitions(response.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching recognitions:', error);
      setError('Failed to load recognitions');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/employees');
      console.log('Fetched employees for recognition:', response.data);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employee list');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/recognition/leaderboard');
      console.log('Fetched leaderboard:', response.data);
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/recognition', formData);
      console.log('Recognition created:', response.data);
      
      setSuccess('Recognition sent successfully!');
      setShowForm(false);
      setFormData({
        toEmployee: '',
        category: 'excellence',
        message: '',
        points: 10,
        isPublic: true,
        tags: []
      });
      
      // Refresh data
      await fetchRecognitions();
      await fetchLeaderboard();
      
    } catch (error) {
      console.error('Error saving recognition:', error);
      setError(error.response?.data?.message || 'Failed to save recognition');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'excellence': return 'fa-star';
      case 'teamwork': return 'fa-users';
      case 'innovation': return 'fa-lightbulb';
      case 'leadership': return 'fa-crown';
      case 'customer_focus': return 'fa-handshake';
      default: return 'fa-trophy';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'excellence': return 'bg-warning text-dark';
      case 'teamwork': return 'bg-info text-white';
      case 'innovation': return 'bg-purple text-white';
      case 'leadership': return 'bg-success text-white';
      case 'customer_focus': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  };

  // Filter out current user from employee list to prevent self-recognition
  const filteredEmployees = employees.filter(emp => emp._id !== user?.id);

  const getRankBadgeClass = (index) => {
    switch (index) {
      case 0: return 'rank-1 bg-warning text-dark';
      case 1: return 'rank-2 bg-secondary text-white';
      case 2: return 'rank-3 bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-trophy me-2"></i>
                  Employee Recognition
                </h1>
                <p className="text-muted mb-0">
                  Recognize and appreciate your colleagues' achievements
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary-custom"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Recognize Someone
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm logout-btn"
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <div className="row">
            {/* Recognition List */}
            <div className="col-lg-8">
              <div className="dashboard-card mb-4">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Recent Recognitions
                    <span className="badge bg-primary ms-2">{recognitions.length}</span>
                  </h3>
                </div>
                <div className="card-body">
                  {recognitions.length > 0 ? (
                    <div className="row g-3">
                      {recognitions.map((recognition) => (
                        <div key={recognition._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <span className={`badge ${getCategoryColor(recognition.category)} me-2`}>
                                      <i className={`fas ${getCategoryIcon(recognition.category)} me-1`}></i>
                                      {recognition.category.replace('_', ' ')}
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-star me-1"></i>
                                      {recognition.points} points
                                    </span>
                                    {!recognition.isPublic && (
                                      <span className="badge bg-secondary ms-2">
                                        <i className="fas fa-lock me-1"></i>
                                        Private
                                      </span>
                                    )}
                                  </div>
                                  <p className="card-text mb-3">{recognition.message}</p>
                                  <div className="d-flex flex-wrap gap-3">
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      From: {recognition.fromEmployee?.name || 'You'}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-user-check me-1"></i>
                                      To: {recognition.toEmployee?.name || 'Unknown'}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-calendar me-1"></i>
                                      {new Date(recognition.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-trophy fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No recognitions yet</h5>
                      <p className="text-muted mb-3">Be the first to recognize someone's achievement!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Give Recognition
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="col-lg-4">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-chart-line me-2 text-warning"></i>
                    Recognition Leaderboard
                  </h3>
                </div>
                <div className="card-body">
                  {leaderboard.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {leaderboard.slice(0, 5).map((item, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center border-0 py-3">
                          <div className="flex-shrink-0">
                            <div className={`rank-badge ${getRankBadgeClass(index)}`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">{item.employee?.name || 'Unknown Employee'}</h6>
                            <small className="text-muted">{item.employee?.department || 'No department'}</small>
                          </div>
                          <div className="flex-shrink-0 text-end">
                            <div className="fw-bold text-primary">{item.totalPoints} pts</div>
                            <small className="text-muted">{item.recognitionCount} recognitions</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No leaderboard data yet</p>
                      <small className="text-muted">Recognize colleagues to see the leaderboard!</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recognition Form */}
            {showForm && (
              <div className="col-12 mt-4">
                <div className="dashboard-card">
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-trophy me-2 text-success"></i>
                      Recognize a Colleague
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Recognize *</label>
                            <select
                              className="form-select"
                              required
                              value={formData.toEmployee}
                              onChange={(e) => setFormData({ ...formData, toEmployee: e.target.value })}
                            >
                              <option value="">Select Employee</option>
                              {filteredEmployees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                  {emp.name} ({emp.department || 'No department'})
                                </option>
                              ))}
                            </select>
                            <small className="text-muted">Choose who you want to recognize</small>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Category</label>
                            <select
                              className="form-select"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                              <option value="excellence">Excellence</option>
                              <option value="teamwork">Teamwork</option>
                              <option value="innovation">Innovation</option>
                              <option value="leadership">Leadership</option>
                              <option value="customer_focus">Customer Focus</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Points</label>
                            <input
                              type="number"
                              className="form-control"
                              min="5"
                              max="50"
                              value={formData.points}
                              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                            />
                            <small className="text-muted">Points awarded (5-50)</small>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Visibility</label>
                            <div className="form-check mt-2">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="isPublic"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                              />
                              <label className="form-check-label" htmlFor="isPublic">
                                Make this recognition public
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Recognition Message *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Share what they did that was exceptional and how it made a difference..."
                        />
                        <small className="text-muted">Describe why this person deserves recognition</small>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-success"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trophy me-2"></i>
                              Give Recognition
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setError('');
                            setSuccess('');
                          }}
                          className="btn btn-outline-secondary"
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS for rank badges */}
      <style jsx>{`
        .rank-badge {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .rank-1 {
          background: linear-gradient(45deg, #FFD700, #FFA500);
        }
        .rank-2 {
          background: linear-gradient(45deg, #C0C0C0, #A0A0A0);
        }
        .rank-3 {
          background: linear-gradient(45deg, #CD7F32, #8B4513);
        }
      `}</style>
    </div>
  );
};

export default Recognition;