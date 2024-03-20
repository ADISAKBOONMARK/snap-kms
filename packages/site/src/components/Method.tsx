import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import styled from 'styled-components';

import { AlertBanner, AlertType } from './AlertBanner';
import { MethodButton } from './Buttons';
import { CopyableItem } from './CopyableItem';
import { InputType } from '../types';

const StyledDescription = styled.p`
  font-size: 14px;
  margin: 8px;
  padding-top: 24px;
`;

const InputTitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 5px 2.5% 5px 16px;
`;

const StyledSelect = styled.select`
  width: calc(95% - 16px);
  padding-top: 8px;
  padding-bottom: 10px;
  padding-left: 10px;
  margin: 8px 2.5% 8px 16px;
  border-radius: 5px;
  -moz-appearance:none; 
  -webkit-appearance:none;
  appearance:none;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KCjwhLS0gTGljZW5zZTogTUlULiBNYWRlIGJ5IEgyRDIgRGVzaWduOiBodHRwczovL2dpdGh1Yi5jb20vaDJkMi1kZXNpZ24vaDJkMi1zaG9waWNvbnMgLS0+Cjxzdmcgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciID4KCjxwYXRoIGQ9Ik0wIDBoNDh2NDhIMHoiIGZpbGw9Im5vbmUiLz4KPGcgaWQ9IlNob3BpY29uIj4KCTxnPgoJCTxwb2x5Z29uIHBvaW50cz0iMjQsMjkuMTcxIDkuNDE0LDE0LjU4NSA2LjU4NiwxNy40MTMgMjQsMzQuODI3IDQxLjQxNCwxNy40MTMgMzguNTg2LDE0LjU4NSAJCSIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg==");
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: calc(100% - 8px) center;
`;

const StyledSelectItem = styled.option`
  margin-left: 16px;

  :disabled {
    font-style: italic;
  }
`;

const TextField = styled.input`
  width: calc(95% - 16px);
  padding: 10px;
  margin: 8px 2.5% 8px 16px;
  background: transparent;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #bbc0c5;
`;

const TextArea = styled.textarea`
  width: calc(95% - 16px);
  height: 250px;
  padding: 10px;
  margin: 8px 2.5% 8px 16px;
  background: transparent;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #bbc0c5;
`;

const CopyableContainer = styled.div`
  width: 95%;
  margin: 0px 2.5% 8px 8px;
`;

export type MethodProps = {
  description: string;
  inputs: {
    id: string;
    title: string;
    placeholder: string;
    onChange: () => null;
    type: InputType;
  }[];
  action: {
    callback: () => Promise<unknown>;
    disabled: boolean;
    label: string;
  };
  successMessage?: string;
  failureMessage?: string;
};

export const Method = ({
  description,
  inputs,
  action,
  successMessage,
  failureMessage,
}: MethodProps) => {
  const [response, setResponse] = useState<unknown>();
  const [error, setError] = useState<unknown>();

  const inputSwitch = (props: any) => {
    switch (props.type) {
      case InputType.TextField:
        return (
          <TextField
            id={props.id}
            placeholder={props.placeholder}
            onChange={props.onChange}
          />
        );
      case InputType.TextArea:
        return (
          <TextArea
            id={props.id}
            placeholder={props.placeholder}
            onChange={props.onChange}
          />
        );
      case InputType.Dropdown:
        return (
          <StyledSelect onChange={props.onChange}>
            <StyledSelectItem disabled value="">
              {props.placeholder}
            </StyledSelectItem>
            {props.options.map((option: { value: string | number }) => (
              <StyledSelectItem value={option.value} key={option.value}>
                {option.value}
              </StyledSelectItem>
            ))}
          </StyledSelect>
        );
      default:
        return null;
    }
  };

  return (
    <Grid
      container={true}
      direction="column"
      spacing={4}
      style={{
        overflowX: 'hidden',
      }}
    >
      <StyledDescription>{description}</StyledDescription>
      {inputs?.map(
        (input: {
          title: string;
          placeholder: string;
          onChange: () => null;
          type: InputType;
        }) => (
          <Grid key={input.title}>
            <InputTitle>{input.title}</InputTitle>
            {inputSwitch(input)}
          </Grid>
        ),
      )}

      {action && (
        <MethodButton
          onClick={async () => {
            setResponse(undefined);
            setError(undefined);
            try {
              // eslint-disable-next-line id-length
              const r = await action.callback();
              setResponse(r === undefined ? null : r);
              // eslint-disable-next-line id-length
            } catch (e: any) {
              setError(e);
            }
          }}
          disable={action.disabled}
          label={action.label}
        />
      )}

      {response !== undefined && (
        <CopyableContainer>
          <AlertBanner
            title={successMessage ?? 'Successful request'}
            alertType={AlertType.Success}
          />
          <CopyableItem value={JSON.stringify(response, null, 2)} />
        </CopyableContainer>
      )}

      {error !== undefined && (
        <CopyableContainer>
          <AlertBanner
            title={failureMessage ?? 'Error request'}
            alertType={AlertType.Failure}
          />
          <CopyableItem
            value={
              error instanceof Error
                ? error.message
                : JSON.stringify(error, null, 2)
            }
          />
        </CopyableContainer>
      )}
    </Grid>
  );
};
