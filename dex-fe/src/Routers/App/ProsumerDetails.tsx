interface RouteParams {
  id: string;
}

export default function ProsumerDetails({ id }: RouteParams) {
  return <div>{id}</div>;
}
