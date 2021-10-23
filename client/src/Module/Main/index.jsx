import { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router";
import { configureReq, reqTokenCheck } from "../../fetch";
import { message, Spin } from 'antd';
import { MainWrapper } from "./style";
function Main() {
    
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        configureReq();
        const fetchFun = async () => {
            const { code } = await reqTokenCheck();
            if (code) {
                history.replace('/sign');
            } else {
                setLoading(false);
                message.success("登陆成功!");
                
            }
        }

        fetchFun();
    }, [])


    return (
        <MainWrapper>
            {
                loading ? <Spin id="loading"/> : <div>this is Main Page</div>
            }
        </MainWrapper>
    )
}

export default Main;