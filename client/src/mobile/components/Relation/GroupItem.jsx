import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
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
						<UserItemBtn title="备注" size={2} />
					</div>
                    <List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="更改群名" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="更改群马甲" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="邀请好友" />
						</ListItemButton>
					</ListItem>
					<Divider />
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="踢除成员" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="解散改聊" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="转让该群" />
						</ListItemButton>
					</ListItem>
					<Divider />
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary="删除该群" />
						</ListItemButton>
					</ListItem>
				</List>
				</AccordionDetails>
			</Accordion>
		</>
	);
}
