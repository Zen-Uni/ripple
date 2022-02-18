import { useState, forwardRef } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./style.css";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GroupItem(props) {
	const [expanded, setExpanded] = useState(false);
	const [name, setName] = useState(props.name || "默认群名");
	const [openRename, setRenameOpen] = useState(false);
	const [remark, setRemark] = useState(props.remark || "");
	const [email, setEmail] = useState("");
	const [openRemark, setRemarkOpen] = useState(false);
	const [openQuit, setQuitOpen] = useState(false);
	const [openDelete, setDeleteOpen] = useState(false);
	const [openAlert, setAlertOpen] = useState(false);
	const [openTransfer, setTransferOpen] = useState(false);
	const [openInvite, setInviteOpen] = useState(false);
	const [openKick, setKickOpen] = useState(false);
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
	 * 目标邮箱更改处理函数
	 * @param {Object} event 事件
	 */
	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	/**
	 * 更新群名
	 */
	const updateName = () => {
		//向服务器请求
		//...

		handleClick(setRenameOpen, false);
		setAlertOpen(true);
	};

	/**
	 * 更新群备注
	 */
	const updateRemark = () => {
		//向服务器请求
		//...

		handleClick(setRemarkOpen, false);
		setAlertOpen(true);
	};

	/**
	 * 请求退群
	 */
	const quitGroup = () => {
		//向服务器请求
		//...

		handleClick(setQuitOpen, false);
		setAlertOpen(true);
	};

	/**
	 * 请求删除群聊
	 */
	const deleteGroup = () => {
		//向服务器请求
		//...

		handleClick(setDeleteOpen, false);
		setAlertOpen(true);
	};

	/**
	 * 邀请好友
	 */
	const inviteFriend = () => {
		//向服务器请求
		//...

		if (checkEmail(email)) {
			handleClick(setInviteOpen, false);
			setAlertOpen(true);
			setEmail("");
		} else {
			alert("请检查邮箱是否正确");
		}
	};

	/**
	 * 邀请好友
	 */
	const transferGroup = () => {
		//向服务器请求
		//...

		if (checkEmail(email)) {
			handleClick(setTransferOpen, false);
			setAlertOpen(true);
			setEmail("");
		} else {
			alert("请检查邮箱是否正确");
		}
	};

	/**
	 * 邀请好友
	 */
	const kickMember = () => {
		//向服务器请求
		//...

		if (checkEmail(email)) {
			handleClick(setKickOpen, false);
			setAlertOpen(true);
			setEmail("");
		} else {
			alert("请检查邮箱是否正确");
		}
	};

	/**
	 * 邮箱是否符合规范
	 * @param {string} email 目标邮箱
	 * @returns boolean
	 */
	const checkEmail = (email) =>
		/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(email);

	return (
		<>
			<Accordion
				expanded={expanded}
				onChange={() => {
					setExpanded(!expanded);
				}}
				className="group-item-wrapper"
			>
				<AccordionSummary className="group-item-header">
					<div className="group-item">
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
					<div className="group-item-btn-group">
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

						<Divider />
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => handleClick(setInviteOpen, true)}
							>
								<ListItemText primary="邀请好友" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => handleClick(setKickOpen, true)}
							>
								<ListItemText primary="踢除成员" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => handleClick(setDeleteOpen, true)}
							>
								<ListItemText primary="解散该群" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() =>
									handleClick(setTransferOpen, true)
								}
							>
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
				open={openKick}
				onClose={() => handleClick(setKickOpen, false)}
			>
				<DialogTitle>踢除成员</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="kick"
						label="成员邮箱"
						type="text"
						fullWidth
						variant="standard"
						value={email}
						onChange={handleEmailChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={kickMember}>就酱</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openTransfer}
				onClose={() => handleClick(setTransferOpen, false)}
			>
				<DialogTitle>转让群</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="transfer"
						label="新群主邮箱"
						type="text"
						fullWidth
						variant="standard"
						value={email}
						onChange={handleEmailChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={transferGroup}>就酱</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openInvite}
				onClose={() => handleClick(setInviteOpen, false)}
			>
				<DialogTitle>邀请成员</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="transfer"
						label="好友邮箱"
						type="text"
						fullWidth
						variant="standard"
						value={email}
						onChange={handleEmailChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={inviteFriend}>就酱</Button>
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

			<Dialog
				open={openDelete}
				onClose={deleteGroup}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{`真的要解散 ${name} 吗`}
				</DialogTitle>
				<DialogActions>
					<Button
						onClick={() => {
							handleClick(setDeleteOpen, false);
						}}
					>
						我再想想
					</Button>
					<Button onClick={deleteGroup} autoFocus>
						我意已决
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={openAlert}
				autoHideDuration={6000}
				onClose={() => handleClick(setAlertOpen, false)}
			>
				<Alert
					onClose={() => handleClick(setAlertOpen, false)}
					severity="success"
					sx={{ width: "100%" }}
				>
					操作成功
				</Alert>
			</Snackbar>
		</>
	);
}
