import { shallow } from 'enzyme';
import React from 'react';

import { ButtonContained, ButtonOutlined } from '@vtb/ui-kit/adaptive/atoms/button';
import { NOTIFICATION_TYPE } from '@vtb/ui-kit/adaptive/molecules/notification';

import { BUTTONS_LOCK } from '../types';
import { MSAResultScreen } from './MSAResultScreen';

const mockOnClose = jest.fn();
const mockOnBack = jest.fn();

const defaultProps = {
  buttons: [
    {
      onClick: mockOnClose,
      title: 'asd',
      type: BUTTONS_LOCK.CONTINUE,
    },
    {
      onClick: mockOnBack,
      title: 'qwe',
      type: BUTTONS_LOCK.SECONDARY,
    },
  ],
  isFetchLoading: false,
  notification: {
    description: 'qwe',
    title: 'zxc',
    type: NOTIFICATION_TYPE.info,
  },
};

describe('MSAResultScreen', () => {
  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnBack.mockReset();
  });

  it('renders with all props', () => {
    const component = shallow(<MSAResultScreen {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders with isFetchLoading=true', () => {
    const component = shallow(<MSAResultScreen {...defaultProps} isFetchLoading />);

    expect(component).toMatchSnapshot();
  });

  it('calls onClose', () => {
    const component = shallow(<MSAResultScreen {...defaultProps} />);

    component.find(ButtonOutlined).simulate('click');

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onCanfirm', () => {
    const component = shallow(<MSAResultScreen {...defaultProps} />);

    component.find(ButtonContained.Loader).simulate('click');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
