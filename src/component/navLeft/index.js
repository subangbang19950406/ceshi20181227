import React from 'react';
// import { Layout, Menu, Icon } from 'antd';
import {NavLink} from 'react-router-dom'
// import './index.less';
// import MenuConfig from './../../config/menuConfig'
import { Layout, Menu, Icon ,Breadcrumb} from 'antd';

const { Header, Sider, Content , Footer,} = Layout;
const SubMenu = Menu.SubMenu;
export default class NavLeft extends React.Component{
	state = {
		collapsed: false,
	  };
	//   toggle = () => {
	// 	this.setState({
	// 	  collapsed: !this.state.collapsed,
	// 	});
	//   }
	render(){
		return (
				<div>
					<Sider
					// collapsible
					// collapsed={this.state.collapsed}
					// onCollapse={this.onCollapse}
					// trigger={null}
					// collapsible
					// collapsed={this.state.collapsed}
					>
						<div className="logo" />
						<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
							<SubMenu
							key="sub1"
							title={<span><Icon type="user" /><span>User</span></span>}
							>
									<Menu.Item key="3">Tom</Menu.Item>
									<Menu.Item key="4">Bill</Menu.Item>
									<Menu.Item key="5">Alex</Menu.Item>
							</SubMenu>
							<SubMenu
							key="sub2"
							title={<span><Icon type="team" /><span>Team</span></span>}
							>
									<Menu.Item key="6">Team 1</Menu.Item>
									<Menu.Item key="8">Team 2</Menu.Item>
							</SubMenu>
							<SubMenu
							key="sub3"
							title={<span><Icon type="team" /><span>Team</span></span>}
							>
									<Menu.Item key="9">Team 1</Menu.Item>
									<Menu.Item key="10">Team 2</Menu.Item>
							</SubMenu>
							<SubMenu
							key="sub4"
							title={<span><Icon type="team" /><span>Team</span></span>}
							>
									<Menu.Item key="11">Team 1</Menu.Item>
									<Menu.Item key="12">Team 2</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
				</div>
			)
	}
}	