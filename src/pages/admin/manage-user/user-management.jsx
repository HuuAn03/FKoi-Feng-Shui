import React, { useState, useEffect } from 'react';
import api from "../../../config/axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (status) => {
    setLoading(true);
    try {
      const response = await api.get(`/user`, { params: { status } });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.patch(`/user/${userId}/toggle-status`);
      fetchUsers(status);
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    fetchUsers(value);
  };

  useEffect(() => {
    fetchUsers(status);
  }, [status]);

  return (
    <div>
      <h2>User Management</h2>
      <select value={status} onChange={handleStatusChange} className="status-select">
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Phone Number</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user}>
                <td>{user.user}</td>
                <td>{user.fullName || "N/A"}</td>
                <td>{user.phoneNumber || "N/A"}</td>
                <td>{user.birthdate || "N/A"}</td>
                <td>{user.gender || "N/A"}</td>
                <td>
                  <button onClick={() => toggleUserStatus(user.user)}>
                    {status === "ACTIVE" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
