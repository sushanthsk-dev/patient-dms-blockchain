import React, { useState } from 'react';
import { registerPatient } from '../api/api';

const PatientRegistration = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient({ name, age, walletAddress });
      alert('Patient registered successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to register patient');
    }
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        className="w-full p-2 border"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2">
        Register Patient
      </button>
    </form>
  );
};

export default PatientRegistration;

