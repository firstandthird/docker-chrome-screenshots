FROM ubuntu:latest

RUN mkdir /app
WORKDIR /app

## PART 1: Core components
## =======================

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade &&\
apt-get install -y sudo curl wget unzip git

# Install node 8
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install Chrome for Ubuntu
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - &&\
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' &&\
sudo apt-get update &&\
sudo apt-get install -y google-chrome-stable

COPY package.json /app
RUN npm install

# Expose port 8080
EXPOSE 8080

## PART 4: Final setup
## ===================

# Add a user and make it a sudo user
# RUN useradd -m chromeuser && sudo adduser chromeuser sudo

# Copy the chrome-user script used to start Chrome as non-root
# COPY chromeuser-script.sh /app
# RUN chmod +x /app/chromeuser-script.sh

COPY . /app

CMD ["npm", "start"]
