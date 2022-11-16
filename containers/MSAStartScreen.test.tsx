import { shallow } from 'enzyme';
import React from 'react';

import { ButtonContained } from '@vtb/ui-kit/adaptive/atoms/button';
import { Dropdown } from '@vtb/ui-kit/adaptive/molecules/dropdown';
import { RadioGroup } from '@vtb/ui-kit/adaptive/molecules/radioGroup';

import { BackButtonBlock } from '../components/components';
import { LOCK_OPERATION, BUTTONS_LOCK, LOCK_REASON, NOTIFICATION_TYPE } from '../types';
import { MSAStartScreen } from './MSAStartScreen';

const mockOnChangeBlockCardType = jest.fn();
const mockOnChangeReasonBlockCard = jest.fn();
const mockOnConfirm = jest.fn();
const mockOnBack = jest.fn();

const reasonBlockCard = {
  id: LOCK_REASON.LOSS,
  caption: 'foo3',
  value: 'foo4',
};

const dropdownOptions = [
  {
    id: LOCK_REASON.THEFT,
    caption: 'foo1',
    value: 'foo2',
  },
  reasonBlockCard,
];

const buttonsRadio = [
  {
    id: LOCK_OPERATION.PERMANENT,
    text: 'baz1',
  },
  {
    id: LOCK_OPERATION.TEMPORARY,
    text: 'baz2',
  },
];

const defaultProps = {
  content: {
    buttons: [
      {
        onClick: mockOnConfirm,
        title: 'asd',
        type: BUTTONS_LOCK.CONTINUE,
      },
      {
        onClick: mockOnBack,
        title: 'qwe',
        type: BUTTONS_LOCK.BACK,
      },
    ],
    dropdownOptions,
    buttonsRadio,
    cardTitle: 'bat',
    dropdownLabel: 'bar',
    inputLabel: 'foo',
    notification: {
      description: 'sdf',
      type: NOTIFICATION_TYPE.INFO,
    },
    title: 'wer',
  },
  inputValue: 'qux',
  isFetchLoading: false,
  isTempBlockAvailable: true,
  onChangeBlockCardType: mockOnChangeBlockCardType,
  onChangeReasonBlockCard: mockOnChangeReasonBlockCard,
  reasonBlockCard,
  selectedRadioButton: LOCK_OPERATION.PERMANENT,
};

jest.mock('../utils/notificationUtils', () => ({
  getNotificationType: jest.fn().mockReturnValue('info'),
}));

describe('MSAStartScreen', () => {
  beforeEach(() => {
    mockOnBack.mockReset();
    mockOnConfirm.mockReset();
    mockOnChangeBlockCardType.mockReset();
    mockOnChangeReasonBlockCard.mockReset();
  });

  it('renders with all props', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders with selected radio button = temporary', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} selectedRadioButton={LOCK_OPERATION.TEMPORARY} />);
    expect(component).toMatchSnapshot();
  });

  it('calls onChangeBlockCardType', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} />);

    component.find(RadioGroup).prop('onChange')?.(true, LOCK_OPERATION.TEMPORARY);

    expect(mockOnChangeBlockCardType).toHaveBeenCalledTimes(1);
    expect(mockOnChangeBlockCardType).toHaveBeenCalledWith(LOCK_OPERATION.TEMPORARY);
  });

  it('calls onChangeReasonBlockCard', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} />);

    component.find(Dropdown).simulate('change');

    expect(mockOnChangeReasonBlockCard).toHaveBeenCalledTimes(1);
  });

  it('calls onCanfirm', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} />);

    component.find(ButtonContained.Loader).simulate('click');

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onBack', () => {
    const component = shallow(<MSAStartScreen {...defaultProps} />);

    component.find(BackButtonBlock).simulate('click');

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
