# Downloads and installs the badge api packge from npm to the `package` directory
# After that, the package directory can be deployed to azure with package deploy
set -e
NPM_PACKAGE_VERSION=$1


n=0
max=10
until [ "$n" -ge $max ]
do
   wget $(npm view @stryker-mutator/dashboard-badge-api@${NPM_PACKAGE_VERSION} dist.tarball) && break
   echo "Failed get npm view @stryker-mutator/dashboard-badge-api@${NPM_PACKAGE_VERSION} dist.tarball, retrying after 10 sec"
   n=$((n+1)) 
   sleep 10
done

if [[ $n -ge $max ]]; then
  echo "Failed $max times, exiting" >&2
  exit 1
fi

tar -xzf dashboard-badge-api-${NPM_PACKAGE_VERSION}.tgz
cd package
npm install --production