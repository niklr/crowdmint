// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract ProjectManager {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    /**
     * Prevent ETH from being sent to this contract
     */
    fallback() external payable {
        revert();
    }

    receive() external payable {
        revert();
    }
}
