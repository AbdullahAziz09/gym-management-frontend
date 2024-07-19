// Table.js

import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

const Table = ({ admins, onDelete }) => {
  const handleDelete = (adminId) => {
    onDelete(adminId);
  };

  return (
    <div className="container ml-3 mr-3">
      <table className="table table-bordered mt-5 table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Admin Name</th>
            <th>Admin ID</th>
            <th>City</th>
            <th>Password</th>
            <th>Entry Date</th>
            <th>Operator</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.adminName}</td>
              <td>{admin.adminId}</td>
              <td>{admin.city}</td>
              <td>{admin.password}</td>
              <td>{admin.entryDate}</td>
              <td>{admin.operator}</td>
              <td>
              <RiDeleteBin6Line 
                  color="red"
                  size={20}
                  onClick={() => handleDelete(admin._id)}
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

export default Table;
