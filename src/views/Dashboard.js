import React, { Fragment } from 'react';

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
        <h1>Hello, Circles!</h1>
      </View>

      <Footer />
    </Fragment>
  );
};

export default Dashboard;
