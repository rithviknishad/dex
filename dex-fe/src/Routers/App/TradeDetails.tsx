interface RouteParams {
  prosumer?: string;
  id: string;
}

export default function TradeDetails({ prosumer, id }: RouteParams) {
  return <div>{id}</div>;
}
