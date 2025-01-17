import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import { router } from "./routes/routes";

function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  );
}

export default App;
