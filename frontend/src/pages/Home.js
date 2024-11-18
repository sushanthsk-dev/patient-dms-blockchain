import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchVerifiedDoctors, fetchPatients } from "../api/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [recentPatients, setRecentPatients] = useState([]);
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    // Simulate fetching data for patients and doctors
    const fetchPatientData = async () => {
      const patients = await getPatientData(); // Replace with actual API call
      const doctors = await getDoctorData(); // Replace with actual API call
      setTotalPatients(patients.length);
      setTotalDoctors(doctors.length);
      setRecentPatients(patients.slice(0, 5));

      // Prepare data for the graph (patients registered over time)
      const dates = patients.map((patient) => patient.registeredAt);
      const counts = Array.from(new Set(dates)).map(
        (date) => dates.filter((d) => d === date).length
      );
      setPatientData({ labels: Array.from(new Set(dates)), counts });
    };

    fetchPatientData();
  }, []);

  // Simulated function for fetching patient data
  const getPatientData = async () => {

    return await fetchPatients();
  };

  /**
   * 
   * @returns 
   */
  const getDoctorData = async () => {
    return await fetchVerifiedDoctors();
  };

  const chartData = {
    labels: patientData.labels,
    datasets: [
      {
        label: "Patients Registered",
        data: patientData.counts,
        backgroundColor: "rgba(255,99,132,0.8)", // Beautiful color for the bars
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        barThickness: 30, // Adjust thickness for a more appealing look
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} patients`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      {/* Hospital Banner with background image */}
      <div
        className="w-full bg-cover bg-center text-white p-16 rounded-lg shadow-lg mb-6"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6010794/pexels-photo-6010794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      >
        <h1 className="text-5xl font-bold text-center">
          Welcome to the Patient Data Management System
        </h1>
        <p className="text-center text-xl mt-4">
          Your health records, secured and accessible at any time, anywhere.
          Stay informed and manage your care efficiently with our powerful
          tools.
        </p>
        <div className="flex justify-center mt-6">
          <button className="bg-white text-blue-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all">
            Get Started
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* Total Patients Card */}
        <div className="w-full p-6 bg-white rounded-lg shadow-lg text-center border-2 border-teal-500 hover:bg-teal-100 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Total Patients
          </h2>
          <p className="text-4xl text-teal-600">{totalPatients}</p>
        </div>

        {/* Total Doctors Card */}
        <div className="w-full p-6 bg-white rounded-lg shadow-lg text-center border-2 border-purple-500 hover:bg-purple-100 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Total Doctors
          </h2>
          <p className="text-4xl text-purple-600">{totalDoctors}</p>
        </div>

        {/* Recent Patients Card */}
        <div className="w-full p-6 bg-white rounded-lg shadow-lg border-2 border-blue-500 hover:border-blue-700 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Recent Patients
          </h2>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300"
              >
                {/* Patient Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-medium text-gray-800">
                    {patient.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    ({patient.age} years)
                  </div>
                </div>

                {/* Patient Registration Date with Icon */}
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2M9 8V6a3 3 0 016 0v2"
                    />
                  </svg>
                  <span>{patient.registeredAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Registration Graph Card */}
        <div className="w-full p-6 bg-white rounded-lg shadow-lg border-2 border-red-500 hover:bg-red-100 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Patient Registration Over Time
          </h2>
          <div className="w-full max-w-4xl mx-auto">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
