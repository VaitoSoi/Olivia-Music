echo "> Updating code...."
git pull origin main
echo "> Updated"

echo "> Updating packages...."
yarn
echo "> Updated"

./compile.sh