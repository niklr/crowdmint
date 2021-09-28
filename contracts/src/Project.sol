// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import { Utils } from "./Utils.sol";

contract Project {
    using SafeMath for uint256;

    struct ProjectInfo {
        string category;
        string title;
        string description;
        string url;
        uint256 goal;
        uint256 created;
        uint256 deadline;
        address payable creator;
    }

    struct Contribution {
        address payable contributor;
        uint256 created;
        uint256 amount;
    }

    // Keep-It-All (KIA)
    string constant CATEGORY_KIA = "KIA";
    // All-Or-Nothing (AON)
    string constant CATEGORY_AON = "AON";

    address public manager;
    uint256 public totalContributions;
    uint256 public totalContributors;
    uint256 public totalFunding;

    mapping(address => uint256) public contributors;
    mapping(uint256 => Contribution) public contributions;

    ProjectInfo public info;

    event InfoUpdated(address indexed project, string title, string url);
    event ContributionReceived(address indexed project, address indexed contributor, uint256 amount);
    event RefundRequested(address indexed project, address indexed requestor, uint256 amount);
    event PayoutRequested(address indexed project, address indexed requestor, uint256 amount);

    modifier onlyCreator() {
        require(info.creator == msg.sender, "Only creator.");
        _;
    }

    modifier onlyManager() {
        require(manager == msg.sender, "Only manager.");
        _;
    }

    modifier onlyManagerOrCreator() {
        require(manager == msg.sender || info.creator == msg.sender, "Only manager or creator.");
        _;
    }

    modifier onlyExpired() {
        require(info.deadline <= block.timestamp, "Only expired.");
        _;
    }

    constructor(
        string memory _category,
        string memory _title,
        string memory _description,
        string memory _url,
        uint256 _goal,
        uint256 _deadline,
        address payable _creator
    ) {
        require(
            Utils.compareStrings(_category, CATEGORY_KIA) || Utils.compareStrings(_category, CATEGORY_AON),
            "Category must be KIA or AON."
        );
        require(_goal > 0, "Funding goal must be greater than 0.");
        require(_deadline > block.timestamp, "Deadline must be greater than current timestamp.");
        require(_creator != address(0), "Creator address must be valid.");

        manager = msg.sender;

        info = ProjectInfo({
            category: _category,
            title: _title,
            description: _description,
            url: _url,
            goal: _goal,
            created: block.timestamp,
            deadline: _deadline,
            creator: _creator
        });

        totalContributions = 0;
        totalContributors = 0;
        totalFunding = 0;
    }

    function getInfo()
        public
        view
        returns (
            ProjectInfo memory,
            uint256, // totalContributions
            uint256, // totalContributors
            uint256, // totalFunding
            address // manager
        )
    {
        return (
            info,
            totalContributions,
            totalContributors,
            totalFunding,
            manager
        );
    }

    function getContribution(uint256 _index) public view returns (Contribution memory) {
        Contribution memory c = contributions[_index];
        return (c);
    }

    /**
     * Updates the info of the project.
     */
    function setInfo(
        string memory _category,
        string memory _title,
        string memory _description,
        string memory _url,
        uint256 _goal,
        uint256 _deadline
    ) public onlyManagerOrCreator {
        info.title = _title;
        info.description = _description;
        info.url = _url;
        if (manager == msg.sender) {
            info.category = _category;
            info.goal = _goal;
            info.deadline = _deadline;
        }
        emit InfoUpdated(address(this), info.title, info.url);
    }

    /**
     * Contributes the provided amount for the specified contributor.
     */
    function contribute(address payable _contributor) public payable onlyManager {
        require(msg.value > 0, "Contribution must be greater than 0.");
        require(info.deadline >= block.timestamp, "Project has expired.");

        // Add contribution to map
        Contribution memory c = contributions[totalContributions];
        c.contributor = _contributor;
        c.created = block.timestamp;
        c.amount = msg.value;

        // Update balance of contributor
        uint256 prevContributorBalance = contributors[_contributor];
        contributors[_contributor] += msg.value;

        // Increase total contributors if not seen before
        if (prevContributorBalance == 0) {
            totalContributors++;
        }

        totalFunding += msg.value;
        totalContributions++;

        emit ContributionReceived(address(this), _contributor, msg.value);
    }

    /**
     * Withdraws the contributions as contributor.
     */
    function refund() public onlyExpired {
        // Refund is allowed when expired and funding goal not reached.
        require(totalFunding < info.goal, "Funding goal has been reached.");

        uint256 amount = contributors[msg.sender];

        if (amount > 0) {
            // Set to 0 before sending the amount to prevent re-entrancy attacks
            contributors[msg.sender] = 0;
            (bool success, ) = msg.sender.call{ value: amount }("");
            require(success, "Failed to send amount.");
            emit RefundRequested(address(this), msg.sender, amount);
        }
    }

    /**
     * Withdraws all contributions as creator.
     */
    function payout() public onlyCreator onlyExpired {
        bool allOrNothing = Utils.compareStrings(info.category, CATEGORY_AON);
        if (allOrNothing) {
            // TODO: allow withdraw after grace period even with AON category
            require(totalFunding >= info.goal, "Funding goal has not been reached.");
        }

        uint256 amount = totalFunding;

        if (amount > 0) {
            // Set to 0 before sending the amount to prevent re-entrancy attacks
            totalFunding = 0;
            //bool success = info.creator.send(amount);
            (bool success, ) = info.creator.call{ value: amount }("");
            require(success, "Failed to send amount.");
            emit PayoutRequested(address(this), msg.sender, amount);
        }
    }

    /**
     * Prevent accidental transactions
     */
    fallback() external payable {
        revert();
    }

    receive() external payable {
        revert();
    }
}
