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
				<Typography variant="h6" gutterBottom component="div" className={"relation-subtitle"}>
					relation
				</Typography>
			</div>

			<Box>
				<Tabs value={value} onChange={handleChange} indicatorColor={"tansparent"}>
					<Tab label="好友" {...a11yProps(0)} disableFocusRipple={true}/>
					<Tab label="群聊" {...a11yProps(1)} disableFocusRipple={true}/>
				</Tabs>
			</Box>

			<TabPanel value={value} index={0}>
				<UserItem
					avatar="https://mui.com/static/images/avatar/1.jpg"
					name="季悠然"
					remarks="小号"
				></UserItem>
				<UserItem
					avatar="https://mui.com/static/images/avatar/1.jpg"
					name="卢本伟"
				></UserItem>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<GroupItem name="后宫群"></GroupItem>
				<GroupItem name="学习交流群"></GroupItem>
				<GroupItem name="卷群"></GroupItem>
			</TabPanel>
		</>
	);
}
