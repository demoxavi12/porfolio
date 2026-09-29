import { useEffect, useState } from "react";
import { person } from "../data/content";

const format = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: person.timezone,
  }).format(new Date());

/** Local time in Berhampur, refreshed every 20s. */
export function useClock() {
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}
