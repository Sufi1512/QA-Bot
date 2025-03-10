import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CallDashboard } from "./CallDashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CallDashboard />
    </>
  );
}

export default App;
