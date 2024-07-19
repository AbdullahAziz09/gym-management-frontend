// AdminManagementPage.js

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Table from '../components/Table';


const AdminManagementPage = () => {
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [admins, setAdmins] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Default to 1 page
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1
  const [limit, setLimit] = useState(5); 

  const handleAdminNameChange = (e) => setAdminName(e.target.value);
  const handleAdminIdChange = (e) => setAdminId(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleReset = () => {
    setAdminName('');
    setAdminId('');
    setCity('');
    setPassword('');
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (admins.some(admin => admin.adminId === adminId)) {
      alert('Admin ID already exists. Please choose a different Admin ID.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminName, adminId, city, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      const newAdmin = await response.json();
      setAdmins([...admins, newAdmin]);
      handleReset();
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin. Please try again.');
    }
  };

  const handleDelete = async (adminId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/admins/${adminId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete admin');
      }

      setAdmins(admins.filter(admin => admin._id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
    }
  };

  const fetchAdmins = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`http://localhost:3002/api/admins?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      const data = await response.json();
      setAdmins(data.admins);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    fetchAdmins(page, limit);
  };

  const handleLimitChange = (e) => {
    const selectedLimit = e.target.value;
    setLimit(selectedLimit);
    fetchAdmins(currentPage, selectedLimit);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center p-0">
        <div className="container-fluid w-75 p-3">
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4">
                <h4>Create Admin</h4>
              </div>
              <div className="card container ml-3 mr-3 p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label  htmlFor="adminName" className="text-start d-block"><strong>Admin Name</strong></label>
                      <TextField
                        type="text"
                        id="adminName"
                        placeholder="Admin Name"
                        value={adminName}
                        onChange={handleAdminNameChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="adminId" className="text-start d-block"><strong>Admin ID</strong></label>
                      <TextField
                        type="text"
                        id="adminId"
                        placeholder="Admin ID"
                        value={adminId}
                        onChange={handleAdminIdChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="text-start d-block"><strong>City</strong></label>
                      <select
                        id="city"
                        className="form-control"
                        value={city}
                        onChange={handleCityChange}
                        required
                      >
                        <option value="">Select City</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Multan">Multan</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Vehari">Vehari</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="password" className="text-start d-block"><strong>Password</strong></label>
                      <TextField
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex justify-content-end mt-3">
                    <Button type="reset" variant="danger" onClick={handleReset} className="mx-2">Reset</Button>
                    <div className='mx-2'></div>
                    <Button type="submit" variant="success" className="mx-2">Submit</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4 mt-4">
                <h4>Admin Data</h4>
              </div>
              <div className="card container ml-2 mr-2 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <label htmlFor="limit" className="mr-2"><strong>Show</strong></label>
                    <div className='mx-2'></div>
                    <select
                  id="limit"
                  onChange={handleLimitChange}
                  value={limit}
                  className="form-select w-auto"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={'All'}>All</option>
                </select>
                  </div>
                </div>
                <Table admins={admins} onDelete={handleDelete} />
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <nav aria-label="Admin Pagination">
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminManagementPage;
