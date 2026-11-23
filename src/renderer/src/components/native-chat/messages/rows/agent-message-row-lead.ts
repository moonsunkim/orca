import { translate } from '@/i18n/i18n'
import type { Translate } from '@/i18n/use-translate'
import type { AgentMessageHeading } from '../../../../../../shared/agent-session/view/messages/agent-message-presentation'

export function agentMessageRowFallback(
  heading: AgentMessageHeading,
  t: Translate = translate
): string {
  return heading === 'followed-up-worker'
    ? t('components.native-chat.agentMessage.unnamedRecipient', 'an agent')
    : t('components.native-chat.agentMessage.unnamedSender', 'an agent')
}

/** The words an agent message's row starts with ("Started", "Update from"). */
export function agentMessageRowLead(
  heading: AgentMessageHeading,
  t: Translate = translate,
  standalone = false
): string {
  switch (heading) {
    case 'started':
    case 'started-agent':
      return t('components.native-chat.agentMessage.row.started', 'Started')
    case 'reopened-worker':
      return t('components.native-chat.agentMessage.row.reopened', 'Reopened')
    case 'followed-up-worker':
      return standalone
        ? t('components.native-chat.agentMessage.event.followedUp', 'Sent follow-up')
        : t('components.native-chat.agentMessage.row.followedUp', 'Sent follow-up to')
    case 'handed-off':
      return standalone
        ? t('components.native-chat.agentMessage.kind.handedOff', 'Handed off')
        : t('components.native-chat.agentMessage.row.handedOff', 'Handed off to')
    case 'task':
      return standalone
        ? t('components.native-chat.agentMessage.kind.task', 'Task')
        : t('components.native-chat.agentMessage.row.task', 'Task from')
    case 'worker':
      return standalone
        ? t('components.native-chat.agentMessage.event.update', 'Update')
        : t('components.native-chat.agentMessage.row.update', 'Update from')
    case 'coordinator':
    case 'generic':
      return standalone
        ? t('components.native-chat.agentMessage.event.message', 'Message')
        : t('components.native-chat.agentMessage.row.message', 'Message from')
  }
}
