import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/user/allusers');
        
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          throw new Error(response.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
        toast.error('Error loading users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/api/user/delete/${userToDelete}`);
      if (response.data.success) {
        setUsers(prevUsers => 
          prevUsers.filter(user => user._id !== userToDelete)
        );
        toast.success('User deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTableRow = (user) => {
    // Mobile row renderer
    if (window.innerWidth < 640) {
      return (
        <div key={user._id} className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="text-sm text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
              <Link
                to={`/update-user/${user._id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(user._id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Desktop row renderer - existing table row code
    return (
      <tr key={user._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{user.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <Link
            to={`/update-user/${user._id}`}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(user._id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
            Users <span className="text-gray-400">({filteredUsers.length})</span>
          </h1>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border-b border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors duration-300"
          />
        </div>

        <div className="hidden sm:block bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                renderTableRow(user)
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-4">
          {filteredUsers.map(renderTableRow)}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-center mb-4">Delete User</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;