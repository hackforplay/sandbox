import { fromEvent } from 'rxjs';
import { filter, first, map, mergeMap, share } from 'rxjs/operators';
import { filterNotUndefined } from './utils';

const getUniqueId = (id => () => 'FEELES_UNIQ_ID-' + ++id)(0);

const port$ = fromEvent<MessageEvent>(window, 'message').pipe(
  filter(event => event.source !== window),
  map(event => (event.ports || [])[0]),
  filterNotUndefined,
  map(port => ({ port })),
  share()
);

export const connected = port$.pipe(first()).toPromise();

export const message$ = port$.pipe(
  first(),
  mergeMap(ref => {
    ref.port.start();
    return fromEvent<MessageEvent>(ref.port, 'message');
  }),
  share()
);

message$.subscribe(); // like connect()

export interface IMessagePayload<T> {
  id: string;
  query: string;
  value: T;
}

export function sendMessage<Input>(
  query: string,
  value: Input
): Promise<MessageEvent> {
  const message: IMessagePayload<Input> = {
    id: getUniqueId(),
    query,
    value
  };
  connected.then(ref => ref.port.postMessage(message));
  return message$
    .pipe(
      filter(e => e.data && e.data.id === message.id),
      map(e => {
        if (e.data && e.data.error) {
          console.error(`Error in sendMessage:${query} (${value})`);
          throw e.data.error;
        }
        return e;
      }),
      first()
    )
    .toPromise();
}
