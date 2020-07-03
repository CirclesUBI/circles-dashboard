import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import HealthViewerField from '~/components/HealthViewerField';
import HealthViewerService from '~/components/HealthViewerService';
import StatusIndicator from '~/components/StatusIndicator';
import web3 from '~/services/web3';

const HealthViewer = () => {
  const health = useSelector((state) => state.health);

  return (
    <HealthViewerStyle>
      <HealthViewerService
        isActive={health.graph.isReachable}
        label="Graph Node"
      >
        <HealthViewerField label="Synced">
          <StatusIndicator isActive={health.graph.isSynced} />
        </HealthViewerField>

        <HealthViewerField label="Failed">
          <StatusIndicator isActive={!health.graph.isFailed} />
        </HealthViewerField>

        <HealthViewerField label="Entity Count">
          {health.graph.entityCount}
        </HealthViewerField>

        <HealthViewerField label="Blocks">
          {health.graph.latestEthereumBlockNumber} /{' '}
          {health.graph.totalEthereumBlocksCount}
        </HealthViewerField>
      </HealthViewerService>

      <HealthViewerService
        isActive={health.relay.isReachable}
        label="Relayer Service"
      >
        <HealthViewerField label="Funder Balance">
          {web3.utils.fromWei(health.relay.currentBalance)} ETH
        </HealthViewerField>
      </HealthViewerService>

      <HealthViewerService isActive={health.api.isReachable} label="API" />

      <HealthViewerService
        isActive={health.app.isReachable}
        label="Client Website"
      />
    </HealthViewerStyle>
  );
};

const HealthViewerStyle = styled.div`
  display: flex;

  justify-content: space-between;
`;

export default HealthViewer;
