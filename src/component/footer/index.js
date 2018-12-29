import React from 'react';
import { Layout, Menu, Icon ,Breadcrumb} from 'antd';

const { Header, Sider, Content , Footer,} = Layout;
// import './index.less'
export default class Footers extends React.Component{
	render(){
		return (
				<div>
					<Footer style={{ textAlign: 'center' }}>
							Ant Design ©2018 Created by Ant UED
					</Footer>
				</div>
			)
	}
}	