import AppRouter from "./Routers/App";
import SessionRouter from "./Routers/Session";
import useJWTAuth from "./hooks/useJWTAuth";

function App() {
  const { authenticated } = useJWTAuth();

  if (authenticated) {
    return <AppRouter />;
  } else {
    return <SessionRouter />;
  }
}

export default App;
