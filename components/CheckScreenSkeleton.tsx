import React from 'react';
import { Flex, Box } from 'reflexbox/styled-components';

import { AdaptiveCol, AdaptiveRow } from '@vtb/ui-kit/adaptive/atoms/layout';
import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import { LINE_SIZES, SKELETON_LINE_WIDTH, TextlineSkeleton } from '@components/Skeleton/components';
import { ButtonSkeleton } from '@components/Skeleton/components/adaptive/ButtonSkeleton';

import { CheckScreenInputSkeleton } from './CheckScreenInputSkeleton';
import { DataRowTableSkeleton } from './DataRowTableSkeleton';

const CheckScreenSkeleton = () => (
  <Box mt={INDENT.m}>
    <AdaptiveRow>
      <AdaptiveCol tablet={8}>
        <TextlineSkeleton width={SKELETON_LINE_WIDTH.xxl} lineSize={LINE_SIZES.l} />
        <DataRowTableSkeleton />
        <CheckScreenInputSkeleton />
        <Flex alignItems="center" flexDirection="row" maxWidth={FIELD_WIDTH.xl} mb={INDENT.m}>
          <ButtonSkeleton buttonBorderRadius={4} />
          <Box ml={INDENT.m}>
            <ButtonSkeleton buttonBorderRadius={4} />
          </Box>
        </Flex>
        <Box mt={INDENT.l}>
          <TextlineSkeleton width={SKELETON_LINE_WIDTH.xs} lineSize={LINE_SIZES.l} />
        </Box>
      </AdaptiveCol>
    </AdaptiveRow>
  </Box>
);

export { CheckScreenSkeleton };
