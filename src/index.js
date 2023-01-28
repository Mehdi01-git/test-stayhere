import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Ids from "./Pages/Ids";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <Ids />,
  },
]);
const FavMovies = JSON.parse(window.localStorage.getItem("FavMovies"));
const globalState = {
  favsId: FavMovies ? [...FavMovies] : [],
};

export const globalStateContext = React.createContext(globalState);
export const dispatchStateContext = React.createContext(undefined);

const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    globalState
  );
  return (
    <globalStateContext.Provider value={state}>
      <dispatchStateContext.Provider value={dispatch}>
        {children}
      </dispatchStateContext.Provider>
    </globalStateContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStateProvider>
    <RouterProvider router={router} />
  </GlobalStateProvider>
);
