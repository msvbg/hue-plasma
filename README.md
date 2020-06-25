# Prerequisites

Find the IP of your Hue bridge.

Create a Hue username by pressing on the bridge button and running

```sh
curl -d '{"devicetype": "app_name"}' http://192.168.10.221/api
```

Put the IP into index.ts and the username into ./username.

# Install and run 

```sh
nvm use
npm install
npm start
```