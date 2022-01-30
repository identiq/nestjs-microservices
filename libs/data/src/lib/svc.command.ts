export const WebhookSvcCommand = {
  WebhookFindMany: 'webhook_find_many',
  WebhookCreate: 'webhook_create',
} as const;

export const SvcCommand = {
  ...WebhookSvcCommand,
} as const;

export type SvcCommand = typeof SvcCommand[keyof typeof SvcCommand];
