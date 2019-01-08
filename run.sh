target="1"

if [ $# -gt 0 ] && [[ $1 -eq 1 ]] || [[ $1 -eq 2 ]] || [[ $1 -eq 3 ]] || [[ $1 -eq 4 ]];then
  target=$1
  echo "\033[0;32mrun example $target\033[0m"
else echo "\033[0;32ma param is required, run example 1 by default\033[0m"
fi

cd example
cp "app-$target.tsx" "app.tsx"
cd ..
npm start
