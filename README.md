

## Install package 
to avoid errors when install package, because store is not fully compatible, try legacy peer
npm i --legacy-peer-deps

## Launch autogenerate api 
if you want to know you can try 
openapi-generator-cli generate -i data-2025413223217.json -g typescript-angular -o apps/expvi-twitter/src/app/api


## Redux dev tools 
You can follow the state flow in the reduxDevtools plugin and see how the store is managed and how it handles a single source of truth.
