import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/ErrorFallback";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";

import "./App.scss";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}} resetKeys={[window.location.href]}>
      <BrowserRouter>
        <div className="App">
          <Layout />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
