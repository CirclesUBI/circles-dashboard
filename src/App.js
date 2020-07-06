import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import Box from '@material-ui/core/Box';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState, useMemo, useEffect } from 'react';
import TimelineIcon from '@material-ui/icons/Timeline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Network from '~/views/Network';
import NotFound from '~/views/NotFound';
import Statistics from '~/views/Statistics';
import Status from '~/views/Status';
import logo from '~/assets/logo.png';
import useStyles from '~/styles';
import { initializeApp, checkAppState } from '~/store/app/actions';

import pkg from '../package.json';

const CHECK_APP_FREQUENCY = 30 * 1000;
const CIRCLES_URL = 'https://joincircles.net';

const views = [
  {
    title: 'Network',
    path: '/',
    icon: BlurOnRoundedIcon,
  },
  {
    title: 'Statistics',
    path: '/statistics',
    icon: TimelineIcon,
  },
  {
    title: 'Status',
    path: '/status',
    icon: FavoriteIcon,
  },
];

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
      await dispatch(checkAppState());
    };

    initialize();

    window.setInterval(async () => {
      await dispatch(checkAppState());
    }, CHECK_APP_FREQUENCY);
  };

  useEffect(onAppStart, []);

  const title = useMemo(() => {
    const current = views.find((view) => view.path === location.pathname);
    return current ? current.title : '404';
  }, [location.pathname]);

  return (
    <div className={classes.root}>
      <AppBar
        className={clsx(classes.appBar, isDrawerOpen && classes.appBarShift)}
        position="absolute"
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            className={clsx(
              classes.menuButton,
              isDrawerOpen && classes.menuButtonHidden,
            )}
            color="inherit"
            edge="start"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            className={classes.title}
            color="inherit"
            component="h1"
            noWrap
            variant="h6"
          >
            Circles - {title}
          </Typography>

          <Avatar alt="Circles" className={classes.small} src={logo} />
        </Toolbar>
      </AppBar>

      <Drawer
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !isDrawerOpen && classes.drawerPaperClose,
          ),
        }}
        open={isDrawerOpen}
        variant="permanent"
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />

        <List>
          <AppListItems />
        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container className={classes.container} maxWidth="lg">
          <Switch>
            <Route component={Network} exact path="/" />
            <Route component={Statistics} path="/statistics" />
            <Route component={Status} path="/status" />
            <Route component={NotFound} />
          </Switch>

          <Box pt={4}>
            <Typography align="center" color="textSecondary" variant="body2">
              <Link color="inherit" href={CIRCLES_URL} target="_blank">
                Circles
              </Link>
              {' - '}v{pkg.version}
            </Typography>
          </Box>
        </Container>
      </main>
    </div>
  );
};

const AppListItems = () => {
  const classes = useStyles();
  const location = useLocation();

  return views.map((view) => {
    return (
      <ListItem
        className={classes.listItem}
        component={RouterLink}
        key={view.title}
        selected={location.pathname === view.path}
        to={view.path}
      >
        <ListItemIcon>
          <view.icon />
        </ListItemIcon>

        <ListItemText primary={view.title} />
      </ListItem>
    );
  });
};

export default App;
