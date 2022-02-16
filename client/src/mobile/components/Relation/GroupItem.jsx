import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import UserItemBtn from "./UserItemBtn";
import "./style.css";

export default function GroupItem(props) {
	const [expanded, setExpanded] = useState(false);

	const navigate = useNavigate();

	const jump = (dest) => {
		console.log("跳转至" + dest);
		navigate(`/${dest}/${props.name}`);
	};

	return (
		<>
			<Accordion
				expanded={expanded}
				onChange={() => {
					setExpanded(!expanded);
				}}
				className="user-item-wrapper"
			>
				<AccordionSummary className="user-item-header">
					<div className="user-item">
						<Avatar
							alt={props.name}
							sx={{ width: "3rem", height: "3rem" }}
						>
							{props.name[0]}
						</Avatar>
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
						<UserItemBtn
							title="聊天"
							size={2}
							action={() => jump("chat")}
						/>
						<UserItemBtn title="设置" size={2} />
					</div>
				</AccordionDetails>
			</Accordion>
		</>
	);
}
