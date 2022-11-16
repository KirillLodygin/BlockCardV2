import React from 'react';
import styled from 'styled-components/macro';

import { AdditionalTypography, ADDITIONAL_TYPOGRAPHY_SIZE } from '@vtb/ui-kit/adaptive/atoms/additionalTypography';
import { MainTypography, MAIN_TYPOGRAPHY_SIZE } from '@vtb/ui-kit/adaptive/atoms/mainTypography';
import { NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';
import { INDENT } from '@vtb/ui-kit/tokens/sizes';
import { TYPOGRAPHY_TAG } from '@vtb/ui-kit/tokens/typography';

import {
  OperationFormStatusAdaptive,
  StatusIconWrapperAdaptive,
  StatusInfoWrapper,
} from '@common/overmind/layouts/common/components/operationForm/AdaptiveOperationFormStatus';
import { ErrorAnimation, SuccessAnimation } from '@common/overmind/layouts/common/layoutParts/NotificationAnimation';

type NotificationType = typeof NOTIFICATION_TYPE.info | typeof NOTIFICATION_TYPE.fail;

type Props = {
  description: string;
  title: string;
  type: NotificationType;
};

const OperationFormStatusAdaptiveWrapper = styled(OperationFormStatusAdaptive)`
  margin-bottom: ${INDENT.m};
`;

const StatusTextAdaptive = styled(MainTypography)`
  margin-bottom: ${INDENT.xxxs};
`;

export const AdaptiveOperationStatus = ({ description, title, type }: Props) => (
  <OperationFormStatusAdaptiveWrapper isError={type === NOTIFICATION_TYPE.fail}>
    <StatusIconWrapperAdaptive>
      {type === NOTIFICATION_TYPE.fail ? <ErrorAnimation /> : <SuccessAnimation />}
    </StatusIconWrapperAdaptive>
    <StatusInfoWrapper>
      <StatusTextAdaptive tag={TYPOGRAPHY_TAG.h2} size={MAIN_TYPOGRAPHY_SIZE.m} autoFocus>
        {title}
      </StatusTextAdaptive>
      <AdditionalTypography size={ADDITIONAL_TYPOGRAPHY_SIZE.m}>{description}</AdditionalTypography>
    </StatusInfoWrapper>
  </OperationFormStatusAdaptiveWrapper>
);
