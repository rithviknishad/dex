/**
 * Conditionally concatenate classes. An alternate replacement for `clsx`.
 *
 * **Example Usage:**
 * ```tsx
 * <div className={classNames("md:flex", true && "p-0", false && "p-10")} />
 * // "md:flex p-0"
 * ```
 */
export default function classNames(
  ...classes: (string | boolean | undefined)[]
) {
  return classes.filter(Boolean).join(" ");
}
