import React from 'react';
import styled from 'styled-components';

import Explorer from '~/components/Explorer';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import HealthViewer from '~/components/HealthViewer';
import View from '~/components/View';

const Dashboard = () => {
  return (
    <DashboardStyle>
      <Header>
        <HealthViewer />
      </Header>

      <View>
        <Explorer />
      </View>

      <Footer />
    </DashboardStyle>
  );
};

const DashboardStyle = styled.div`
  min-width: 360px;
  max-width: 1600px;

  margin: 0 auto;
`;

export default Dashboard;
