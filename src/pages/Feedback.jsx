import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Feedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    toEmployee: '',
    message: '',
    category: 'general',
    isAnonymous: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFeedbacks();
    fetchEmployees();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/api/feedback');
      console.log('Fetched feedbacks:', response.data);
      setFeedbacks(response.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedbacks');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/employees');
      console.log('Fetched employees:', response.data);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employee list');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      if (editingId) {
        response = await api.put(`/api/feedback/${editingId}`, formData);
        setSuccess('Feedback updated successfully!');
      } else {
        response = await api.post('/api/feedback', formData);
        setSuccess('Feedback sent successfully!');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        toEmployee: '',
        message: '',
        category: 'general',
        isAnonymous: false
      });
      
      // Refresh the feedback list
      await fetchFeedbacks();
      
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError(error.response?.data?.message || 'Failed to save feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback) => {
    // Check if user can edit this feedback
    const canEdit = feedback.fromEmployee?._id === user?.id || 
                   user?.role === 'admin' || 
                   user?.role === 'hr';
    
    if (!canEdit) {
      setError('You do not have permission to edit this feedback');
      return;
    }

    setFormData({
      toEmployee: feedback.toEmployee?._id || '',
      message: feedback.message || '',
      category: feedback.category || 'general',
      isAnonymous: feedback.isAnonymous || false
    });
    setEditingId(feedback._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await api.delete(`/api/feedback/${id}`);
      setSuccess('Feedback deleted successfully!');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setError('Failed to delete feedback');
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      toEmployee: '',
      message: '',
      category: 'general',
      isAnonymous: false
    });
    setError('');
    setSuccess('');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'positive': return 'fa-smile text-success';
      case 'constructive': return 'fa-lightbulb text-warning';
      default: return 'fa-comment text-primary';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'positive': return 'border-success';
      case 'constructive': return 'border-warning';
      default: return 'border-primary';
    }
  };

  // Check if user can perform actions on feedback
  const canPerformAction = (feedback) => {
    return feedback.fromEmployee?._id === user?.id || 
           user?.role === 'admin' || 
           user?.role === 'hr';
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-comments me-2"></i>
                  Feedback Management
                </h1>
                <p className="text-muted mb-0">
                  {user?.role === 'admin' || user?.role === 'hr' 
                    ? 'Manage all feedback across the organization' 
                    : 'Give and receive constructive feedback'
                  }
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary-custom"
                >
                  <i className="fas fa-plus me-2"></i>
                  Give Feedback
                </button>
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
            {/* Feedback List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    {user?.role === 'admin' || user?.role === 'hr' ? 'All Feedback' : 'My Feedback'}
                    <span className="badge bg-primary ms-2">{feedbacks.length}</span>
                  </h3>
                </div>

                <div className="card-body">
                  {feedbacks.length > 0 ? (
                    <div className="row g-4">
                      {feedbacks.map((feedback) => (
                        <div key={feedback._id} className="col-12">
                          <div className={`card border ${getCategoryColor(feedback.category)} hover-lift`}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                  <i className={`fas ${getCategoryIcon(feedback.category)} fa-2x me-3`}></i>
                                  <div>
                                    <h6 className="card-title mb-1 text-capitalize">
                                      {feedback.category} Feedback
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                      {feedback.isAnonymous && (
                                        <span className="badge bg-secondary">
                                          <i className="fas fa-user-secret me-1"></i>
                                          Anonymous
                                        </span>
                                      )}
                                      <small className="text-muted">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                </div>

                                {canPerformAction(feedback) && (
                                  <div className="btn-group">
                                    <button
                                      onClick={() => handleEdit(feedback)}
                                      className="btn btn-outline-primary btn-sm"
                                      title="Edit Feedback"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(feedback._id)}
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete Feedback"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <p className="card-text mb-3">{feedback.message}</p>

                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {!feedback.isAnonymous ? (
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      From: {feedback.fromEmployee?.name || 'Unknown'}
                                    </small>
                                  ) : (
                                    <small className="text-muted">
                                      <i className="fas fa-user-secret me-1"></i>
                                      From: Anonymous
                                    </small>
                                  )}
                                  <small className="text-muted ms-3">
                                    <i className="fas fa-user-check me-1"></i>
                                    To: {feedback.toEmployee?.name || 'Unknown'}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No feedback found</h5>
                      <p className="text-muted mb-3">
                        {user?.role === 'admin' || user?.role === 'hr' 
                          ? 'No feedback has been shared yet' 
                          : 'Be the first to share some feedback!'
                        }
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Share Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{ top: '100px' }}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-edit me-2 text-success"></i>
                      {editingId ? 'Edit Feedback' : 'Give Feedback'}
                    </h3>
                  </div>

                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">To Employee *</label>
                        <select
                          className="form-select"
                          required
                          value={formData.toEmployee}
                          onChange={(e) => setFormData({ ...formData, toEmployee: e.target.value })}
                          disabled={editingId} // Cannot change recipient when editing
                        >
                          <option value="">Select Employee</option>
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} ({emp.department || 'No department'})
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">Choose who you want to give feedback to</small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="general">General</option>
                          <option value="positive">Positive</option>
                          <option value="constructive">Constructive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Message *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Write your constructive feedback here..."
                        />
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="isAnonymous">
                            Send anonymously
                          </label>
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <button type="submit" disabled={loading} className="btn btn-success">
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              {editingId ? 'Updating...' : 'Sending...'}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              {editingId ? 'Update Feedback' : 'Send Feedback'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
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
    </div>
  );
};

export default Feedback;