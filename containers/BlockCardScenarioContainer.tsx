import React from 'react';
import { Box, Flex } from 'reflexbox/styled-components';
import styled from 'styled-components/macro';

import { INDENT } from '@vtb/ui-kit/tokens/sizes';
import { vtbGroupUIFontFamily } from '@vtb/ui-kit/tokens/typography';

import { ProductsScenarioBreadcrumbs } from '@components/ProductsScenarioBreadcrumbs';

const Container = styled.div`
  ${vtbGroupUIFontFamily};
`;

type Props = {
  children: React.ReactElement;
};

export const BlockCardScenarioContainer = ({ children }: Props) => (
  <Flex as={Container} flexDirection="column">
    <Box mb={INDENT.m}>
      <ProductsScenarioBreadcrumbs />
    </Box>
    {children}
  </Flex>
);
