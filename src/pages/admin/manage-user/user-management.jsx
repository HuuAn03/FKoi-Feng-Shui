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
      console.log("Fetched users:", response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    fetchUsers(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const filteredUsers = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(value.toLowerCase()) ||
        user.phoneNumber.includes(value)
    );
    setUsers(filteredUsers);
  };

  useEffect(() => {
    fetchUsers(status);
  }, [status]);

  return (
    <div >
      <h2>User Management</h2>
      <select value={status} onChange={handleStatusChange} className="status-select">
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      <input
        type="text"
        placeholder="Search by name or phone"
        onChange={handleSearch}
        className="search-input"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
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
                <td>{user.fullName}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.birthdate}</td>
                <td>{user.gender}</td>
                <td>
                  <button onClick={() => console.log("View user:", user)}>View</button>
                  <button onClick={() => console.log("Edit user:", user)}>Edit</button>
                  <button onClick={() => console.log("Delete user:", user)}>Delete</button>
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
