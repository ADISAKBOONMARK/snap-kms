import React, { useContext } from 'react';
import styled, { useTheme } from 'styled-components';

import { MetaMask } from './MetaMask';
import { PoweredBy } from './PoweredBy';
import { ReactComponent as MetaMaskFox } from '../assets/metamask_fox.svg';
import packageInfo from '../../package.json';
import { defaultSnapOrigin } from '../config';
import snapPackageInfo from '../../package.json';
import { MetaMaskContext } from '../hooks';

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 2.4rem;
  padding-bottom: 2.4rem;
  border-top: 1px solid ${(props) => props.theme.colors.border?.default};
`;

const PoweredByButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  border-radius: ${({ theme }) => theme.radii.button};
  box-shadow: ${({ theme }) => theme.shadows.button};
  background-color: ${({ theme }) => theme.colors.background?.alternative};
`;

const PoweredByContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const VersionStyle = styled.p`
  margin: 1.2rem;
  font-size: 1.2rem;
  padding-right: 2rem;
  color: ${({ theme }) => theme.colors.text?.muted};
`;

export const Footer = () => {
  const theme = useTheme();

  const [state, dispatch] = useContext(MetaMaskContext);

  /**
   * Component that displays the dapp and snap versions.
   *
   * @returns A component that displays the dapp and snap versions.
   */
  const Version = () => {
    return (
      <VersionStyle>
        <div>
          <b>Dapp version: </b>
          {packageInfo.version}
        </div>

        <div>
          <b>Snap version (expected): </b>
          {snapPackageInfo.version}
        </div>

        {state.installedSnap ? (
          <div>
            <b>Snap version (installed): </b> {state.installedSnap?.version}
          </div>
        ) : (
          <div>
            <b>Snap version (to install): </b> {snapPackageInfo.version}
          </div>
        )}

        {defaultSnapOrigin.startsWith('local') && `(from ${defaultSnapOrigin})`}
      </VersionStyle>
    );
  };

  return (
    <FooterWrapper>
      <PoweredByButton href="https://docs.metamask.io/" target="_blank">
        <MetaMaskFox />
        <PoweredByContainer>
          <PoweredBy color={theme.colors.text?.muted ?? '#6A737D'} />
          <MetaMask color={theme.colors.text?.default ?? '#24272A'} />
        </PoweredByContainer>
      </PoweredByButton>
      <Version />
    </FooterWrapper>
  );
};
