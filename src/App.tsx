import clfParse from 'clf-parser';
import './App.scss'


const file = `
`;

const lines = file.split('\n').filter(Boolean);
const parsedLog = lines
  .map(clfParse)
  .map(({ remote_addr, status, body_bytes_sent, method, path, protocol }) => ({ remote_addr, status, body_bytes_sent, method, path, protocol }));
  console.log(parsedLog);
// console.table(lines.map(clfParse).map(({ remote_addr, status, body_bytes_sent, method, path, protocol }) => ({ remote_addr, status, body_bytes_sent, method, path, protocol })))

function App() {

  return (
    <>
      <h1>Log Parser</h1>

      <h2>Browse the raw log</h2>
      <div className="raw-log">
        <pre>
          {lines.map((line, index) => (
            <kbd key={index}>{line.trimStart()}{'\n'}</kbd>
          ))}
        </pre>
      </div>
    </>
  )
}

export default App
