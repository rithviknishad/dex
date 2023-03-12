import { Coordinates } from "@/types/types";

export default function parseCoordinates(coordinates: Coordinates) {
  const [latitude, longitude] = coordinates.split(",").map(parseFloat);
  return { latitude, longitude };
}
