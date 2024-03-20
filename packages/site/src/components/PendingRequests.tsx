import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import styled from 'styled-components';

import {
  AccountRow,
  AccountRowTitle,
  StyledBox,
} from './styledComponents';
import { CopyableItem } from './CopyableItem';
import { formatEther } from '@ethersproject/units';
import { TextArea } from './TextArea';
import { MethodButton } from './Buttons';
import { AlertBanner, AlertType } from './AlertBanner';
import { confirmAlert } from 'react-confirm-alert'; // Import

const AccordionContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const AccordionItem = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 8px;
`;

const AccordionHeader = styled.div`
  margin: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const AccordionContent = styled.div`
  display: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? 'block' : 'none')};
  padding: 0px 32px;
`;

export const Accordion = ({ items, client }: any) => {
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    let newIndexes;
    if (activeIndexes.includes(index)) {
      newIndexes = activeIndexes.filter((element: any) => element !== index);
    } else {
      newIndexes = [...activeIndexes, index];
    }
    setActiveIndexes(newIndexes);
  };

  const [response, setResponse] = useState<unknown>();
  const [error, setError] = useState<unknown>();

  return (
    <AccordionContainer>
      {items.map((item: any, index: number) => {
        return (
          <AccordionItem key={index}>
            <AccordionHeader onClick={() => toggleAccordion(index)}>
              {item.id}
              {activeIndexes.includes(index) ? (
                <IoIosArrowUp />
              ) : (
                <IoIosArrowDown />
              )}
            </AccordionHeader>
            <AccordionContent isOpen={activeIndexes.includes(index)}>
              <AccountRow>
                <AccountRowTitle>From</AccountRowTitle>
                <CopyableItem value={item.request.params[0].from} />
              </AccountRow>
              <AccountRow>
                <AccountRowTitle>To</AccountRowTitle>
                <CopyableItem value={item.request.params[0].to} />
              </AccountRow>
              <AccountRow>
                <AccountRowTitle>Value (ETH)</AccountRowTitle>
                <TextArea
                  value={formatEther(BigInt(item.request.params[0].value))}
                />
              </AccountRow>
              <AccountRow>
                <AccountRowTitle>Data</AccountRowTitle>
                <TextArea value={item.request.params[0].data} />
              </AccountRow>
              <AccountRow>
                <AccountRowTitle>Detail</AccountRowTitle>
                <TextArea value={JSON.stringify(item.request, null, 2)} />
              </AccountRow>
              {response !== undefined && (
                <StyledBox>
                  <AlertBanner
                    title={'Successful request'}
                    alertType={AlertType.Success}
                  />
                  <CopyableItem value={JSON.stringify(response, null, 2)} />
                </StyledBox>
              )}

              {error !== undefined && (
                <StyledBox>
                  <AlertBanner
                    title={'Error request'}
                    alertType={AlertType.Failure}
                  />
                  <CopyableItem
                    value={
                      error instanceof Error
                        ? error.message
                        : JSON.stringify(error, null, 2)
                    }
                  />
                </StyledBox>
              )}

              <StyledBox style={{ textAlign: 'right' }}>
                <MethodButton
                  onClick={async () => {
                    confirmAlert({
                      title: 'Reject',
                      message: 'Are you sure to reject the transaction?',
                      buttons: [
                        {
                          label: 'No',
                        },
                        {
                          label: 'Yes',
                          onClick: async () => {
                            setResponse(undefined);
                            setError(undefined);
                            try {
                              // eslint-disable-next-line id-length
                              const r = await client.rejectRequest(
                                item.id as string,
                              );
                              setResponse(r === undefined ? null : r);
                              // eslint-disable-next-line id-length
                              delete items[index];
                            } catch (e: any) {
                              setError(e);
                            }
                          },
                        },
                      ],
                    });
                  }}
                  width={'100px'}
                  color={{
                    hover: '#CB4335',
                    background: '#E74C3C',
                  }}
                  label={'Reject'}
                ></MethodButton>
                <MethodButton
                  onClick={async () => {
                    confirmAlert({
                      title: 'Approve',
                      message: 'Are you sure to approve the transaction?',
                      buttons: [
                        {
                          label: 'No',
                        },
                        {
                          label: 'Yes',
                          onClick: async () => {
                            setResponse(undefined);
                            setError(undefined);
                            try {
                              // eslint-disable-next-line id-length
                              const r = await client.approveRequest(
                                item.id as string,
                              );
                              setResponse(r === undefined ? null : r);
                              // eslint-disable-next-line id-length
                              delete items[index];
                            } catch (e: any) {
                              setError(e);
                            }
                          },
                        },
                      ],
                    });
                  }}
                  width={'100px'}
                  color={{
                    hover: '#16A085',
                    background: '#138D75',
                  }}
                  label={'Approve'}
                ></MethodButton>
              </StyledBox>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionContainer>
  );
};

export default Accordion;
