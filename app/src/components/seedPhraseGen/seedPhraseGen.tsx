import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../store/themeContext/themeContext";
import { StoreContext } from "../../store/store";
import useStyles from "../register/registerStyles";
import ButtonPill from "../buttonPill/buttonPill";
import SeedPhrase from "../seedPhrase/seedPhrase";
import { useHistory, Redirect } from "react-router-dom";
import welcomeImage from "../../media/images/welcome-image.png";

export interface Props {}

function SeedPhraseGen(props: Props) {
  const { state, actions } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const classes = useStyles({ ...props, ...theme });

  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  async function onContinue() {
    history.push("/confirm-seed");
  }

  console.log("mnemonic", state.mnemonic);

  return (
    <div className={classes.Login}>
      <img src={welcomeImage}></img>

      <div className={classes.registerContainer}>
        <div className={classes.title}>Registering account...</div>

        <div className={classes.description}>
          Your seed phrase is used to generate and recover your account Please
          save these 12 words on a piece of paper or a hardware wallet. The
          order is important. This seed will allow you to recover your account.
        </div>

        {state.mnemonic ? (
          <SeedPhrase seedPhrase={state.mnemonic} />
        ) : (
          <div>Loading...</div>
        )}

        {/* TODO need T&C checkbox */}

        {hasError ? (
          <div className={classes.errormsg}>
            Please confirm you understand how the seed phrase works.
          </div>
        ) : (
          ""
        )}
        <ButtonPill text={"Continue"} clickFunction={onContinue}></ButtonPill>
      </div>
    </div>
  );
}

export default React.memo(SeedPhraseGen);
