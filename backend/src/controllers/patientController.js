const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');  // Ganache RPC endpoint
const contractAddress = process.env.CONTRACT_ADDRESS;  // Contract address
const contractABI = require('../../blockchain/build/contracts/PatientDataManagement.json');  // Contract ABI
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

function bigIntSerializer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
    }
    return value;
  }

exports.register = async (req, res) => {
  try {
    const { name, age, accountAddress } = req.body;

    // Fetch current block number (for debugging purposes)
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Current Block Number:', blockNumber);
    
    // Fetch current gas price for legacy transactions
    const gasPrice = await web3.eth.getGasPrice();

    // Define the gas settings
    const gasSettings = {
      from: accountAddress,
      gas: BigInt(3000000).toString(),  // Set the gas limit
      gasPrice: gasPrice  // Use legacy gas price
    };

    // Send the transaction to register the patient
    const result = await contract.methods.registerPatient(name, age)
      .send(gasSettings);
    
    // Send the response with the transaction result
    res.json({ success: true, transaction: JSON.parse(JSON.stringify(result, bigIntSerializer)) });
    
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecord = async (req, res) => {
    try {
        const patientAddress = req.params.address;
        const sender = req.user.accountAddress; // The address trying to access the records
        const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price
    // Define the gas settings
    const gasSettings = {
        from: sender,
        gas: BigInt(3000000).toString(),  // Set the gas limit
        gasPrice: gasPrice 
      };
        // Call the smart contract to get patient records
        const record = await contract.methods.getPatientRecords(patientAddress).call(gasSettings);
        const jsonData = JSON.parse(JSON.stringify(record, bigIntSerializer));
        const data = jsonData['patientName'] ? {
            name: jsonData.patientName,
            age: jsonData.patientAge,
            registeredAt: new Date(jsonData.registeredAt*1000),
            medicalRecords: jsonData.medicalRecords,
            authorizedDoctors: jsonData.authorizedDoctors 
        } : [];
        console.log(jsonData);
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
  };
  

exports.getAllPatients = async (req, res) => {
    try {
        const sender = req.user.accountAddress; 
        const gasPrice = await web3.eth.getGasPrice(); 
    const gasSettings = {
        from: sender,
        gas: BigInt(3000000000).toString(),  // Set the gas limit
        gasPrice: gasPrice
      };
        // Call the smart contract to get patient records
        const record = await contract.methods.getAllPatients().call(gasSettings);
        const jsonData = JSON.parse(JSON.stringify(record, bigIntSerializer));
      console.log(jsonData);
        const data = Array.isArray(jsonData) && jsonData.length ? jsonData.map((patient) => {
            return {
                address: patient.patientAddress,
                name: patient.name,
                age: patient.age,
                registeredAt: new Date(patient.registeredAt*1000),
                medicalRecords: patient.medicalRecords,
                authorizedDoctors: patient.authorizedDoctors 
            }
        }) : [];
        let filteredData = [];
        if(req.user.role === "doctor") {
            filteredData = data.filter((patient) => {
                const docIds = patient.authorizedDoctors.map((doc) => doc.doctorAddress);
                return docIds.includes(req.user.accountAddress);
            });
        } else if (req.user.role === "admin") {
            filteredData = data;
        }
        res.json(filteredData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
  };
  
