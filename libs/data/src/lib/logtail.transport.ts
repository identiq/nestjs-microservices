import { Logtail } from '@logtail/node';
import * as split from 'split2';
import * as pump from 'pumpify';
import { LogLevel, ILogtailOptions } from '@logtail/types';
import { levels, LogDescriptor } from 'pino';
import { obj } from 'through2';
import { TransformCallback } from 'through2';

export function createLogtailTransport(
  token: string,
  opts?: Partial<ILogtailOptions>
): pump {
  const logger = new Logtail(token, opts);

  function safeParse(src: string) {
    try {
      const parsed = JSON.parse(src);

      return parsed;
    } catch (e) {
      return { msg: src, level: '10' };
    }
  }

  function handleLog(log: LogDescriptor, cb: TransformCallback) {
    const {
      level,
      time,
      pid,
      hostname,
      msg = '',
      context = {},
      ...params
    } = log;
    logger.log(msg, (levels.labels[level] || 'info') as LogLevel, {
      ...params,
      context: { system: { pid, hostname }, ...context },
    });
    cb();
  }

  const transport = obj((log, _enc, callback) => {
    handleLog(log, callback);
  });

  return new pump(split(safeParse), transport);
}
