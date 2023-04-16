interface RouteParams {
  prosumer?: string;
  id: string;
}

export default function OrderDetails({ prosumer, id }: RouteParams) {
  return <div>{id}</div>;
}
