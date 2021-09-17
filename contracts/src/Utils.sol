// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract Utils {
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
