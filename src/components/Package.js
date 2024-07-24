import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import { MdEditCalendar } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

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
      toast.error('Failed to fetch packages. Please try again.');
    }
  };

  const handleUpdatePackage = async (packageId, updatedPackage) => {
    try {
      const response = await fetch(`http://localhost:3002/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPackage),
      });

      if (!response.ok) {
        throw new Error('Failed to update package');
      }

      fetchPackages();
      updateAssociatedTrainees(packageId, updatedPackage);
      toast.success('Package updated successfully');
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package. Please try again.');
    }
  };

  const updateAssociatedTrainees = async (packageId, updatedPackage) => {
    try {
      const response = await fetch(`http://localhost:3002/api/trainees/updateByPackage/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageName: updatedPackage.packageName,
          packageAmount: updatedPackage.packageAmount,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update associated trainees');
      }
    } catch (error) {
      console.error('Error updating associated trainees:', error);
      toast.error('Failed to update associated trainees. Please try again.');
    }
  };
  
  

  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleSaveClick = () => {
    if (selectedPackage) {
      const { _id, packageName, packageAmount } = selectedPackage;
      handleUpdatePackage(_id, { packageName, packageAmount });
      setSelectedPackage(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPackage((prev) => ({ ...prev, [name]: value }));
  };

  const renderPackageRows = () => {
    return packages.map((pkg) => (
      <tr key={pkg._id}>
        <td>{pkg.packageName}</td>
        <td>{pkg.packageAmount}</td>
        <td>
          <MdEditCalendar 
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#007bff' }} 
            onClick={() => handleEditClick(pkg)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center p-0">
        <div className="container-fluid w-75 p-3">
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4">
                <h4>Package Management</h4>
              </div>
              <div className="card container ml-2 mr-2 p-4">
                <div className="row mb-3">
                  <div className="col">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Package Name</th>
                          <th>Package Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>{renderPackageRows()}</tbody>
                    </table>
                  </div>
                </div>
                {selectedPackage && (
                  <div className="row">
                    <div className="col">
                      <h3>Edit Package</h3>
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Package Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="packageName"
                            value={selectedPackage.packageName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Package Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            name="packageAmount"
                            value={selectedPackage.packageAmount}
                            onChange={handleChange}
                          />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add this to display toast notifications */}
    </>
  );
};

export default Package;
