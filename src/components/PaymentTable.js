import React from 'react';
import { RiDeleteBin6Line, RiPrinterLine } from 'react-icons/ri';

const PaymentTable = ({ payments, onDelete }) => {
  const handlePrint = (payment) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #ddd; padding: 20px; box-shadow: 0 6px 12px rgba(0,0,0,0.2); background: #f5f5f5; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 10px 0; font-size: 32px; color: #007bff;">Invoice</h2>
          <p style="font-style: italic; color: #666;">Thank you for your payment!</p>
        </div>
        <div style="margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
          <h3 style="font-size: 24px; color: #007bff;">Trainee Details</h3>
          <p><strong>ID:</strong> ${payment.trainee ? payment.trainee.traineeId : 'Unknown'}</p>
          <p><strong>Name:</strong> ${payment.trainee ? payment.trainee.name : 'Unknown'}</p>
        </div>
        <div style="margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
          <h3 style="font-size: 24px; color: #007bff;">Payment Details</h3>
          <p><strong>Payment Date:</strong> ${new Date(payment.paymentDate).toLocaleDateString()}</p>
          <p><strong>Paid for Month/Year:</strong> ${new Date(payment.monthYear).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p><strong>Amount:</strong> ${payment.amount}</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #888;">This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '', 'height=700,width=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

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
                  size={24}
                  onClick={() => onDelete(payment._id)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                />
                <RiPrinterLine
                  color="#007bff" 
                  size={24}
                  onClick={() => handlePrint(payment)}
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
