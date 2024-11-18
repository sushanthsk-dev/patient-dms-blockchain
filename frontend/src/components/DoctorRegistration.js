import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Table } from 'antd';
import { verifyDoctor, registerDoctor, fetchDoctors } from '../api/api';

const DoctorRegistration = () => {
  const [doctors, setDoctors] = useState([{
    name: "Hello",
    specialty: "Don't",
    verified: true
  }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorAddress, setNewDoctorAddress] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);

  // Fetch doctors when component mounts
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const fetchedDoctors = await fetchDoctors();
        setDoctors(fetchedDoctors);

      } catch (error) {
        console.error('Error loading doctors:', error);
      }
      setIsRefresh(false);
    };
    loadDoctors();
  }, [isRefresh]);

  // Verify doctor by ID
  const handleVerifyDoctor = async (doctorId) => {
    try {
      debugger
      await verifyDoctor({doctorAddress: doctorId});
      setIsRefresh(true);
    } catch (error) {
      console.error('Error verifying doctor:', error);
    }
  };

  // Add new doctor
  const handleRegisterDoctor = async () => {
    try {
      const newDoctor = await registerDoctor({
        name: newDoctorName,
        specialization: newDoctorSpecialty,
        doctorAddress: newDoctorAddress
      });
      setIsRefresh(true);
      setIsModalVisible(false);
      setNewDoctorName('');
      setNewDoctorSpecialty('');
      setNewDoctorAddress('');

    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  // Table columns for doctors
  const columns = [
    {
      title: 'Doctor Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Verification Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified) => (
        <span
          className={`px-2 py-1 rounded-full text-white ${
            isVerified ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        >
          {isVerified ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="primary"
          disabled={record.isVerified}
          onClick={() => handleVerifyDoctor(record.doctorAddress)}
        >
          Verify
        </Button>
      ),
    },
  ];

  return (
    <div className="doctor-registration-container">
      <div className="md-6 mb-4">
        <h2 className={`font-bold text-xl transition-all duration-300`}>Manage Doctors</h2>
        <div className='text-right'>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="mt-6 bg-blue-500 hover:bg-blue-700"
          >
            Add New Doctor
          </Button>
        </div>
      </div>
      <Table
        dataSource={doctors}
        columns={columns}
        rowKey="id"
        pagination={false}
      />


      {/* Modal for Adding a New Doctor */}
      <Modal
        title="Add New Doctor"
        open={isModalVisible}  // Using 'open' prop instead of 'visible'
        onOk={handleRegisterDoctor}
        onCancel={() => setIsModalVisible(false)}
        okText="Add Doctor"
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter Doctor's Name"
            value={newDoctorName}
            onChange={(e) => setNewDoctorName(e.target.value)}
          />
          <Input
            placeholder="Enter Doctor's Address"
            value={newDoctorAddress}
            onChange={(e) => setNewDoctorAddress(e.target.value)}
          />
          <Input
            placeholder="Enter Doctor's Specialty"
            value={newDoctorSpecialty}
            onChange={(e) => setNewDoctorSpecialty(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DoctorRegistration;
