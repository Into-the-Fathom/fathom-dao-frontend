# Fathom DAO Frontend

## How to execute:

Go to client-staking folder: ```cd client-staking```

Execute: ```npm config set legacy-peer-deps true``` This mitigates errrors for legacy dependencies

Execute: ```npm install```

Execute: ```npm run dev``` to start localhost


Few Things to note:
1. All the buttons are disabled until you connect to a metamask wallet
2. The UI works only for Goerli and Apothem. The Apothem network should work well for coralX accounts. With Goerli the Stake tokens are not available in coralX accounts as of yet.
3. Each time you change your network or account the page refereshes and you have to connect to metamask to enable the button.
