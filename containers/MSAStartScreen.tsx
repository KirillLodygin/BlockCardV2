import React, { useCallback } from 'react';
import { Box } from 'reflexbox/styled-components';

import { getDataTestId } from '@vtb/ui-kit/_utils/getDataTestId';
import { ButtonContained } from '@vtb/ui-kit/adaptive/atoms/button';
import { Input } from '@vtb/ui-kit/adaptive/atoms/input';
import { Radio } from '@vtb/ui-kit/adaptive/atoms/radio';
import { Dropdown } from '@vtb/ui-kit/adaptive/molecules/dropdown';
import { DropdownValue } from '@vtb/ui-kit/adaptive/molecules/dropdown/_baseDropdown/typesDropdown';
import { Notification } from '@vtb/ui-kit/adaptive/molecules/notification';
import { RADIO_GROUP_TYPE, RadioGroup } from '@vtb/ui-kit/adaptive/molecules/radioGroup';
import { FIELD_WIDTH, INDENT } from '@vtb/ui-kit/tokens/sizes';

import { BackButtonBlock, BlockTitle } from '../components/components';
import { LOCK_OPERATION, LOCK_REASON, BUTTONS_LOCK, NOTIFICATION_TYPE } from '../types';
import { getNotificationType } from '../utils/notificationUtils';

type Props = {
  content: {
    buttons: {
      onClick: () => void;
      title: string;
      type: BUTTONS_LOCK;
    }[];
    buttonsRadio: {
      id: LOCK_OPERATION;
      text: string;
    }[];
    dropdownLabel: string;
    dropdownOptions: {
      id: LOCK_REASON;
      caption: string;
      value: string;
    }[];
    inputLabel: string;
    notification: {
      description: string;
      type: NOTIFICATION_TYPE;
    };
    title: string;
  };
  inputValue: string;
  isFetchLoading: boolean;
  isTempBlockAvailable: boolean;
  onChangeBlockCardType: (selectedRadioButton: LOCK_OPERATION.TEMPORARY | LOCK_OPERATION.PERMANENT) => void;
  onChangeReasonBlockCard: (reasonBlockCard: DropdownValue) => void;
  reasonBlockCard?: DropdownValue;
  selectedRadioButton: LOCK_OPERATION;
};

export const MSAStartScreen = ({
  content: {
    buttons,
    buttonsRadio,
    dropdownLabel,
    dropdownOptions,
    inputLabel,
    notification: { description: notificationDescription, type: notificationType },
    title,
  },
  inputValue,
  isFetchLoading,
  isTempBlockAvailable,
  onChangeBlockCardType,
  onChangeReasonBlockCard,
  reasonBlockCard,
  selectedRadioButton,
}: Props) => {
  const handleChangeRadioButton = useCallback(
    (_: boolean, value: LOCK_OPERATION.TEMPORARY | LOCK_OPERATION.PERMANENT) => {
      onChangeBlockCardType(value);
    },
    [onChangeBlockCardType],
  );

  return (
    <>
      <BlockTitle titleText={title} />
      {isTempBlockAvailable && (
        <Box mb={INDENT.xs}>
          <RadioGroup
            data-test-id={getDataTestId('RadioGroup', 'blockCard')}
            disabled={isFetchLoading}
            type={RADIO_GROUP_TYPE.horizontal}
            onChange={handleChangeRadioButton}
            selected={selectedRadioButton}
            name="RadioGroup"
          >
            {buttonsRadio.map(({ id, text }) => (
              <Radio key={id} value={`${id}`}>
                {text}
              </Radio>
            ))}
          </RadioGroup>
        </Box>
      )}
      <Box mb={INDENT.l} maxWidth={FIELD_WIDTH.xl}>
        <Input label={inputLabel} value={inputValue} disabled />
      </Box>
      {selectedRadioButton === LOCK_OPERATION.PERMANENT && (
        <Box mb={INDENT.l} maxWidth={FIELD_WIDTH.xl}>
          <Dropdown
            data-test-id="whyBlockingCardDropdown"
            label={dropdownLabel}
            options={dropdownOptions}
            onChange={onChangeReasonBlockCard}
            value={reasonBlockCard}
          />
        </Box>
      )}
      <Box mb={INDENT.m} maxWidth={FIELD_WIDTH.xl}>
        <Notification type={getNotificationType(notificationType)} text={notificationDescription} />
      </Box>
      {buttons.map(({ onClick, title, type }, index) => {
        const mt = index > 0 ? INDENT.m : undefined;
        const ButtonComponent = type === BUTTONS_LOCK.CONTINUE ? ButtonContained.Loader : BackButtonBlock;
        const isLoading = type === BUTTONS_LOCK.CONTINUE && isFetchLoading;

        return (
          <Box mt={mt} key={`${title}_${type}`}>
            <ButtonComponent
              data-test-id={getDataTestId(type, 'blockCardButton')}
              onClick={onClick}
              isLoading={isLoading}
              disabled={isFetchLoading}
            >
              {title}
            </ButtonComponent>
          </Box>
        );
      })}
    </>
  );
};
