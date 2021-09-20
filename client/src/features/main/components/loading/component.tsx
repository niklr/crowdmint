
import { Typography } from '@mui/material';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';

export const MainLoading = () => {

  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Typography>Loading...</Typography>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
