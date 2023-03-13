import { EventType, RecordedEvent } from '../types';

export enum DomInteractionEvent {
  CLICK = 'click',
  MOUSE_ENTER = 'mouseenter',
  KEY_DOWN = 'keydown',
}

export enum TrackElement {
  BUTTON = 'BUTTON',
  DIV = 'DIV',
  ANCHOR = 'ANCHOR',
  TEXTBOX = 'TEXTBOX',
  SELECT = 'SELECT',
}

export type UserInteractionTarget = {
  id: string;
  name: string;
  classNames: string;
  innerText: string;
  localName: string;
  nodeName: string;
};

export type MouseClickEvent = RecordedEvent & {
  type: EventType.USER_INTERACTION;
  domInteractionEvent: DomInteractionEvent.CLICK;
  target: UserInteractionTarget;
};

export type MouseEnterEvent = RecordedEvent & {
  type: EventType.USER_INTERACTION;
  domInteractionEvent: DomInteractionEvent.MOUSE_ENTER;
  target: UserInteractionTarget;
};

export type KeydownEvent = RecordedEvent & {
  type: EventType.USER_INTERACTION;
  domInteractionEvent: DomInteractionEvent.KEY_DOWN;
  target: UserInteractionTarget;
};

export interface TrackElementHandler {
  defaultEvents: () => Set<DomInteractionEvent>;
  querySelector: (document: Document) => Element[];
}

class ButtonHandler implements TrackElementHandler {
  defaultEvents = (): Set<DomInteractionEvent> => {
    return new Set<DomInteractionEvent>([
      DomInteractionEvent.CLICK,
      DomInteractionEvent.MOUSE_ENTER,
    ]);
  };

  querySelector = (document: Document): Element[] => {
    const elements: HTMLButtonElement[] = [];
    document
      .querySelectorAll('button')
      .forEach((element) => elements.push(element));
    return elements;
  };
}

class DivHandler implements TrackElementHandler {
  defaultEvents = (): Set<DomInteractionEvent> => {
    return new Set<DomInteractionEvent>([
      DomInteractionEvent.CLICK,
      DomInteractionEvent.MOUSE_ENTER,
    ]);
  };

  querySelector = (document: Document): Element[] => {
    const elements: HTMLDivElement[] = [];
    document.querySelectorAll('div').forEach((element) => {
      // Known limitation that this doesn't work for elements whose click handler is added through addEventListener.
      if (typeof element.onclick === 'function') {
        console.debug('divs with onclick function', element);
        elements.push(element);
      }
    });
    return elements;
  };
}

class AnchorHandler implements TrackElementHandler {
  defaultEvents = (): Set<DomInteractionEvent> => {
    return new Set<DomInteractionEvent>([
      DomInteractionEvent.CLICK,
      DomInteractionEvent.MOUSE_ENTER,
    ]);
  };

  querySelector = (document: Document): Element[] => {
    const elements: HTMLAnchorElement[] = [];
    document.querySelectorAll('a').forEach((element) => elements.push(element));
    return elements;
  };
}

class TextboxHandler implements TrackElementHandler {
  defaultEvents = (): Set<DomInteractionEvent> => {
    return new Set<DomInteractionEvent>([
      DomInteractionEvent.CLICK,
      DomInteractionEvent.KEY_DOWN,
    ]);
  };

  querySelector = (document: Document): Element[] => {
    const elements: HTMLInputElement[] = [];
    document.querySelectorAll('input').forEach((element) => {
      if (element.type === 'text') {
        elements.push(element);
      }
    });
    return elements;
  };
}

class SelectHandler implements TrackElementHandler {
  defaultEvents = (): Set<DomInteractionEvent> => {
    return new Set<DomInteractionEvent>([
      DomInteractionEvent.CLICK,
      DomInteractionEvent.KEY_DOWN,
    ]);
  };

  querySelector = (document: Document): Element[] => {
    const elements: HTMLSelectElement[] = [];
    document
      .querySelectorAll('select')
      .forEach((element) => elements.push(element));
    return elements;
  };
}

export const trackElementHandlerMap = new Map<TrackElement, TrackElementHandler>([
  [TrackElement.BUTTON, new ButtonHandler()],
  [TrackElement.DIV, new DivHandler()],
  [TrackElement.ANCHOR, new AnchorHandler()],
  [TrackElement.TEXTBOX, new TextboxHandler()],
  [TrackElement.SELECT, new SelectHandler()],
]);