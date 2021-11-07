/**
 * @description component about search function 
 */

import { useRef, useState } from "react";
import { avatarRoot, findUser, reqAddUser } from "../../fetch";
import { ResBoxWrapper, ResWrapper, SearchWrapper } from "./style";
import { message } from 'antd';
import fetchEmit from "../../socket";
import { connect } from "react-redux";
function Search(props) {
    const { email } = props;
    const [resBox, setresBox] = useState(false);
    const [msg, setMsg] = useState(false);
    const [userAvatar, setUserAvatar] = useState("");
    const [username, setUsername] = useState("");
    const [to, setTo] = useState("");
    const inputEl = useRef(null);
    const handleSearch = async e => {
        if (e.keyCode === 13) {
            setresBox(true);
            const email = inputEl.current.value;
            console.log("email --- ", email);
            const {code, data} = await findUser({email});
            console.log(data);
            if (!code) {
                const { username, avatar, email } = data;
                setUserAvatar(avatar);
                setUsername(username);
                setTo(email);
                setMsg(true);
            } else {
                setMsg(false);
            }
        }
    }

    const handleAddUser = async() => {
        if (email === to) {
            message.warning("不能添加自己为好友");
            return;
        }
        const { code, msg, data } = await reqAddUser({to});
        console.log(msg);
        if (!code) {
            message.success(msg);
            console.log("sid --- ", data.sid);
            fetchEmit("friend-request", data.sid);
        } else {
            message.warning(msg);
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            setresBox(false);
        }, 300)
    }

    return (
        <SearchWrapper>
            <input type="text" id="search-input" 
                onKeyDown={(e) => handleSearch(e)} 
                ref={inputEl}
                onBlur={handleBlur}
            />
            {
                resBox ? <ResBoxWrapper>
                    {   
                        msg ? (
                            <ResWrapper>
                                <div className="avatar" style={{
                                    backgroundImage: `url(${avatarRoot + userAvatar})`
                                }}></div>
                                <div className="username">{username}</div>
                                <div id="add-friend" onClick={handleAddUser}>+</div>
                            </ResWrapper>
                        ) : <div className="no-user">The user could not be found</div>
                    }
                </ResBoxWrapper> : null
            }
        </SearchWrapper>
    )
}

const stateToProps = state => {
    return {
        email: state.email
    }
}

export default connect(stateToProps, null)(Search);