# Shadow

[![npm version](https://badge.fury.io/js/shadow-analytics.svg)](https://badge.fury.io/js/shadow-analytics)

**Important: This is not production ready yet.**

## What is Shadow?

Shadow is an open-source library for capturing data that enables developers to understand how their users are experiencing their product. Currently, it captures user interactions and network requests. It aims to require minimal code changes from the developers to capture this data, i.e. developers should not have to modify their codebase just to send analytics events.

Shadow reads the DOM and select elements to add event listeners to capture user interactions, and it uses [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance) to capture network requests.

## Motivation

There are many parts of the stack to monitor and many ways to track the performance of an application. However, we believe the best way to understand how your users are experiencing your app is to measure at where they are interacting with the app - the frontend. The SQL queries and backend service can be optimized, but if it takes a long time for an API query to return to the browser (for whatever reasons), your users will have a bad experience.

Measuring in production is also the most accurate (as compared to a test/staging environment) because the request and response data are real.

**Littering our code with event-capturing calls**, for example, when a button is clicked, when an action is dispatched, or when a network request is sent or completed is tedious, repetitive, and results in code that is not core to the functionality. Ideally, we want something magical - a library that you can drop in and it captures all **meaningful user interactions and network requests** with minimal configuration.

## Goal

The goal is to have a Shadow SDK for developers to capture data and a Shadow webapp to display data (both will be open-source). User interactions and requests will be lined up in a timeline format so that developers:

- Understand which actions triggered the network requests.
- Understand the intervals between every action and whether any delay is due to a slowdown in network requests or other reasons.

The webapp will also categorise users by other data such as geographical regions or other user-defined properties, for example, user organizations, to provide more insights.

## Status

- [x] Pre (x3) Alpha:
- Still a work-in-progress. It is currently just a library that captures events and writes to local storage.
- It selects a small list of elements to track for user interactions.
- It only tracks network requests from the Performance API, i.e. PerformanceResourceTiming.

## Installation

```
npm install shadow-analytics
```

or

```
yarn add shadow-analytics
```

## Usage

```
import { Shadow } from 'shadow-analytics';

// Where your app is initialized
Shadow.init({
  // initialization options
  skipUserInteractions?: boolean;

  skipNetworkRequests?: boolean;

  trackInteractions?: TrackInteractionOptions;
});
```

To view the captured data, currently, you have to read from local storage (either through the console or opening up local storage in the browser).

### Example output

```
[
  // ...
  {
    "recordedTimestamp": "2023-03-14T17:16:23.163Z",
    "type": "USER_INTERACTION",
    "domInteractionEvent": "click",
    "target": {
      "classNames": "MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium ...",
      "id": "",
      "name": "",
      "innerText": "Sign In",
      "localName": "button",
      "nodeName": "BUTTON"
    }
  },
  {
    "type": "NETWORK_REQUEST",
    "recordedTimestamp": "2023-03-14T17:16:23.350Z",
    "networkRequest": {
      "connectStart": 8313,
      "connectEnd": 8313,
      "domainLookupStart": 8313,
      "domainLookupEnd": 8313,
      "redirectStart": 0,
      "redirectEnd": 0,
      "responseStart": 8497,
      "requestStart": 8325,
      "secureConnectionStart": 0,
      "responseEnd": 8497,
      "fetchStart": 8313,
      "workerStart": 0,
      "decodedBodySize": 1039,
      "encodedBodySize": 1039,
      "transferSize": 2076,
      "nextHopProtocol": "http/1.1",
      "startTime": 8313,
      "duration": 184,
      "name": "http://localhost:3001/login",
      "initiatorType": "fetch"
    }
  }
  // ...
]

```

### Initialization Options

- `skipUserInteractions` - optional `boolean`. Whether to skip capturing user interactions.
- `skipNetworkRequests` - optional `boolean`. Whether to skip capturing network requests.
- `trackInteractions` - optional `TrackInteractionOptions`. Custom settings for tracking user interactions. Will only be used if `skipUserInteractions` is `undefined` or `false`.

#### `TrackInteractionOptions`

```
{
  [k in TrackElement]?: 'skip' | Set<DomInteractionEvent>;
};

enum TrackElement {
  BUTTON = 'BUTTON',
  DIV = 'DIV', // only divs with onclick handler are tracked
  ANCHOR = 'ANCHOR',
  TEXTBOX = 'TEXTBOX',
  SELECT = 'SELECT',
}

enum DomInteractionEvent {
  CLICK = 'click',
  MOUSE_ENTER = 'mouseenter',
  KEY_DOWN = 'keydown',
}
```

Each key in `TrackInteractionOptions` must be a value in enum `TrackElement`. It represents the element that the value should apply to. Values can be `skip` or a Set of `DomInteractionEvent` enum values. (`skip` would skip tracking interactions on the element.)

## Support

Please file any questions, bugs, or requests in [Github Issues](https://github.com/hendychua/shadow/issues).

## Known Limitations

- Only writes to local storage for now.
- Only 5 types of HTML element are being tracked now. These are the common ones that usually result in a REST API call.
- For `div`s, we are only tracking those with `onclick` handler. This would mean that we are missing out on `div`s whose handler is added using `addEventListener()` method.
- Network requests are captured using Performance API. The API returns very detailed [timing metrics](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming#typical_resource_timing_metrics). However, due to CORS restrictions, most of these metrics require `Timing-Allow-Origin` header to be set in the backend service to allow your frontend to read. See [Timing-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin) for details.

## Future Work

- Support more DOM elements and/or events.
- Allow custom elements to be enabled/disabled for tracking.
- Send user info (e.g. id, org id) for associating data.
- Send captured data to platform instead of just local storage.
- Webapp component.
