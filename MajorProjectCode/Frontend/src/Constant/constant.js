const contractAddress = "0x437d1Bb58A0C23eC638F108C017Ef21C90CaA768";

const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_temperature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_damageStatus",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_shipper",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_shipperLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productURL",
        "type": "string"
      }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "temperature",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "damageStatus",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "status",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "producer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "shipper",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "shipperLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "productURL",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "deliveryDetails",
            "type": "string"
          }
        ],
        "internalType": "struct Freight.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "temperature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "damageStatus",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "producer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "shipper",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "shipperLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productURL",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryDetails",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_temperature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_damageStatus",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_shipperLocation",
        "type": "string"
      }
    ],
    "name": "updateProducerDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_temperature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_damageStatus",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_deliveryDetails",
        "type": "string"
      }
    ],
    "name": "updateReceiverDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_temperature",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_damageStatus",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_shipperLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productURL",
        "type": "string"
      }
    ],
    "name": "updateShipperDetails",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export {contractAbi, contractAddress};