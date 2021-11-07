import { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router";
import { configureReq, reqTokenCheck } from "../../fetch";
import { message, Spin } from 'antd';
import { MainWrapper } from "./style";
import { connect } from "react-redux";
import { userInfoAction } from "../../store/action";
import Wrapper from "./Wrapper";
import fetchEmit from "../../socket";
// import { getItem } from "../../localStorage";
function Main(props) {
    const { storeUserMsg } = props; 
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        configureReq();
        const fetchFun = async () => {
            const { code, data } = await reqTokenCheck();
            console.log("code ---", data);
            if (code) {
                history.replace('/sign');
            } else {
                setLoading(false);
                storeUserMsg(data);
                message.success("login successfully");
                
            }
        }

        fetchFun();
   
    }, [])

    // useEffect(() => {
    //     console.log("email --- ", email)
    //     fetchEmit("storeid", email);
    // }, [])
    return (
        <MainWrapper>
            {
                loading ? <Spin id="loading"/> : <Wrapper></Wrapper>
            }
        </MainWrapper>
    )
}

const stateToDispatch = dispatch => {
    return {
        storeUserMsg(data) {
            const action = userInfoAction(data);
            dispatch(action);
        }
    }
}




export default connect(null, stateToDispatch)(Main);