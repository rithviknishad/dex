export type Refer<T> = string;

export type Collection<T> = { [x: Refer<T>]: T };

export type Coordinates = `${number},${number}`;
export type Timestamp = number;

export type TimeOfDay = `${number}:${number}`;

export type Schedule = {
  /** 24-hour time, e.g. "08:00", "17:30" */
  start: TimeOfDay;
  /** 24-hour time, e.g. "08:00", "17:30" */
  end: TimeOfDay;
  /** binary string (length 7, 1 = active, 0 = inactive, eg. 00000011 = Sat, Sun) */
  weekdays: `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}`;
  // Number of concurrent instances of this schedule
  concurrency?: number;
};
