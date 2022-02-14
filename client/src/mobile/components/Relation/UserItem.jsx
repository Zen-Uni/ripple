import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserItemBtn from "./UserItemBtn";
import "./style.css";

export default function UserItem(props) {
	const [expanded, setExpanded] = useState(false);
	const [remarks, setRemarks] = useState(props.remarks);
	const [newRemark, setNewRemark] = useState(props.remarks);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const navigate = useNavigate();

	const jump = (dest) => {
		console.log("跳转至" + dest);
		navigate(`/${dest}/${props.name}`);
	};

	const handleNewRemark = () => {
		setRemarks(newRemark);
		handleClose();
	};

	const handleChange = (event) => {
		setNewRemark(event.target.value);
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
							src={props.avatar}
							sx={{ width: "3rem", height: "3rem" }}
						/>
						<Typography
							variant="h6"
							component="div"
							sx={{ lineHeight: "3rem" }}
						>
							<span style={{ opacity: 0.2, marginRight: "1rem" }}>
								{remarks ? `(${remarks})` : ""}
							</span>
							{props.name}
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<div className="user-item-btn-group">
						<UserItemBtn
							title="动态"
							size={4}
							action={() => jump("moment")}
						/>
						<UserItemBtn
							title="聊天"
							size={4}
							action={() => jump("chat")}
						/>
						<UserItemBtn
							title="备注"
							size={4}
							action={handleClickOpen}
						/>
						<UserItemBtn title="删除" size={4} type="warning" />
					</div>
				</AccordionDetails>
			</Accordion>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>给{props.name}备注</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="remarks"
						label="备注"
						type="text"
						fullWidth
						variant="standard"
						value={newRemark}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>取消</Button>
					<Button onClick={handleNewRemark}>就酱</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
