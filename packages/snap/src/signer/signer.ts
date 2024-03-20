import { KMSClient } from '@aws-sdk/client-kms';
import {
  utils,
  Signer,
  providers,
  BigNumber,
  BytesLike,
  Transaction,
} from 'ethers';
import { keccak256 } from '@ethersproject/keccak256';
import { _TypedDataEncoder } from '@ethersproject/hash';

import { createSignature } from './eth';
import { getEthAddressFromKMS } from './kms';
import { hashPersonalMessage } from 'ethereumjs-util';
import {
  TypedDataDomain,
  TypedDataField,
  TypedDataSigner,
} from '@ethersproject/abstract-signer';
import {
  TypedDataV1Field,
  typedSignatureHash,
  TypedDataUtils,
  SignTypedDataVersion,
  TypedMessage,
  MessageTypes,
} from '@metamask/eth-sig-util';

export class KMSSigner extends Signer implements TypedDataSigner {
  connect(provider: providers.Provider): Signer {
    throw new Error('Method not implemented.');
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, any>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  private address: string | undefined;

  constructor(public keyId: string, private kmsInstance: KMSClient) {
    super();
    this.keyId = keyId;
    this.kmsInstance = kmsInstance ?? new KMSClient({});
  }

  async getAddress(): Promise<string> {
    if (!this.address) {
      this.address = await getEthAddressFromKMS({
        keyId: this.keyId,
        kmsInstance: this.kmsInstance,
      });
    }
    return this.address;
  }

  async signMessage(message: utils.Bytes | string): Promise<string> {
    if (typeof message === 'string') {
      message = utils.toUtf8Bytes(message);
    }
    const messageBuffer = Buffer.from(utils.hexlify(message).slice(2), 'hex');
    const hash = hashPersonalMessage(messageBuffer).toString('hex');

    const sig = await createSignature({
      kmsInstance: this.kmsInstance,
      keyId: this.keyId,
      message: `0x${hash}`,
      address: await this.getAddress(),
    });

    return utils.joinSignature(sig);
  }

  async signTypedDataV1(typedData: TypedDataV1Field[]): Promise<string> {
    const hash = typedSignatureHash(typedData);
    const sig = await createSignature({
      kmsInstance: this.kmsInstance,
      keyId: this.keyId,
      message: hash,
      address: await this.getAddress(),
    });

    return utils.joinSignature(sig);
  }

  async signTypedDataV3V4(
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4,
    typedData: TypedMessage<MessageTypes>,
  ): Promise<string> {
    const messageBuffer = TypedDataUtils.eip712Hash(typedData, version);
    const hash = messageBuffer.toString('hex');
    const sig = await createSignature({
      kmsInstance: this.kmsInstance,
      keyId: this.keyId,
      message: `0x${hash}`,
      address: await this.getAddress(),
    });
    return utils.joinSignature(sig);
  }

  async signTransaction(
    transaction: providers.TransactionRequest,
  ): Promise<string> {
    const tx = await utils.resolveProperties(transaction);
    const baseTx: any = {
      chainId: tx.chainId || undefined,
      data: tx.data || undefined,
      gasLimit: tx.gasLimit || undefined,
      gasPrice: tx.gasPrice || undefined,
      nonce: tx.nonce ? BigNumber.from(tx.nonce).toNumber() : undefined,
      to: tx.to || undefined,
      value: tx.value || undefined,
      type: tx.type,
      maxFeePerGas: tx.maxFeePerGas || undefined,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas || undefined,
    };

    if (baseTx.type === 0) {
      delete baseTx.maxFeePerGas;
      delete baseTx.maxPriorityFeePerGas;
    }
    const unsignedTx = utils.serializeTransaction(baseTx);
    const hash = keccak256(utils.arrayify(unsignedTx));

    const sig = await createSignature({
      kmsInstance: this.kmsInstance,
      keyId: this.keyId,
      message: hash,
      address: await this.getAddress(),
    });
    return utils.serializeTransaction(baseTx, sig);
  }

  async parseTransaction(rawTransaction: BytesLike): Promise<Transaction> {
    return utils.parseTransaction(rawTransaction);
  }
}
