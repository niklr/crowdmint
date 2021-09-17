// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Project.sol";

contract ProjectManager {
    using SafeMath for uint256;

    address public owner;
    uint256 public totalProjects;

    mapping(uint256 => address) public projects;

    event ProjectCreated(uint indexed id, string category, string title, address addr, address creator);

    constructor() {
        owner = msg.sender;
        totalProjects = 0;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function create(
        string memory _category,
        string memory _title,
        string memory _url,
        uint256 _goal,
        uint256 _deadline
    ) public returns (address) {
        require(_goal > 0, "Funding goal must be greater than 0.");
        require(_deadline > block.timestamp, "Deadline must be greater than current timestamp.");

        Project project = new Project(_category, _title, _url, _goal, _deadline, msg.sender);

        address addr = address(project);
        projects[totalProjects] = addr;

        emit ProjectCreated(totalProjects, _category, _title, addr, msg.sender);

        totalProjects++;

        return addr;
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
