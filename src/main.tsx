import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <Router>
    // <Provider>
      <QueryClientProvider client={queryClient}>
          {/* <Route path="/one"> */}
            {/* <KeepAlive name="One"> */}
              <App />
            {/* </KeepAlive> */}
          {/* </Route> */}
      </QueryClientProvider>
    // </Provider>
//   </Router>
);
