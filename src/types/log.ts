export type ShortLog = {
  remote_addr: string | null;
  status: number;
  body_bytes_sent: number;
  method: string;
  path: string | null;
  protocol: string | null;
}

export type Log = ShortLog & {
  http_method: string | null;
  http_referer: string | null;
  http_user_agent: string | null;
  http_x_forwarded_for?: string | null;
  remote_user: string | null;
  request: string | null;
  time_local: Date | null;
}

export type Analytics = {
  groupedByRemoteAddr: Record<string, ShortLog[]>;
  groupedByPath: Record<string, ShortLog[]>;
  countByRemoteAddr: { remote_addr: string, count: number }[];
  countByPath: { path: string, count: number }[];
}
