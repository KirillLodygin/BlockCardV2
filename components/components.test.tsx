import { shallow } from 'enzyme';
import React from 'react';

import { ButtonText } from '@vtb/ui-kit/adaptive/atoms/button';

import { BackButtonBlock, CodeRequestTimer } from './components';

const mockOnClick = jest.fn();

describe('components', () => {
  describe('BackButtonBlock', () => {
    it('should calls backButtonAction', () => {
      const component = shallow(
        <BackButtonBlock onClick={mockOnClick} data-test-id="qwe">
          foo
        </BackButtonBlock>,
      );

      component.find(ButtonText).simulate('click');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('CodeRequestTimer', () => {
    it('should render with isTimerRunning=true', () => {
      const component = shallow(
        <CodeRequestTimer isTimerRunning setIsTimerRunning={jest.fn()} text="foo" timeout={11} />,
      );

      expect(component).toMatchSnapshot();
    });

    it('should render with isTimerRunning=false', () => {
      const component = shallow(
        <CodeRequestTimer isTimerRunning={false} setIsTimerRunning={jest.fn()} text="foo" timeout={11} />,
      );

      expect(component).toMatchSnapshot();
    });
  });
});
