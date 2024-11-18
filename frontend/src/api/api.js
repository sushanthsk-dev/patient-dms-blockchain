import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';
const apiWrapper = axios.create({
    baseURL: API_BASE, // Set your base URL
});

// Add a request interceptor to add bearer token in header
apiWrapper.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('jwtToken');

        // If token exists, add it to the headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle any errors during the request setup
        return Promise.reject(error);
    }
);

/**
 * Register Patient
 * @param {Object} data the payload
 * @returns the registered data
 */
export const registerPatient = (data) => {
  return apiWrapper.post(`/patient/register`, data, {
    headers: {
      
    }
  });
};

/**
 * Get Patient Records by walletAddress
 * @param {String} walletAddress 
 * @returns the patient record
 */
export const getPatientRecords = (walletAddress) => {
  return apiWrapper.get(`/patient/${walletAddress}/records`);
};


/**
 * Get User profile
 * @returns user profile
 */
export const getMe = () => {
  return apiWrapper.get(`/user/me`);
};

/**
 * Register a new doctor
 * @param {Object} data the payload
 * @returns registered doctor data
 */
export const registerDoctor = (data) => {
  return apiWrapper.post(`/doctor/register`, data);
};

/**
 * 
 * @param {*} data 
 * @returns 
 */
export const verifyDoctor = (data) => {
  debugger
  return apiWrapper.post(`/doctor/verify-doctor`, data);
};

/**
 * Authorize a doctor to access patient records
 * @param {Object} data 
 * @returns
 */
export const authorizeDoctor = (data) => {
  return apiWrapper.post(`/doctor/authorize-doctor`, data);
};

/**
 * Add Medical record
 * @param {Object} data 
 * @returns 
 */
export const addMedicalRecord = (data) => {
  return apiWrapper.post(`/medical-record/add`, data);
};


/**
 * Fetch all doctors
 * @returns list of doctors
 */
export const fetchVerifiedDoctors = async () => {
  try {
    const response = await apiWrapper.get(`/doctor/verified/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

/**
 * Fetch all doctors
 * @returns list of doctors
 */
export const fetchDoctors = async () => {
  try {
    const response = await apiWrapper.get(`/doctor/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

/**
 * Fetch patients
 * @returns the list of patients
 */
export const fetchPatients = async () => {
  try {
    const response = await apiWrapper.get(`/patient/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};


/**
 * Login
 * @param {Object} data 
 * @returns 
 */
export const login = async (data) => {
  try {
    debugger
    const response = await apiWrapper.post(`/user/login`, data);

    
    return response.data; // return data if needed
  } catch (error) {
    throw error;  // rethrow if you need additional error handling
  }
};

/**
 * Signup
 * @param {String} email the email
 * @param {String} password the password
 * @returns 
 */
export const signup = async (email, password) => {
  try {
    const response = await apiWrapper.post(`/user/signup`, {email, password});

    if (!response.ok) throw new Error('Login failed');
    
    return await response.json();  // return data if needed
  } catch (error) {
    throw error;
  }
};