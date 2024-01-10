import { Analytics } from '../types/log';

const TOP_COUNT = 3;

export function AnalyticsSummary ({ analytics }: { analytics: Analytics | null}) {
  if (!analytics) {
    return null;
  }

  const topRemoteAddr = analytics.countByRemoteAddr.slice(0, TOP_COUNT);
  const topPaths = analytics.countByPath.slice(0, TOP_COUNT);
  const uniqueRemoteAddrCount = analytics.countByRemoteAddr.length;

  return (<>
    <h2>Analytics summary</h2>
      <ul>
        <li>Number of unique IP addresses: <strong>{uniqueRemoteAddrCount}</strong></li>
        <li>Top {TOP_COUNT} IP addresses:
          <ol>
            {topRemoteAddr.map(({ remote_addr, count }) => (
              <li key={remote_addr}><strong>{remote_addr}</strong> <em>({count} requests)</em></li>
            ))}
          </ol>
        </li>
        <li>Top {TOP_COUNT} most requested paths:
          <ol>
            {topPaths.map(({ path, count }) => (
              <li key={path}><strong>{path}</strong> <em>({count} requests)</em></li>
            ))}
          </ol>
        </li>
      </ul>
  </>);
}
