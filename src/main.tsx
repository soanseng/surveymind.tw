import "@fontsource-variable/inter";
import "./globals.css";
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes: routeRecords, isClient, initialState }) => {
    void router;
    void routeRecords;
    void isClient;
    void initialState;
  },
);
