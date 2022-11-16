import React, { FC } from 'react';
import { Box } from 'reflexbox/styled-components';

import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import { FieldSkeleton, TextlineSkeleton, LINE_SIZES, SKELETON_LINE_WIDTH } from '@components/Skeleton/components';

export const CheckScreenInputSkeleton: FC = () => (
  <Box mb={INDENT.l}>
    <Box mb={INDENT.sm}>
      <TextlineSkeleton width={SKELETON_LINE_WIDTH.xxl} lineSize={LINE_SIZES.m} />
    </Box>
    <Box maxWidth={FIELD_WIDTH.xl}>
      <FieldSkeleton width={FIELD_WIDTH.auto} />
    </Box>
    <Box mt={INDENT.l}>
      <TextlineSkeleton width={SKELETON_LINE_WIDTH.xxl} lineSize={LINE_SIZES.m} />
    </Box>
  </Box>
);
