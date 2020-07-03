import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Graph } from 'react-d3-graph';
import { useSelector } from 'react-redux';

import core from '~/services/core';
import web3 from '~/services/web3';
import { getEvents } from '~/services/events';

const Explorer = () => {
  const explorer = useSelector((state) => state.explorer);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');

  function updateGraph() {
    const events = getEvents();

    // Add all nodes, remove duplicates
    const newNodes = events.reduce((acc, { data }) => {
      [data.canSendTo, data.user].forEach((id) => {
        const foundDuplicate = acc.find((accItem) => {
          return accItem.id === id;
        });

        if (!foundDuplicate) {
          acc.push({
            id,
            label: id.slice(0, 10),
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
    const newLinks = Object.keys(linksTable).reduce((acc, key) => {
      const { source, target, limit, limitPercentage } = linksTable[key];

      const limitFormat = web3.utils.fromWei(limit, 'ether').split('.')[0];

      // Remove all links which have 0 trust limit
      if (limitPercentage !== '0') {
        acc.push({
          source,
          target,
          label: `${limitFormat} (${limitPercentage}%)`,
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
    width: 1350,
    height: 800,
    directed: true,
    nodeHighlightBehavior: true,
    d3: {
      alphaTarget: 0,
      gravity: -1000,
      linkLength: 220,
      linkStrength: 0.1,
    },
    node: {
      color: 'lightgreen',
      size: 300,
      renderLabel: true,
      labelProperty: 'label',
      highlightStrokeColor: 'black',
    },
    link: {
      highlightColor: 'lightblue',
      renderLabel: true,
      type: 'CURVE_SMOOTH',
    },
  };

  const onClickNode = (id) => {
    setSelectedNode(id);
  };

  return (
    <ExplorerStyle>
      <ExplorerDetail safeAddress={selectedNode} />

      <Graph
        config={config}
        data={data}
        id="trust-network"
        onClickNode={onClickNode}
      />
    </ExplorerStyle>
  );
};

const ExplorerDetail = (props) => {
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
    <ExplorerDetailStyle>
      <p>Safe: {props.safeAddress}</p>
      <p>Balance: {balance} Circles</p>
    </ExplorerDetailStyle>
  );
};

ExplorerDetail.propTypes = {
  safeAddress: PropTypes.string,
};

const ExplorerStyle = styled.div`
  position: relative;

  background-color: #efefef;
`;

const ExplorerDetailStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;

  background-color: #999;

  p {
    margin: 0;
  }
`;

export default Explorer;
