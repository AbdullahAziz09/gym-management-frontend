import React, { useState, useEffect } from 'react';
import TextField from '../components/TextField';
import Button from '../components/Button';
import TraineesTable from '../components/TraineesTable';
import Navbar from '../components/Navbar';

const TraineesPage = () => {
  const [traineeId, setTraineeId] = useState('');
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [trainees, setTrainees] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/packages');
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleTraineeIdChange = (e) => setTraineeId(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

  const handleCnicChange = (e) => {
    let value = e.target.value;
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setCnic(value);
  };

  const handlePhoneNoChange = (e) => {
    const value = e.target.value;
    if (value.length <= 11 || value === '') {
      setPhoneNo(value);
    } else {
      alert('Please Enter a Valid Phone Number');
    }
  };

  const handleEmailAddressChange = (e) => setEmailAddress(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleReset = () => {
    setTraineeId('');
    setName('');
    setCnic('');
    setPhoneNo('');
    setEmailAddress('');
    setCity('');
    setStatus('');
    setSelectedPackage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Check if traineeId already exists
     const existingTrainee = trainees.find(trainee => trainee.traineeId === traineeId);
     if (existingTrainee) {
       alert(`Trainee with ID "${traineeId}" already exists. Please use a different Trainee ID.`);
       return;
     }

    try {
      const response = await fetch('http://localhost:3002/api/trainees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traineeId,
          name,
          cnic,
          phoneNo,
          emailAddress,
          city,
          status,
          packageId: selectedPackage?._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add trainee');
      }

      const newTrainee = await response.json();
      setTrainees([...trainees, newTrainee]);
      handleReset();
    } catch (error) {
      console.error('Error adding trainee:', error);
      alert('Failed to add trainee. Please try again.');
    }
  };

  const handleDelete = async (traineeId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/trainees/${traineeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Trainee');
      }

      setTrainees(trainees.filter(trainee => trainee._id !== traineeId));
    } catch (error) {
      console.error('Error deleting trainee:', error);
      alert('Failed to delete trainee. Please try again.');
    }
  };

  const fetchTrainees = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`http://localhost:3002/api/trainees?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trainees');
      }
      const data = await response.json();
      setTrainees(data.trainees || []);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching trainees:', error);
    }
  };

  useEffect(() => {
    fetchTrainees(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    fetchTrainees(page, limit);
  };

  const handleLimitChange = (e) => {
    const selectedLimit = e.target.value;
    setLimit(selectedLimit);
    fetchTrainees(currentPage, selectedLimit);
  };

  const handlePackageChange = (e) => {
    const selectedPackageId = e.target.value;
    const selectedPackageObj = packages.find(pkg => pkg._id === selectedPackageId);
    setSelectedPackage(selectedPackageObj); // Set the selected package object
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center p-0">
        <div className="container-fluid w-75 p-3">
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4">
                <h4>Create Trainee</h4>
              </div>
              <div className="card container ml-3 mr-3 p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="traineeId" className="text-start d-block"><strong>Trainee ID</strong></label>
                      <TextField
                        type="text"
                        id="traineeId"
                        placeholder="Trainee ID"
                        value={traineeId}
                        onChange={handleTraineeIdChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="name" className="text-start d-block"><strong>Name</strong></label>
                      <TextField
                        type="text"
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={handleNameChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="cnic" className="text-start d-block"><strong>CNIC</strong></label>
                      <TextField
                        type="text"
                        id="cnic"
                        placeholder="xxxxx-xxxxxxx-x"
                        value={cnic}
                        onChange={handleCnicChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phoneNo" className="text-start d-block"><strong>Phone Number</strong></label>
                      <TextField
                        type="text"
                        id="phoneNo"
                        placeholder="Phone Number"
                        value={phoneNo}
                        onChange={handlePhoneNoChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="emailAddress" className="text-start d-block"><strong>Email Address</strong></label>
                      <TextField
                        type="email"
                        id="emailAddress"
                        placeholder="Email Address"
                        value={emailAddress}
                        onChange={handleEmailAddressChange}
                        required
                      />
                    </div>
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
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="status" className="text-start d-block"><strong>Status</strong></label>
                      <TextField
                        type="text"
                        id="status"
                        placeholder="Status"
                        value={status}
                        onChange={handleStatusChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="packageId" className="text-start d-block"><strong>Package Name</strong></label>
                      <select
                        id="packageId"
                        className="form-control"
                        value={selectedPackage?._id}
                        onChange={handlePackageChange}
                        required
                      >
                        <option value="">Select Package</option>
                        {packages.map(pkg => (
                          <option key={pkg._id} value={pkg._id}>{pkg.packageName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group d-flex justify-content-end mt-3">
                    <Button type="reset" variant="danger" onClick={handleReset} className="mx-2">Reset</Button>
                    <div className='mx-2'></div>
                    <Button type="submit" variant="primary" className="mx-2">Submit</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4 mt-4">
                <h4>Trainee Data</h4>
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
                <TraineesTable trainees={trainees} onDelete={handleDelete} />
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <nav aria-label="Trainee Pagination">
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

export default TraineesPage;
