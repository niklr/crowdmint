// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract SimpleStorage {
    uint256 storedData;
    uint256 public totalAmount;

    constructor() payable {
        storedData = 123;
    }

    function set(uint256 x) public payable {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function fund() public payable {
        require(msg.value > 0, "Contribution must be greater than 0.");
        totalAmount += msg.value;
    }

    function refund() public {
        uint256 amount = totalAmount;
        totalAmount = 0;
        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "Failed to send amount.");
    }
}
