"use client";

import { useEffect, useState } from "react";
import moment from "moment";

interface Props {
  time: string;
  className?: string;
}

export default function RelativeTime({ time, className }: Props) {
  const [relativeTime, setRelativeTime] = useState(() =>
    moment(time).fromNow()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(moment(time).fromNow());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <time className={className} dateTime={time}>
      {relativeTime}
    </time>
  );
}
