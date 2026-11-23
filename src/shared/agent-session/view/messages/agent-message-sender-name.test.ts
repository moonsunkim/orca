import { expect, it } from 'vitest'
import { resolveAgentMessageSenderName } from './agent-message-presentation'

it('preserves resolved names even when they spell a translated fallback', () => {
  expect(
    [
      { localChat: true, botName: 'Сова', customLabel: 'Чат', snapshotName: '@owl' },
      { localChat: true, customLabel: ' ', conversationName: 'агента', snapshotName: '@owl' },
      { localChat: false, botName: 'Сова', snapshotName: '@owl' },
      { localChat: false, snapshotName: 'агента' },
      { localChat: false, snapshotName: null, tabLabel: ' Чат ' },
      { localChat: false, snapshotName: null, tabLabel: ' ' }
    ].map(resolveAgentMessageSenderName)
  ).toEqual(['Сова', 'агента', '@owl', 'агента', 'Чат', null])
})
