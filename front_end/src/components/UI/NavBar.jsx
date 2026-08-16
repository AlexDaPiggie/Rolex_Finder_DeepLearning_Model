import "./NavBar.css";

function NavBar({ currentPage, onPageChange }) {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-link ${currentPage === "home" ? "active" : ""}`}
        onClick={() => onPageChange("home")}
      >
        Home
      </button>
      <button
        className={`nav-link ${currentPage === "authors" ? "active" : ""}`}
        onClick={() => onPageChange("authors")}
      >
        Authors
      </button>
    </nav>
  );
}

export default NavBar;
