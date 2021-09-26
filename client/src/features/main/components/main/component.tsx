import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Networks } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { NetworkCheck } from '../../../account/components/network';
import { Hero } from '../../../common/components/hero';
import { Test } from '../../../common/components/test';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';
import { ProjectCreate } from '../../../project/components/create';
import { ProjectEdit } from '../../../project/components/edit';
import { LatestProjects } from '../../../project/components/latest';
import { ProjectOverview } from '../../../project/components/overview';

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context();
  const [isNetworkSupported, setIsNetworkSupported] = React.useState(true);

  SnackbarUtil.snackbar = useSnackbar();

  const { chainId } = context;

  useEffect(() => {
    if (chainId) {
      const network = Networks.find(e => e.id === chainId);
      setIsNetworkSupported(!!network);
    }
  }, [chainId]);

  return (
    <MainWrapper>
      <HashRouter>
        <Header />
        <MainScroll>
          {!isNetworkSupported ? (
            <NetworkCheck />
          ) : (
            <Switch>
              <Route path="/projects/create">
                <ProjectCreate />
              </Route>
              <Route path="/projects/:id/edit">
                <ProjectEdit />
              </Route>
              <Route path="/projects/:id">
                <ProjectOverview />
              </Route>
              <Route path="/test">
                <Test />
              </Route>
              <Route path="/">
                <Hero></Hero>
                <LatestProjects></LatestProjects>
              </Route>
            </Switch>
          )}
        </MainScroll>
        <Footer />
      </HashRouter>
    </MainWrapper>
  )
}
