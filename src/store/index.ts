import { RecordedEvent } from '../types';

export interface DataLakeManager {
  syncTimeOrigin: (sessionId: string, timeOrigin: number) => void;
  uploadEvents: (sessionId: string, events: RecordedEvent[]) => void;
}
