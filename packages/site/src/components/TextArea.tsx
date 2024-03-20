import React, { useState } from 'react';

import {
  AccountRow,
  CopyableContainer,
  CopyableItemValue,
} from './styledComponents';

export const TextArea = ({ value }: { value: string }) => {
  const [active, setActive] = useState(false);

  return (
    <AccountRow>
      <CopyableContainer active={active}>
        <CopyableItemValue>{value}</CopyableItemValue>
      </CopyableContainer>
    </AccountRow>
  );
};
