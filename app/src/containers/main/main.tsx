import React, { useContext } from "react";
import useStyles from "./mainStyles";
import ButtonLink from "../../components/buttonLink/buttonLink";
import { StoreContext } from "../../store/store";
import { ThemeContext } from "../../store/themeContext/themeContext";
import { Redirect } from "react-router-dom";
import FileModal from "../../components/fileModal/fileModal";

export interface Props {}

function Main(props: Props) {
  const { state, actions } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const file = {
    name: "FileName",
    size: "24",
    creation_date: "22.1.2021",
    content_type: "txt",
  };
  const classes = useStyles({ ...props, ...theme });
  return (
    <div className={classes.Main}>
      {/* <Login></Login> */}
      {state.password && <Redirect to={"/drive/root"} />}
      {/* <FileModal file={file}></FileModal> */}
      <ButtonLink label="Login" color="grey" path="/login"></ButtonLink>
    </div>
  );
}
export default React.memo(Main);
