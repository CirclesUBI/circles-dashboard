import React, { Fragment } from 'react';

import Explorer from '~/components/Explorer';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import HealthViewer from '~/components/HealthViewer';
import View from '~/components/View';

const Dashboard = () => {
  return (
    <Fragment>
      <Header>
        <HealthViewer />
      </Header>

      <View>
        <Explorer />
      </View>

      <Footer />
    </Fragment>
  );
};

export default Dashboard;
