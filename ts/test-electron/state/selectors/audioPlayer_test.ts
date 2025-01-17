// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { assert } from 'chai';
import { noopAction } from '../../../state/ducks/noop';
import type { VoiceNoteAndConsecutiveForPlayback } from '../../../state/selectors/audioPlayer';
import { isPaused } from '../../../state/selectors/audioPlayer';
import { actions } from '../../../state/ducks/audioPlayer';
import type { StateType } from '../../../state/reducer';
import { reducer as rootReducer } from '../../../state/reducer';

function voiceNoteDataForMessage(
  messageId: string
): VoiceNoteAndConsecutiveForPlayback {
  return {
    conversationId: 'convo',
    voiceNote: {
      id: messageId,
      type: 'outgoing',
      timestamp: 0,
      url: undefined,
      source: undefined,
      sourceUuid: undefined,
      messageIdForLogging: messageId,
      isPlayed: false,
    },
    consecutiveVoiceNotes: [],
    previousMessageId: undefined,
    nextMessageTimestamp: undefined,
    playbackRate: 1,
  };
}

describe('state/selectors/audioPlayer', () => {
  const getEmptyRootState = (): StateType => {
    return rootReducer(undefined, noopAction());
  };

  describe('isPaused', () => {
    it('returns true if state.audioPlayer.active is undefined', () => {
      const state = getEmptyRootState();
      assert.isTrue(isPaused(state));
    });

    it('returns false if state.audioPlayer.active is not undefined', () => {
      const state = getEmptyRootState();

      const updated = rootReducer(
        state,
        actions.loadMessageAudio({
          voiceNoteData: voiceNoteDataForMessage('id'),
          position: 0,
          context: 'context',
          ourConversationId: 'convo',
        })
      );

      assert.isFalse(isPaused(updated));
    });
  });
});
