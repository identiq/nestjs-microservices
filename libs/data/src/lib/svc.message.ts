export const GatewaySvcMessage = {
  Timeout: 'gateway_timeout',
} as const;

export const HttpSvcMessage = {
  409: 'conflit',
  400: 'bad_request',
} as const;

export const WeebhookSvcMessage = {
  WebhookValidationAddressSsl: 'validation_address_ssl',
} as const;

export const SvcMessage = {
  ...GatewaySvcMessage,
  ...HttpSvcMessage,
  ...WeebhookSvcMessage,
} as const;

export type SvcMessage = typeof SvcMessage[keyof typeof SvcMessage];
