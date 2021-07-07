import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Wrapper } from "./Login.style";
import { CSSProperties } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { LoginToken } from "./components/interfaces";
import { get } from "./components/Http";
import { setGlobalIsAdmin, setGlobalLicense, setGlobalToken } from "./window";
import { CustomSnackbarAlert } from "./Alert";

const licenseInputStyle: CSSProperties = {
  width: "40%",
};

const errorStyle: CSSProperties = {
  fontWeight: "bold",
  fontSize: "3em",
};

const Login = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [license, setLicense] = useState("");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState("");
  const history = useHistory();
  const [hasSessionExpired, setSessionExpired] = useState(history.location.state !== undefined && (history.location.state as {hasExpired:boolean}).hasExpired);

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
    setGlobalToken(token);
    setGlobalIsAdmin(isAdmin);
    setGlobalLicense(license);
    history.push("/beers");
  }

  if (hasSessionExpired) {
    setSessionExpired(false);
    setOpenPopup(true);
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
      <CustomSnackbarAlert {...{
        open: openPopup,
        onClose: () => {setOpenPopup(false)},
        severity: "info",
        contentText: "Session has expired. Please log back in."
      }} />
    </Wrapper>
  );
};

export default Login;
