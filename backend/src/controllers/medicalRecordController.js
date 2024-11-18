const {Web3} = require('web3');
const web3 = new Web3(process.env.BLOCKCHAIN_NODE_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../../blockchain/build/contracts/PatientDataManagement.json');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

exports.addMedicalRecord = async (req, res) => {
    try {
        const { patientAddress, record } = req.body;
        const sender = req.user.accountAddress;
        console.log();
                // Fetch current gas price for legacy transactions
                const gasPrice = await web3.eth.getGasPrice();  // Legacy gas price

                // Define the gas settings
                const gasSettings = {
                    from: sender,
                    gas: 3000000,  // Set the gas limit
                    gasPrice: gasPrice  // Use legacy gas price
                };
        // Call the contract method to add a medical record
        await contract.methods.addMedicalRecord(patientAddress, record).send(gasSettings);
    
        res.status(200).json({ message: 'Medical record added successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}