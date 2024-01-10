import clfParse from 'clf-parser';
import type { Analytics, Log, ShortLog } from '../types/log';
import { CHUNK_SIZE } from './constants';
import groupBy from 'lodash/groupby';

/**
 * Parse a chunk of log lines. This function is called once for each chunk of log lines.
 * This allows the parsing to be done in chunks, which is more memory efficient.
 * While it doesn't matter for small files, this is important for large files.
 *
 * The way this is implemented here is not the most efficient way to do this because
 * we're not offloading the parsing to a separate thread. This means that the parsing
 * is blocking the main thread, which means that the UI will be unresponsive while
 * the parsing is happening. This is not a problem for small files, but it is a problem
 * for large files. The solution to this is to use a web worker to offload the parsing
 * to a separate thread.
 *
 * Alternatively we could offload the parsing to the server and have the server send
 * back the parsed data. This would be more efficient because the server would be able
 * to use all of its cores to parse the data, and the client would not have to parse
 * the data at all.
 * @param chunk - a chunk of log lines to parse
 */
export function parseChunk(chunk: string[]) {
  return chunk
    .map<Log>(clfParse)
    .map<ShortLog>(({ remote_addr, status, body_bytes_sent, method, path, protocol }) => ({ remote_addr, status, body_bytes_sent, method, path, protocol }));
}

function sortByCount(a: { count: number }, b: { count: number }) {
  return b.count - a.count;
}

export function parseLog(logLines: string[]): Analytics {
  // chunk the parsing into a smaller subset of lines at a time
  const chunks = [];
  if (logLines.length > CHUNK_SIZE) {
    // parse each chunk and merge the results
    for (let i = 0; i < logLines.length; i += CHUNK_SIZE) {
      chunks.push(logLines.slice(i, i + CHUNK_SIZE));
    }
  } else {
    chunks.push(logLines);
  }
  const parsedChunks = chunks.map(parseChunk);
  const parsedLog = parsedChunks.flat();
  const groupedByRemoteAddr = groupBy(parsedLog, 'remote_addr');
  const groupedByPath = groupBy(parsedLog, 'path');
  const countByPath = Object.entries<ShortLog[]>(groupedByPath)
    .map(([path, logs]) => ({ path, count: logs.length }))
    .sort(sortByCount);
  const countByRemoteAddr = Object.entries<ShortLog[]>(groupedByRemoteAddr).map(([remote_addr, logs]) => ({ remote_addr, count: logs.length }))
  .sort(sortByCount);

  return {
    groupedByRemoteAddr,
    groupedByPath,
    countByRemoteAddr,
    countByPath,
  };
}
