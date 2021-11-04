/**
 * @description list's components and styles
 */

// import { connect } from "react-redux";

// import { updateFriendListAction } from "../../store/action";
import FriendList from "./FriendList";
import Search from "./Search";
import { ListWrapper } from "./style";


// TODO：好友列表更新
function List() {
  
    return (
        <ListWrapper>
            <Search/>
            <FriendList/>
        </ListWrapper>
    )
}


export default List;