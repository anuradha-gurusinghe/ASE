import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import { Container, Grid } from '@mui/material';
import AllCategoryTable from './AllCategoryTable';
import { useState } from 'react';
import { CategoryDetails } from 'src/models/Category';


const AllCategories = () => {
    
    const [AllCategories, setAllCategories] = useState(
        [] as CategoryDetails[]
      );
    return (
        <>
            <Helmet>
                <title>All Categories - Applications</title>
            </Helmet>

            
      <PageTitleWrapper>
        <>
          <PageHeader
            AllCategories ={AllCategories}
            setAllCategories={setAllCategories}
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
                        AllCategories={AllCategories}
                        setAllCategories={setAllCategories}/> 
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    )
}

export default AllCategories;