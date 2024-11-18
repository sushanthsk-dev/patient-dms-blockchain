const {Web3} = require('web3');
const web3 = new Web3(process.env.BLOCKCHAIN_NODE_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../../blockchain/build/contracts/PatientDataManagement.json');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);


function bigIntSerializer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
    }
    return value;
  }

exports.register = async (req, res) => {
    try {
        const { doctorAddress, name, specialization } = req.body;

        const sender = req.user.accountAddress;
    
        // Fetch current block number (for debugging purposes)
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Current Block Number:', blockNumber);
        
        // Fetch current gas price for legacy transactions
        const gasPrice = await web3.eth.getGasPrice();
    
        // Define the gas settings
        const gasSettings = {
          from: sender,
          gas: 3000000,  // Set the gas limit
          gasPrice: gasPrice
        };
    
        // Send the transaction to register the patient
        const result =  await contract.methods.registerDoctor(doctorAddress, name, specialization)
          .send(gasSettings);
        
        // Send the response with the transaction result
        res.json({ success: true, transaction: JSON.parse(JSON.stringify(result, bigIntSerializer)) });
        
      } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: error.message });
      }
};

exports.getPatientsRecords = async (req, res) => {
  try {
      const records = await contract.methods
          .getPatientRecords(req.params.address)
          .call({ from: req.user.walletAddress });
          
      res.json({ records });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.verifyDoctor = async (req, res) => {
    try {
        const { doctorAddress } = req.body;
        const sender = req.user.accountAddress;
            // Fetch current gas price for legacy transactions
            const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price
    
            // Define the gas settings
            const gasSettings = {
              from: sender,
              gas: 3000000,  // Set the gas limit
              gasPrice: gasPrice  // Use legacy gas price
            };
        // Call the contract method to verify the doctor
        await contract.methods.verifyDoctor(doctorAddress).send(gasSettings);
    
        res.status(200).json({ message: 'Doctor verified successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}

exports.authorizeDoctor = async (req, res) => {
    try {
        const { doctorAddress, patientAddress } = req.body;
        // Fetch current gas price for legacy transactions
        const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price

        // Define the gas settings
        const gasSettings = {
            from: patientAddress,
            gas: 3000000,  // Set the gas limit
            gasPrice: gasPrice  // Use legacy gas price
        };
        // Call the contract method to authorize a doctor for the patient
        await contract.methods.authorizeDoctor(doctorAddress).send(gasSettings);
    
        res.status(200).json({ message: 'Doctor authorized successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}

exports.getVerifiedDoctors = async (req, res) => {
    try {
        const sender = req.user.accountAddress; 
    
        // Fetch current gas price for legacy transactions
        const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price

        // Define the gas settings
        const gasSettings = {
            from: sender,
            gas: 3000000,  // Set the gas limit
            gasPrice: gasPrice  // Use legacy gas price
        };
        // Call the contract method to authorize a doctor for the patient
        const result = await contract.methods.getVerifiedDoctors().call(gasSettings);
        
        res.status(200).json(JSON.parse(JSON.stringify(result, bigIntSerializer)));
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}

exports.getDoctors = async (req, res) => {
    try {
        const sender = req.user.accountAddress; 
    
        // Fetch current gas price for legacy transactions
        const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price

        // Define the gas settings
        const gasSettings = {
            from: sender,
            gas: 3000000,  // Set the gas limit
            gasPrice: gasPrice  // Use legacy gas price
        };
        // Call the contract method to authorize a doctor for the patient
        const result = await contract.methods.getDoctors().call(gasSettings);
        
        res.status(200).json(JSON.parse(JSON.stringify(result, bigIntSerializer)));
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}