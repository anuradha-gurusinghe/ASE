import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import { Container, Grid } from '@mui/material';
import AllCategoryTable from './AllIconTable';
import { useState } from 'react';
import { IconDetails } from 'src/models/Icon';


const AllIcons = () => {
    
    const [AllIcons, setAllIcons] = useState(
        [] as IconDetails[]
      );
    return (
        <>
            <Helmet>
                <title>All Categories - Applications</title>
            </Helmet>

            
      <PageTitleWrapper>
        <>
          <PageHeader
            AllIcons ={AllIcons}
            setAllIcons={setAllIcons}
          />
        </>
      </PageTitleWrapper>

            <Container maxWidth="lg">
                <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                >
                    <Grid item xs={12}>
                        <AllCategoryTable  
                        AllIcons ={AllIcons}
                        setAllIcons={setAllIcons}/> 
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    )
}

export default AllIcons;