# Snap KMS Signer

Snap KMS Signer is a feature that allows users to sign Ethereum transactions using an external key management service (KMS) provider. This feature enhances the security of the signing process by keeping the private keys used for signing transactions secure and isolated from the browser and the MetaMask extension.

When a user initiates a transaction in MetaMask, instead of signing the transaction using the locally stored private key, MetaMask communicates with the external KMS provider to perform the signing operation. This allows the private key to remain safely stored within the KMS, reducing the risk of exposure to malicious actors.

The integration of a KMS with MetaMask provides users with a more secure way to interact with decentralized applications (dApps) and the Ethereum blockchain, ensuring that their transactions are signed in a secure environment.

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask
Flask](https://metamask.io/flask/), a canary distribution for developers that
provides access to upcoming features.

## Getting Started

Run all:
```shell
$ yarn install
$ yarn start
```

Run only snap:

```shell
$ cd ./packages/snap
$ yarn install
$ yarn start
```

Run only snap dapp:

```shell
$ cd ./packages/site
$ yarn install
$ yarn start
```