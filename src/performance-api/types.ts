/**
 * Note that if the backend is on a different origin, due to cross-origin restrictions,
 * most of these data require Timing-Allow-Origin header to be set to allow the frontend
 * to see the values.
 * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin.
 */
export type NetworkRequest = {
  /**
   * connectEnd - connectStart = TCP handshake time.
   */
  connectStart: number;
  connectEnd: number;

  /**
   * domainLookupEnd - domainLookupEnd = DNS lookup time.
   */
  domainLookupStart: number;
  domainLookupEnd: number;

  /**
   * redirectEnd - redirectStart = Redirection time.
   */
  redirectStart: number;
  redirectEnd: number;

  /**
   * responseStart - requestStart = Request time.
   */
  responseStart: number;
  requestStart: number;

  /**
   * requestStart - secureConnectionStart = TLS negotiation time.
   */
  secureConnectionStart: number;

  /**
   * responseEnd - fetchStart = Time to fetch (without redirects).
   */
  responseEnd: number;
  fetchStart: number;

  /**
   * fetchStart - workerStart = ServiceWorker processing time.
   */
  workerStart: number;

  /**
   * Checking if content was compressed (decodedBodySize should not be encodedBodySize)
   */
  decodedBodySize: number;
  encodedBodySize: number;

  /**
   * Checking if local caches were hit (transferSize should be 0)
   */
  transferSize: number;

  /**
   * Checking if modern and fast protocols are used (nextHopProtocol should be HTTP/2 or HTTP/3)
   */
  nextHopProtocol: string;

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/startTime
   */
  startTime: number;

  /**
   * Returns a timestamp that is the difference between the responseEnd and the startTime properties.
   */
  duration: number;

  /**
   * Resource URL
   */
  name: string;

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType
   */
  initiatorType: string;
};