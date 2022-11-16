import React from 'react';
import { Box, Flex } from 'reflexbox/styled-components';

import { getDataTestId } from '@vtb/ui-kit/_utils/getDataTestId';
import { ButtonContained, ButtonOutlined } from '@vtb/ui-kit/adaptive/atoms/button';
import { NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';
import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import { useBreakpointState } from '@common/hooks/useBreakpoint';

import { AdaptiveOperationStatus } from '../components/AdaptiveOperationStatus';
import { ResultScreenSkeleton } from '../components/ResultScreenSkeleton';
import { BUTTONS_LOCK } from '../types';

type NotificationType = typeof NOTIFICATION_TYPE.info | typeof NOTIFICATION_TYPE.fail;

type Props = {
  buttons: {
    onClick: () => void;
    title: string;
    type: BUTTONS_LOCK;
  }[];
  isFetchLoading: boolean;
  notification: {
    description: string;
    title: string;
    type: NotificationType;
  };
};

export const MSAResultScreen = ({ buttons, isFetchLoading, notification: { description, title, type } }: Props) => {
  const { isMobile } = useBreakpointState();

  return isFetchLoading ? (
    <ResultScreenSkeleton />
  ) : (
    <>
      <AdaptiveOperationStatus description={description} title={title} type={type} />
      <Flex flexDirection={isMobile ? 'column' : 'row'} maxWidth={isMobile ? '100%' : FIELD_WIDTH.xl}>
        {buttons.map(({ onClick, title, type }, index) => {
          const indent = index > 0 ? INDENT.m : undefined;
          const ButtonComponent = type === BUTTONS_LOCK.SECONDARY ? ButtonOutlined : ButtonContained.Loader;

          return (
            <Box ml={isMobile ? undefined : indent} mt={isMobile ? indent : undefined} key={`${title}_${type}`}>
              <ButtonComponent data-test-id={getDataTestId(type, 'blockCardButton')} onClick={onClick}>
                {title}
              </ButtonComponent>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};
