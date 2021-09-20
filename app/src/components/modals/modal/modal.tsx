import React, { useContext } from 'react';
import { useTheme } from 'src/contexts/themeContext/themeContext';
import { Close, ModalFolder } from '../../icons/icons';
import useStyles from './modalStyles';
import Overlay from 'src/components/overlay/overlay';

import {
  BaseButton,
  BUTTON_VARIANTS,
  BUTTON_SIZE,
} from 'src/shared/BaseButton/BaseButton';
export interface Props {
  children?: React.ReactNode;
  handleClick?: () => void;
  handleClose?: () => void;
  handleClickAway?: () => void;
  heading: string;
  button?: string;
  disabledButton?: string;
  icon?: boolean;
  confirmMessage?: string;
  notifyMessage?: string;
  errorMessage?: string;
}

function Modal(props: Props) {
  const { theme } = useTheme();
  const classes = useStyles({ ...props, ...theme });

  return (
    <Overlay handleClickAway={props.handleClose}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          {props.icon && <ModalFolder className={classes.icon} />}
          {props.heading}
          <button onClick={props.handleClose}>
            <Close className={classes.closeIcon} />
          </button>
        </div>
        <div className={classes.flex}>
          <div className={classes.body}>
            <div>{props.children}</div>
            {props.confirmMessage && (
              <p className={classes.confirmMessage}>{props.confirmMessage}</p>
            )}
            {props.notifyMessage && (
              <p className={classes.notifyMessage}>{props.notifyMessage}</p>
            )}
            {props.errorMessage && (
              <p className={classes.errorMessage}>{props.errorMessage}</p>
            )}
          </div>
          <div className={classes.buttonContainer}>
            <BaseButton
              variant={BUTTON_VARIANTS.ALTERNATIVE}
              size={BUTTON_SIZE.MEDIUM}
              isDisabled={props.disabledButton !== undefined}
              onClickCallback={() => props.handleClick()}
            >
              {props.disabledButton ? props.disabledButton : props.button}
            </BaseButton>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export default React.memo(Modal);
