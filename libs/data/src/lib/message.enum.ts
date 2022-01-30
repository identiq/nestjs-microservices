export const WebhookServiceMessage = {
  FindManySuccess: 'webhook_find_many_success',
  FindManyBadRequest: 'webhook_find_many_bad_request',
  Created: 'webhook_created',
  Conflit: 'webhook_conflit',
} as const;

export const ServiceMessage = {
  ...WebhookServiceMessage,
} as const;

export type ServiceMessage = typeof ServiceMessage[keyof typeof ServiceMessage];
