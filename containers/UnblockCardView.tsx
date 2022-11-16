import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { cutBBCodesAndTags } from '@common/parse-bb-code';
import { CardEntity } from '@modules/DebitAndCreditCards';

import {
  AnalyticAction,
  AnalyticsEntityType,
  AnalyticsOptionsType,
  CreditAnalyticsMapType,
  DebitAnalyticsMapType,
  NotificationKeys,
} from '../analytics';
import { BLOCK_CARD_SMS_CODE_LENGTH, initAuthorizeResponse } from '../constants/commonConstants';
import { useSubscribeBlockCardAsyncEvents } from '../hooks';
import {
  AsyncEventBlockDebitCardResponse,
  BlockCardResponseType,
  ContentCardBlock,
  NOTIFICATION_TYPE,
  BUTTONS_LOCK,
  LOCK_OPERATION,
  BLOCK_DEBIT_CARD_SCREEN,
  BLOCK_TABLE_DATA_TITLE,
  AuthorizeResponseType,
  SCENARIO_ASYNC_EVENT_BLOCK_CARD,
} from '../types';
import { isKeyInAnalyticsMap } from '../utils/analyticsTypeGuard';
import { blockCardRequest } from '../utils/blockCardRequest';
import { getTimeoutValue } from '../utils/getTimeoutValue';
import { getNotificationType } from '../utils/notificationUtils';
import { isNumeric } from '../utils/validators';
import { MSACheckScreen } from './MSACheckScreen';
import { MSAResultScreen } from './MSAResultScreen';

type Props = {
  card: CardEntity;
  content: ContentCardBlock;
  onClose: () => void;
  isConfirmEnabled?: boolean;
  analyticsCb: (action: AnalyticAction, options: AnalyticsOptionsType) => void;
  analyticsMap: AnalyticsEntityType['analyticsMap'];
};

export const UnblockCardView = ({
  card: { id: cardId, shortNumber = '', displayName = '' },
  content: { lockConfirmationScreen, lockResultScreen },
  onClose,
  isConfirmEnabled = false,
  analyticsCb,
  analyticsMap,
}: Props) => {
  const [currentScreen, setCurrentScreen] = useState<BLOCK_DEBIT_CARD_SCREEN>(
    isConfirmEnabled ? BLOCK_DEBIT_CARD_SCREEN.CHECK : BLOCK_DEBIT_CARD_SCREEN.RESULT,
  );
  const [{ expirationTime, phone, transactionId }, setAuthorizeResponse] =
    useState<AuthorizeResponseType>(initAuthorizeResponse);
  const [secureCode, setSecureCode] = useState('');
  const [isSecureCodeInputError, setIsSecureCodeInputError] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<Exclude<NotificationKeys, 'START' | 'CHECK'>>(
    NOTIFICATION_TYPE.SUCCESS,
  );
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isFetchAthorizeLoading, setIsFetchAuthorizeLoading] = useState(false);
  const [maskedCardNumber, setMaskedCardNumber] = useState('');
  const [currentDateSeconds, setCurrentDateSeconds] = useState<number>(
    Number((new Date().getTime() / 1000).toFixed(0)),
  );

  const analyticsOptions = useMemo(
    () => ({
      blockType: LOCK_OPERATION.UNFREEZE,
      cardName: displayName,
      screenData: currentScreen,
      notificationType: getNotificationType(notificationType),
    }),
    [currentScreen, displayName, notificationType],
  );

  const handleConfirm = useCallback(async () => {
    setIsFetchLoading(true);

    try {
      if (isConfirmEnabled) {
        const urlUnblockForCreditCard = `unfreeze/${cardId}/commit`;

        // подтвердить разблокировку карты
        if (
          isKeyInAnalyticsMap<CreditAnalyticsMapType>(analyticsMap, BLOCK_DEBIT_CARD_SCREEN.CHECK, 'confirmUnfreeze')
        ) {
          analyticsCb(analyticsMap[BLOCK_DEBIT_CARD_SCREEN.CHECK].confirmUnfreeze, analyticsOptions);
        }

        await blockCardRequest(urlUnblockForCreditCard, { transactionId, secureCode });
      } else {
        const urlUnblockForDebitCard = `unfreeze/${cardId}`;

        await blockCardRequest(urlUnblockForDebitCard);
      }
    } catch (e) {
      setIsFetchLoading(false);
      setNotificationType(NOTIFICATION_TYPE.FAIL);
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);
    }
  }, [isConfirmEnabled, cardId, analyticsMap, transactionId, secureCode, analyticsCb, analyticsOptions]);

  const handleSendSmsCode = useCallback(async () => {
    const url = `unfreeze/${cardId}/authorize`;
    setIsFetchAuthorizeLoading(true);

    try {
      await blockCardRequest(url);
    } catch (e) {
      setIsFetchAuthorizeLoading(false);
      setNotificationType(NOTIFICATION_TYPE.FAIL);
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.RESULT);
    }
  }, [cardId]);

  const handleInitLoad = useCallback(() => {
    if (isConfirmEnabled) {
      handleSendSmsCode();
    } else {
      handleConfirm();
    }
  }, [handleConfirm, handleSendSmsCode, isConfirmEnabled]);

  const handleAgainBlockingCard = useCallback(() => {
    if (isConfirmEnabled) {
      setCurrentScreen(BLOCK_DEBIT_CARD_SCREEN.CHECK);
      setSecureCode('');
      setIsSecureCodeInputError(false);
      handleSendSmsCode();
    } else {
      handleConfirm();
    }
  }, [setCurrentScreen, setSecureCode, setIsSecureCodeInputError, handleSendSmsCode, handleConfirm, isConfirmEnabled]);

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

  const handleAsyncEvent = ({ body, status, type }: AsyncEventBlockDebitCardResponse) => {
    setIsFetchLoading(false);
    setIsFetchAuthorizeLoading(false);

    if (type === SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT_UNFREEZE && status === 511) {
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

    if (type === SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE_UNFREEZE) {
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

  useEffect(() => {
    handleInitLoad();
  }, []);

  useEffect(() => {
    if (secureCode.length === BLOCK_CARD_SMS_CODE_LENGTH && currentScreen === BLOCK_DEBIT_CARD_SCREEN.CHECK) {
      handleConfirm();
    }
  }, [currentScreen, handleConfirm, secureCode]);

  useEffect(() => {
    setCurrentDateSeconds(Number((new Date().getTime() / 1000).toFixed(0)));
  }, [expirationTime]);

  const contentCheckScreen = useMemo(() => {
    const { buttons, operationName, phoneInfo, table, ...content } = lockConfirmationScreen;

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
      .filter(({ type }) =>
        [BLOCK_TABLE_DATA_TITLE.CARD_TITLE, BLOCK_TABLE_DATA_TITLE.SHROT_CRAD_NEMBER].includes(type),
      )
      .map(({ type, title }) => ({
        title,
        value: type === BLOCK_TABLE_DATA_TITLE.CARD_TITLE ? operationName : shortNumber,
      }));

    return {
      ...content,
      backButton,
      continueButton,
      resendButton,
      dataRowTableData,
      phoneInfo: cutBBCodesAndTags(phoneInfo, phone),
    };
  }, [phone, lockConfirmationScreen, shortNumber]);

  const { notificationResultScreen, buttonsResultScreen } = useMemo(() => {
    const { notifications, buttons } = lockResultScreen;

    const notificationResultScreen = notifications
      .filter(({ operations, type }) => type === notificationType && operations.includes(LOCK_OPERATION.UNFREEZE))
      .map(({ title, description, type }) => ({
        description,
        title: cutBBCodesAndTags(title, maskedCardNumber),
        type: getNotificationType(type),
      }))[0];

    const buttonsResultScreen = buttons
      .filter(({ isFail, type }) => {
        if (notificationType === NOTIFICATION_TYPE.FAIL) {
          return isFail;
        }

        return !isFail && type === BUTTONS_LOCK.CONTINUE;
      })
      .map(({ type, title }) => {
        let onClick = () => {
          if (isKeyInAnalyticsMap<DebitAnalyticsMapType>(analyticsMap, notificationType)) {
            analyticsCb(analyticsMap[notificationType].unfreeze, analyticsOptions);
          }
          onClose();
        };

        if (notificationType === NOTIFICATION_TYPE.FAIL && type === BUTTONS_LOCK.CONTINUE) {
          onClick = handleAgainBlockingCard;
        }

        return { onClick, title, type };
      });

    return {
      notificationResultScreen,
      buttonsResultScreen,
    };
  }, [
    lockResultScreen,
    notificationType,
    maskedCardNumber,
    analyticsMap,
    onClose,
    analyticsCb,
    analyticsOptions,
    handleAgainBlockingCard,
  ]);

  return currentScreen === BLOCK_DEBIT_CARD_SCREEN.CHECK ? (
    <MSACheckScreen
      content={contentCheckScreen}
      blockCardType={LOCK_OPERATION.UNFREEZE}
      isFetchLoading={isFetchLoading}
      isFetchAthorizeLoading={isFetchAthorizeLoading}
      onChangeSecureCode={handleChangeSecureCodeValue}
      onBack={onClose}
      onSendSmsCode={handleSendSmsCode}
      secureCode={secureCode}
      onResetSecureCodeError={setIsSecureCodeInputError}
      isSecureCodeInputError={isSecureCodeInputError}
      timeout={getTimeoutValue({ expirationTime, currentDateSeconds })}
    />
  ) : (
    <MSAResultScreen
      notification={notificationResultScreen}
      buttons={buttonsResultScreen}
      isFetchLoading={isFetchLoading}
    />
  );
};
