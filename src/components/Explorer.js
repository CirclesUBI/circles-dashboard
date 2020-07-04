import Fab from '@material-ui/core/Fab';
import ForceGraph2D from 'react-force-graph-2d';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useState } from 'react';
import SyncIcon from '@material-ui/icons/Sync';
import clsx from 'clsx';
import { checkExplorerState } from '~/store/explorer/actions';
import { useSelector, useDispatch } from 'react-redux';

import useStyles from '~/styles';
import web3 from '~/services/web3';
import { getEvents } from '~/services/events';

const Explorer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const explorer = useSelector((state) => state.explorer);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    dispatch(checkExplorerState());
  }, []);

  const handleSync = () => {
    dispatch(checkExplorerState());
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNodeClick = (node) => {
    props.onSafeSelected(node.id);
  };

  function updateGraph() {
    const events = getEvents();

    // Add all nodes, remove duplicates
    const nodes = events.reduce((acc, { data }) => {
      [data.canSendTo, data.user].forEach((id) => {
        const foundDuplicate = acc.find((accItem) => {
          return accItem.id === id;
        });

        if (!foundDuplicate) {
          acc.push({
            id,
            label: id,
          });
        }
      });

      return acc;
    }, []);

    // Organize all links in a hash table to find out
    // which is the last trust limit of each connection
    const linksTable = {};

    events.forEach(({ data }) => {
      const key = `${data.user}${data.canSendTo}`;

      if (key in linksTable) {
        linksTable[key].limitPercentage = data.limitPercentage;
      } else {
        linksTable[key] = {
          source: data.user,
          target: data.canSendTo,
          limit: data.limit,
          limitPercentage: data.limitPercentage,
        };
      }
    });

    // Create all links for the graph
    const links = Object.keys(linksTable).reduce((acc, key) => {
      const { source, target, limit, limitPercentage } = linksTable[key];
      const limitFormat = web3.utils.fromWei(limit, 'ether').split('.')[0];

      // Remove all edges which have 0 trust limit
      if (limitPercentage !== '0') {
        acc.push({
          source,
          target,
          label: `${limitFormat} Circles (${limitPercentage}%)`,
        });
      }

      return acc;
    }, []);

    return {
      nodes,
      links,
    };
  }

  const data = useMemo(updateGraph, [explorer.updatedAt]);

  if (data.nodes.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        classes.explorer,
        isFullscreen && classes.explorerFullscreen,
      )}
    >
      <div className={classes.explorerBar}>
        <Fab color="secondary" size="small" onClick={handleFullscreenToggle}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </Fab>

        <Fab color="secondary" size="small" onClick={handleSync}>
          <SyncIcon />
        </Fab>
      </div>

      <ForceGraph2D
        graphData={data}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        linkLabel="label"
        linkOpacity={1}
        nodeColor={(node) =>
          node.id === props.selectedSafeAddress ? 'green' : 'red'
        }
        nodeLabel="label"
        showNavInfo={false}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

Explorer.propTypes = {
  onSafeSelected: PropTypes.func.isRequired,
  selectedSafeAddress: PropTypes.string,
};

export default Explorer;
