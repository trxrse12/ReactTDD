1. How to start the app:
    npm run build;
2. How to test the app:
    npm test;
3. Update:
    a. Any time you add CSS or a web page you don't need to rebuild with webpack!!!
    b. Any time you touch the React code, you have to rebuild;
4. How to compile and run Graph/QL Relay client TDD code:
    1. install and configure the pre-requisites:
           A. npm i --save-dev relay-compiler
           B. npm i --save-dev babel-plugin-relay
           C. Add these lines to .babelrc:
            {
                "plugins":[
                    "relay"    
                ]
            }    
    2. npm run relay
    3. npm run test     
5. How to run the React app and the test server:
    1. install the pre-requisites: npm i webpack-dev-server --save-dev
    2. modify the webpack.config:
                const path = require('path');
                const webpack = require('webpack');
                
                module.exports = {
                  entry: "./src/index.js",
                  mode: 'development',
                  module: {
                    rules: [{
                      test: /\.(js|jsx)$/,
                      exclude: /node-modules/,
                      loader: 'babel-loader'
                    }]
                  },
                  resolve: {
                    extensions: [".js"]
                  },
                  output: {
                    path: path.resolve(__dirname, "dist"),
                    filename: "bundle.js"
                  },
                  devServer: {
                    contentBase: path.join(__dirname, "dist"),
                    compress: true,
                    port: 9000
                  }
    3. modify the dist/index.html to ru                  
    3. modify the package.json "scripts":
                        "build": "webpack --env production",
                        "relay": "relay-compiler --src ./src --schema ./src/schema.graphql --extensions js jsx --watchman false",
                        "start": "webpack-dev-server --env development"
    4. in a new terminal, start the graphql server: 
        cd ~/projects/server
        npm run serve
    5. in the original terminal, webpack-compile the react app:
        npm run build
    6. in the original termial, start the webpack-dev-server that serves your react app: 
        npm run start    
    7. Be sure you add the CORS headers to the devServer in webpack.config.js:
        devServer: {
            ............................
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
              "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
          }
        
    8. After realizing I cannot run separate servers for client and server, I had to
        bring them together: 
            a. I added  the static part to the server, so that it can serve the React
            webpage;
            b. I "merged" the package.json dependencies;
            c. I "merged" the package.json scripts (to allow running both server and client scripts from 
        one point);
            d. I started running the npm scripts one by one to ensure the 
        new merged server/client project is working
            e. There are 2 webpack.config: one for server, the other one for client; so
        I saved the server webpack.config.js as webpack.server.config.js to the appointments directory
         
            