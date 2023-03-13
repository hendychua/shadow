import { v4 as uuidV4 } from 'uuid';
import { performanceEntryTypeHandlerMap, SupportedPerformanceEntryType } from './performance-api';
import { EventType, RecordedEvent } from './types';
import { DomInteractionEvent, KeydownEvent, MouseClickEvent, MouseEnterEvent, TrackElement, trackElementHandlerMap } from './user-interactions';
import { LocalDataLakeManager } from './store/local-storage';

export type TrackInteractionOptions = {
  [k in TrackElement]?: 'skip' | Set<DomInteractionEvent>;
};

export type InitializationInputs = {
  skipUserInteractions?: boolean;
  skipNetworkRequests?: boolean;
  trackInteractions?: TrackInteractionOptions;
};

export namespace Shadow {
  const UPLOAD_INTERVAL_MS = 10000;

  let events: RecordedEvent[] = [];

  function performanceCallback(list: PerformanceObserverEntryList) {
    list.getEntries().forEach((entry) => {
      const event = performanceEntryTypeHandlerMap
        .get(entry.entryType)
        ?.entryToRecordedEvent(entry);
      if (event) {
        events.push(event);
      }
    });
  }

  function domEventCallback(
    domEvent: Event,
    eventToTrack: DomInteractionEvent,
  ) {
    const target = domEvent.target! as Element;

    const recordedEvent: MouseClickEvent | MouseEnterEvent | KeydownEvent = {
      recordedTimestamp: new Date(),
      type: EventType.USER_INTERACTION,
      domInteractionEvent: eventToTrack,
      target: {
        classNames: target.className,
        id: target.id,
        name: (target as any).name || '',
        innerText: target.textContent || '',
        localName: target.localName,
        nodeName: target.nodeName,
      },
    };
    events.push(recordedEvent);
  }

  export function init(initializationInputs: InitializationInputs) {
    const sessionId = uuidV4();

    const { skipNetworkRequests, skipUserInteractions, trackInteractions } =
      initializationInputs;

    const dataLakeManager = new LocalDataLakeManager();

    dataLakeManager.syncTimeOrigin(sessionId, performance.timeOrigin);

    setInterval(() => {
      if (events.length) {
        dataLakeManager.uploadEvents(sessionId, events);
        events = [];
      }
    }, UPLOAD_INTERVAL_MS);

    if (!skipNetworkRequests) {
      const performanceObserver = new PerformanceObserver(performanceCallback);
      performanceObserver.observe({
        entryTypes: Object.values(SupportedPerformanceEntryType),
      });
    }

    if (!skipUserInteractions) {
      Object.values(TrackElement).forEach((trackElement) => {
        const elementHandler = trackElementHandlerMap.get(trackElement);
        if (!elementHandler) {
          console.error(
            `No handler found for element type ${trackElement}. Not tracking such elements.`,
          );
          return;
        }

        const elementUserOptions = trackInteractions?.[trackElement];

        if (elementUserOptions === 'skip') {
          return;
        } else {
          const elements = elementHandler.querySelector(document);
          const eventsToTrack =
            elementUserOptions || elementHandler.defaultEvents();
          elements.forEach((element) => {
            eventsToTrack.forEach((eventToTrack) => {
              element.addEventListener(eventToTrack, (event) =>
                domEventCallback(event, eventToTrack),
              );
            });
          });
        }
      });
    }
  }
}

