// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
import "./SimpleStorage.sol";

contract SimpleManager {
    address public storageAddress;

    constructor() payable {}

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function create() public returns (address) {
        SimpleStorage simpleStorage = new SimpleStorage();
        storageAddress = address(simpleStorage);
        return storageAddress;
    }
}
