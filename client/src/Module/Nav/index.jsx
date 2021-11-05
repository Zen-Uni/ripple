/**
 * @description nav bar component and styles
 */

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavWrapepr } from "./style";
import { avatarRoot, reqAddList, reqMakeFriend } from '../../fetch'
import { handlePostImg } from "../../utils/postImg";
import { updateAvatarAction, updateFriendListAction } from "../../store/action";
import { removeToken } from "../../localStorage";
import { message } from "antd";



function Nav(props) {
    const { userAvatar, updateAvatar, haveMsg, handleFriendList } = props;
    const [reqList, setReqList] = useState(null);
    const [showList, setShowList] = useState(false);
    // const [haveMsg, setHaveMsg] = useState(false);
    useEffect(() => {
        // console.log(avatarRoot + userAvatar)
        
    })
    // useEffect(() => {
    //     const avatarDom = document.getElementById("id")
    //     avatarDom.style.backgroundImage = `url(${avatarRoot} + ${userAvatar})`
    // })  

    const handleRemoveToken = () => {
        removeToken();
        window.location.href = "/"
    }

    const handleAddList = async() => {
        const res = await reqAddList();
        const { data } = res;
        console.log(res);
        setReqList(data.list);
        setShowList(true);
    }

    const handleCloseList = (e) => {
        e.stopPropagation();
        setShowList(false);
    }

    const handleMakeFriend = async (email) => {
        const { code, msg } = await reqMakeFriend({email});
        if (code === 0) {
            message.success(msg);
            handleAddList();
            await handleFriendList();
        }
   
    }

    return (
        <NavWrapepr>
            <div id="avatar" style={{
                backgroundImage: `url(${avatarRoot+userAvatar})`
            }}>
                <input type="file" onChange={(e) => handlePostImg(e, updateAvatar)}/>
            </div>


            {/* message button */}
            <div id="tip" onClick={handleAddList}>
                {
                    haveMsg ? <div className="have-message"></div> : null
                }
                <i className="iconfont icon-xiaoxi"></i>
                {
                    showList ? (
                        <div id="req-list">
                            <div id="req-list-cancel" onClick={handleCloseList}>
                                <i className="iconfont icon-quxiao"></i>
                            </div>
                            <div className="req-list-title">Friend Request List</div>
                            <div className="req-item-box" onClick={e => e.stopPropagation()}>
                            {
                                reqList.map((item) => {
                                    return (
                                        <div className="req-item" key={item.eamil + item.username}>
                                            <div className="req-item-avatar" 
                                                style={{
                                                    backgroundImage: `url(${avatarRoot+item.avatar})`
                                                }}
                                            ></div>
                                            <div className="req-item-username">{item.username}</div>
                                            <div className="req-item-select">
                                                <i className="iconfont icon-jujue"></i>
                                                <i className="iconfont icon-tongyi1" onClick={handleMakeFriend.bind(this,item.email)}></i>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    ) : null
                }
            </div>

            <div id="logout" onClick={handleRemoveToken}>
                <i className="iconfont icon-Logout"></i>
            </div>

{/* TODO: 处理请求已读问题 */}

           
       
        </NavWrapepr>
    )
}

const stateToProps = state => {
    return {
        userAvatar: state.avatar,
        haveMsg: state.req
    }
}

const stateToDispatch = dispatch => {
    return {
        updateAvatar(data) {
            const action = updateAvatarAction(data);
            dispatch(action);
        },
        async handleFriendList() {
            const action = await updateFriendListAction();
            dispatch(action);
        }
    }
}

export default connect(stateToProps, stateToDispatch)(Nav);
