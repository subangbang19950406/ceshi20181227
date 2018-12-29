import React , {Component} from 'react'
import './index.css'
export default class Home extends Component{
    constructor(props) {
        super(props)
        this.state={

        }

    }
    render(){
        return (
            <div className="home-wrap">
                欢迎使用东客网络后台管理系统
            </div>
        );
    }
}