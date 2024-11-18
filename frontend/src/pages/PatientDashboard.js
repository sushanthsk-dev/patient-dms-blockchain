import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Table, Avatar, Tooltip, AutoComplete } from 'antd';
import { addMedicalRecord, fetchPatients, registerPatient, authorizeDoctor, fetchVerifiedDoctors } from '../api/api';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [isViewRecordModalVisible, setIsViewRecordModalVisible] = useState(false);
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', accountAddress: '' });
  const [currentPatient, setCurrentPatient] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [searchDoctor, setSearchDoctor] = useState(''); // State for doctor search input
  const [doctorAddress, setDoctorAddress] = useState(''); // State to store selected doctor's address

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const showRecordModal = (patient) => {
    setCurrentPatient(patient);
    setIsRecordModalVisible(true);
  };
  const handleRecordCancel = () => setIsRecordModalVisible(false);
  const showViewRecordModal = (patient) => {
    setCurrentPatient(patient);
    setIsViewRecordModalVisible(true);
  };
  const handleViewRecordCancel = () => setIsViewRecordModalVisible(false);
  const showDoctorModal = (patient) => {
    setCurrentPatient(patient);
    setIsDoctorModalVisible(true);
  };
  const handleDoctorCancel = () => {
    setSearchDoctor('');
    setIsDoctorModalVisible(false);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleRecordChange = (e) => setMedicalRecord(e.target.value);

  const handleAddPatient = async () => {
    if (newPatient.name && newPatient.age && newPatient.accountAddress) {
      await registerPatient(newPatient);
      setNewPatient({ name: '', age: '', accountAddress: '' });
      setIsRefresh(true);
      handleCancel();
    }
  };

  const handleAddMedicalRecord = async () => {
    await addMedicalRecord({ record: medicalRecord, patientAddress: currentPatient.address });
    setMedicalRecord('');
    setIsRefresh(true);
    handleRecordCancel();
  };

  const getDoctors = async () => {
    const doctorsList = await fetchVerifiedDoctors();
    setDoctors(doctorsList);
  };

  const handleAuthorizeDoctor = async () => {
    if (doctorAddress) {
      await authorizeDoctor({doctorAddress: doctorAddress, patientAddress: currentPatient.address});
      setIsRefresh(true);
      handleDoctorCancel();
    }
  };

  const getAllPatients = async () => {
    const patients = await fetchPatients();
    setIsRefresh(false);
    setPatients(patients);
  };

  useEffect(() => {
    getAllPatients();
    getDoctors();
  }, [isRefresh]);

  const getDoctorInitials = (name) => {
    debugger
    const nameParts = name.split(' ');
    if(nameParts)
    return `${nameParts[0][0]}${nameParts[1][0]}`;
  };

  const columns = [
    { title: 'Account Address', dataIndex: 'address', key: 'address' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Registration Date', dataIndex: 'registeredAt', key: 'registeredAt' },
    {
      title: 'Authorized Doctors',
      key: 'authorizedDoctors',
      render: (text, record) => (
        <div className="flex space-x-2">
          {Array.isArray(record.authorizedDoctors) && record.authorizedDoctors.length > 0 ? record.authorizedDoctors.map(({name}, index) => (
            <Tooltip key={index} title={name}> 
              <Avatar key={index} size={40} className="border-2 border-gray-300">
                {getDoctorInitials(name)}
              </Avatar>
            </Tooltip>
          )) : <p>-</p>}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="space-x-2">
          {localStorage.getItem('role') === "doctor" && <Button type="default" onClick={() => showRecordModal(record)} className="text-blue-500 border-blue-500">
            Add Medical Record
          </Button>}
          {Array.isArray(record.medicalRecords) && record.medicalRecords.length > 0 && (
            <Button type="default" onClick={() => showViewRecordModal(record)} className="text-green-500 border-green-500">
              View Medical Records
            </Button>
          )}
          {localStorage.getItem('role') === "admin" && <Button type="primary" onClick={() => showDoctorModal(record)} className="bg-green-500 hover:bg-green-700">
            Authorize Doctor
          </Button>}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="mb-6 text-right">
        {localStorage.getItem('role') === "admin" && <Button type="primary" onClick={showModal} className="bg-blue-500 hover:bg-blue-700">
          Add New Patient
        </Button>}
      </div>

      <Table dataSource={patients} columns={columns} rowKey="address" pagination={false} />

      <Modal title="Add New Patient" open={isModalVisible} onOk={handleAddPatient} onCancel={handleCancel} okText="Add Patient">
        <div className="space-y-4">
          <Input placeholder="Enter Patient's Name" value={newPatient.name} onChange={handleInputChange} name="name" />
          <Input placeholder="Enter Patient's Age" value={newPatient.age} onChange={handleInputChange} name="age" />
          <Input placeholder="Enter Patient account address" value={newPatient.accountAddress} onChange={handleInputChange} name="accountAddress" />
        </div>
      </Modal>

      {currentPatient && (
        <Modal title={`Add Medical Record for ${currentPatient.name}`} open={isRecordModalVisible} onOk={handleAddMedicalRecord} onCancel={handleRecordCancel} okText="Add Record">
          <div className="space-y-4">
            <Input.TextArea placeholder="Enter medical record details" value={medicalRecord} onChange={handleRecordChange} rows={4} />
          </div>
        </Modal>
      )}

      {currentPatient && (
        <Modal title={`Medical Records for ${currentPatient.name}`} open={isViewRecordModalVisible} onOk={handleViewRecordCancel} onCancel={handleViewRecordCancel} footer={[<Button key="close" onClick={handleViewRecordCancel}>Close</Button>]}>
          <ul className="list-disc space-y-2 pl-4">
            {currentPatient.medicalRecords.map((record, index) => <li key={index}>{record}</li>)}
          </ul>
        </Modal>
      )}

      {currentPatient && (
        <Modal
          title="Authorize Doctor"
          open={isDoctorModalVisible}
          onCancel={handleDoctorCancel}
          footer={[
            <Button key="close" onClick={handleDoctorCancel}>Close</Button>,
            <Button key="authorize" type="primary" onClick={handleAuthorizeDoctor}>Authorize Doctor</Button>,
          ]}
        >
          <div className="space-y-4" style={{ width: '100%' }}>
            <AutoComplete
              placeholder="Search for a doctor"
              value={searchDoctor}
              onChange={(value) => setSearchDoctor(value)}
              options={doctors
                .filter((doctor) => {
                  const authorizedDoctors = currentPatient.authorizedDoctors.map(({doctorAddress}) => doctorAddress);
                  return !authorizedDoctors.includes(doctor.doctorAddress) && doctor.name.toLowerCase().includes(searchDoctor.toLowerCase()); 
                })
                .map((doctor) => ({
                  value: doctor.name,
                  label: doctor.name,
                  doctorAddress: doctor.doctorAddress, // Include doctor address
                }))}
              style={{ width: '100%' }}
              onSelect={(value, option) => {
                // On selecting a doctor, set doctor address
                setDoctorAddress(option.doctorAddress);
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientDashboard;
