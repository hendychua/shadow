import { DataLakeManager } from '.';
import { RecordedEvent } from '../types';

export type LocalDataLakeStruct = {
  timeOrigin: number;
  events: RecordedEvent[][];
};

export class LocalDataLakeManager implements DataLakeManager {
  syncTimeOrigin = (sessionId: string, timeOrigin: number) => {
    let data = this.readExistingData(sessionId);
    if (data) {
      data.timeOrigin = timeOrigin;
    } else {
      data = {
        timeOrigin,
        events: [],
      };
    }
    this.saveData(sessionId, data);
  };

  uploadEvents = (sessionId: string, events: RecordedEvent[]) => {
    if (!events.length) {
      return;
    }

    let data = this.readExistingData(sessionId);
    if (data) {
      data.events.push(events);
      this.saveData(sessionId, data);
    } else {
      console.error(`Session id ${sessionId} not found. Unable to save data.`);
    }
  };

  private readExistingData = (
    sessionId: string,
  ): LocalDataLakeStruct | null => {
    const key = this.computeKey(sessionId);
    const strVal = localStorage.getItem(key);
    try {
      const existing: LocalDataLakeStruct = JSON.parse(strVal || 'null');
      if (existing) {
        return existing;
      }
    } catch (err) {
      console.error(
        `Corrupted data found for ${key}: '${strVal}'. Deleting data.`,
      );
    }
    return null;
  };

  private saveData = (sessionId: string, data: LocalDataLakeStruct) => {
    const key = this.computeKey(sessionId);
    localStorage.setItem(key, JSON.stringify(data));
  };

  private computeKey = (sessionId: string): string => {
    return `shdw-events-${sessionId}`;
  };
}
