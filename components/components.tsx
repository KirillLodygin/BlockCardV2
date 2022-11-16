import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex } from 'reflexbox/styled-components';
import styled from 'styled-components/macro';

import { AdditionalTypography, ADDITIONAL_TYPOGRAPHY_SIZE } from '@vtb/ui-kit/adaptive/atoms/additionalTypography';
import { ButtonText } from '@vtb/ui-kit/adaptive/atoms/button';
import { Icon, ICON_SIZE } from '@vtb/ui-kit/adaptive/atoms/icon';
import { MAIN_TYPOGRAPHY_SIZE, MainTypography } from '@vtb/ui-kit/adaptive/atoms/mainTypography';
import { Notification as Notice, NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';
import { COLOR_GETTERS } from '@vtb/ui-kit/adaptive/tokens/palette/colorGetters';
import { CardPending, ChevronLeft } from '@vtb/ui-kit/assets';
import { INDENT } from '@vtb/ui-kit/tokens/sizes';
import { TYPOGRAPHY_WEIGHT } from '@vtb/ui-kit/tokens/typography';

import { ReactComponent as CardBlockErrorDark } from '@assets/cards/cardBlockErrorDark.svg';
import { ReactComponent as CardBlockErrorLight } from '@assets/cards/cardBlockErrorLight.svg';
import { ReactComponent as CardBlockSuccessDark } from '@assets/cards/cardBlockSuccessDark.svg';
import { ReactComponent as CardBlockSuccessLight } from '@assets/cards/cardBlockSuccessLight.svg';
import { useThemedContent } from '@common/appTheme';
import { OPERATIONS_CONSTANTS } from '@common/overmind/constants/base';
import { DEFAULT_ERROR_MSG } from '@common/overmind/constants/messages';
import { OperationFormChild } from '@common/overmind/layouts/common/components/operationForm';
import {
  OperationFormStatus,
  StatusIconContainer,
  StatusText,
} from '@common/overmind/layouts/common/components/operationForm/OperationFormStatus';
import { ELEMENT_TYPES } from '@common/overmind/layouts/common/constants';
import { cutBBCodesAndTags, parseBBCode } from '@common/parse-bb-code';
import { useSetNavBarTitle } from '@modules/NavBar';

// TODO-gordeev: использовать более подходящие типы после того как они будут сформированы в овермайнде
// TODO-svetlov: перетащить все компоненты в свои файлы и переместить в папку с компонентами

type TitleProps = {
  titleText?: string;
};

export const Title = ({ titleText }: TitleProps) => (
  <Box mb={INDENT.sm}>
    <MainTypography autoFocus>{parseBBCode(titleText)}</MainTypography>
  </Box>
);

const NotificationText = styled(AdditionalTypography).attrs({
  size: ADDITIONAL_TYPOGRAPHY_SIZE.m,
})`
  color: ${COLOR_GETTERS.text.secondary};
`;

type NotificationProps = {
  hasErrorNotification: boolean;
  isLockingSuccess: boolean;
  statusText: string | undefined;
  details: React.Component;
};

export const Notification = ({ statusText, hasErrorNotification, isLockingSuccess, details }: NotificationProps) => {
  const illustrations = useThemedContent(
    {
      success: <CardBlockSuccessLight />,
      error: <CardBlockErrorLight />,
    },
    {
      success: <CardBlockSuccessDark />,
      error: <CardBlockErrorDark />,
    },
  );

  return (
    <Box mb={INDENT.l}>
      <OperationFormStatus>
        <StatusIconContainer>
          {isLockingSuccess && illustrations.success}
          {hasErrorNotification && illustrations.error}
        </StatusIconContainer>
        <StatusText autoFocus>{statusText}</StatusText>

        <NotificationText>{details}</NotificationText>
      </OperationFormStatus>
    </Box>
  );
};

type ButtonsBlockProps = {
  buttons: ReadonlyArray<any>;
};

export const ButtonsBlock = ({ buttons }: ButtonsBlockProps) => (
  <Box mt={INDENT.m}>
    {buttons.map((button) =>
      button.props.name === OPERATIONS_CONSTANTS.commandNames.CANCEL ? (
        <Box mt={INDENT.l} key={button.key}>
          {button}
        </Box>
      ) : (
        <Box key={button.key}>{button}</Box>
      ),
    )}
  </Box>
);

type ElementsBlockProps = {
  elements: ReadonlyArray<any>;
};

export const ElementsBlock = ({ elements }: ElementsBlockProps) => (
  <Box mb={INDENT.xs} flexDirection="column" key="rootGroup">
    {elements.map((field, i) => (
      <OperationFormChild type={ELEMENT_TYPES.FIELD} key={i}>
        {field}
      </OperationFormChild>
    ))}
  </Box>
);

export const BlockTitle = ({ titleText }: TitleProps) => {
  const TitleRef = useRef(null);
  useSetNavBarTitle(titleText, TitleRef);

  if (titleText) {
    return (
      <Box mb={INDENT.m}>
        <MainTypography size={MAIN_TYPOGRAPHY_SIZE.m} tag="h3" ref={TitleRef} autoFocus>
          {titleText}
        </MainTypography>
      </Box>
    );
  }

  return null;
};

export const DefaultErrorBlock = () => (
  <Box mt={INDENT.m}>
    <Notice text={DEFAULT_ERROR_MSG} type={NOTIFICATION_TYPE.fail} />
  </Box>
);

const StyledAdditionalTypography = styled(AdditionalTypography)`
  color: ${COLOR_GETTERS.text.primary};
`;

type CodeRequestTimerProps = {
  isTimerRunning: boolean;
  setIsTimerRunning: (value: boolean) => void;
  text: string;
  timeout: number;
};

export const CodeRequestTimer = ({ isTimerRunning, setIsTimerRunning, text, timeout }: CodeRequestTimerProps) => {
  const [seconds, setSeconds] = useState(timeout);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);

    if (seconds === 0) {
      clearInterval(timerId);
      setIsTimerRunning(false);
    }

    return () => clearInterval(timerId);
  }, [seconds, setIsTimerRunning]);

  useEffect(() => {
    if (isTimerRunning) {
      setSeconds(timeout);
    }
  }, [isTimerRunning, timeout]);

  return (
    <Box mt={INDENT.xs}>
      <Flex>
        {isTimerRunning && <Icon type={CardPending} size={ICON_SIZE.s} />}
        <StyledAdditionalTypography weight={TYPOGRAPHY_WEIGHT.bold} role="timer">
          <Box as="span" ml={INDENT.xxxxs}>
            {cutBBCodesAndTags(text, seconds.toString().padStart(2, '0'))}
          </Box>
        </StyledAdditionalTypography>
      </Flex>
    </Box>
  );
};

type BackButtonBlockProps = {
  children: string;
  'data-test-id': string;
  disabled?: boolean;
  onClick: () => void;
};

export const BackButtonBlock = ({ children, ...props }: BackButtonBlockProps) => (
  <ButtonText size="medium" icon={ChevronLeft} {...props}>
    {children}
  </ButtonText>
);
