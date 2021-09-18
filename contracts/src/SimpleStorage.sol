// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import { Utils } from "./Utils.sol";

contract SimpleStorage {
    uint256 storedData;
    uint256 public totalAmount;
    address payable funder;

    constructor() payable {
        require(Utils.compareStrings("test123", "test123"), "test");
        storedData = 123;
    }

    function set(uint256 x) public payable {
        require(Utils.compareStrings("test", "test123"), "test");
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
        funder = msg.sender;
    }

    function refund() public {
        uint256 amount = totalAmount;
        totalAmount = 0;
        (bool success, ) = funder.call{ value: amount }("");
        require(success, "Failed to send amount.");
    }
}
