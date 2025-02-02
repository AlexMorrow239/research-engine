import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "./components/common/toast-container/ToastContainer";
import { KonamiCode } from "./components/konami-code/KonamiCode";
import { router } from "./routes/routes";
import { persistor, store } from "./store";

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
        <KonamiCode />
      </PersistGate>
    </Provider>
  );
}

export default App;
