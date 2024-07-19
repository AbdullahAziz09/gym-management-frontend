// TraineesTable.js
import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

const TraineesTable = ({ trainees, onDelete }) => {
  return (
    <div className="container ml-3 mr-3">
      <table className="table table-bordered mt-5 table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Trainee ID</th>
            <th>Name</th>
            <th>CNIC</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>City</th>
            <th>Status</th>
            <th>Package Name</th>
            <th>Package Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((trainee) => (
            <tr key={trainee._id}>
              <td>{trainee.traineeId}</td>
              <td>{trainee.name}</td>
              <td>{trainee.cnic}</td>
              <td>{trainee.phoneNo}</td>
              <td>{trainee.emailAddress}</td>
              <td>{trainee.city}</td>
              <td>{trainee.status}</td>
              <td>{trainee.package?.packageName || 'N/A'}</td>
              <td>{trainee.package?.packageAmount || 'N/A'}</td>
              <td>
              <RiDeleteBin6Line 
                  color="red"
                  size={20}
                  onClick={() => onDelete(trainee._id)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TraineesTable;
