import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Wrapper } from "./Login.style";
import { CSSProperties } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { LoginToken } from "./components/interfaces";
import { get } from "./components/Http";

const licenseInputStyle: CSSProperties = {
  width: "40%",
};

const errorStyle: CSSProperties = {
  fontWeight: "bold",
  fontSize: "3em",
};

const Login = () => {
  const [license, setLicense] = useState("");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleClick = async () => {
    let licenseCode = (
      document.getElementById("licenseField") as HTMLInputElement
    ).value;

    try{
      let response = await get<LoginToken>("/login/" + licenseCode)
      setToken(response.token);
      setLicense(response.license);
      setIsAdmin(response.isAdmin);
    } catch (err){
      setError("You're not licensed! 🔫");
    }
  };

  if (license && token && isAdmin !== undefined) {
    window.token = token;
    window.license = license;
    window.isAdmin = isAdmin;
    history.push("/beers");
  }

  return (
    <Wrapper>
      <TextField
        label="License"
        name={"license"}
        style={licenseInputStyle}
        id="licenseField"
      ></TextField>
      <Button onClick={ () => {handleClick()}}>Seek Legal Advice</Button>
      {error && <div style={errorStyle}>{error}</div>}
    </Wrapper>
  );
};

export default Login;
