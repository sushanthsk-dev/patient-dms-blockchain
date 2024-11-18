import React, { useState } from 'react';
import { addMedicalRecord } from '../api/api';

const RecordForm = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [record, setRecord] = useState('');
  const doctorAddress = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b"; // Doctor's wallet address

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedicalRecord({ patientAddress, record, sender: doctorAddress });
      alert('Record added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add record');
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Patient Wallet Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border"
        placeholder="Medical Record"
        value={record}
        onChange={(e) => setRecord(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-red-500 text-white p-2">
        Add Medical Record
      </button>
    </form>
  );
};

export default RecordForm;

