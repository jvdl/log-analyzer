import { CHUNK_SIZE } from '../util/constants';

export function BrowseLog ({ logLines }: { logLines: string[] }) {
  if (!logLines?.length) {
    return null;
  }

  return (<>
    <h2>Browse the raw log</h2>
    <small>
      {
      logLines.length > CHUNK_SIZE
        ? <>Showing first {CHUNK_SIZE} lines</>
        : <>{logLines.length} lines</>
      }
    </small>
    <div className="raw-log">
      <pre>
        {logLines.slice(0,CHUNK_SIZE).map((line, index) => (
          <code key={index}>{line.trimStart()}{'\n'}</code>
        ))}
      </pre>
    </div>
  </>);
}
