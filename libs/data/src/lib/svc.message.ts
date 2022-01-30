export const GatewaySvcMessage = {
  Timeout: 'gateway_timeout',
} as const;

export const WebhookSvcMessage = {
  FindManySuccess: 'webhook_find_many_success',
  FindManyBadRequest: 'webhook_find_many_bad_request',
  Created: 'webhook_created',
  Conflit: 'webhook_conflit',
} as const;

export const SvcMessage = {
  ...GatewaySvcMessage,
  ...WebhookSvcMessage,
} as const;

export type SvcMessage = typeof SvcMessage[keyof typeof SvcMessage];
