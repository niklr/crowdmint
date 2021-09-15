import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

export default {
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./src",
        tests: "./test",
    },
    solidity: '0.7.6',
    typechain: {
        target: 'ethers-v5'
    }
};
