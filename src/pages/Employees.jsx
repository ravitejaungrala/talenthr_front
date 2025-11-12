import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      setError('');
      console.log('Fetching employees as:', user?.role);
      const response = await api.get('/api/employees');
      console.log('Employees fetched:', response.data.length);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 403) {
        setError('Access denied. You need admin or HR privileges to view employees.');
      } else {
        setError('Failed to fetch employees. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await api.put(`/api/employees/${editingId}`, updateData);
      } else {
        await api.post('/api/auth/register', formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        isActive: true
      });
      await fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '',
      role: employee.role,
      isActive: employee.isActive
    });
    setEditingId(employee._id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.delete(`/api/employees/${id}`);
      await fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee');
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      isActive: true
    });
    setError('');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'hr': return 'bg-warning text-dark';
      default: return 'bg-primary';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-success' : 'bg-secondary';
  };

  // Only show employee management for admin and HR
  if (user?.role !== 'admin' && user?.role !== 'hr') {
    return (
      <div className="container-fluid py-4 mt-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <h4>Access Denied</h4>
              <p>You don't have permission to access employee management.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-users me-2"></i>
                  Employee Management
                </h1>
                <p className="text-muted mb-0">
                  Manage all employees in the system
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary-custom"
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Employee
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <div className="row">
            {/* Employees List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    All Employees
                    <span className="badge bg-primary ms-2">{employees.length}</span>
                  </h3>
                </div>
                <div className="card-body">
                  {employees.length > 0 ? (
                    <div className="row g-3">
                      {employees.map((employee) => (
                        <div key={employee._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                         style={{width: '50px', height: '50px'}}>
                                      <i className="fas fa-user text-white"></i>
                                    </div>
                                    <div>
                                      <h5 className="card-title mb-1">{employee.name}</h5>
                                      <p className="text-muted mb-1">{employee.email}</p>
                                      <div className="d-flex gap-2">
                                        <span className={`badge ${getRoleColor(employee.role)}`}>
                                          {employee.role}
                                        </span>
                                        <span className={`badge ${getStatusColor(employee.isActive)}`}>
                                          {employee.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  <div className="btn-group">
                                    <button
                                      onClick={() => handleEdit(employee)}
                                      className="btn btn-outline-primary btn-sm"
                                      title="Edit Employee"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(employee._id)}
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete Employee"
                                      disabled={employee._id === user.id}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                  <div className="mt-2">
                                    <small className="text-muted">
                                      Joined: {new Date(employee.createdAt).toLocaleDateString()}
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
                      <i className="fas fa-users fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No employees found</h5>
                      <p className="text-muted mb-3">Add your first employee to get started!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add Employee
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-edit me-2 text-success"></i>
                      {editingId ? 'Edit Employee' : 'Add Employee'}
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@company.com"
                        />
                      </div>

                      {!editingId && (
                        <div className="mb-3">
                          <label className="form-label fw-medium">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            required={!editingId}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Minimum 6 characters"
                            minLength="6"
                          />
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-medium">Role</label>
                        <select
                          className="form-select"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="employee">Employee</option>
                          <option value="hr">HR Manager</option>
                          {user?.role === 'admin' && <option value="admin">Administrator</option>}
                        </select>
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="isActive">
                            Active Employee
                          </label>
                        </div>
                      </div>

                      <div className="d-grid gap-2">
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
                              <i className="fas fa-save me-2"></i>
                              {editingId ? 'Update Employee' : 'Add Employee'}
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

export default Employees;