import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

const TrainerTable = ({ trainers, onDelete }) => {
  const handleDelete = (trainerId) => {
    onDelete(trainerId);
  };

  return (
    <div className="container ml-3 mr-3">
      <table className="table table-bordered mt-5">
        <thead className="thead-dark">
          <tr>
            <th>Trainer ID</th>
            <th>Name</th>
            <th>CNIC</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>City</th>
            <th>Status</th>
            <th>Entry Date</th>
            <th>Operator</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer._id}>
              <td>{trainer.trainerId}</td>
              <td>{trainer.name}</td>
              <td>{trainer.cnic}</td>
              <td>{trainer.phoneNo}</td>
              <td>{trainer.emailAddress}</td>
              <td>{trainer.city}</td>
              <td>{trainer.status}</td>
              <td>{trainer.datetime}</td> 
              <td>{trainer.operator}</td>
              <td>
              <RiDeleteBin6Line 
                  color="red"
                  size={20}
                  onClick={() => handleDelete(trainer._id)}
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

export default TrainerTable;
