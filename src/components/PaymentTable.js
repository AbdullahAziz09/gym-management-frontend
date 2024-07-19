import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

const PaymentTable = ({ payments, onDelete }) => {
  if (!payments || payments.length === 0) {
    return <div>No payments found.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Paid for Month/Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.trainee ? payment.trainee.traineeId : 'Unknown'}</td>
              <td>{payment.amount}</td>
              <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
              <td>{new Date(payment.monthYear).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              <td>
              <RiDeleteBin6Line 
                  color="red"
                  size={20}
                  onClick={() => onDelete(payment._id)}
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

export default PaymentTable;
