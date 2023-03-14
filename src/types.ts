export enum EventType {
  USER_INTERACTION = 'USER_INTERACTION',
  NETWORK_REQUEST = 'NETWORK_REQUEST',
}

export type RecordedEvent = {
  type: EventType;
  recordedTimestamp: Date;
};
