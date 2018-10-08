#!/bin/bash
set -e
# set -x


# Made for Ubuntu 16.04 LTS


printHeader() {
  ORANGE='\033[0;33m'
  NC='\033[0m'
  printf "${ORANGE}=> $1 Installation${NC}\n"
}



###########################
printHeader 'Docker'
sudo apt-get update

sudo apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get -y install docker-ce



###########################
printHeader 'Git'
sudo apt-get update && sudo apt-get -y install git



###########################
printHeader 'Node'
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs



###########################
printHeader 'Yarn'
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get -y install yarn



###########################
printHeader 'WineHq'
sudo dpkg --add-architecture i386

wget -nc https://dl.winehq.org/wine-builds/Release.key
sudo apt-key add Release.key
sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/

sudo apt-get update && sudo apt-get -y install --install-recommends winehq-stable



###########################
printHeader 'genIcon.bash deps'
bin/genIcon.bash install

