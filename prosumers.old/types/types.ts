export type Refer<T> = string;

export type Collection<T> = { [x: Refer<T>]: T };

export type Coordinates = `${number},${number}`;

export type TimeOfDay = `${number}:${number}`;
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Schedule = {
  /** 24-hour time, e.g. "08:00", "17:30" */
  start: TimeOfDay;
  /** 24-hour time, e.g. "08:00", "17:30" */
  end: TimeOfDay;
  // 24-hour time, e.g. "08:00", "17:30"
  weekdays: Weekday[];
};
