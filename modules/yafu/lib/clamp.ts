/**
 * The function enables selecting a middle value
 * within a range of values between a defined minimum and maximum.
 *
 * @function clamp
 * @arg l {Number} The lower bound
 * @arg u {Number} The upper bound
 * @arg v {Number} The value that needs to be clamped
 * @return {Number}
 */
export function clamp(l: number, u: number, v: number): number {
  if (v > u) return u
  if (v < l) return l
  return v
}
