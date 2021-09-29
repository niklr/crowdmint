# CrowdMINT

Decentralized crowdfunding on Nervos Network.

<p align="center">
	<img src="assets/logo_text.png" alt="CrowdMINT logo">
</p>

CrowdMINT is a blockchain based solution leveraging NFTs to crowdfund community projects.

The developed smart contract supports both the fixed AON (All-Or-Nothing) and the flexible KIA (Keep-It-All) [crowdfunding models](https://www.researchgate.net/publication/272306935_Crowdfunding_Models_Keep-it-All_vs_All-or-Nothing).
A big advantage of smart contracts is most of the fees known from conventional crowdfunding platforms are eliminated.
However, possible business uses cases could involve a small fee when creating projects or after successful campaigns, directly programmed into the smart contract.

Typical crowdfunding campaigns offer rewards to contributors for specific amounts. On top of that, CrowdMINT plans to leverage NFTs to incentivize funders.
By choosing this option, the amount above the funding goal will be distributed to the holders of minted NFTs and based on the percentage defined by the campaign creator.

Example:

- Funding goal was set to 100'000 CKB and reached 500'000 CKB
- 50% of the amount above goal will be distributed to eligible funders
- NFT minting was limited to 100 with a unit price of 1'000 CKB
- Funder A minted 2 NFTs
- Funder B minted 10 NFTs

Both funders A and B not only contributed to make this crowdfunding project a success but also get a return on investment.

- 50% of 400'000 CKB = 200'000 CKB is distributed among eligible funders
- Funder A gets 2% of 200'000 CKB = 4'000 CKB (2'000 CKB profit)
- Funder B gets 10% of 200'000 CKB = 20'000 CKB (10'000 CKB profit)

A decentralized crowdfunding solution such as CrowdMINT could have an exponential impact on the community leading to a higher number of successful projects started on Nervos.

## Setup the Godwoken Testnet Network in MetaMask
https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/tasks/7.port.eth.dapp.md

<details open>
<summary>Godwoken Testnet</summary>
```txt
Network Name: Godwoken Testnet
RPC URL: https://godwoken-testnet-web3-rpc.ckbapp.dev
Chain ID: 71393
Currency Symbol: <Leave Empty>
Block Explorer URL: <Leave Empty>
```
</details>

<details>
<summary>Godwoken Devnet</summary>
```txt
Network Name: Godwoken Devnet
RPC URL: http://localhost:8024
Chain ID: 1024777
Currency Symbol: <Leave Empty>
Block Explorer URL: <Leave Empty>
```
</details>

