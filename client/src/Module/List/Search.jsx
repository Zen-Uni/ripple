/**
 * @description component about search function 
 */

import { useRef, useState } from "react";
import { avatarRoot, findUser, reqAddUser } from "../../fetch";
import { ResBoxWrapper, ResWrapper, SearchWrapper } from "./style";
import { message } from 'antd';
import fetchEmit from "../../socket";
function Search() {
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
        const { code, msg, data } = await reqAddUser({to});
        console.log(data);
        if (!code) {
            message.success(msg);
            console.log("sid --- ", data.sid);
            fetchEmit("friend-request", data.sid);
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
            {/* TODO: 添加好友前端 */}
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
                        ) : <div className="no-user">找不到此用户</div>
                    }
                </ResBoxWrapper> : null
            }
        </SearchWrapper>
    )
}

export default Search;