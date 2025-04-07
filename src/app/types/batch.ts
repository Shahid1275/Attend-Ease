interface Batch {
  id: number;
  title: string;
  session: string;
  leaves_allowed: number;
  start_date: string | null; // Must be snake_case to match API
}