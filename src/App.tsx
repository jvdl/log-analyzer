import { useState } from 'react';
import { BrowseLog } from './components/BrowseLog';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { UploadLog } from './components/UploadLog';
import type { Analytics } from './types/log';
import { parseLog } from './util/analyze';
import './App.scss';

function App() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<Analytics|null>(null);
  const onUpload = (fileContent: string | null) => {
    // reset state
    setAnalytics(null);
    setLogLines([]);

    if (!fileContent) {
      return;
    }

    const lines = fileContent.split('\n').filter(Boolean);
    setLogLines(lines);
    setAnalytics( parseLog(lines) );

  };
  return (
    <>
      <h1>Log Parser</h1>
      <UploadLog onUpload={onUpload} />
      <AnalyticsSummary analytics={analytics} />
      <BrowseLog logLines={logLines} />
    </>
  );
}

export default App;
