import { parseLog, parseChunk } from './analyze';
import { describe, it, expect } from 'vitest';

// log lines look like this
// 177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "User Agent Here"
// Note that we can ommit the last few fields since they are not used in the analysis so for testing purposes, we can shorten them to:
// 177.71.128.21 - - [-] "GET /intranet-analytics/ HTTP/1.1"
const defaultLogLines = [
  '123.456.789.0 - - [-] "GET /path-1 HTTP/2" 200 1234',
  '123.456.789.1 - - [-] "GET /path-2 HTTP/2" 200 1234',
  '123.456.789.1 - - [-] "GET /path-1 HTTP/2" 200 1234',
];

/*
{
  groupedByRemoteAddr: {
    '123.456.789.0': [ [Object] ],
    '123.456.789.1': [ [Object], [Object] ]
  },
  groupedByPath: { '/path-1': [ [Object], [Object] ], '/path-2': [ [Object] ] },
  countByRemoteAddr: [
    { remote_addr: '123.456.789.1', count: 2 },
    { remote_addr: '123.456.789.0', count: 1 }
  ],
  countByPath: [ { path: '/path-1', count: 2 }, { path: '/path-2', count: 1 } ]
}
*/
describe(parseLog, () => {
  it('should parse a log file', () => {
    const analytics = parseLog(defaultLogLines);

    const analyticsShape = {
      groupedByRemoteAddr: {},
      groupedByPath: {},
      countByRemoteAddr: {},
      countByPath: {},
    };
    // check that the analytics object has the correct shape
    expect(analytics).toMatchObject(analyticsShape);
  });

  it('should count by path', () => {
    const analytics = parseLog(defaultLogLines);

    expect(analytics.countByPath.length).toBe(2);
    expect(analytics.countByPath[0]).toEqual({ path: '/path-1', count: 2 });
    expect(analytics.countByPath[1]).toEqual({ path: '/path-2', count: 1 });
  });

  it('should parse a log file with a single line', () => {
    const analytics = parseLog(defaultLogLines.slice(0, 1));

    expect(analytics.countByRemoteAddr.length).toBe(1);
    expect(analytics.countByRemoteAddr[0]).toEqual({ remote_addr: '123.456.789.0', count: 1 });
    expect(analytics.countByPath[0]).toEqual({ path: '/path-1', count: 1 });
  });

  it('should parse a log file with no lines', () => {
    const analytics = parseLog([]);

    expect(analytics.countByRemoteAddr.length).toBe(0);
    expect(analytics.countByPath.length).toBe(0);
  });

  it('should parse a log file with a single ip with a different path', () => {
    const logLines = [
      '123.456.789.0 - - [-] "GET /path-1 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-2 HTTP/2"',
    ];
    const analytics = parseLog(logLines);

    expect(analytics.countByRemoteAddr.length).toBe(1);
    expect(analytics.countByRemoteAddr[0]).toEqual({ remote_addr: '123.456.789.0', count: 2 });
    expect(analytics.countByPath[0]).toEqual({ path: '/path-1', count: 1 });
    expect(analytics.countByPath[1]).toEqual({ path: '/path-2', count: 1 });
  });

  it('should sort the count by path', () => {
    const logLines = [
      '123.456.789.0 - - [-] "GET /path-1 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-2 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-3 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-2 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-2 HTTP/2"',
      '123.456.789.0 - - [-] "GET /path-3 HTTP/2"',
    ];
    const analytics = parseLog(logLines);

    expect(analytics.countByPath.length).toBe(3);
    expect(analytics.countByPath[0]).toEqual({ path: '/path-2', count: 3 });
    expect(analytics.countByPath[1]).toEqual({ path: '/path-3', count: 2 });
  });
});

describe(parseChunk, () => {

  it('should parse a chunk of log lines', () => {
    const parsedChunk = parseChunk(defaultLogLines);

    expect(parsedChunk.length).toBe(defaultLogLines.length);
    expect(parsedChunk[0]).toEqual({
      remote_addr: '123.456.789.0',
      status: 200,
      body_bytes_sent: 1234,
      method: 'GET',
      path: '/path-1',
      protocol: 'HTTP/2'
    });
  });

  it('should parse a chunk of log lines with no lines', () => {
    const parsedChunk = parseChunk([]);
    expect(parsedChunk.length).toBe(0);
  });

});
