/**
 * @description Web Mobile 通讯录根组件
 * @author Uni
 * @since 1.0
 */

import "./style.css";
import { useState } from "react";
import UserItem from "../../components/Relation/UserItem.jsx";
import GroupItem from "../../components/Relation/GroupItem.jsx";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div>{children}</div>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `tab-${index}`,
		"aria-controls": `tabpanel-${index}`,
	};
}

export default function Relation() {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const friends = [
		{
			avatar: "https://gravatar.loli.top/avatar/87e0f8d2f0f70987061cec6376cb7f97?s=200&r=G&d=",
			name: "季悠然",
			remarks: "小号",
		},
		{
			avatar: "https://cdn.exia.xyz/img/upload/joseph.jpg",
			name: "Jostar",
			remarks: "十字军",
		},
		{
			avatar: "https://cdn.exia.xyz/img/upload/jotaro.jpg",
			name: "Jotaro",
			remarks: "十字军",
		},
		{
			avatar: "https://cdn.exia.xyz/img/upload/bobo.jpg",
			name: "波鲁纳雷夫",
			remarks: "波波",
		},
		{
			avatar: "https://mui.com/static/images/avatar/1.jpg",
			name: "(0-0)",
			remarks: "",
		},
	];

	const groups = [
		{
			name: "学习群",
		},
		{
			name: "卷群",
		},
		{
			name: "老曾家",
		},
		{
			name: "绝密",
		},
	];

	return (
		<>
			<div className="relation-header">
				<Typography
					variant="h3"
					gutterBottom
					component="div"
					sx={{ marginBottom: 0 }}
				>
					人际
				</Typography>
				<Typography
					variant="h6"
					gutterBottom
					component="div"
					className={"relation-subtitle"}
				>
					relation
				</Typography>
			</div>

			<Box>
				<Tabs value={value} onChange={handleChange}>
					<Tab
						label="好友"
						{...a11yProps(0)}
						disableFocusRipple={true}
					/>
					<Tab
						label="群聊"
						{...a11yProps(1)}
						disableFocusRipple={true}
					/>
				</Tabs>
			</Box>

			<TabPanel value={value} index={0}>
				{friends.map((f) => (
					<UserItem
						avatar={f.avatar}
						name={f.name}
						remarks={f.remarks}
						key={f.name}
					></UserItem>
				))}

				<Typography
					gutterBottom
					component="div"
					className={"relation-bottom-text"}
				>
					到底咯~
				</Typography>
			</TabPanel>
			<TabPanel value={value} index={1}>
				{groups.map((g) => (
					<GroupItem name={g.name} key={g.name}></GroupItem>
				))}
				<Typography
					gutterBottom
					component="div"
					className={"relation-bottom-text"}
				>
					到底咯~
				</Typography>
			</TabPanel>
		</>
	);
}
