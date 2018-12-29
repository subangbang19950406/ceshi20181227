import React from 'react'
import { Layout, Menu, Icon ,Breadcrumb} from 'antd';

const { Header, Sider, Content , Footer,} = Layout;
// import './index.less'
export default class Headers extends React.Component{
	state = {
		collapsed: false,
	  };
	  toggle = () => {
		this.setState({
		  collapsed: !this.state.collapsed
		});
	  }
	render(){
		return (
			<div>
						<Header style={{ background: '#fff', padding: 0 ,marginBottom:30}}>
							<Icon
							className="trigger"
							type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.toggle}
							/>
							{/* <p className="ap">ssdasdasd</p> */}
						</Header>
			</div>
			)
	}
}	