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
        
        
        