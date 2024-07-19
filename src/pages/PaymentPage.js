import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TextField from '../components/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../components/Button';
import PaymentTable from '../components/PaymentTable';

const PaymentPage = () => {
  const [trainees, setTrainees] = useState([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState('');
  const [amount, setAmount] = useState('');
  const [monthYear, setMonthYear] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainees();
    fetchPayments();
  }, []);

  const fetchTrainees = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/trainees?forDropdown=true');
      if (!response.ok) {
        throw new Error('Failed to fetch trainees');
      }
      const data = await response.json();
      setTrainees(data.trainees);
    } catch (error) {
      console.error('Error fetching trainees:', error);
      setError('Failed to fetch trainees. Please try again.');
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments. Please try again.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTraineeId || !amount || !monthYear) {
      alert('Please fill all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      alert('Please enter a valid amount');
      return;
    }

    const trainee = trainees.find((t) => t._id === selectedTraineeId);
    if (!trainee) {
      alert('Trainee not found');
      return;
    }

    if (numericAmount < trainee.package.packageAmount) {
      alert(`Please enter at least ${trainee.package.packageAmount} to pay.`);
      return;
    }

    // Check if the trainee has already made a payment for the selected month
    const formattedMonthYear = new Date(monthYear).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const existingPayment = payments.find((payment) => {
      const paymentMonthYear = new Date(payment.monthYear).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      return payment.trainee._id === selectedTraineeId && paymentMonthYear === formattedMonthYear;
    });

    if (existingPayment) {
      alert(`Trainee has already made a payment for ${formattedMonthYear}`);
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traineeId: selectedTraineeId,
          amount: numericAmount,
          monthYear: monthYear.toLocaleDateString(), // Convert Date object to string format
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to make payment');
      }

      const newPayment = await response.json();
      setPayments([...payments, newPayment]);
      setSelectedTraineeId('');
      setAmount('');
      setMonthYear(new Date());
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Failed to make payment. Please try again.');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }

      setPayments(payments.filter((payment) => payment._id !== paymentId));
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center p-0">
        <div className="container-fluid w-75 p-3">
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white py-2 mb-3 text-start p-4">
                <h4>Make Payment</h4>
              </div>
              <div className="card container ml-2 mr-2 p-4">
                <form onSubmit={handlePaymentSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="traineeId" className="text-start d-block">
                        <strong>Trainee</strong>
                      </label>
                      <select
                        id="traineeId"
                        className="form-control"
                        value={selectedTraineeId}
                        onChange={(e) => setSelectedTraineeId(e.target.value)}
                        required
                      >
                        <option value="">Select a trainee</option>
                        {trainees.map((trainee) => (
                          <option key={trainee._id} value={trainee._id}>
                            {trainee.traineeId}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="amount" className="text-start d-block">
                        <strong>Amount</strong>
                      </label>
                      <TextField
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="monthYear" className="text-start d-block">
                        <strong>Month/Year</strong>
                      </label>
                      <DatePicker
                        id="monthYear"
                        selected={monthYear}
                        onChange={(date) => setMonthYear(date)}
                        dateFormat="d-MMMM-yyyy"
                        className="form-control"
                        wrapperClassName="w-100"
                        required
                      />
                    </div>
                    <div className="form-group d-flex justify-content-end mt-3">
                      <Button type="submit" variant="primary" className="btn-primary">
                        Make Payment
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white mt-4 py-2 mb-3 text-start p-4">
                <h4>Payment History</h4>
              </div>
              <div className="card container ml-2 mr-2 p-4">
                <PaymentTable payments={payments} onDelete={handleDeletePayment} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
