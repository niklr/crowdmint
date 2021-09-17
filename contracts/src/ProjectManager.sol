// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Project.sol";

contract ProjectManager {
    using SafeMath for uint256;

    address public owner;
    uint256 public totalProjects;

    mapping(string => uint256) public indexes;
    mapping(uint256 => address) public projects;

    event ProjectCreated(uint256 indexed index, string category, string title, address addr, address creator);

    constructor() {
        owner = msg.sender;
        totalProjects = 0;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    /**
     * Creates a new project.
     */
    function create(
        string memory _id,
        string memory _category,
        string memory _title,
        string memory _url,
        uint256 _goal,
        uint256 _deadline
    ) public returns (address) {
        require(indexes[_id] == 0, "Identifier already exists.");
        require(_goal > 0, "Funding goal must be greater than 0.");
        require(_deadline > block.timestamp, "Deadline must be greater than current timestamp.");

        Project project = new Project(_category, _title, _url, _goal, _deadline, msg.sender);

        uint256 index = totalProjects + 1;
        indexes[_id] = index;
        address addr = address(project);
        projects[index] = addr;

        emit ProjectCreated(index, _category, _title, addr, msg.sender);

        totalProjects++;

        return addr;
    }

    /**
     * Contributes the provided amount to the specified project.
     */
    function contribute(address payable _projectAddress) public payable {
        require(msg.value > 0, "Contribution must be greater than 0.");

        Project project = Project(_projectAddress);
        require(project.manager() == address(this), "Invalid project.");

        project.contribute{value: msg.value}(msg.sender);
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
