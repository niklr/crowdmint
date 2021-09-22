## godwoken-kicker

after changing .build.mode.env the repository has to be deleted and cloned again if built before...

docker system prune
git log

`git checkout v0.7.1-rc2`

make stop, make clean, docker system prune, sudo rm -rf, clone, make init, make start

### Show logs

`make sg`

### Fund accounts

http://localhost:6100/ -> switch to Accounts tab -> enter ETH address

node ./packages/tools/lib/account-cli.js deposit -p 0x6cd5e7be2f6504aa5ae7c0c04178d8f47b7cfc63b71d95d9e6282f5b090431bf -l 0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8 -c 100000000000 -r http://localhost:8114 -i http://localhost:8116

### Explorer

https://testnet1.godwoken.nervos.org/