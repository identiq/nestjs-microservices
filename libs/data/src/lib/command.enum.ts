export const WebhookServiceCommand = {
  FindMany: 'webhook_find_many',
  Create: 'webhook_create',
} as const;

export const ServiceCommand = {
  ...WebhookServiceCommand,
} as const;

export type WebhookServiceCommand =
  typeof WebhookServiceCommand[keyof typeof WebhookServiceCommand];
