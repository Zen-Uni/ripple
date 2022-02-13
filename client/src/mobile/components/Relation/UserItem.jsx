import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import UserItemBtn from "./UserItemBtn";
import "./style.css";

export default function UserItem(props) {
	const [name, setName] = useState(props.name);
	const [avatar, setAvatar] = useState(props.avatar);
	const [expanded, setExpanded] = useState(false);

	return (
		<Accordion
			expanded={expanded}
			onChange={()=>{setExpanded(!expanded)}}
            className="user-item-wrapper"
		>
			<AccordionSummary
				className="user-item-header"
			>
				<div className="user-item">
					<Avatar
						alt={name}
						src={avatar}
						sx={{ width: "3rem", height: "3rem" }}
					/>
					<Typography
						variant="h6"
						component="div"
						sx={{ lineHeight: "3rem" }}
					>
						{name}
					</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails>
                <div className="user-item-btn-group">
                    <UserItemBtn title="朋友圈" size={4}/>
                    <UserItemBtn title="聊天" size={4}/>
                    <UserItemBtn title="备注" size={4}/>
                    <UserItemBtn title="删除" size={4}/>
                </div>
			</AccordionDetails>
		</Accordion>
	);
}
