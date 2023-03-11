import { Collection, WithRef } from "@/types/types";

export default function toDocuments<T>(
  collection: Collection<T>
): WithRef<T>[] {
  return Object.entries(collection).map(([$ref, obj]) => ({ ...obj, $ref }));
}
