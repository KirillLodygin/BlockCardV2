import React from 'react';
import { Box, Flex } from 'reflexbox/styled-components';

import { INDENT } from '@vtb/ui-kit/tokens/sizes';

import { LINE_SIZES, TextlineSkeleton } from '@components/Skeleton';

export const SkeletonDataRowTableItem = () => (
  <Box mb={INDENT.xxs} width={INDENT.m}>
    <Flex flexGrow={1} mr={INDENT.xxl}>
      <Box ml={INDENT.xxs}>
        <TextlineSkeleton lineSize={LINE_SIZES.xs} />
      </Box>

      <Box ml="auto">
        <TextlineSkeleton lineSize={LINE_SIZES.xs} />
      </Box>
    </Flex>
  </Box>
);

export const DataRowTableSkeleton = () => (
  <Box mt={INDENT.sm} mb={INDENT.m}>
    <SkeletonDataRowTableItem />
    <SkeletonDataRowTableItem />
    <SkeletonDataRowTableItem />
    <SkeletonDataRowTableItem />
  </Box>
);
