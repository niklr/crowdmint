// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import { Utils } from "./Utils.sol";

contract Project {
    using SafeMath for uint256;

    struct ProjectInfo {
        string category;
        string title;
        string url;
        uint256 goal;
        uint256 deadline;
        address payable creator;
    }

    struct Contribution {
        address payable contributor;
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

    event ContributionReceived(address project, address contributor, uint256 amount);

    modifier onlyCreator() {
        require(info.creator == msg.sender, "Only creator.");
        _;
    }

    modifier onlyManager() {
        require(manager == msg.sender, "Only manager.");
        _;
    }

    modifier onlyExpired() {
        require(info.deadline <= block.timestamp, "Only expired.");
        _;
    }

    constructor(
        string memory _category,
        string memory _title,
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
            url: _url,
            goal: _goal,
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
            string memory, // category
            string memory, // title
            string memory, // url
            uint256, // goal
            uint256, // deadline
            address, // creator
            uint256, // totalContributions
            uint256, // totalContributors
            uint256, // totalFunding
            address // manager
        )
    {
        return (
            info.category,
            info.title,
            info.url,
            info.goal,
            info.deadline,
            info.creator,
            totalContributions,
            totalContributors,
            totalFunding,
            manager
        );
    }

    function getContribution(uint256 _index) public view returns (address, uint256) {
        Contribution memory c = contributions[_index];
        return (c.contributor, c.amount);
    }

    /**
     * Contributes the provided amount for the specified contributor.
     */
    function contribute(address payable _contributor) public payable {
        // TODO: use onlyManager modifier once other contracts can send funds
        require(msg.value > 0, "Contribution must be greater than 0.");
        require(info.deadline >= block.timestamp, "Project has expired.");

        // Add contribution to map
        Contribution memory c = contributions[totalContributions];
        c.contributor = _contributor;
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
        }
    }

    /**
     * Withdraws all contributions as creator.
     */
    function payout() public onlyCreator  {
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
        }
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
