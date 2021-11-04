/**
 * @description friend list render component
 */

import { useEffect } from "react";
import { connect } from "react-redux";
import { avatarRoot } from "../../fetch";
// import { reqFriendList } from "../../fetch";
import { updateFriendListAction } from "../../store/action";
import { FriendListBox } from "./style";


// TODO:消息记录在列表中预览
function FriendList(props) {
    const { list, hanldeFriendList } = props;
    useEffect(() => {
        hanldeFriendList();
        
    }, [])
    return (
        <FriendListBox>
           
            {
                list.length === 0 ? null : (
                    list.map(item => {
                        return (
                            <div className="list-item" email={item.email} key={item.email}>
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
        list: state.friendList
    }
}


const stateToDispatch = dispatch => {
    return {
        async hanldeFriendList() {
            const action = await updateFriendListAction();
            dispatch(action);
        }
    }
}

export default connect(stateToProps, stateToDispatch)(FriendList);