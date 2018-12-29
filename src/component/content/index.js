import React from 'react';
import { Layout, Menu, Icon ,Breadcrumb} from 'antd';

const { Header, Sider, Content , Footer,} = Layout;
// import './index.less'
export default class Contents extends React.Component{
	render(){
		return (
				<div>
					<Content style={{ margin: '0 16px' }}>
							<Breadcrumb style={{ margin: '16px 0' }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>Bill</Breadcrumb.Item>
							</Breadcrumb>
							<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
							Bill is a cat.
							</div>
					</Content>
				</div>
			)
	}
}	