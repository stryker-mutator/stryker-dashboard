# Downloads and installs the badge api packge from npm to the `package` directory
# After that, the package directory can be deployed to azure with package deploy
set -e
NPM_PACKAGE_VERSION=$1
wget $(npm view @stryker-mutator/dashboard-badge-api@${NPM_PACKAGE_VERSION} dist.tarball)
tar -xzf dashboard-badge-api-${NPM_PACKAGE_VERSION}.tgz
cd package
npm install --production