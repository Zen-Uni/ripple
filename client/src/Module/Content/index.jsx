/**
 * @description Content component and styles
 */



import { ChatBox, ContentWrapper, MessageBox } from "./style";
import { connect } from 'react-redux';
import { useEffect, useRef } from "react";
import fetchEmit from "../../socket";
import { avatarRoot } from "../../fetch";
import { updateMessage } from "../../store/action";
function Content(props) {
    const { userName, email, femail, message, userAvatar, chatAvatar, handleUpdateMessage } = props;

    const inputEl = useRef(null);

    const handleChating = (e) => {
        // TODO: shift + enter 换行
        if (e.keyCode === 13) {
            const el = document.querySelector("#chat-input");
            const content = el.innerText.trim();
            e.preventDefault();
            el.innerText = "";
            fetchEmit("chat", {
                email,
                femail,
                content
            });
            
            handleUpdateMessage({
                from: email,
                content
            })
        }
    }

    useEffect(() => {
        if (femail) {
            const el = document.querySelector("#message-box-wrapper");
            el.scrollTop = el.scrollHeight;
        }
    })
    return (
        <ContentWrapper>
            {
                // 注意顺序
                !femail ? null : (
                   <>
                        {
                            femail ? <div className="message-box-title">{userName}</div> : null
                        }
                        <MessageBox id="message-box-wrapper">
                            {/* <div className="message-title"></div> */}
                            {/* <div className="message-box">
                                <div className="message-avatar"></div>
                                <div className="message-context"></div>
                            </div> */}
                            
                            {
                                message.map((item, index) => {
                                    const avatar = item.from === email ? userAvatar : chatAvatar
                                    return (
                                        <div key={item.from + index} className={item.from === email ? "message-box message-box-right" : "message-box message-box-left"}>
                                            <div className="message-avatar"
                                                style={{
                                                    backgroundImage: `url(${avatarRoot + avatar})`
                                                }}
                                            ></div>
                                            <div className="message-context">{item.content}</div>
                                        </div>
                                    )
                                })
                            }
                        </MessageBox>
                        <ChatBox>
                            <div ref={inputEl} contentEditable id="chat-input" placeholder="发表点什么吧～" onKeyDown={(e) => handleChating(e)}></div>
                        </ChatBox>
                   </>
                )
            }
        </ContentWrapper>
    )
}

const stateToProps = state => {
    return {
        conversation: state.conversation,
        email: state.email,
        femail: state.currentChat,
        message: state.message,
        userAvatar: state.avatar,
        chatAvatar: state.chatAvatar,
        userName: state.chatUsername
    }
}

const stateToDispatch = dispatch => {
    return {
        handleUpdateMessage(data) {
            const action = updateMessage(data);
            dispatch(action);
        }
    }
}

export default connect(stateToProps, stateToDispatch)(Content);