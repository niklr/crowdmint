## godwoken-kicker

after changing .build.mode.env the repository has to be deleted and cloned again if built before...

docker system prune
git log

`git checkout v0.7.1-rc2`

make stop, make clean, docker system prune, sudo rm -rf, clone, make init, make start

### Show logs

`make sg`