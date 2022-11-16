import React from 'react';
import { Flex, Box } from 'reflexbox/styled-components';
import styled from 'styled-components/macro';

import { AdaptiveCol } from '@vtb/ui-kit/adaptive/atoms/layout';
import { COLOR_GETTERS } from '@vtb/ui-kit/adaptive/tokens/palette/colorGetters';
import { adaptive } from '@vtb/ui-kit/tokens/screen';
import { INDENT } from '@vtb/ui-kit/tokens/sizes';

import { LINE_SIZES, Skeleton, SKELETON_LINE_WIDTH, TextlineSkeleton } from '@components/Skeleton/components';
import { ButtonSkeleton } from '@components/Skeleton/components/adaptive/ButtonSkeleton';

const NotificationSkeleton = styled.div`
  display: flex;
  flex-direction: row;
  height: 120px;
  background-color: ${COLOR_GETTERS.background.secondary};
  border-radius: ${INDENT.xxxxs};
  margin: 0 0 ${INDENT.m};
  padding: ${INDENT.sm} ${INDENT.s} ${INDENT.m} ${INDENT.xxl};
  box-sizing: border-box;
  gap: ${INDENT.xxxl};

  ${adaptive.maxWidth.mobile} {
    align-items: center;
    flex-direction: column;
    height: 100%;
    padding: ${INDENT.s};
    width: 100%;
  }
`;

const AdaptiveIndentContainer = styled(Flex)`
  flex-direction: row;
  gap: ${INDENT.m};

  ${adaptive.maxWidth.mobile} {
    flex-direction: column;
    width: 100%;
  }
`;

const ResultScreenSkeleton = () => (
  <>
    <NotificationSkeleton>
      <Box>
        <Skeleton width={64} height={64} radius={32} />
      </Box>
      <AdaptiveCol tablet={8}>
        <TextlineSkeleton width={SKELETON_LINE_WIDTH.xl} lineSize={LINE_SIZES.m} />
        <TextlineSkeleton width={SKELETON_LINE_WIDTH.m} lineSize={LINE_SIZES.l} />
      </AdaptiveCol>
    </NotificationSkeleton>
    <AdaptiveIndentContainer>
      <ButtonSkeleton buttonBorderRadius={4} />
      <ButtonSkeleton buttonBorderRadius={4} />
    </AdaptiveIndentContainer>
  </>
);

export { ResultScreenSkeleton };
