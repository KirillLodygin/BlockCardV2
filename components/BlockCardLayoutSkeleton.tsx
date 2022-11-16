import React from 'react';
import { Flex, Box } from 'reflexbox/styled-components';

import { AdaptiveCol, AdaptiveRow } from '@vtb/ui-kit/adaptive/atoms/layout';
import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import {
  FieldSkeleton,
  DropdownSkeleton,
  TextlineSkeleton,
  LINE_SIZES,
  SKELETON_LINE_WIDTH,
} from '@components/Skeleton/components';
import { ButtonSkeleton } from '@components/Skeleton/components/adaptive/ButtonSkeleton';

const BlockCardLayoutSkeleton = () => (
  <Box mt={INDENT.m}>
    <AdaptiveRow>
      <AdaptiveCol tablet={8}>
        <Flex flexDirection="column">
          <TextlineSkeleton width={SKELETON_LINE_WIDTH.xxl} lineSize={LINE_SIZES.l} />
          <Box mt={INDENT.sm}>
            <FieldSkeleton width={FIELD_WIDTH.auto} />
          </Box>
          <Box mt={INDENT.xxs}>
            <DropdownSkeleton width={FIELD_WIDTH.auto} />
          </Box>
          <Box mt={INDENT.l}>
            <FieldSkeleton width={FIELD_WIDTH.auto} />
          </Box>
          <Box mt={INDENT.xxs}>
            <ButtonSkeleton />
          </Box>
          <Box mt={INDENT.l}>
            <TextlineSkeleton width={SKELETON_LINE_WIDTH.xs} lineSize={LINE_SIZES.l} />
          </Box>
        </Flex>
      </AdaptiveCol>
    </AdaptiveRow>
  </Box>
);

export { BlockCardLayoutSkeleton };
