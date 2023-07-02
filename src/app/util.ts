export const moveInArray = (arr: Array<unknown>, src: number, dest: number): boolean => {
  if (src < 0) src = arr.length - src;
  if (dest < 0) dest = arr.length - dest;
  
  const ok = 0 <= src && src < arr.length
    && 0 <= dest && dest <= arr.length
    && src !== dest;

  return ok && !!arr.splice(dest, 0, arr.splice(src, 1)[0]);
};

export const inserted = <T>(xs: T[], x: T, at: number) =>
	[...xs.slice(0, at), x, ...xs.slice(at)];

type Stringy = string | undefined | null | false;

export function classes(...segments: Stringy[]) { 
  return segments.filter(Boolean).join(" ");
}

export const SECOND = 1_000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export const getHumanisedTimestr = (millis: number) => {
  const hours = Math.floor(millis / HOUR);
  const minutes = Math.floor((millis % HOUR) / MINUTE);
  const seconds = Math.floor((millis % MINUTE) / SECOND);
  const hoursStr = hours ? `${hours}h` : "";
  const minutesStr = minutes ? `${minutes}m` : "";
  const secondsStr = minutes < 5 && seconds? `${seconds}s` : "";
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

export const formatTime = (timeMs: number) => {
  const hours = Math.floor(timeMs / HOUR);
  const minutes = Math.floor((timeMs - (hours * HOUR)) / MINUTE);
  const seconds = Math.floor((timeMs - (minutes * MINUTE)) / SECOND);
  const minutesStr = `${minutes < 10 ? "0" : ""}${minutes}`;
  const secondsStr = `${seconds < 10 ? "0" : ""}${seconds}`;
  return `${hours? hours : ""}${minutesStr}:${secondsStr}`;
};