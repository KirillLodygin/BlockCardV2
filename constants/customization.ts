import { OPERATIONS_CONSTANTS } from '@common/overmind/constants/base';
import {
  BUTTON_TYPE_LINK_CHEVRON,
  BUTTON_TYPE_USUAL,
} from '@common/overmind/layouts/common/components/button/constants';

export const customization = {
  itemProps: {
    [OPERATIONS_CONSTANTS.commandNames.EDIT]: { style: BUTTON_TYPE_LINK_CHEVRON },
    [OPERATIONS_CONSTANTS.commandNames.CANCEL]: {
      style: BUTTON_TYPE_LINK_CHEVRON,
      text: 'Назад',
    },
    [OPERATIONS_CONSTANTS.commandNames.DONE]: {
      style: BUTTON_TYPE_USUAL,
      text: 'Готово',
    },
  },
  itemTitles: {
    [OPERATIONS_CONSTANTS.fieldTypes.BLOCK_STATUS]: {
      description: '',
    },
    [OPERATIONS_CONSTANTS.fieldTypes.DESCRIPTION]: {
      description: '',
    },
  },
};
