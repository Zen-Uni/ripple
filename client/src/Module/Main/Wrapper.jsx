/**
 * @description Main page's style wrapper component
 */


import Content from "../Content";
import List from "../List";
import Nav from "../Nav";
import { ChatWrapper, ContainerWrapper } from "./style";


// TODO: front end UI
function Wrapper() {
    return (
        <ContainerWrapper>
            <ChatWrapper>
                <Nav/>
                <List/>
                <Content></Content>
            </ChatWrapper>
        </ContainerWrapper>
    )
}


export default Wrapper;