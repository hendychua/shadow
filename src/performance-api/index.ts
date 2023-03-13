import { EventType, RecordedEvent } from '../types';
import { NetworkRequest } from './types';

interface PerformanceEntryTypeHandler {
  entryToRecordedEvent: (entry: PerformanceEntry) => RecordedEvent | null;
}

export enum SupportedPerformanceEntryType {
  RESOURCE = 'resource',
}

export type NetworkRequestEvent = RecordedEvent & {
  type: EventType.NETWORK_REQUEST;
  networkRequest: NetworkRequest;
};

class PerformanceResourceTimingHandler implements PerformanceEntryTypeHandler {
  entryToRecordedEvent = (entry: PerformanceEntry): RecordedEvent | null => {
    if (entry.entryType === SupportedPerformanceEntryType.RESOURCE) {
      const performanceResourceTiming = entry as PerformanceResourceTiming;
      const networkRequest: NetworkRequest = {
        connectStart: performanceResourceTiming.connectStart,
        connectEnd: performanceResourceTiming.connectEnd,
        domainLookupStart: performanceResourceTiming.domainLookupStart,
        domainLookupEnd: performanceResourceTiming.domainLookupEnd,
        redirectStart: performanceResourceTiming.redirectStart,
        redirectEnd: performanceResourceTiming.redirectEnd,
        responseStart: performanceResourceTiming.responseStart,
        requestStart: performanceResourceTiming.requestStart,
        secureConnectionStart: performanceResourceTiming.secureConnectionStart,
        responseEnd: performanceResourceTiming.responseEnd,
        fetchStart: performanceResourceTiming.fetchStart,
        workerStart: performanceResourceTiming.workerStart,
        decodedBodySize: performanceResourceTiming.decodedBodySize,
        encodedBodySize: performanceResourceTiming.encodedBodySize,
        transferSize: performanceResourceTiming.transferSize,
        nextHopProtocol: performanceResourceTiming.nextHopProtocol,
        startTime: performanceResourceTiming.startTime,
        duration: performanceResourceTiming.duration,
        name: performanceResourceTiming.name,
        initiatorType: performanceResourceTiming.initiatorType,
      };
      const networkRequestEvent: NetworkRequestEvent = {
        type: EventType.NETWORK_REQUEST,
        recordedTimestamp: new Date(),
        networkRequest,
      };
      return networkRequestEvent;
    } else {
      return null;
    }
  };
}

export const performanceEntryTypeHandlerMap = new Map<
  string,
  PerformanceEntryTypeHandler
>([
  [
    SupportedPerformanceEntryType.RESOURCE,
    new PerformanceResourceTimingHandler(),
  ],
]);