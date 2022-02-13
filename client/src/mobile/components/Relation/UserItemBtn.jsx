import './style.css'

export default function UserItemBtn(props) {
    return (
        <>
            <div className="user-item-btn" style={{width: "calc((100% - 2rem) / "+ props.size +")"}}>
                { props.title }
            </div>
        </>
    );
}