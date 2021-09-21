import React, { useContext, useState, useEffect } from 'react';

// Contexts
import { ThemeContext } from 'src/contexts/themeContext/themeContext';
import { StoreContext } from 'src/store/store';

// Icons
import { PodInfo as PodInfoIcon } from 'src/components/icons/icons';

// Hooks
import useStyles from './secondLevelNavigationStyles';

// Components
import { ActionMenu } from './actionMenu/actionMenu';
import BaseActionButton, {
  ACTION_BUTTON_VARIANTS,
  ACTION_BUTTON_ICONS,
} from 'src/shared/BaseActionButton/BaseActionButton';

export interface Props {
  isSearchResults: boolean;
  isOwned: boolean;
  onOpenCreateFolderModal: () => void;
  onOpenImportFileModal: () => void;
  onOpenUploadModal: () => void;
}

const SecondLevelNavigation = (props: Props): JSX.Element => {
  const { state } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const classes = useStyles({ ...theme });

  // Determinate if pod was opened for first time

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(true);

  const STORAGE_DISSMISSED_POD_INTROS_KEY = 'dissmissed-pod-intros';

  const wasPodIntroDissmised = (): boolean => {
    const savedDissmissedPodsIntros = localStorage.getItem(
      STORAGE_DISSMISSED_POD_INTROS_KEY
    );
    const parsed: string[] = JSON.parse(savedDissmissedPodsIntros);

    return parsed ? parsed.includes(state.podName) : false;
  };

  const dissmissPodIntro = (): void => {
    if (!wasPodIntroDissmised()) {
      const savedDissmissedPodsIntros = localStorage.getItem(
        STORAGE_DISSMISSED_POD_INTROS_KEY
      );
      const parsed: string[] = JSON.parse(savedDissmissedPodsIntros);
      if (parsed !== null) {
        parsed.push(state.podName);
        localStorage.setItem(
          STORAGE_DISSMISSED_POD_INTROS_KEY,
          JSON.stringify(parsed)
        );
      } else {
        localStorage.setItem(
          STORAGE_DISSMISSED_POD_INTROS_KEY,
          JSON.stringify([state.podName])
        );
      }
      setIsActionMenuOpen(false);
    }
  };

  // const isPodOpenedForFirstTime = (): boolean => {
  //   const doesPodHasNoDirs = () => state.dirs && state.dirs.length === 0;
  //   const doesPodHasNoEntries = () =>
  //     state.entries && state.entries.length === 0;

  //   // I assume that pod intro was dissmissed if user closed intro or if pod contains any dir or entry
  //   return (
  //     doesPodHasNoEntries() || doesPodHasNoDirs() || !wasPodIntroDissmised()
  //   );
  // };

  // useEffect(() => {
  //   setIsActionMenuOpen(isPodOpenedForFirstTime());
  // }, [state.podName]);

  // Choose messages for current state
  const [informations, setInformations] = useState<{
    title: string;
    caption: string;
  }>({
    title: 'Inventory',
    caption:
      'All your content including what you have shared with others marked with a',
  });

  useEffect(() => {
    if (props.isOwned) {
      if (props.isSearchResults) {
        setInformations({
          title: 'Search',
          caption:
            'All your content including what you have shared with others marked with a',
        });
      } else {
        setInformations({
          title: 'Inventory',
          caption:
            'All your content including what you have shared with others marked with a',
        });
      }
    } else {
      if (props.isSearchResults) {
        setInformations({
          title: 'Search Search file',
          caption:
            '(All links to content shared with you) Links Shared by Username',
        });
      } else {
        setInformations({
          title: 'Inbox (Read Only)',
          caption:
            '(All links to content shared with you) Links Shared by Username',
        });
      }
    }
  }, [props.isOwned, props.isSearchResults]);

  return (
    <>
      <div className={classes.secondLevelNavigation}>
        <div className={classes.left}>
          <div className={classes.titleWrapper}>
            <h1 className={classes.midHeader}>{informations.title}</h1>
          </div>
          <div className={classes.infoWrapper}>
            <PodInfoIcon className={classes.infoIcon} />
            <span className={classes.information}>{informations.caption}</span>
            <div
              className={classes.shareIcon}
              onClick={() => {
                setIsActionMenuOpen(true);
              }}
            >
              s
            </div>
          </div>
        </div>
        {!isActionMenuOpen && (
          <div className={classes.right}>
            <BaseActionButton
              icon={ACTION_BUTTON_ICONS.UPLOAD}
              variant={ACTION_BUTTON_VARIANTS.ACTION_OUTLINED}
              onClickCallback={() => props.onOpenUploadModal()}
            >
              Upload
            </BaseActionButton>
            <BaseActionButton
              icon={ACTION_BUTTON_ICONS.CREATE}
              variant={ACTION_BUTTON_VARIANTS.ACTION_OUTLINED_WITHOUT_TEXT}
              onClickCallback={() => props.onOpenImportFileModal()}
            />
            <BaseActionButton
              icon={ACTION_BUTTON_ICONS.FOLDER}
              variant={ACTION_BUTTON_VARIANTS.ACTION_OUTLINED_WITHOUT_TEXT}
              onClickCallback={() => props.onOpenCreateFolderModal()}
            />
          </div>
        )}
      </div>
      {isActionMenuOpen && (
        <ActionMenu
          isOwned={props.isOwned}
          onCreateMarkdownFile={() =>
            console.log('onCreateMarkdownFile clicked')
          }
          onCloseActionMenu={() => setIsActionMenuOpen(false)}
          onOpenCreateFolderModal={() => props.onOpenCreateFolderModal()}
          onOpenImportFileModal={() => props.onOpenImportFileModal()}
          onOpenUploadModal={() => {
            props.onOpenUploadModal();
          }}
        />
      )}
      <p className={classes.disclaimer}>
        Note: You cannot share contnet that you do not own
      </p>
    </>
  );
};

export default React.memo(SecondLevelNavigation);