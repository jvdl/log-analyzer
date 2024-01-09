/// <reference types="vite/client" />


// the package itself doesn't use types, but I've inferred this
// from its output and tests
declare module 'clf-parser' {
  export default function clfParser(line: string): {
    body_bytes_sent: number;
    http_method: string | null;
    http_referer: string | null;
    http_user_agent: string | null;
    http_x_forwarded_for?: string | null;
    method: string;
    path: string | null;
    protocol: string | null;
    remote_addr: string | null;
    remote_user: string | null;
    request: string | null;
    status: number;
    time_local: Date | null;
  }
}
