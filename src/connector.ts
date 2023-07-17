import { fromEvent } from 'rxjs';
import { filter, first, map, share } from 'rxjs/operators';

const getUniqueId = (
  id => () =>
    'FEELES_UNIQ_ID-' + ++id
)(0);

const { port1, port2 } = new MessageChannel();

export const port = port1;

export const connected = Promise.resolve({ port: port1 });

export const message$ = fromEvent<MessageEvent>(port1, 'message').pipe(share());

message$.subscribe(); // like connect()
port1.start();

window.parent.postMessage({}, '*', [port2]); // ready!

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
  port1.postMessage(message);
  return message$
    .pipe(
      filter(e => e.data && e.data.id === message.id),
      map(e => {
        if (e.data && e.data.error) {
          throw e.data.error;
        }
        return e;
      }),
      first()
    )
    .toPromise();
}
