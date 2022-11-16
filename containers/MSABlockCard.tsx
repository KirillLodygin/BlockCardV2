import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DropdownValue } from '@vtb/ui-kit/adaptive/molecules/dropdown/_baseDropdown/typesDropdown';

import { cutBBCodesAndTags } from '@common/parse-bb-code';

import {
  AnalyticAction,
  AnalyticsEntityType,
  AnalyticsOptionsType,
  DebitAnalyticsMapType,
  NotificationKeys,
} from '../analytics';
import { BLOCK_CARD_SMS_CODE_LENGTH, initAuthorizeResponse } from '../constants/commonConstants';
import { useSubscribeBlockCardAsyncEvents } from '../hooks';
import {
  AsyncEventBlockDebitCardResponse,
  AuthorizeResponseType,
  BLOCK_DEBIT_CARD_SCREEN,
  BLOCK_TABLE_DATA_TITLE,
  BlockCardResponseType,
  BUTTONS_LOCK,
  CARD_TYPE,
  ContentCardBlock,
  LOCK_OPERATION,
  NOTIFICATION_TYPE,
  SCENARIO_ASYNC_EVENT_BLOCK_CARD,
} from '../types';
import { isKeyInAnalyticsMap } from '../utils/analyticsTypeGuard';
import { blockCardRequest } from '../utils/blockCardRequest';
import { getTimeoutValue } from '../utils/getTimeoutValue';
import { getNotificationType } from '../utils/notificationUtils';
import { isNumeric } from '../utils/validators';
import { MSACheckScreen } from './MSACheckScreen';
import { MSAResultScreen } from './MSAResultScreen';
import { MSAStartScreen } from './MSAStartScreen';

export type MSABlockCardProps = {
  cardId: string;
  cardName: string;
  content: ContentCardBlock;
  isTempBlockCardScenarioAvailable: boolean;
  isVirtualCard: boolean;
  shortNumber: string;
  onBack: () => void;
  onIssueCard: () => void;
  analyticsCb: (action: AnalyticAction, options: AnalyticsOptionsType) => void;
  analyticsMap: AnalyticsEntityType['analyticsMap'];
};

export const MSABlockCard = ({
  cardId,
  cardName,
  content,
  isTempBlockCardScenarioAvailable,
  isVirtualCard,
  shortNumber,
  analyticsCb,
  analyticsMap,
  onBack,
  onIssueCard,
}: MSABlockCardProps) => {
  const { lockConfirmationScreen, lockResultScreen, lockTypeSelectionScreen } = content;

  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isFetchAthorizeLoading, setIsFetchAuthorizeLoading] = useState(false);
  const [{ expirationTime, phone, transactionId }, setAuthorizeResponse] =
    useState<AuthorizeResponseType>(initAuthorizeResponse);
  const [maskedCardNumber, setMaskedCardNumber] = useState('');
  const [selectedRadioButton, setSelectedRadioButton] = useState<LOCK_OPERATION.TEMPORARY | LOCK_OPERATION.PERMANENT>(
    isTempBlockCardScenarioAvailable ? LOCK_OPERATION.TEMPORARY : LOCK_OPERATION.PERMANENT,
  );
  const [reasonBlockCard, setReasonBlockCard] = useState<DropdownValue>();
  const [currentScreen, setCurrentScreen] = useState<BLOCK_DEBIT_CARD_SCREEN>(BLOCK_DEBIT_CARD_SCREEN.START);
  const [notificationType, setNotificationType] = useState<Exclude<NotificationKeys, 'START' | 'CHECK'>>(
    NOTIFICATION_TYPE.SUCCESS,
  );
  const [secureCode, setSecureCode] = useState('');
  const [isSecureCodeInputError, setIsSecureCodeInputError] = useState<boolean>(false);
  const [currentDateSeconds, setCurrentDateSeconds] = useState<number>(
    Number((new Date().getTime() / 1000).toFixed(0)),
  );

  const analyticsOptions = useMemo(
    () => ({
      blockType: selectedRadioButton,
      cardName,
      screenData: currentScreen,
      notificationType: getNotificationType(notificationType),
      reason: reasonBlockCard?.caption,
    }),
    [cardName, currentScreen, notificationType, reasonBlockCard?.caption, selectedRadioButton],
  );

  const handleConfirm = useCallback(async () => {
    if (currentScreen === BLOCK_DEBIT_CARD_SCREEN.START) {
      analyticsCb(analyticsMap[BLOCK_DEBIT_CARD_SCREEN.START].blockCard, analyticsOptions);
    }

    if (currentScreen === BLOCK_DEBIT_CARD_SCREEN.START && selectedRadioButton === LOCK_OPERATION.PERMANENT) {
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.CHECK);

      return;
    }

    let url = `freeze/${cardId}`;
    setIsFetchLoading(true);

    try {
      if (selectedRadioButton === LOCK_OPERATION.PERMANENT) {
        url = `lock/${cardId}/commit`;
        const data = {
          transactionId,
          secureCode,
        };

        await blockCardRequest(url, data);
      } else {
        await blockCardRequest(url);
      }
    } catch (e) {
      setIsFetchLoading(false);
      setNotificationType(NOTIFICATION_TYPE.FAIL);
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);
    }
  }, [
    analyticsCb,
    analyticsMap,
    analyticsOptions,
    cardId,
    currentScreen,
    secureCode,
    selectedRadioButton,
    transactionId,
  ]);

  const handleBack = useCallback(() => {
    if (currentScreen === BLOCK_DEBIT_CARD_SCREEN.RESULT) {
      if (isKeyInAnalyticsMap<DebitAnalyticsMapType>(analyticsMap, notificationType)) {
        analyticsCb(analyticsMap[notificationType].clear, analyticsOptions);
      }
    }

    if (currentScreen === BLOCK_DEBIT_CARD_SCREEN.CHECK) {
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.START);
      setSecureCode('');
      setIsSecureCodeInputError(false);

      return;
    }

    onBack();
  }, [analyticsCb, analyticsMap, analyticsOptions, currentScreen, notificationType, onBack]);

  const handleIssueCard = useCallback(() => {
    if (isKeyInAnalyticsMap<DebitAnalyticsMapType>(analyticsMap, notificationType)) {
      analyticsCb(analyticsMap[NOTIFICATION_TYPE.SUCCESS].issueCard, analyticsOptions);
    }

    onIssueCard();
  }, [analyticsCb, analyticsMap, analyticsOptions, notificationType, onIssueCard]);

  const handleAgainBlockingCard = useCallback(() => {
    setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.START);
    setSecureCode('');
    setIsSecureCodeInputError(false);
  }, []);

  const handleSendSmsCode = useCallback(
    async (isSentCode: boolean) => {
      const url = `lock/${cardId}/authorize`;
      setIsFetchAuthorizeLoading(true);
      setSecureCode('');

      if (
        isKeyInAnalyticsMap<DebitAnalyticsMapType>(analyticsMap, BLOCK_DEBIT_CARD_SCREEN.CHECK, 'newCode') &&
        isKeyInAnalyticsMap<DebitAnalyticsMapType>(analyticsMap, BLOCK_DEBIT_CARD_SCREEN.CHECK, 'confirm')
      ) {
        const checkActions = analyticsMap[BLOCK_DEBIT_CARD_SCREEN.CHECK];
        const action = isSentCode ? checkActions.newCode : checkActions.confirm;

        analyticsCb(action, analyticsOptions);
      }

      try {
        await blockCardRequest(url);
      } catch (e) {
        setIsFetchAuthorizeLoading(false);
        setNotificationType(NOTIFICATION_TYPE.FAIL);
        setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);
      }
    },
    [analyticsCb, analyticsMap, analyticsOptions, cardId],
  );

  const handleAsyncEvent = ({ body, status, type }: AsyncEventBlockDebitCardResponse) => {
    setIsFetchLoading(false);
    setIsFetchAuthorizeLoading(false);

    if (type === SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT && status === 511) {
      setIsSecureCodeInputError(true);

      return;
    }

    if (status !== 200) {
      if (type === SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE) {
        setNotificationType(NOTIFICATION_TYPE.FAIL);
      } else {
        setNotificationType(NOTIFICATION_TYPE.ERROR);
      }

      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);

      return;
    }

    if (type === SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE) {
      setAuthorizeResponse({
        ...(body as AuthorizeResponseType),
        expirationTime: (body as AuthorizeResponseType).expirationTime || initAuthorizeResponse.expirationTime,
      });

      return;
    }

    setMaskedCardNumber((body as BlockCardResponseType).maskedCardNumber);
    setNotificationType(NOTIFICATION_TYPE.SUCCESS);
    setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);
  };

  useSubscribeBlockCardAsyncEvents(handleAsyncEvent);

  const handleChangeSecureCodeValue = useCallback(
    (codeValue: string) => {
      if (!codeValue) {
        setSecureCode('');

        return;
      }

      if (!isNumeric(codeValue)) {
        return;
      }

      if (isSecureCodeInputError && codeValue !== secureCode) {
        setIsSecureCodeInputError(false);
      }

      setSecureCode(codeValue);
    },
    [isSecureCodeInputError, secureCode],
  );

  useEffect(() => {
    if (
      selectedRadioButton === LOCK_OPERATION.PERMANENT &&
      secureCode.length === BLOCK_CARD_SMS_CODE_LENGTH &&
      currentScreen === BLOCK_DEBIT_CARD_SCREEN.CHECK
    ) {
      handleConfirm();
    }
  }, [currentScreen, handleConfirm, secureCode, selectedRadioButton]);

  useEffect(() => {
    setCurrentDateSeconds(Number((new Date().getTime() / 1000).toFixed(0)));
  }, [expirationTime]);

  const contentSelectionScreen = useMemo(() => {
    const {
      buttons,
      buttonsRadio,
      dropdown: { elements, label: dropdownLabel },
      notifications,
      ...content
    } = lockTypeSelectionScreen;

    const notification = notifications.filter(({ operations }) => operations.includes(selectedRadioButton))[0];

    const buttonsSelectionScreen = buttons.map(({ type, title }) =>
      type === BUTTONS_LOCK.CONTINUE ? { onClick: handleConfirm, title, type } : { onClick: handleBack, title, type },
    );

    const cardType = isVirtualCard ? CARD_TYPE.DIGITAL : CARD_TYPE.PLASTIC;

    const dropdownOptions = elements
      .filter(({ cardTypes }) => cardTypes.includes(cardType))
      .map(({ id, text }) => ({
        id,
        caption: text,
        value: text,
      }));

    const buttonsRadioAvalible = buttonsRadio.filter(
      ({ id }) => id === LOCK_OPERATION.PERMANENT || id === LOCK_OPERATION.TEMPORARY,
    );

    return {
      ...content,
      dropdownLabel,
      dropdownOptions,
      notification,
      buttons: buttonsSelectionScreen,
      buttonsRadio: buttonsRadioAvalible,
    };
  }, [lockTypeSelectionScreen, isVirtualCard, selectedRadioButton, handleConfirm, handleBack]);

  const contentCheckScreen = useMemo(() => {
    const { buttons, operationName, phoneInfo, table, ...content } = lockConfirmationScreen;

    const { buttonsRadio } = lockTypeSelectionScreen;

    const { backButton, continueButton, resendButton } = buttons.reduce((acc, { title, type }) => {
      if (type === BUTTONS_LOCK.BACK) {
        return { ...acc, backButton: { title, type } };
      }

      if (type === BUTTONS_LOCK.RESEND) {
        return { ...acc, resendButton: { title, type } };
      }

      if (type === BUTTONS_LOCK.CONTINUE) {
        return { ...acc, continueButton: { title, type } };
      }

      return acc;
    }, {} as Record<string, { title: string; type: BUTTONS_LOCK }>);

    const dataRowTableData = table
      .filter(({ type }) => {
        if (selectedRadioButton === LOCK_OPERATION.TEMPORARY) {
          return type !== BLOCK_TABLE_DATA_TITLE.BLOCK_REASON;
        }

        return true;
      })
      .map(({ type, title }) => {
        switch (type) {
          case BLOCK_TABLE_DATA_TITLE.CARD_TITLE:
            return {
              title,
              value: operationName,
            };

          case BLOCK_TABLE_DATA_TITLE.SHROT_CRAD_NEMBER:
            return {
              title,
              value: shortNumber,
            };

          case BLOCK_TABLE_DATA_TITLE.OPERATION_TYPE:
            return {
              title,
              value: buttonsRadio.filter(({ id }) => id === selectedRadioButton)[0].text,
            };

          default:
            return {
              title,
              value: reasonBlockCard?.value,
            };
        }
      });

    return {
      ...content,
      backButton,
      continueButton,
      resendButton,
      dataRowTableData,
      phoneInfo: cutBBCodesAndTags(phoneInfo, phone),
    };
  }, [phone, lockConfirmationScreen, lockTypeSelectionScreen, reasonBlockCard, shortNumber, selectedRadioButton]);

  const { notificationResultScreen, buttonsResultScreen } = useMemo(() => {
    const { notifications, buttons } = lockResultScreen;

    const notificationResultScreen = notifications
      .filter(({ operations, type }) => type === notificationType && operations.includes(selectedRadioButton))
      .map(({ title, description, type }) => ({
        description,
        title: cutBBCodesAndTags(title, maskedCardNumber),
        type: getNotificationType(type),
      }))[0];

    const buttonsResultScreen = buttons
      .map(({ isFail, type, title }) => {
        let onClick = handleBack;

        if (notificationType === NOTIFICATION_TYPE.FAIL) {
          if (type === BUTTONS_LOCK.CONTINUE) {
            onClick = handleAgainBlockingCard;
          }

          return isFail ? { onClick, title, type } : undefined;
        }

        if (selectedRadioButton === LOCK_OPERATION.PERMANENT && notificationType !== NOTIFICATION_TYPE.ERROR) {
          if (type === BUTTONS_LOCK.SECONDARY) {
            onClick = handleIssueCard;
          }

          return isFail ? undefined : { onClick, title, type };
        }

        return type === BUTTONS_LOCK.CONTINUE && !isFail ? { onClick, title, type } : undefined;
      })
      .filter((button) => button) as { onClick: () => void; title: string; type: BUTTONS_LOCK }[];

    return {
      notificationResultScreen,
      buttonsResultScreen,
    };
  }, [
    lockResultScreen,
    notificationType,
    selectedRadioButton,
    maskedCardNumber,
    handleBack,
    handleAgainBlockingCard,
    handleIssueCard,
  ]);

  useEffect(() => {
    if (!reasonBlockCard) {
      setReasonBlockCard(contentSelectionScreen.dropdownOptions[0]);
    }
  }, [contentSelectionScreen.dropdownOptions, reasonBlockCard]);

  switch (currentScreen) {
    case BLOCK_DEBIT_CARD_SCREEN.START: {
      return (
        <MSAStartScreen
          content={contentSelectionScreen}
          inputValue={shortNumber}
          isFetchLoading={isFetchLoading}
          isTempBlockAvailable={isTempBlockCardScenarioAvailable}
          onChangeBlockCardType={setSelectedRadioButton}
          onChangeReasonBlockCard={setReasonBlockCard}
          reasonBlockCard={reasonBlockCard}
          selectedRadioButton={selectedRadioButton}
        />
      );
    }

    case BLOCK_DEBIT_CARD_SCREEN.CHECK: {
      return (
        <MSACheckScreen
          content={contentCheckScreen}
          blockCardType={selectedRadioButton}
          isFetchLoading={isFetchLoading}
          isFetchAthorizeLoading={isFetchAthorizeLoading}
          onChangeSecureCode={handleChangeSecureCodeValue}
          onBack={handleBack}
          onSendSmsCode={handleSendSmsCode}
          secureCode={secureCode}
          onResetSecureCodeError={setIsSecureCodeInputError}
          isSecureCodeInputError={isSecureCodeInputError}
          timeout={getTimeoutValue({ expirationTime, currentDateSeconds })}
        />
      );
    }

    default:
      return (
        <MSAResultScreen
          notification={notificationResultScreen}
          buttons={buttonsResultScreen}
          isFetchLoading={isFetchLoading}
        />
      );
  }
};
