#!/bin/sh

rm -rf ./dist
npm run build

#正式版部署
scp ./dist/* root@35.229.134.228:/usr/share/nginx/investdigital
#scp -r ./public/img/* root@35.229.134.228:/usr/share/nginx/investdigital/public/img

#investdigital-test部署
#scp ./dist/* root@35.229.134.228:/usr/share/nginx/investdigital-test
#scp -r ./public/* root@35.229.134.228:/usr/share/nginx/investdigital-test/public

