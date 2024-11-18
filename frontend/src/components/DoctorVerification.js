import React, { useState } from 'react';
import { verifyDoctor } from '../api/api';

const DoctorVerification = () => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const adminAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"; // Admin address for sender

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyDoctor({ doctorAddress, sender: adminAddress });
      alert('Doctor verified successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to verify doctor');
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
      <button type="submit" className="w-full bg-yellow-500 text-white p-2">
        Verify Doctor
      </button>
    </form>
  );
};

export default DoctorVerification;

