import React, { useContext } from 'react';
import semver from 'semver';
import styled from 'styled-components';

import { HeaderButtons } from './Buttons';
import snapPackageInfo from '../../../snap/package.json';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap } from '../utils';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  padding-left: 5%;
  padding-right: 5%;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

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

  const updateAvailable = Boolean(
    state?.installedSnap &&
      semver.gt(snapPackageInfo.version, state.installedSnap?.version),
  );

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Title>🧸 Snap KMS Signer</Title>
      </LogoWrapper>
      <RightContainer>
        <HeaderButtons
          state={state}
          onConnectClick={handleConnectClick}
          updateAvailable={updateAvailable}
        />
      </RightContainer>
    </HeaderWrapper>
  );
};
