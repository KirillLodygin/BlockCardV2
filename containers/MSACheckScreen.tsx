import React, { useCallback, useState } from 'react';
import { Box } from 'reflexbox/styled-components';

import { getDataTestId } from '@vtb/ui-kit/_utils/getDataTestId';
import { AdditionalTypography } from '@vtb/ui-kit/adaptive/atoms/additionalTypography';
import { ButtonContained } from '@vtb/ui-kit/adaptive/atoms/button';
import { ControlWithTips } from '@vtb/ui-kit/adaptive/atoms/controlWithTips';
import { DataRowTable, DATA_ROW_SIZES } from '@vtb/ui-kit/adaptive/atoms/dataRow';
import { Input } from '@vtb/ui-kit/adaptive/atoms/input';
import { MAIN_TYPOGRAPHY_SIZE } from '@vtb/ui-kit/adaptive/atoms/mainTypography';
import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import { CheckScreenInputSkeleton } from '../components/CheckScreenInputSkeleton';
import { BackButtonBlock, BlockTitle, CodeRequestTimer } from '../components/components';
import { BLOCK_CARD_SMS_CODE_LENGTH, SCENARIO_TEST_ID } from '../constants/commonConstants';
import { BUTTONS_LOCK, LOCK_OPERATION, RowTableData } from '../types';

type Props = {
  content: {
    backButton: {
      title: string;
      type: BUTTONS_LOCK;
    };
    continueButton: {
      title: string;
      type: BUTTONS_LOCK;
    };
    dataRowTableData: RowTableData[];
    inputErrorText: string;
    inputLabel: string;
    phoneInfo: string;
    resendButton: {
      title: string;
      type: BUTTONS_LOCK;
    };
    timerInfo: string;
    title: string;
  };
  blockCardType: LOCK_OPERATION;
  isFetchLoading: boolean;
  isFetchAthorizeLoading: boolean;
  onBack: () => void;
  onChangeSecureCode: (value: string) => void;
  onSendSmsCode: (isSentCode: boolean) => void;
  secureCode: string;
  onResetSecureCodeError: (isError: boolean) => void;
  isSecureCodeInputError: boolean;
  timeout: number;
};

export const MSACheckScreen = ({
  content: {
    backButton,
    continueButton,
    dataRowTableData,
    inputErrorText,
    inputLabel,
    phoneInfo,
    resendButton,
    timerInfo,
    title,
  },
  blockCardType,
  isFetchLoading,
  isFetchAthorizeLoading,
  onBack,
  onChangeSecureCode,
  onSendSmsCode,
  secureCode,
  onResetSecureCodeError,
  isSecureCodeInputError,
  timeout,
}: Props) => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSentCode, setIsSentCode] = useState(blockCardType === LOCK_OPERATION.UNFREEZE);

  const handleSendSmsCode = useCallback(() => {
    onSendSmsCode(isSentCode);
    setIsSentCode(true);
  }, [isSentCode, onSendSmsCode]);

  const handleResentSmsCode = useCallback(() => {
    onSendSmsCode(isSentCode);
    setIsTimerRunning(true);
    onResetSecureCodeError(false);
  }, [isSentCode, onResetSecureCodeError, onSendSmsCode]);

  return (
    <>
      <BlockTitle titleText={title} />
      <Box mb={INDENT.m}>
        <DataRowTable data={dataRowTableData} size={DATA_ROW_SIZES.m} />
      </Box>
      {isSentCode &&
        (isFetchAthorizeLoading ? (
          <CheckScreenInputSkeleton />
        ) : (
          <Box mb={INDENT.l}>
            <Box mb={INDENT.sm}>
              <AdditionalTypography size={MAIN_TYPOGRAPHY_SIZE.m} tag="p" weight="normal">
                {phoneInfo}
              </AdditionalTypography>
            </Box>
            <Box maxWidth={FIELD_WIDTH.xl}>
              <ControlWithTips width={FIELD_WIDTH.m} errorText={inputErrorText} hasError={isSecureCodeInputError}>
                <Input
                  data-test-id={getDataTestId(SCENARIO_TEST_ID, 'input_smscode_field')}
                  disabled={isFetchLoading}
                  label={inputLabel}
                  maxLength={BLOCK_CARD_SMS_CODE_LENGTH}
                  onChange={onChangeSecureCode}
                  value={secureCode}
                  autoFocus
                  inputMode="numeric"
                  isLoading={isFetchLoading}
                  type="text"
                  hasError={isSecureCodeInputError}
                />
              </ControlWithTips>
            </Box>
            {isTimerRunning && (
              <CodeRequestTimer
                isTimerRunning={isTimerRunning}
                setIsTimerRunning={setIsTimerRunning}
                text={timerInfo}
                timeout={timeout}
              />
            )}
          </Box>
        ))}
      <Box mb={INDENT.m}>
        {isSentCode ? (
          <ButtonContained.Loader
            data-test-id={getDataTestId(resendButton.type, 'blockCardButton')}
            disabled={isTimerRunning || isFetchLoading}
            isLoading={isFetchAthorizeLoading}
            onClick={handleResentSmsCode}
          >
            {resendButton.title}
          </ButtonContained.Loader>
        ) : (
          <ButtonContained.Loader
            data-test-id={getDataTestId(continueButton.type, 'blockCardButton')}
            onClick={handleSendSmsCode}
          >
            {continueButton.title}
          </ButtonContained.Loader>
        )}
      </Box>
      <Box>
        <BackButtonBlock
          data-test-id={getDataTestId(backButton.type, 'blockCardButton')}
          disabled={isFetchLoading || isFetchAthorizeLoading}
          onClick={onBack}
        >
          {backButton.title}
        </BackButtonBlock>
      </Box>
    </>
  );
};
