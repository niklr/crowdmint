// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract SimpleStorage {
    uint256 storedData;

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
}
