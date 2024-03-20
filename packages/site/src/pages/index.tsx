import type { KeyringAccount, KeyringRequest } from '@metamask/keyring-api';
import { KeyringSnapRpcClient } from '@metamask/keyring-api';
import Grid from '@mui/material/Grid';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  Accordion,
  AccountList,
  Card,
  ConnectButton,
  Toggle,
} from '../components';
import {
  CardContainer,
  Container,
  Divider,
  DividerTitle,
  StyledBox,
} from '../components/styledComponents';

import { defaultSnapOrigin } from '../config';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import { InputType } from '../types';
import type { KeyringState } from '../utils';
import {
  connectSnap,
  getSnap,
  isSynchronousMode,
  toggleSynchronousApprovals,
  stringToHex,
} from '../utils';
import PendingRequests from '../components/PendingRequests';

const snapId = defaultSnapOrigin;

const initialState: {
  pendingRequests: KeyringRequest[];
  accounts: KeyringAccount[];
  useSynchronousApprovals: boolean;
} = {
  pendingRequests: [],
  accounts: [],
  useSynchronousApprovals: true,
};

const listOfAwsRegions = [
  { value: 'ap-southeast-1' },
  { value: 'ap-southeast-2' },
  { value: 'ap-east-1' },
  { value: 'ap-northeast-1' },
  { value: 'ap-northeast-2' },
  { value: 'ap-northeast-3' },
  { value: 'ap-south-1' },
  { value: 'ca-central-1' },
  { value: 'cn-north-1' },
  { value: 'cn-northwest-1' },
  { value: 'eu-central-1' },
  { value: 'eu-north-1' },
  { value: 'eu-south-1' },
  { value: 'eu-west-1' },
  { value: 'eu-west-2' },
  { value: 'eu-west-3' },
  { value: 'me-south-1' },
  { value: 'sa-east-1' },
  { value: 'us-east-1' },
  { value: 'us-east-2' },
  { value: 'us-west-1' },
  { value: 'us-west-2' }
];

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [snapState, setSnapState] = useState<KeyringState>(initialState);
  // The AWS credentials.
  const [kmsKey, setKmsKey] = useState<string | null>();
  const [awsRegion, setAwsRegion] = useState<string | null>();
  const [awsAccessKey, setAwsAccessKey] = useState<string | null>();
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState<string | null>();
  // Is not a good practice to store sensitive data in the state of
  // a component but for this case it should be ok since this is an
  // internal development and testing tool.
  const [privateKey, setPrivateKey] = useState<string | null>();
  const [accountId, setAccountId] = useState<string | null>();
  const [accountObject, setAccountObject] = useState<string | null>();
  const [requestId, setRequestId] = useState<string | null>(null);
  // const [accountPayload, setAccountPayload] =
  //   useState<Pick<KeyringAccount, 'name' | 'options'>>();
  const client = new KeyringSnapRpcClient(snapId, window.ethereum);

  useEffect(() => {
    /**
     * Return the current state of the snap.
     *
     * @returns The current state of the snap.
     */
    async function getState() {
      if (!state.installedSnap) {
        return;
      }
      const accounts = await client.listAccounts();
      const pendingRequests = await client.listRequests();
      const isSynchronous = await isSynchronousMode();

      setSnapState({
        accounts,
        pendingRequests,
        useSynchronousApprovals: isSynchronous,
      });

      // Set default Aws Region 
      setAwsRegion("ap-southeast-1")
    }

    getState().catch((error) => console.error(error));
  }, [state.installedSnap]);

  const syncAccounts = async () => {
    const accounts = await client.listAccounts();
    setSnapState({
      ...snapState,
      accounts,
    });
  };

  const importAccount = async () => {
    const pk = stringToHex(
      kmsKey + '|' + awsRegion + '|' + awsAccessKey + '|' + awsSecretAccessKey,
    );

    const newAccount = await client.createAccount({
      privateKey: pk as string,
    });
    await syncAccounts();

    return newAccount;
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleUseSyncToggle = useCallback(async () => {
    console.log('Toggling synchronous approval');
    await toggleSynchronousApprovals();
    setSnapState({
      ...snapState,
      useSynchronousApprovals: !snapState.useSynchronousApprovals,
    });
  }, [snapState]);

  const accountManagementMethods = [
    {
      name: 'Import account',
      description: 'Import an account using a KMS key and AWS credentials.',
      inputs: [
        {
          id: 'import-account-kms-key',
          title: 'KMS Key',
          value: kmsKey,
          type: InputType.TextField,
          placeholder: 'E.g. 69411b4c-7be2-4dc5-8017-86f9a76f8e34',
          onChange: (event: any) => setKmsKey(event.currentTarget.value),
        },
        {
          id: 'import-account-aws-region',
          title: 'AWS Region',
          value: awsRegion,
          type: InputType.Dropdown,
          options: listOfAwsRegions,
          placeholder: 'E.g. ap-southeast-1',
          onChange: (event: any) => setAwsRegion(event.currentTarget.value),
        },
        {
          id: 'import-account-aws-access-key',
          title: 'AWS Access Key',
          value: awsAccessKey,
          type: InputType.TextField,
          placeholder: 'E.g. ABCDEFGHIJKLNMOPQRST',
          onChange: (event: any) => setAwsAccessKey(event.currentTarget.value),
        },
        {
          id: 'import-account-aws-secret-access-key',
          title: 'AWS Secret Access Key',
          value: awsSecretAccessKey,
          type: InputType.TextField,
          placeholder: 'E.g. abcdefghijklnmopqrstuvwxyz12345678910112',
          onChange: (event: any) =>
            setAwsSecretAccessKey(event.currentTarget.value),
        },
      ],
      action: {
        callback: async () => await importAccount(),
        label: 'Import Account',
      },
      successMessage: 'Account imported',
    },
  ];

  return (
    <Container>
      {!state.installedSnap ? (
        <CardContainer>
          <Card
            content={{
              title: '🔐 Snap KMS Signer',
              description:
                'Snap KMS Signer is a feature that allows users to sign Ethereum transactions using an external key management service (KMS) provider.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.hasMetaMask}
                  style={{
                    width: '100%',
                  }}
                />
              ),
            }}
            disabled={!state.hasMetaMask}
          />
        </CardContainer>
      ) : (
        <StyledBox sx={{ flexGrow: 1 }}>
          <Grid container={true} spacing={4} columns={[1, 2, 3]}>
            <Grid item xs={3} sm={3} md={1}>
              <DividerTitle>Accounts</DividerTitle>
              <AccountList
                accounts={snapState.accounts}
                handleDelete={async (accountIdToDelete) => {
                  await client.deleteAccount(accountIdToDelete);
                  const accounts = await client.listAccounts();
                  setSnapState({
                    ...snapState,
                    accounts,
                  });
                }}
              />
              <Accordion items={accountManagementMethods} />
              <Divider />
            </Grid>
            <Grid item xs={3} sm={3} md={2}>
              <DividerTitle>Request Methods</DividerTitle>
              <Toggle
                title="Synchronous Approval"
                defaultChecked={snapState.useSynchronousApprovals}
                onToggle={handleUseSyncToggle}
                enabled={Boolean(state.installedSnap)}
              />
              <PendingRequests
                items={snapState.pendingRequests}
                client={client}
              />
              <Divider />
              <Divider />
            </Grid>
          </Grid>
        </StyledBox>
      )}
    </Container>
  );
};

export default Index;
