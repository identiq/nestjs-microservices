import { SvcMessage } from './svc.message';

export interface SvcResponse<T> {
  cmd: SvcMessage;
  data?: T;
}
