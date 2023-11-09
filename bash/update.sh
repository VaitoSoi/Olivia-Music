echo "> Updating code...."
git pull origin main
echo "> Updated"

echo "> Updating packages...."
yarn
echo "> Updated"

if [ -f ./compile.sh ]; then
    bash ./compile.sh
else
    bash ./bash/compile.sh
fi