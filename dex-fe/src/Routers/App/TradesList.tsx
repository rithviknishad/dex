interface RouteParams {
  prosumer?: string;
}

export default function TradesList({ prosumer }: RouteParams) {
  return <div>{prosumer}</div>;
}
