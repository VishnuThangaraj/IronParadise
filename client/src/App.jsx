import { Toaster } from "sonner";
import UserAttendance from "./pages/UserAttendance";

const App = () => {
  return (
    <div style={{ width: "100%" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "p-3",
        }}
        richColors
      />
      <UserAttendance />
    </div>
  );
};

export default App;
