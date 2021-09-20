import { HashRouter, Route, Switch } from 'react-router-dom';
import { Hero } from '../../../common/components/hero';
import { Test } from '../../../common/components/test';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';

export const Main: React.FC = (props: any) => {
  return (
    <>
      <MainWrapper>
        <HashRouter>
          <Header />
          <MainScroll>
            <Switch>
              <Route path="/test">
                <Test />
              </Route>
              <Route path="/">
                <Hero></Hero>
              </Route>
            </Switch>
          </MainScroll>
          <Footer />
        </HashRouter>
      </MainWrapper>
    </>
  )
}
