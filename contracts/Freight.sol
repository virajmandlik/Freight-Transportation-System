// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Freight {
    struct Product {
        uint256 id;
        string name;
        string temperature;
        string damageStatus;
        string status;
        address producer;
        address shipper;
        address receiver;
        string shipperLocation;
        string productURL;
        string deliveryDetails;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    modifier onlyProducer(uint256 _id) {
        require(msg.sender == products[_id].producer, "Not producer");
        _;
    }

    modifier onlyShipper(uint256 _id) {
        require(msg.sender == products[_id].shipper, "Not shipper");
        _;
    }

    modifier onlyReceiver(uint256 _id) {
        require(msg.sender == products[_id].receiver, "Not receiver");
        _;
    }

    modifier onlyWhenShipped(uint256 _id) {
        require(
            keccak256(bytes(products[_id].status)) == keccak256(bytes("Dispatched by Shipper")),
            "Not shipped"
        );
        _;
    }

    function addProduct(
        string memory _name,
        string memory _temperature,
        string memory _damageStatus,
        address _shipper,
        address _receiver,
        string memory _shipperLocation,
        string memory _productURL
    ) public {
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _temperature,
            _damageStatus,
            "Not Dispatched",
            msg.sender,
            _shipper,
            _receiver,
            _shipperLocation,
            _productURL,
            ""
        );
    }

    function updateProducerDetails(
        uint256 _id,
        string memory _temperature,
        string memory _damageStatus,
        string memory _shipperLocation
    ) public onlyProducer(_id) {
        require(keccak256(bytes(products[_id].status)) == keccak256(bytes("Not Dispatched")), 
            "Invalid status");
        
        products[_id].temperature = _temperature;
        products[_id].damageStatus = _damageStatus;
        products[_id].shipperLocation = _shipperLocation;
        products[_id].status = "Dispatched by Producer";
    }

    function updateShipperDetails(
        uint256 _id,
        string memory _temperature,
        string memory _damageStatus,
        string memory _shipperLocation,
        string memory _productURL
    ) public onlyShipper(_id) {
        require(keccak256(bytes(products[_id].status)) == keccak256(bytes("Dispatched by Producer")), 
            "Invalid status");

        products[_id].temperature = _temperature;
        products[_id].damageStatus = _damageStatus;
        products[_id].shipperLocation = _shipperLocation;
        products[_id].productURL = _productURL;
        products[_id].status = "Dispatched by Shipper";
    }

    function updateReceiverDetails(
        uint256 _id,
        string memory _temperature,
        string memory _damageStatus,
        string memory _deliveryDetails
    ) public onlyReceiver(_id) onlyWhenShipped(_id) {
        products[_id].temperature = _temperature;
        products[_id].damageStatus = _damageStatus;
        products[_id].deliveryDetails = _deliveryDetails;
        products[_id].status = "Delivered";
    }

    function getProduct(uint256 _id) public view returns (Product memory) {
        return products[_id];
    }
}