import Box from '@material-ui/core/Box';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import ForceGraph2D from 'react-force-graph-2d';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SendIcon from '@material-ui/icons/Send';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { SizeMe } from 'react-sizeme';
import { checkExplorerState } from '~/store/explorer/actions';
import { useSelector, useDispatch } from 'react-redux';

import useStyles, { colors } from '~/styles';
import web3 from '~/services/web3';
import { getEvents } from '~/services/events';

const NODE_REL_SIZE = 6;
const RECENTER_DURATION_MS = 500;

const nodesCache = {};

const Explorer = ({ selectedSafeAddress, selectedTransfer, ...props }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const explorer = useSelector((state) => state.explorer);
  const ref = useRef();

  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!explorer.isReady) {
      handleSync();
    }
  }, []);

  useEffect(() => {
    if (selectedSafeAddress && ref.current) {
      const node = nodesCache[selectedSafeAddress];

      if (node) {
        ref.current.centerAt(node.x, node.y, RECENTER_DURATION_MS);
      }
    }
  }, [selectedSafeAddress]);

  const handleSync = () => {
    dispatch(checkExplorerState());
  };

  const handleRecenter = () => {
    if (!ref.current) {
      return;
    }

    ref.current.zoomToFit(RECENTER_DURATION_MS);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNodeClick = (node) => {
    props.onSafeSelected(node.id);
  };

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);

      if (node.neighbors) {
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      }

      if (node.links) {
        node.links.forEach((link) => highlightLinks.add(link));
      }

      setHoverNode(node.id);
    } else {
      setHoverNode(null);
    }

    updateHighlight();
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const renderNodeOutline = useCallback(
    (node, ctx) => {
      // This is a trick to get the node x|y positions for later use
      nodesCache[node.id] = node;

      if (highlightNodes.has(node) || node.id === selectedSafeAddress) {
        // Draw outline circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_REL_SIZE * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle =
          node.id === hoverNode ? colors.primary : colors.alternate;

        if (node.id === selectedSafeAddress) {
          ctx.fillStyle = colors.secondary;
        }

        ctx.fill();
      }

      if (selectedTransfer) {
        let text = '';

        if (node.id === selectedTransfer.from) {
          text = 'S';
        } else if (node.id === selectedTransfer.to) {
          text = 'R';
        }

        ctx.fillStyle = colors.primary;
        ctx.fillText(
          text,
          node.x + 1 - NODE_REL_SIZE / 2,
          node.y - NODE_REL_SIZE * 2,
        );
      }
    },
    [hoverNode, selectedSafeAddress, selectedTransfer],
  );

  const renderLinkWidth = useCallback(
    (link) => {
      const isTransferLink =
        selectedTransfer &&
        selectedTransfer.transactionsPath.find((transaction) => {
          return (
            transaction.from === link.source.id &&
            transaction.to === link.target.id
          );
        });

      return isTransferLink ? 4 : highlightLinks.has(link) ? 2 : 0;
    },
    [highlightLinks, selectedTransfer],
  );

  const renderLinkLabel = useCallback(
    (link) => {
      const transferLinks =
        selectedTransfer &&
        selectedTransfer.transactionsPath.filter((transaction) => {
          return (
            transaction.from === link.source.id &&
            transaction.to === link.target.id
          );
        });

      return transferLinks.length > 0
        ? transferLinks
            .map((transferLink) => {
              const { step, value } = transferLink;
              const tokenOwnerAddress = transferLink.tokenOwnerAddress.slice(
                0,
                16,
              );

              return `${step}: ${value} (${tokenOwnerAddress}..)`;
            })
            .join(' and ')
        : link.label;
    },
    [highlightLinks, selectedTransfer],
  );

  const getNodeColor = useCallback(
    (node) => {
      if (selectedTransfer) {
        const isTransferNode = selectedTransfer.transactionsPath.find(
          (transaction) => {
            return transaction.from === node.id || transaction.to === node.id;
          },
        );

        return isTransferNode ? colors.primary : colors.alternate;
      }

      return colors.alternate;
    },
    [selectedTransfer],
  );

  const data = useMemo(() => {
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
            label: `${id.slice(0, 16)}...`,
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
          label: `Capacity: ${limitFormat} Circles (${limitPercentage}% trust)`,
        });
      }

      return acc;
    }, []);

    links.forEach((link) => {
      const source = nodes.find((node) => node.id === link.source);
      const target = nodes.find((node) => node.id === link.target);

      !source.neighbors && (source.neighbors = []);
      !target.neighbors && (target.neighbors = []);
      source.neighbors.push(target);
      target.neighbors.push(source);

      !source.links && (source.links = []);
      !target.links && (target.links = []);
      source.links.push(link);
      target.links.push(link);
    });

    return {
      nodes: nodes.reduce((acc, node) => {
        // Remove nodes without links
        if (node.neighbors && node.neighbors.length > 0) {
          acc.push(node);
        }

        return acc;
      }, []),
      links,
    };
  }, [explorer.updatedAt]);

  return (
    <Box
      className={clsx(
        classes.explorer,
        isFullscreen && classes.explorerFullscreen,
      )}
    >
      <Box className={classes.explorerBar} display="flex">
        <Box className={classes.explorerBarContent} flexGrow={1}>
          <Tooltip arrow title="Toggle fullscreen">
            <Fab
              color="secondary"
              size="small"
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Fab>
          </Tooltip>

          <Tooltip arrow title="Fit network to screen">
            <Fab color="secondary" size="small" onClick={handleRecenter}>
              <CenterFocusStrongIcon />
            </Fab>
          </Tooltip>

          <Tooltip arrow title="Sync with latest data">
            <span>
              <Fab
                color="secondary"
                disabled={explorer.isLoading}
                size="small"
                onClick={handleSync}
              >
                <SyncIcon />
              </Fab>
            </span>
          </Tooltip>
        </Box>

        <Box
          alignItems="center"
          className={classes.explorerBarContent}
          display="flex"
        >
          {selectedTransfer && (
            <Chip
              color="primary"
              icon={<SendIcon fontSize="small" />}
              label={`Value: ${selectedTransfer.value}, Max: ${selectedTransfer.maximumFlow}, Steps: ${selectedTransfer.transactionsPath.length}`}
              onDelete={props.onTransferReset}
            />
          )}
        </Box>
      </Box>

      <SizeMe
        monitorHeight
        render={({ size }) => {
          if (explorer.isLoading) {
            return (
              <Box
                alignItems="center"
                display="flex"
                justifyContent="center"
                style={{ height: '100%' }}
              >
                <CircularProgress />
              </Box>
            );
          }

          return (
            <ForceGraph2D
              graphData={data}
              height={isFullscreen ? window.screen.innerHeight : 800}
              linkCurvature={0.5}
              linkDirectionalArrowLength={5}
              linkDirectionalArrowRelPos={1}
              linkDirectionalParticleWidth={renderLinkWidth}
              linkDirectionalParticles={4}
              linkLabel={renderLinkLabel}
              linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
              nodeCanvasObject={renderNodeOutline}
              nodeCanvasObjectMode={() => 'before'}
              nodeColor={getNodeColor}
              nodeLabel="label"
              nodeRelSize={NODE_REL_SIZE}
              ref={ref}
              showNavInfo={false}
              style={{ overflow: 'hidden' }}
              width={size.width}
              onLinkHover={handleLinkHover}
              onNodeClick={handleNodeClick}
              onNodeDragEnd={(node) => {
                // Fix dragged nodes
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
              }}
              onNodeHover={handleNodeHover}
            />
          );
        }}
      />
    </Box>
  );
};

Explorer.propTypes = {
  onSafeSelected: PropTypes.func.isRequired,
  onTransferReset: PropTypes.func.isRequired,
  selectedSafeAddress: PropTypes.string,
  selectedTransfer: PropTypes.object,
};

export default Explorer;
