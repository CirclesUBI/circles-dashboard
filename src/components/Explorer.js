import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';
import { useSelector } from 'react-redux';

import core from '~/services/core';
import web3 from '~/services/web3';
import { getEvents } from '~/services/events';

const Explorer = () => {
  const explorer = useSelector(state => state.explorer);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');

  function updateGraph() {
    const events = getEvents();

    // Add all nodes, remove duplicates
    const newNodes = events.reduce((acc, { data }) => {
      [data.canSendTo, data.user].forEach(id => {
        const foundDuplicate = acc.find(accItem => {
          return accItem.id === id;
        });

        if (!foundDuplicate) {
          acc.push({
            id,
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
          limitPercentage: data.limitPercentage,
        };
      }
    });

    // Create all links for the graph
    const newLinks = Object.keys(linksTable).reduce((acc, key) => {
      const { source, target, limitPercentage } = linksTable[key];

      // Remove all links which have 0 trust limit
      if (limitPercentage !== '0') {
        acc.push({
          source,
          target,
          label: limitPercentage,
        });
      }

      return acc;
    }, []);

    // Update graph data
    setNodes(newNodes);
    setLinks(newLinks);
  }

  useEffect(updateGraph, [explorer.updatedAt]);

  if (nodes.length === 0) {
    return null;
  }

  const data = {
    nodes,
    links,
  };

  const config = {
    directed: true,
    nodeHighlightBehavior: true,
    node: {
      color: 'lightgreen',
      size: 120,
      renderLabel: false,
      highlightStrokeColor: 'black',
    },
    link: {
      highlightColor: 'lightblue',
      renderLabel: true,
      type: 'CURVE_SMOOTH',
    },
  };

  const onClickNode = id => {
    setSelectedNode(id);
  };

  return (
    <div>
      <ExplorerDetail safeAddress={selectedNode} />

      <Graph
        config={config}
        data={data}
        id="trust-network"
        onClickNode={onClickNode}
      />
    </div>
  );
};

const ExplorerDetail = props => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const updateDetails = async () => {
      const currentBalance = await core.token.getBalance(props.safeAddress);
      setBalance(web3.utils.fromWei(currentBalance));
    };

    if (props.safeAddress) {
      updateDetails();
      setBalance(0);
    }
  }, [props.safeAddress]);

  if (!props.safeAddress) {
    return null;
  }

  return (
    <div>
      <p>Safe: {props.safeAddress}</p>
      <p>Balance: {balance} Circles</p>
    </div>
  );
};

ExplorerDetail.propTypes = {
  safeAddress: PropTypes.string,
};

export default Explorer;
