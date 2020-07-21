# Node-v3-Chat-App

Pre-requisite:

1. Install Latest node js in the machine.
2. Install socket.io by running below command
   > npm install socket.io

Application URL: http://172.25.26.5:1000

ByDefault port: 1000
(We can change this by modify the src/index.js file)

How to run the application in the Window/Linux

1. Clone the project
2. Install all the npm's inside the project directory by running below command:
   > npm run build
3. After successfully runs step 2, Install pm2 npm by running below command
   ? npm install -g pm2
4. After successfully runs step 3, Then we can start the project by running below command.
   > pm2 start src/index.js
   
   or 
   
   > node src/index.js
   
   
