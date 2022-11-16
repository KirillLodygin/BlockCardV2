import { useEffect } from 'react';

import { IResponseReceivedEvent, useSubscribeAsyncEvent } from '@common/asyncServer';
import { emitter, eventBusLog } from '@common/eventBus';
import { featureService, USE_EVENT_BROKER } from '@common/featureFlags';

import {
  AsyncEventBlockDebitCardResponse,
  AuthorizeResponseType,
  BlockCardResponseType,
  SCENARIO_ASYNC_EVENT_BLOCK_CARD,
} from '../types';

export const useSubscribeBlockCardAsyncEvents = (callback: (body: AsyncEventBlockDebitCardResponse) => void) => {
  useEffect(() => {
    if (featureService.isActiveFeature(USE_EVENT_BROKER)) {
      const authorizeEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE];
      const authorizeUnfreezeEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE_UNFREEZE];
      const commitEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT];
      const commitUnfreezeEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT_UNFREEZE];
      const freezeEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.FREEZE];
      const unfreezeEvent = ['async', SCENARIO_ASYNC_EVENT_BLOCK_CARD.UNFREEZE];

      const onEvent = ({
        response: { body, status },
        type,
      }: IResponseReceivedEvent<AuthorizeResponseType | BlockCardResponseType>) => {
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${authorizeEvent}`);
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${authorizeUnfreezeEvent}`);
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${commitEvent}`);
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${commitUnfreezeEvent}`);
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${freezeEvent}`);
        eventBusLog(`Сработала подписка в MSABlockCardScreen на ${unfreezeEvent}`);

        callback({ type, body, status } as AsyncEventBlockDebitCardResponse);
      };
      emitter.on(authorizeEvent, onEvent);
      emitter.on(authorizeUnfreezeEvent, onEvent);
      emitter.on(commitEvent, onEvent);
      emitter.on(commitUnfreezeEvent, onEvent);
      emitter.on(freezeEvent, onEvent);
      emitter.on(unfreezeEvent, onEvent);

      return () => {
        emitter.removeListener(authorizeEvent, onEvent);
        emitter.removeListener(authorizeUnfreezeEvent, onEvent);
        emitter.removeListener(commitEvent, onEvent);
        emitter.removeListener(commitUnfreezeEvent, onEvent);
        emitter.removeListener(freezeEvent, onEvent);
        emitter.removeListener(unfreezeEvent, onEvent);
      };
    }
  }, []);

  const asyncEvent = ({
    response: { body, status },
    type,
  }: IResponseReceivedEvent<AuthorizeResponseType | BlockCardResponseType>) => {
    callback({ type, body, status } as AsyncEventBlockDebitCardResponse);
  };

  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE, asyncEvent);
  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.AUTHORIZE_UNFREEZE, asyncEvent);
  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT, asyncEvent);
  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.COMMIT_UNFREEZE, asyncEvent);
  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.FREEZE, asyncEvent);
  useSubscribeAsyncEvent(SCENARIO_ASYNC_EVENT_BLOCK_CARD.UNFREEZE, asyncEvent);
};
