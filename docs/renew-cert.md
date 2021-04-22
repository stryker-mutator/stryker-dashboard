# Renew certificates

As of the moment of writing this we have 4 tls enabled websites.

1. stryker-mutator.io
1. dashboard.stryker-mutator.io
1. badge.stryker-mutator.io
1. badge-api.stryker-mutator.io

All 4 are protected using [let's encrypt](https://letsencrypt.org/). 
The root domain (stryker-mutator.io) is automatically renewed. Others are hosted on azure and need our attention from time to time.

## One time setup

*Note: these instructions only work on linux or mac. For windows users, you can use the [Windows subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Install the `certbot`(https://certbot.eff.org/).
Install the `certbot-cloudflare-plugin` (https://certbot-dns-cloudflare.readthedocs.io/en/stable/ and https://www.eigenmagic.com/2018/03/14/howto-use-certbot-with-lets-encrypt-wildcard-certificates/)
Install the azure-cli tooling: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest

Create your `~/.secrets/certbot/cloudflare.ini` file:

```
# Cloudflare API credentials used by Certbot
dns_cloudflare_email = cloudflare@example.com
dns_cloudflare_api_key = 0123456789abcdef0123456789abcdef01234567
```

Run: 

```
az login
az account set -s pdc_stryker_prod01
```

## Renew

Use this script to renew:

```
set -e
PASSWORD=`openssl rand -base64 16`
echo "Using password ${PASSWORD}"

certbot certonly --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/certbot/cloudflare.ini -d dashboard.stryker-mutator.io -d badge.stryker-mutator.io -d badge-api.stryker-mutator.io
cd /etc/letsencrypt/live/dashboard.stryker-mutator.io/
openssl pkcs12 -export -out stryker.pfx -inkey privkey.pem -in cert.pem -certfile chain.pem -password pass:$PASSWORD
az webapp config ssl upload --certificate-file ./stryker.pfx --certificate-password $PASSWORD --name stryker-mutator-badge --resource-group stryker-mutator-badge
az webapp config ssl upload --certificate-file ./stryker.pfx --certificate-password $PASSWORD --name stryker-badge --resource-group strykermutator-badge-website
az webapp config ssl upload --certificate-file ./stryker.pfx --certificate-password $PASSWORD --name stryker-mutator-badge-api --resource-group stryker-dashboard-production


THUMBPRINT=`az webapp config ssl list --resource-group stryker-mutator-badge --query 'reverse(sort_by([], &expirationDate))[0].thumbprint' | tr -d '"'`

az webapp config ssl bind --certificate-thumbprint $THUMBPRINT --ssl-type SNI --name stryker-mutator-badge --resource-group stryker-mutator-badge
az webapp config ssl bind --certificate-thumbprint $THUMBPRINT --ssl-type SNI --name stryker-badge --resource-group strykermutator-badge-website
az webapp config ssl bind --certificate-thumbprint $THUMBPRINT --ssl-type SNI --name stryker-mutator-badge-api --resource-group stryker-dashboard-production

rm /etc/letsencrypt/live/dashboard.stryker-mutator.io/stryker.pfx
```
