// @protected-copy: drawn inside the security-surface setup dialog
// A paired computer's app is made: open Slack's approval page on that computer, or copy its link
// for another device. Slack returns to Orca Cloud, never to a computer, so either way finishes it.
import React, { useId, useState } from 'react'
import { Check, ChevronRight, Copy, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uiDateTimeFormat } from '@/i18n/ui-intl-formatters'
import { useTranslate } from '@/i18n/use-translate'
import { cn } from '@/lib/class-names'
import type { SlackInstallLink } from './slack-install-link'

export function SlackApproveStep({
  hostName,
  link,
  copied,
  onOpen,
  onCopy
}: {
  /** The computer the bot runs on; null in a paired web window, whose bots share its one server. */
  hostName: string | null
  link: SlackInstallLink
  /** Copy link was used: the dialog waits for Slack. */
  copied: boolean
  onOpen: () => void
  onCopy: () => Promise<void>
}): React.JSX.Element {
  const t = useTranslate()
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  // A copied link keeps its field in view while the dialog waits for it.
  const open = expanded || copied
  const until =
    link.expiresAt === null
      ? null
      : uiDateTimeFormat({ hour: 'numeric', minute: '2-digit' }).format(link.expiresAt)
  const note = hostName
    ? until
      ? t(
          'bots.slack.approve.noteUntil',
          'Works once, until {{time}}. Sign in to Slack as yourself there; Orca Cloud passes the approval back to {{host}}.',
          { time: until, host: hostName }
        )
      : t(
          'bots.slack.approve.note',
          'Works once. Sign in to Slack as yourself there; Orca Cloud passes the approval back to {{host}}.',
          { host: hostName }
        )
    : until
      ? t(
          'bots.slack.approve.noteUntilHere',
          'Works once, until {{time}}. Sign in to Slack as yourself there.',
          { time: until }
        )
      : t('bots.slack.approve.noteHere', 'Works once. Sign in to Slack as yourself there.')
  return (
    <div className="space-y-4">
      <p className="text-sm">
        {t('bots.slack.setup.ready', 'Your Slack app is ready. Approve it in Slack to finish.')}
      </p>
      <Button autoFocus className="w-full" onClick={onOpen}>
        <ExternalLink />
        {hostName
          ? t('bots.slack.approve.openOn', 'Open Slack on {{host}}', { host: hostName })
          : t('bots.slack.setup.approve', 'Approve in Slack')}
      </Button>
      <div>
        <Button
          type="button"
          variant="link-muted"
          size="inline"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setExpanded(!open)}
        >
          {t('bots.slack.approve.otherDevice', 'Approve on another device')}
          <ChevronRight className={cn('transition-transform', open && 'rotate-90')} />
        </Button>
        <div id={panelId} hidden={!open} className="space-y-2 pt-3">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={link.authorizeUrl}
              aria-label={t('bots.slack.approve.linkLabel', 'Slack approval link')}
              className="min-w-0 flex-1 font-mono"
              onFocus={(event) => event.currentTarget.select()}
            />
            <Button type="button" variant="outline" onClick={() => void onCopy()}>
              {copied ? <Check /> : <Copy />}
              {copied
                ? t('bots.slack.approve.copied', 'Copied')
                : t('bots.slack.setup.copyLink', 'Copy link')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{note}</p>
          {copied ? (
            <p role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {t('bots.slack.setup.waiting', 'Waiting for Slack…')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
