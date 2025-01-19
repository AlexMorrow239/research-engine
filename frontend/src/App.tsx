import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { router } from "./routes/routes";
import { persistor } from "./store";

function App(): JSX.Element {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  );
}

export default App;
