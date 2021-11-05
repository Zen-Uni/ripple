/**
 * @description friend list render component
 */

import { useEffect } from "react";
import { connect } from "react-redux";
import { avatarRoot, reqMessageHistory } from "../../fetch";
// import { reqFriendList } from "../../fetch";
import { getMessageHistoryAction, updateAvatarAction, updateChatAvatarAction, updateChatUsernameAction, updateCurrentChatAction, updateFriendListAction } from "../../store/action";
import { FriendListBox } from "./style";


// TODO:消息记录在列表中预览
function FriendList(props) {
    const { list, hanldeFriendList, handleCurrent, user, handleGetMessage, handleChatAvatar, handleChatUsername } = props;
    useEffect(() => {
        hanldeFriendList();
        
    }, [])

    const handleChatObj = async(index, email, avatar, username) => {
        // TODO: 点击效果
        // list.map(item => item.checked = false);
        // list[index].checked = true;
        
        handleCurrent(email);

        const res = await reqMessageHistory({
            email: user,
            femail: email
        });
        
        handleGetMessage(res.data.message);
        handleChatAvatar(avatar);
        handleChatUsername(username);
    }

    return (
        <FriendListBox>
           
            {
                list.length === 0 ? null : (
                    list.map((item, index) => {
                        return (
                            <div className={item.checked ? "list-item item-active" : "list-item"} email={item.email} key={item.email}
                                onClick={handleChatObj.bind(this, index, item.email, item.avatar, item.username)}
                            >
                                <div className="item-avatar" style={{
                                    backgroundImage: `url(${avatarRoot + item.avatar})`
                                }}></div>
                                <div className="item-text">
                                    <div className="item-username">{item.username}</div>
                                </div>
                            </div>
                        )
                    })
                )
            }
        </FriendListBox>
    )
}


const stateToProps = state => {
    return {
        list: state.friendList,
        user: state.email
    }
}


const stateToDispatch = dispatch => {
    return {
        async hanldeFriendList() {
            const action = await updateFriendListAction();
            dispatch(action);
        },
        handleCurrent(data) {
            const action = updateCurrentChatAction(data);
            dispatch(action);
        },
        handleGetMessage(data) {
            const action = getMessageHistoryAction(data);
            dispatch(action);
        },
        handleChatAvatar(data) {
            const action = updateChatAvatarAction(data);
            dispatch(action);
        },
        handleChatUsername(data) {
            const action = updateChatUsernameAction(data);
            dispatch(action);
        }
    }
}

export default connect(stateToProps, stateToDispatch)(FriendList);