import { classNames } from "../../utils/classNames";

const ERR = { err: "Unknown error" };

export default function APIErrors({
  error,
  asRecord,
}: {
  error: any;
  asRecord?: boolean;
}) {
  const errors = Object.entries(error.response?.data || ERR);

  return (
    <ul
      className={classNames(
        "block sm:inline",
        !asRecord && errors.length > 1 && "space-y-2 list-decimal ml-6"
      )}
    >
      {errors.map(([key, value]) => (
        <li key={key}>
          {asRecord ? `${key}: ` : ""}
          {value as any}
        </li>
      ))}
    </ul>
  );
}
