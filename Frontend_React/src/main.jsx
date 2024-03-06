import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./AppRouter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Router>
    <AppRouter />
  </Router>,
  // </React.StrictMode>,
);
