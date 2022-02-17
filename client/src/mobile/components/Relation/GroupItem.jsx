import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import UserItemBtn from "./UserItemBtn";
import "./style.css";

export default function GroupItem(props) {
	const [expanded, setExpanded] = useState(false);
	const [name, setName] = useState(props.name || "默认群名");
	const [openRename, setRenameOpen] = useState(false);
	const [remark, setRemark] = useState(props.remark || "");
	const [openRemark, setRemarkOpen] = useState(false);
	const [openQuit, setQuitOpen] = useState(false);
	const [openDelete, setDeleteOpen] = useState(false);
	const navigate = useNavigate();

	/**
	 * 向目标模块跳转
	 * @param {string} dest 目标模块
	 */
	const jump = (dest) => {
		console.log("跳转至" + dest);
		navigate(`/${dest}/${props.name}`);
	};

	/**
	 * 处理点击事件
	 * @param {function} fn 回调函数
	 * @param {boolean} state 状态值
	 * @returns null
	 */
	const handleClick = (fn, state) => fn(state);

	/**
	 * 群名更改处理函数
	 * @param {Object} event 事件
	 */
	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	/**
	 * 群备注更改处理函数
	 * @param {Object} event 事件
	 */
	const handleRemarkChange = (event) => {
		setRemark(event.target.value);
	};

	/**
	 * 更新群名
	 */
	const updateName = () => {
		//向服务器请求
		//...

		handleClick(setRenameOpen, false);
	};

	/**
	 * 更新群备注
	 */
	const updateRemark = () => {
		//向服务器请求
		//...

		handleClick(setRemarkOpen, false);
	};

	/**
	 * 请求退群
	 */
	const quitGroup = () => {
		//向服务器请求
		//...

		handleClick(setQuitOpen, false);
	};

	/**
	 * 请求删除群聊
	 */
	const deleteGroup = () => {
		//向服务器请求
		//...

		handleClick(setDeleteOpen, false);
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
							{name[0]}
						</Avatar>
						<Typography
							variant="h6"
							component="div"
							sx={{ lineHeight: "3rem" }}
						>
							<span style={{ opacity: 0.2, marginRight: "1rem" }}>
								{remark ? `(${remark})` : ""}
							</span>
							{name}
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
						<UserItemBtn
							title="备注"
							size={2}
							action={() => handleClick(setRemarkOpen, true)}
						/>
					</div>
					<List>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => handleClick(setRenameOpen, true)}
							>
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
							<ListItemButton
								onClick={() => {
									handleClick(setQuitOpen, true);
								}}
							>
								<ListItemText primary="退出该群" />
							</ListItemButton>
						</ListItem>
					</List>
				</AccordionDetails>
			</Accordion>

			<Dialog
				open={openRename}
				onClose={() => handleClick(setRenameOpen, false)}
			>
				<DialogTitle>给{name}备注</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="名称"
						type="text"
						fullWidth
						variant="standard"
						value={name}
						onChange={handleNameChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={updateName}>就酱</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openRemark}
				onClose={() => handleClick(setRemarkOpen, false)}
			>
				<DialogTitle>给群 {name} 备注</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="remark"
						label="备注"
						type="text"
						fullWidth
						variant="standard"
						value={remark}
						onChange={handleRemarkChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={updateRemark}>就酱</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openQuit}
				onClose={quitGroup}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{`真的要退出 ${name} 吗`}
				</DialogTitle>
				<DialogActions>
					<Button
						onClick={() => {
							handleClick(setQuitOpen, false);
						}}
					>
						我再想想
					</Button>
					<Button onClick={quitGroup} autoFocus>
						去意已决
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
