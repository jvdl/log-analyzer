import { AnalyticsSummary } from './AnalyticsSummary';
import renderer from 'react-test-renderer';
import { describe, it, expect } from 'vitest';


describe(AnalyticsSummary, () => {
  const defaultAnalytics = {
    groupedByRemoteAddr: {
      '123.456.789.0': [],
      '123.456.789.1': [],
      '123.456.789.2': [],
      '123.456.789.3': [],
      '123.456.789.4': [],
    },
    groupedByPath: {},
    countByRemoteAddr: [
      { remote_addr: '123.456.789.0', count: 5 },
      { remote_addr: '123.456.789.1', count: 4 },
      { remote_addr: '123.456.789.2', count: 3 },
      { remote_addr: '123.456.789.3', count: 2 },
      { remote_addr: '123.456.789.4', count: 1 },
    ],
    countByPath: [
      { path: '/path/1', count: 5 },
      { path: '/path/2', count: 4 },
      { path: '/path/3', count: 3 },
      { path: '/path/4', count: 2 },
      { path: '/path/5', count: 1 },
    ],
  };
  it('renders correctly with expected data', () => {
    const tree = renderer
      .create(<AnalyticsSummary analytics={defaultAnalytics} />)
      .toJSON();
      expect(tree).toMatchSnapshot();
  });

  it('renders correctly with null data', () => {
    const tree = renderer
      .create(<AnalyticsSummary analytics={null} />)
      .toJSON();
      expect(tree).toBeNull();
  });

  it('renders correctly with less than the required number of results', () => {
    const analytics = {
      ...defaultAnalytics,
      countByRemoteAddr: defaultAnalytics.countByRemoteAddr.slice(0, 2),
      countByPath: defaultAnalytics.countByPath.slice(0, 2),
    };
    const tree = renderer
      .create(<AnalyticsSummary analytics={analytics} />)
      .toJSON();
      expect(tree).toMatchSnapshot();
  });
});
