import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Networks } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { NetworkCheck } from '../../../account/components/network';
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
  const basename = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_BASENAME : process.env.REACT_APP_DEV_BASENAME;
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
      <HashRouter basename={basename}>
        <Header />
        <MainScroll>
          {!isNetworkSupported ? (
            <NetworkCheck />
          ) : (
            <Routes>
              <Route path="/projects/create" element={<ProjectCreate />} />
              <Route path="/projects/:address/edit" element={<ProjectEdit />} />
              <Route path="/projects/:address" element={<ProjectOverview />} />
              <Route path="/test" element={<Test />} />
              <Route path="/" element={<LatestProjects />} />
            </Routes>
          )}
        </MainScroll>
        <Footer />
      </HashRouter>
    </MainWrapper>
  )
}
