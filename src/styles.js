import { makeStyles } from '@material-ui/core/styles';

const DRAWER_WIDTH = 240;

export const colors = {
  primary: '#ff9933',
  secondary: '#cc1e66',
  alternate: '#47cccb',
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  accordionDetails: {
    display: 'block',
  },
  listItem: {
    color: theme.palette.text.secondary,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  chipGroup: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  paperNetwork: {
    padding: theme.spacing(0),
    overflow: 'hidden',
  },
  explorer: {
    position: 'relative',
    height: '800px',
  },
  explorerFullscreen: {
    position: 'fixed',
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1400,
    backgroundColor: '#fff',
  },
  explorerBar: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 500,
    pointerEvents: 'none',
  },
  explorerBarContent: {
    '& > *': {
      margin: theme.spacing(0.5),
      pointerEvents: 'all',
    },
  },
}));

export default useStyles;
