yarn compile
cd dist
cp ../package.json ./
cp ../yarn.lock ./
yarn install --production
zip -r ../lambda.zip .
cd ../
rm -r dist
