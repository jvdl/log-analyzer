import { Analytics } from '../types/log';

export function AnalyticsSummary ({ analytics }: { analytics: Analytics | null}) {
  if (!analytics) {
    return null;
  }

  return (<>
    <h2>Analytics summary</h2>
      <ul>
        <li>Number of unique IP addresses: {Object.keys(analytics.groupedByRemoteAddr).length}</li>
        <li>Top 3 IP address:
          <ol>
            {analytics.countByRemoteAddr.slice(0, 3).map(({ remote_addr, count }) => (
              <li key={remote_addr}><strong>{remote_addr}</strong> <em>({count} requests)</em></li>
            ))}
          </ol>
        </li>
        <li>Top 3 most requested paths:
          <ol>
            {analytics.countByPath.slice(0, 3).map(({ path, count }) => (
              <li key={path}><strong>{path}</strong> <em>({count} requests)</em></li>
            ))}
          </ol>
        </li>
      </ul>
  </>);
}
