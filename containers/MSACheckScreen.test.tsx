import { shallow } from 'enzyme';
import React, { ChangeEvent, useState } from 'react';

import { ButtonContained } from '@vtb/ui-kit/adaptive/atoms/button';
import { Input } from '@vtb/ui-kit/adaptive/atoms/input';

import { BackButtonBlock } from '../components/components';
import { RowTableData, LOCK_OPERATION, BUTTONS_LOCK } from '../types';
import { MSACheckScreen } from './MSACheckScreen';

jest.mock('react', () => {
  const requireActual = jest.requireActual('react');

  return {
    ...requireActual,
    useState: jest.fn(),
  };
});

const mockOnResetSecureCodeError = jest.fn();
const mockSetIsSentCode = jest.fn();
const mockSetIsTimerRunning = jest.fn();
const mockOnBack = jest.fn();
const mockOnChangeSecureCode = jest.fn();
const mockOnSendSmsCode = jest.fn();

const mockEvent = {} as ChangeEvent<HTMLInputElement>;

const dataRowTableData: RowTableData[] = [
  {
    title: 'foo1',
    value: 'foo2',
  },
  {
    title: 'bar1',
    value: 'bar2',
  },
];

const defaultProps = {
  content: {
    backButton: {
      title: 'sdf',
      type: BUTTONS_LOCK.BACK,
    },
    continueButton: {
      title: 'xcv',
      type: BUTTONS_LOCK.CONTINUE,
    },
    resendButton: {
      title: 'cvb',
      type: BUTTONS_LOCK.RESEND,
    },
    dataRowTableData,
    inputErrorText: 'sts',
    inputLabel: 'asd',
    phoneInfo: 'bat',
    timerInfo: 'wer',
    title: 'qwe',
  },
  blockCardType: LOCK_OPERATION.PERMANENT,
  isFetchLoading: false,
  isFetchAthorizeLoading: false,
  isSecureCodeInputError: false,
  onBack: mockOnBack,
  onChangeSecureCode: mockOnChangeSecureCode,
  onResetSecureCodeError: mockOnResetSecureCodeError,
  onSendSmsCode: mockOnSendSmsCode,
  secureCode: 'zxc',
  timeout: 10,
};

describe('MSACheckScreen', () => {
  beforeEach(() => {
    (useState as jest.Mock).mockReset();
    mockOnBack.mockReset();
    mockOnChangeSecureCode.mockReset();
    mockOnSendSmsCode.mockReset();
    mockSetIsSentCode.mockReset();
    mockSetIsTimerRunning.mockReset();
    mockOnResetSecureCodeError.mockReset();
  });

  it('renders with all props', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders with isSentCode=true', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders with isSentCode=true and secureCode.length === 6', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} secureCode="qweasd" />);

    expect(component).toMatchSnapshot();
  });

  it('renders with isSentCode=true and isTimerRunning=false', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    expect(component).toMatchSnapshot();
  });

  it('renders with isSentCode=true and isFetchLoading=true', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} isFetchLoading />);

    expect(component).toMatchSnapshot();
  });

  it('calls onSentSmsCode', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, mockSetIsSentCode]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    component.find(ButtonContained.Loader).simulate('click');

    expect(mockOnSendSmsCode).toHaveBeenCalledTimes(1);
    expect(mockSetIsSentCode).toHaveBeenCalledTimes(1);
    expect(mockSetIsSentCode).toHaveBeenCalledWith(true);
  });

  it('calls onSendSmsCode with isSentCode=true and isTimerRunning=false', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, mockSetIsTimerRunning]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    component.find(ButtonContained.Loader).simulate('click');

    expect(mockOnSendSmsCode).toHaveBeenCalledTimes(1);
    expect(mockSetIsTimerRunning).toHaveBeenCalledTimes(1);
    expect(mockSetIsTimerRunning).toHaveBeenCalledWith(true);
  });

  it('calls onBack', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    component.find(BackButtonBlock).simulate('click');

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeSecureCode', () => {
    const mockValue = 'quuux';
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

    const component = shallow(<MSACheckScreen {...defaultProps} />);

    component.find(Input).prop('onChange')?.(mockValue, mockEvent);

    expect(mockOnChangeSecureCode).toHaveBeenCalledTimes(1);
    expect(mockOnChangeSecureCode).toHaveBeenCalledWith(mockValue, mockEvent);
  });
});
