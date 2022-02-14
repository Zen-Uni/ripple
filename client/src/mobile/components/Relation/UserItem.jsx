import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import UserItemBtn from "./UserItemBtn";
import "./style.css";

export default function UserItem(props) {
	const [expanded, setExpanded] = useState(false)
	const navigate = useNavigate()

	const jump = function(dest) {
		console.log('跳转至动态')
		navigate(`/${dest}/${props.name}`)
	}

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
						alt={props.name}
						src={props.avatar}
						sx={{ width: "3rem", height: "3rem" }}
					/>
					<Typography
						variant="h6"
						component="div"
						sx={{ lineHeight: "3rem" }}
					>
						{props.name}
					</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails>
                <div className="user-item-btn-group">
                    <UserItemBtn title="动态" size={4} action={()=>jump('moment')}/>
                    <UserItemBtn title="聊天" size={4} action={()=>jump('chat')}/>
                    <UserItemBtn title="备注" size={4} />
                    <UserItemBtn title="删除" size={4} type="warning"/>
                </div>
			</AccordionDetails>
		</Accordion>
	);
}
