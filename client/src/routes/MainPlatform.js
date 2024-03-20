import styled from "styled-components";
import Menu from "./Menu";
import NavBar from "../components/NavBar";
import HomeVideoPage from "../VideoPages/HomeVideoPage";


const Container = styled.div`
    display: flex;
`;

const Main = styled.div`
    flex:7;
`;
const Wrapper = styled.div``;

function MainComponent() {
    return (
        <Container>
                <Menu />
                    <Main>
                        <NavBar />
                        <Wrapper> 
                            <HomeVideoPage/>
                        </Wrapper>
                    </Main>
        </Container>
    )
}

export default MainComponent;