// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import { Utils } from './Utils.sol';

contract Project {
    using SafeMath for uint256;

    struct ProjectInfo {
        string title;
        string category;
        string url;
        uint256 goal;
        uint256 deadline;
        address creator;
    }

    // Keep-It-All (KIA)
    string constant CATEGORY_1 = "KIA";
    // All-Or-Nothing (AON)
    string constant CATEGORY_2 = "AON";

    address public manager;
    uint256 public totalContributions;
    uint256 public totalContributors;
    uint256 public totalFunding;

    ProjectInfo public info;

    modifier onlyManager() {
        require(manager == msg.sender, "Only manager.");
        _;
    }

    constructor(
        string memory _category,
        string memory _title,
        string memory _url,
        uint256 _goal,
        uint256 _deadline,
        address _creator
    ) {
        require(Utils.compareStrings(_category, CATEGORY_1) || Utils.compareStrings(_category, CATEGORY_2) , "Category must be KIA or AON.");
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
