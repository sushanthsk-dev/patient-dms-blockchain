import React, { useState } from 'react';
import { authorizeDoctor } from '../api/api';

const AuthorizeDoctor = () => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [patientAddress, setPatientAddress] = useState(''); // Patient's wallet address

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authorizeDoctor({ doctorAddress, sender: patientAddress });
      alert('Doctor authorized successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to authorize doctor');
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Doctor Wallet Address"
        value={doctorAddress}
        onChange={(e) => setDoctorAddress(e.target.value)}
        required
      />
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Patient Wallet Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-purple-500 text-white p-2">
        Authorize Doctor
      </button>
    </form>
  );
};

export default AuthorizeDoctor;

