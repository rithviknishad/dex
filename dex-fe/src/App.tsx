import AppRouter from "./Routers/AppRouter";
import SessionRouter from "./Routers/SessionRouter";
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
