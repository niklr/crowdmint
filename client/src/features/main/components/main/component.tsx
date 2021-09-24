import React, { useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Networks } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { NetworkCheck } from '../../../account/components/network';
import { Hero } from '../../../common/components/hero';
import { Test } from '../../../common/components/test';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';
import { ProjectEdit } from '../../../project/components/edit';
import { ProjectList } from '../../../project/components/list';
import { ProjectOverview } from '../../../project/components/overview';

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context();
  const [isNetworkSupported, setIsNetworkSupported] = React.useState(true);

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
                <ProjectList></ProjectList>
              </Route>
            </Switch>
          )}
        </MainScroll>
        <Footer />
      </HashRouter>
    </MainWrapper>
  )
}
