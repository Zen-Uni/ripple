/**
 * @description  Web Mobile 的导航栏组件
 * @author Uni
 * @since 1.0
 */

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export default function NavBar() {
	const [value, setValue] = useState("chat");

    const navigate = useNavigate();

	const handleChange = (event, newValue) => {
		setValue(newValue);
        navigate('/'+newValue);
	};

	return (
		<BottomNavigation
			sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
			value={value}
			onChange={handleChange}
		>
			<BottomNavigationAction
				label="chat"
				value=""
				icon={<span>聊天</span>}
			/>
			<BottomNavigationAction
				label="relation"
				value="relation"
				icon={<span>人际</span>}
			/>
			<BottomNavigationAction
				label="social"
				value="social"
				icon={<span>社交</span>}
			/>
			<BottomNavigationAction
				label="setting"
				value="setting"
				icon={<span>设置</span>}
			/>
		</BottomNavigation>
	);
}
