import { useState } from "react";
import NavBar from "./components/UI/NavBar";
import Home from "./pages/Home";
import Authors from "./pages/Authors";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <NavBar currentPage={page} onPageChange={setPage} />
      {page === "home" ? <Home /> : <Authors />}
    </>
  );
}

export default App;