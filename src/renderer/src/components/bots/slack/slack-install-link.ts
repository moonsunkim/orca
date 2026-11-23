// Slack's install link for one setup attempt, and when it stops working.
import { useEffect, useState } from 'react'
import type { Bot } from '../../../../../shared/bot-types'
import type { ConnectorBotSlackAppResponse } from '../../../../../shared/connector-bot-slack-contract'

/** `expiresAt` (ms) from a cloud that says when the link stops working; null from an older one. */
export type SlackInstallLink = { authorizeUrl: string; expiresAt: number | null }

export const slackInstallLink = (app: ConnectorBotSlackAppResponse): SlackInstallLink => ({
  authorizeUrl: app.authorizeUrl,
  expiresAt: app.expiresAt ?? null
})

/** Whether `expiresAt` has passed, flipping when it does. */
export function useSlackLinkExpired(expiresAt: number | null): boolean {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (expiresAt === null) {
      return
    }
    const left = expiresAt - Date.now()
    if (left <= 0) {
      setNow(Date.now())
      return
    }
    const timer = setTimeout(() => setNow(Date.now()), left)
    return () => clearTimeout(timer)
  }, [expiresAt])
  return expiresAt !== null && now >= expiresAt
}

/** The install link's OAuth state, which the install it completes keeps for its after-install pick. */
export function slackInstallState(authorizeUrl: string): string | null {
  try {
    return new URL(authorizeUrl).searchParams.get('state')
  } catch {
    return null
  }
}

export type OpenedSlackPage = { returnUrl: string | null; link: SlackInstallLink }

// Slack's page already open (or its link copied) for this bot and workspace in this open of the
// dialog: the flow mounts anew when it comes back from the pill, and must not open Slack again.
export const openedSlackPages = new Map<string, OpenedSlackPage>()
export const openedKey = (bot: Pick<Bot, 'hostId' | 'id'>, teamId: string): string =>
  `${bot.hostId}\0${bot.id}\0${teamId}`

/** A new open of the dialog is a fresh attempt, which opens Slack's page again. */
export function forgetOpenedSlackPages(bot: Pick<Bot, 'hostId' | 'id'>): void {
  const prefix = openedKey(bot, '')
  for (const key of openedSlackPages.keys()) {
    if (key.startsWith(prefix)) {
      openedSlackPages.delete(key)
    }
  }
}
