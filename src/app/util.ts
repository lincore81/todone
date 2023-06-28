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