import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PreHomePage from './components/PreHomePage';
// import MainComponent from './routes/MainPlatform';

import HomeVideoPage from "../src/VideoPages/HomeVideoPage";
import VideoDisplayPage from "../src/VideoPages/VideoDisplayPage";

import styled from "styled-components";
import Menu from "../src/routes/Menu";
import NavBar from "../src/components/NavBar";
// import SingIn from './routes/SingIn';
import ContactUs from './routes/ContactUs';
import Signup from './routes/Signup';
import SearchVideoPage from './VideoPages/SearchVideoPage';
import TagsVideos from './VideoPages/TagsVideos';
import Profile from './components/Profile';

import 'bootstrap/dist/css/bootstrap.min.css';
import EditVideoDisplay from './VideoPages/EditVideoDisplay';


const Container = styled.div`
    display: flex;
`;

const Main = styled.div`
    flex:7;
`;

const Wrapper = styled.div``;

function App() {
  
  return (


    <Router>
      
      {/* <Routes>
        <Route path="/mainplatform" element={<PreHomePage />} />
      </Routes>  */}

        <Container>

          <Menu />
          <Main>
            <NavBar />
            <Wrapper>
              <Routes>
              <Route path='/'  >
                <Route index element={<HomeVideoPage type="randomvideo" />} />
                <Route path='trendvideo' element={<HomeVideoPage type="trendvideo" />} />
                <Route path='subscribevideos' element={<HomeVideoPage type="subscribevideos" />} />
                <Route path="search" element={<SearchVideoPage />} />
                <Route path='music' element={<TagsVideos tags='music' />}  />
                <Route path='sports' element={<TagsVideos tags='sports' />}  />
                <Route path='gaming' element={<TagsVideos tags='gaming' />}  />
                <Route path='movies' element={<TagsVideos tags='movie' />}  />
                <Route path='news' element={<TagsVideos tags='news' />}  />
                <Route path='education' element={<TagsVideos tags='education' />}  />
                <Route path='video'>
                  <Route path=":id" element={<VideoDisplayPage />} />
                </Route>
                <Route path='editVideo'>
                  <Route path=":id" element={<EditVideoDisplay />} />
                </Route>
                <Route path="/mainplatform" element={<PreHomePage />} />
                {/* <Route path='/singin' element={<SingIn/>}/> */}
                <Route path='/singin' element={<Signup />}/>
                <Route path='/contactus' element={<ContactUs/>}/>
                <Route path='/profile' element={<Profile />} />
              </Route>

              </Routes>
            </Wrapper>
          </Main>
        </Container>

    </Router>

  );
}

export default App;
