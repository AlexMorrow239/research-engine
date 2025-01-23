import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "./components/common/form-field/toast-container/ToastContainer";
import { router } from "./routes/routes";
import { persistor, store } from "./store";

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
