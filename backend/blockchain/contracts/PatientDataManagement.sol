// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientDataManagement {
    struct Doctor {
        address doctorAddress;
        string name;
        string specialization;
        bool isVerified;
    }
    struct Patient {
        address patientAddress;
        string name;
        uint256 age;
        string[] medicalRecords;
        Doctor[] authorizedDoctors;
        uint256 registeredAt; // Timestamp of registration
    }
    
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    address public admin;
    address[] private patientAddresses; // Array to keep track of all registered patient addresses
    address[] private doctorAddresses; // Array to keep track of all registered doctor addresses

    event PatientRegistered(address indexed patientAddress, string name, uint256 registeredAt);
    event DoctorRegistered(address indexed doctorAddress, string name);
    event MedicalRecordAdded(address indexed patientAddress, string record);
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }
    
    modifier onlyAuthorizedDoctor(address patientAddress) {
        require(doctors[msg.sender].isVerified, "Doctor is not verified.");
        require(isAuthorizedDoctorForPatient(patientAddress, msg.sender), "Doctor not authorized for this patient.");
        _;
    }

    function registerPatient(string memory _name, uint256 _age) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered.");
        
        patients[msg.sender].name = _name;
        patients[msg.sender].age = _age;
        patients[msg.sender].registeredAt = block.timestamp; // Set the registration timestamp
        patientAddresses.push(msg.sender); // Store the patient's address
        emit PatientRegistered(msg.sender, _name, block.timestamp);
    }
    
    function registerDoctor(address _doctorAddress, string memory _name, string memory _specialization) public onlyAdmin {
        require(bytes(doctors[_doctorAddress].name).length == 0, "Doctor already registered.");
        
        doctors[_doctorAddress].name = _name;
        doctors[_doctorAddress].specialization = _specialization;
        doctors[_doctorAddress].isVerified = false;
        doctorAddresses.push(_doctorAddress); // Store the doctor's address
        emit DoctorRegistered(_doctorAddress, _name);
    }
    
    function verifyDoctor(address _doctorAddress) public onlyAdmin {
        require(bytes(doctors[_doctorAddress].name).length != 0, "Doctor does not exist.");
        
        doctors[_doctorAddress].isVerified = true;
    }
    
    function authorizeDoctor(address _doctorAddress) public {
        // Ensure the patient exists
        require(bytes(patients[msg.sender].name).length != 0, "Patient does not exist.");
        // Ensure the doctor exists
        require(bytes(doctors[_doctorAddress].name).length != 0, "Doctor does not exist.");

        // Check if the doctor is already authorized
        bool alreadyAuthorized = false;
        for (uint i = 0; i < patients[msg.sender].authorizedDoctors.length; i++) {
            if (patients[msg.sender].authorizedDoctors[i].doctorAddress == _doctorAddress) {
                alreadyAuthorized = true;
                break; // Exit the loop early if the doctor is already authorized
            }
        }

        // If the doctor is already authorized, skip adding
        if (alreadyAuthorized) {
            revert("Doctor already authorized.");
        }

        // Add the doctor to the authorizedDoctors list
        doctors[_doctorAddress].doctorAddress = _doctorAddress;
        patients[msg.sender].authorizedDoctors.push(doctors[_doctorAddress]);
    }
    
    function addMedicalRecord(address _patientAddress, string memory _record) public onlyAuthorizedDoctor(_patientAddress) {
        patients[_patientAddress].medicalRecords.push(_record);
        emit MedicalRecordAdded(_patientAddress, _record);
    }
    
    function getPatientRecords(address _patientAddress)
        public
        view
        returns (
            string memory patientName,
            uint256 patientAge,
            uint256 registeredAt,
            string[] memory medicalRecords,
            Doctor[] memory authorizedDoctors
        )
    {
        require(
            msg.sender == _patientAddress || 
            msg.sender == admin ||
            isAuthorizedDoctorForPatient(_patientAddress, msg.sender),
            "Unauthorized access to patient records."
        );
        
        Patient memory patient = patients[_patientAddress];
        
        // Assign the values to local variables to return
        string[] memory records = patient.medicalRecords;
        Doctor[] memory doctorsList = patient.authorizedDoctors;

        return (
            patient.name,
            patient.age,
            patient.registeredAt,
            records,
            doctorsList
        );
    }

    function getAuthorizedDoctorNames(address _patientAddress)
        public
        view
        returns (string[] memory doctorNames)
    {
        require(
            msg.sender == _patientAddress || 
            msg.sender == admin ||
            isAuthorizedDoctorForPatient(_patientAddress, msg.sender),
            "Unauthorized access to doctor information."
        );
        
        Patient memory patient = patients[_patientAddress];
        uint256 length = patient.authorizedDoctors.length;
        doctorNames = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address doctorAddress = patient.authorizedDoctors[i].doctorAddress;
            doctorNames[i] = doctors[doctorAddress].name;
        }
        
        return doctorNames;
    }
    
    function isAuthorizedDoctorForPatient(address _patientAddress, address _doctorAddress) internal view returns (bool) {
        for (uint i = 0; i < patients[_patientAddress].authorizedDoctors.length; i++) {
            if (patients[_patientAddress].authorizedDoctors[i].doctorAddress == _doctorAddress) {
                return true;
            }
        }
        return false;
    }
    
    // New function to return all registered patients
    function getAllPatients() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientAddresses.length);
        
        for (uint i = 0; i < patientAddresses.length; i++) {
            allPatients[i] = patients[patientAddresses[i]];
            allPatients[i].patientAddress = patientAddresses[i];
        }
        
        return allPatients;
    }

    // New function to return all verified doctors
    function getVerifiedDoctors() public view returns (Doctor[] memory) {
        uint256 verifiedCount = 0;
        
        // Count how many verified doctors there are
        for (uint i = 0; i < doctorAddresses.length; i++) {
            if (doctors[doctorAddresses[i]].isVerified) {
                verifiedCount++;
            }
        }

        // Create an array to store verified doctors
        Doctor[] memory verifiedDoctors = new Doctor[](verifiedCount);
        uint256 index = 0;

        // Populate the array with verified doctors
        for (uint i = 0; i < doctorAddresses.length; i++) {
            if (doctors[doctorAddresses[i]].isVerified) {
                verifiedDoctors[index] = doctors[doctorAddresses[i]];
                verifiedDoctors[index].doctorAddress = doctorAddresses[i];
                index++;
            }
        }

        return verifiedDoctors;
    }

    // New function to return all doctors
    function getDoctors() public view returns (Doctor[] memory) {

        // Create an array to store allDoctors
        Doctor[] memory allDoctors = new Doctor[](doctorAddresses.length);

        for (uint i = 0; i < doctorAddresses.length; i++) {
                allDoctors[i] = doctors[doctorAddresses[i]];
                allDoctors[i].doctorAddress = doctorAddresses[i];
        }

        return allDoctors;
    }
}
