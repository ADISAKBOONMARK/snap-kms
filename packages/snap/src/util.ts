import type { JsonTx } from '@ethereumjs/tx';
import type { Json } from '@metamask/utils';

import type { Wallet, AWSCredentials } from './keyring';
import { KMSSigner } from './signer';
import { KMSClient } from '@aws-sdk/client-kms';

/**
 * Serializes a transaction by removing undefined properties and converting them to null.
 *
 * @param tx - The transaction object.
 * @param type - The type of the transaction.
 * @returns The serialized transaction.
 */
export function serializeTransaction(tx: JsonTx, type: number): Json {
  const serializableSignedTx: Record<string, any> = {
    ...tx,
    type,
  };
  // Make tx serializable
  // toJSON does not remove undefined or convert undefined to null
  Object.entries(serializableSignedTx).forEach(([key, _]) => {
    if (serializableSignedTx[key] === undefined) {
      delete serializableSignedTx[key];
    }
  });

  return serializableSignedTx;
}

/**
 * Validates whether there are no duplicate addresses in the provided array of wallets.
 *
 * @param address - The address to validate for duplication.
 * @param wallets - The array of wallets to search for duplicate addresses.
 * @returns Returns true if no duplicate addresses are found, otherwise false.
 */
export function isUniqueAddress(address: string, wallets: Wallet[]): boolean {
  return !wallets.find((wallet) => wallet.account.address === address);
}

/**
 * Determines whether the given CAIP-2 chain ID represents an EVM-based chain.
 *
 * @param chain - The CAIP-2 chain ID to check.
 * @returns Returns true if the chain is EVM-based, otherwise false.
 */
export function isEvmChain(chain: string): boolean {
  return chain.startsWith('eip155:');
}

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}

/**
 * Runs the specified callback and throws an error with the specified message
 * if it fails.
 *
 * This function should be used to run code that may throw error messages that
 * could expose sensitive information.
 *
 * @param callback - Callback to run.
 * @param message - Error message to throw if the callback fails.
 * @returns The result of the callback.
 */
export function runSensitive<Type>(
  callback: () => Type,
  message?: string,
): Type {
  try {
    return callback();
  } catch (error) {
    throw new Error(message ?? 'An unexpected error occurred');
  }
}

/**
 * Convert the privateKey to AWS credentials.
 *
 * @param privateKey - The private key.
 * @returns The AWS credentials.
 */
export function privateKeyToAWSCredentials(privateKey: string): AWSCredentials {
  const pk = hexToString(privateKey).split('|');
  if (pk.length !== 4) {
    throw new Error('Invalid private key');
  }
  const aws: AWSCredentials = {
    kmsKey: pk[0] as string,
    awsRegion: pk[1] as string,
    awsAccessKey: pk[2] as string,
    awsSecretAccessKey: pk[3] as string,
  };
  return aws;
}

/**
 * Create KMS signer from the privateKey.
 *
 * @param privateKey - The private key.
 * @returns The KMS signer.
 */
export function privateKeyToKMSSigner(privateKey: string): KMSSigner {
  const credentials = privateKeyToAWSCredentials(privateKey);
  const signer = new KMSSigner(
    credentials.kmsKey,
    new KMSClient({
      region: credentials.awsRegion,
      credentials: {
        accessKeyId: credentials.awsAccessKey,
        secretAccessKey: credentials.awsSecretAccessKey,
      },
    }),
  );
  return signer;
}

/**
 * Convert the string to hex.
 *
 * @param str - The target string that want to convert.
 * @returns The hex of input.
 */
export function stringToHex(str: string) {
  var hex = '';
  for (var i = 0, l = str.length; i < l; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

/**
 * Convert the hex to string.
 *
 * @param hex - The target hex that want to convert.
 * @returns The string of input.
 */
export function hexToString(hex: string) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
