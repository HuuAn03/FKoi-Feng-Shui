import React, { useState, useEffect } from 'react';
import api from "../../../config/axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/user`, {
        params: { status, page, size: 8 }, // Gửi tham số phân trang
      });
      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.patch(`/user/${userId}/toggle-status`);
      fetchUsers(status, currentPage);
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    fetchUsers(value, 0); // Reset về trang đầu khi thay đổi trạng thái
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchUsers(status, newPage);
    }
  };

  useEffect(() => {
    fetchUsers(status);
  }, []);

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
        <>
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
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;