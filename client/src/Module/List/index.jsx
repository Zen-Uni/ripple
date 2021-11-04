/**
 * @description list's components and styles
 */

import { useEffect } from "react";
import { connect } from "react-redux";

import { updateFriendListAction } from "../../store/action";
import FriendList from "./FriendList";
import Search from "./Search";
import { ListWrapper } from "./style";


// TODO：好友列表更新
function List(props) {
    // test
    const { handleUpdateFriendList } = props;
    return (
        <ListWrapper>
            <Search/>
            <FriendList/>
        </ListWrapper>
    )
}

const stateToProps = state => {
    return {
        test: state.test
    }
}


const stateToDispatch = dispatch => {
    return {
        handleUpdateFriendList(data) {
            const action = updateFriendListAction(data);
            dispatch(action);
        }
    }
}

export default connect(stateToProps, stateToDispatch)(List);