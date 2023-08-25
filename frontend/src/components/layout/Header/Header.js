import "./header.css";
import Logo from "../../../assets/manikaran_waters_logo.png";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const smallHeader = location.pathname !== "/";
  return (
    <header className={smallHeader ? "smallHeader" : ""}>
      <img src={Logo} alt="manikaran waters logo" />
      <h1>MANIKARAN WATERS</h1>
    </header>
  );
};

export default Header;
