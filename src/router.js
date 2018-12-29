import React from 'react'
import {HashRouter,Route,Switch,BrowserRouter} from 'react-router-dom'
import App from './App.js'
import Admin from './admin.js';
import Login from './pages/login/index.js';
import Errors from './pages/errors404/index.js';
import HouseList from './pages/houseInfo/houseList/index.js';
import HouseAudit from './pages/houseInfo/houseAudit/index.js';
import ListManage from './pages/infoManage/listManage/index.js';
import Home from './pages/home/index.js';
export default class Irouter extends React.Component{
	render(){
		return (
				<BrowserRouter>
						<App>
							<Switch>
									<Route exact path="/" component={Login}></Route>
									<Route path="/admin" render={()=>
										<Admin>
											<Switch>
												<Route path="/admin/houseInfo/houseList" component={HouseList}></Route>
												<Route path="/admin/houseInfo/houseAudit" component={HouseAudit}></Route>
												<Route path="/admin/infoManage/listManage" component={ListManage}></Route>
												<Route path="/admin/home" component={Home}></Route>
												<Route component={Errors}></Route>
											</Switch>
										</Admin>
									}/>
							</Switch>						
						</App>
				</BrowserRouter>
				
			)
	}
}