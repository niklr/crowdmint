// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import { Utils } from "./Utils.sol";

contract SimpleStorage {
    uint256 storedData;
    uint256 public refTimestamp;
    string public category;
    uint256 public totalAmount;
    address payable funder;

    modifier onlyExpired() {
        require(refTimestamp <= block.timestamp, "Only expired.");
        _;
    }

    constructor() payable {
        storedData = 123;
        category = "test1";
    }

    function set(uint256 x, uint256 _refTimestamp) public payable {
        require(_refTimestamp > block.timestamp, "Reference timestamp must be greater than current timestamp.");
        storedData = x;
        refTimestamp = _refTimestamp;
    }

    function setCategory(string memory _category) public onlyExpired {
        require(Utils.compareStrings(_category, "test1") || Utils.compareStrings(_category, "test2"), "test");
        category = _category;
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
