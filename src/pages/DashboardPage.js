import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Chart from 'chart.js/auto';
import videoSrc from '../pages/night.mp4'; // Import the video

const DashboardPage = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [traineeCount, setTraineeCount] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const donutChartRef = useRef(null);

  const adminColor = 'rgba(255, 99, 132, 0.2)';
  const trainerColor = 'rgba(255, 159, 64, 0.2)';
  const traineeColor = 'rgba(54, 162, 235, 0.2)';

  // Memoize monthColors to prevent unnecessary re-renders
  const monthColors = useMemo(() => [
    '#FF6384', '#FF9F40', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF99CC', '#C9CBCF', '#66FF66', '#CC99FF', '#FF6633', '#669999'
  ], []);

  const createBarChart = useCallback((adminsByCityData, trainersByCityData, traineesByCityData) => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Extract city names and counts for chart labels and data
      const cities = [...new Set([
        ...adminsByCityData.map(cityData => cityData._id),
        ...trainersByCityData.map(cityData => cityData._id),
        ...traineesByCityData.map(cityData => cityData._id),
      ])];

      const adminCounts = cities.map(city => {
        const cityData = adminsByCityData.find(cityData => cityData._id === city);
        return cityData ? cityData.count : 0;
      });

      const trainerCounts = cities.map(city => {
        const cityData = trainersByCityData.find(cityData => cityData._id === city);
        return cityData ? cityData.count : 0;
      });

      const traineeCounts = cities.map(city => {
        const cityData = traineesByCityData.find(cityData => cityData._id === city);
        return cityData ? cityData.count : 0;
      });

      // Create new chart instance
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: cities,
          datasets: [
            {
              label: 'Admins',
              data: adminCounts,
              backgroundColor: adminColor,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Trainers',
              data: trainerCounts,
              backgroundColor: trainerColor,
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
            {
              label: 'Trainees',
              data: traineeCounts,
              backgroundColor: traineeColor,
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Store the new instance to the ref
      chartInstanceRef.current = newChartInstance;
    }
  }, [adminColor, trainerColor, traineeColor]);

  const createDonutChart = useCallback((monthlyPaymentsData) => {
    if (donutChartRef.current) {
      const ctx = donutChartRef.current.getContext('2d');

      // Destroy existing chart instance if it exists
      if (donutChartRef.current.chartInstance) {
        donutChartRef.current.chartInstance.destroy();
      }

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthLabels = months.filter(month => {
        const monthData = monthlyPaymentsData.find(data => data.month === month);
        return monthData && monthData.totalAmount > 0;
      });

      const monthAmounts = monthLabels.map(month => {
        const monthData = monthlyPaymentsData.find(data => data.month === month);
        return monthData ? monthData.totalAmount : 0;
      });

      // Create new chart instance
      const newDonutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: monthLabels,
          datasets: [{
            label: 'Monthly Payments',
            data: monthAmounts,
            backgroundColor: monthColors.slice(0, monthLabels.length),
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });

      // Store the new instance to the ref
      donutChartRef.current.chartInstance = newDonutChartInstance;
    }
  }, [monthColors]);

  useEffect(() => {
    const fetchAdminsByCity = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/admins/by-city');
        if (!response.ok) {
          throw new Error('Failed to fetch admins by city');
        }
        const data = await response.json();
        return data.adminsByCity;
      } catch (error) {
        console.error('Error fetching admins by city:', error);
        return [];
      }
    };

    const fetchTrainersByCity = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/trainers/by-city');
        if (!response.ok) {
          throw new Error('Failed to fetch trainers by city');
        }
        const data = await response.json();
        return data.trainersByCity;
      } catch (error) {
        console.error('Error fetching trainers by city:', error);
        return [];
      }
    };

    const fetchTraineesByCity = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/trainees/by-city');
        if (!response.ok) {
          throw new Error('Failed to fetch trainees by city');
        }
        const data = await response.json();
        return data.traineesByCity;
      } catch (error) {
        console.error('Error fetching trainees by city:', error);
        return [];
      }
    };

    const fetchData = async () => {
      const [adminsByCity, trainersByCity, traineesByCity] = await Promise.all([
        fetchAdminsByCity(),
        fetchTrainersByCity(),
        fetchTraineesByCity()
      ]);

      // Calculate total counts
      const totalAdmins = adminsByCity.reduce((total, cityData) => total + cityData.count, 0);
      const totalTrainers = trainersByCity.reduce((total, cityData) => total + cityData.count, 0);
      const totalTrainees = traineesByCity.reduce((total, cityData) => total + cityData.count, 0);

      setAdminCount(totalAdmins);
      setTrainerCount(totalTrainers);
      setTraineeCount(totalTrainees);

      // Update the bar chart with new data
      createBarChart(adminsByCity, trainersByCity, traineesByCity);
    };

    fetchData();
  }, [createBarChart]);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/payments/monthly-totals');
        if (!response.ok) {
          throw new Error('Failed to fetch monthly payment totals');
        }
        const data = await response.json();
        return data.monthlyTotals;
      } catch (error) {
        console.error('Error fetching monthly payment totals:', error);
        return [];
      }
    };

    const fetchDonutChartData = async () => {
      const monthlyPaymentsData = await fetchMonthlyPayments();
      createDonutChart(monthlyPaymentsData);
    };

    fetchDonutChartData();
  }, [createDonutChart]);

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <video autoPlay loop muted className="background-video" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          overflow: 'hidden',
        }}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
          <div className="container">
            <div className="card bg-dark text-white py-2 mb-3 text-start p-3">
              <h4>Welcome to Dashboard</h4>
            </div>
            <div className="card bg-white text-dark py-2 mb-3 text-start p-4 mt-4">
              <div className="row mt-4">
                <div className="col-md-4">
                  <Card header="Admins" count={adminCount} color="danger" />
                </div>
                <div className="col-md-4">
                  <Card header="Trainers" count={trainerCount} color="warning" />
                </div>
                <div className="col-md-4">
                  <Card header="Trainees" count={traineeCount} color="primary" />
                </div>
              </div>
            </div>
            <div className="card bg-white text-dark py-2 mb-3 p-4">
              <h5 className="text-center mb-4"><strong>City Wise Counts</strong></h5>
              <div style={{ position: 'relative', height: '400px' }}>
                <canvas ref={chartRef} />
              </div>
            </div>
            <div className="card bg-white text-dark py-2 mb-3 p-4">
              <h5 className="text-center mb-4"><strong>Monthly Payments</strong></h5>
              <div style={{ position: 'relative', height: '400px' }}>
                <canvas ref={donutChartRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
