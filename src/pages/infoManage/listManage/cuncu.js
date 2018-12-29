import React, { Component } from 'react'
import { Table, Form, Icon, Input, Button, Card, message, Modal, DatePicker, TimePicker } from 'antd'
import moment from 'moment';
import $ from 'jquery'
import { fetchPost } from './../../../fetch/fetch.js'
import Untils from './../../../untils/index1.js'
export default class ListManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleEdit: false,
            flag: false
        }
        this.params = {
            pageNo: 1
        }
        this.questRender = this.questRender.bind(this)
        this.edit = this.edit.bind(this)
        this.hideModalEdit = this.hideModalEdit.bind(this)
    }

    componentDidMount() {
        this.questRender()
    }

    render() {
        const columns = [
            {
                title: '设备Id',
                dataIndex: 'deviceId',
                key: 'deviceId',
                fixed: 'left',
                width: 80
            },
            {
                title: '初始设备号',
                dataIndex: 'oriDeviceCode',
                key: 'oriDeviceCode'
            },
            {
                title: '设备类型',
                dataIndex: 'deviceType',
                key: 'deviceType'
            },
            {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
                // onCell: (record, rowIndex) => {

                // }
            },
            {
                title: '设备描述',
                dataIndex: 'deviceDesc',
                key: 'deviceDesc'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',

            },
            {
                title: '生效时间',
                dataIndex: 'effDate',
                key: 'effDate',
                width: 200,
            },
            {
                title: '过期时间',
                dataIndex: 'expDate',
                key: 'expDate',
                width: 200
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 100,
                render: (record) => {
                    return (
                        <div>
                            <a href="javascript:;" onClick={this.edit.bind(this, record)}>修改</a>
                            <Modal
                                title={"设备修改"}
                                visible={this.state.visibleEdit}
                                onCancel={this.hideModalEdit}
                                mask={this.state.flag}
                                maskClosable={this.state.flag}
                                confirmLoading={this.state.flag}
                                footer={null}
                                width={630}
                            >
                                <EditData
                                    recordEdit={this.state.recordEdit}
                                    hideEdit={this.hideModalEdit}
                                />
                            </Modal>
                        </div>
                    )
                }
            },
        ];
        const rowCheckSelection = {
            type: "checkbox",
            // selectedRowKeys:selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {//参数1当前选中的为哪一行，参数2选中的为哪些行，为对象
                console.log(selectedRowKeys)
                console.log(selectedRows)
                this.setState({//存储起来
                    selectedRowKeys: selectedRowKeys,//告诉文本框选中的为哪些行，把它勾上,会变成一个数组
                    selectedRows: selectedRows  //为选中的那些行，可以遍历查看各行的信息
                })
            }
        }
        return (
            <div>
                <FilteTable />
                <Table
                    columns={columns}
                    dataSource={this.state.dataList}
                    scroll={{ x: 1600 }}
                    pagination={this.state.pagination}
                    bordered={true}
                    rowSelection={rowCheckSelection}
                />
            </div>
        )
    }

    //初始渲染列表请求
    questRender() {
        fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/query-by-page", {
            pageInfo: {
                pageNo: this.params.pageNo,
                pageSize: 5
            }
        }).then(res => {
            let _this = this
            if (res.code === "0") {
                let arr = []
                console.log("res.data.rows", res.data.rows)
                res.data.rows.map((ite, ind) => {
                    ite.key = ind;
                    let obj = {
                        deviceId: ite.deviceId,
                        oriDeviceCode: ite.oriDeviceCode,
                        deviceType: ite.deviceType,
                        deviceName: ite.deviceName,
                        deviceDesc: ite.deviceDesc,
                        status: ite.status,
                        effDate: ite.effDate,
                        expDate: ite.expDate,
                    }
                    arr.push(obj)
                })
                console.log(arr)
                this.setState({
                    dataList: arr,
                    pagination: Untils.pagination(res, (current) => {
                        _this.params.pageNo = current
                        this.questRender()
                    })
                })
            }
        })
    }

    //点击修改
    edit(record) {
        this.setState({
            visibleEdit: true,
            recordEdit: record,//点击编辑要提交内容时需要的设备ID
        })
        console.log("设备id" + record.deviceId + "信息:", record)

    }

    // 编辑Modal隐藏
    hideModalEdit() {
        this.setState({
            visibleEdit: false
        })
    }
}


//查询 新增 重置 为Table的子组件
class FilteTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            flag: false,
        }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.hideModal = this.hideModal.bind(this)
    }
    render() {
        const { getFieldDecorator, resetFields } = this.props.form;
        return (
            <div style={{ marginBottom: 40, marginTop: 30 }}>
                <Form layout="inline">
                    <Form.Item label="设备编号" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('ori_device_code')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备名称：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('device_name')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" style={{ marginRight: 20 }} onClick={this.handleSearch}>查询</Button>
                        <Button type="dashed" style={{ marginRight: 20 }} onClick={this.handleAdd}>新增</Button>
                        <Button onClick={this.handleReset}>重置</Button>
                        <Modal
                            title={"添加"}
                            visible={this.state.visible}
                            // onOk={this.submitModal}
                            onCancel={this.hideModal}
                            okText="提交"
                            cancelText="取消"
                            mask={this.state.flag}
                            maskClosable={this.state.flag}
                            // closable={this.state.flag}
                            confirmLoading={this.state.flag}
                            footer={null}
                            width={630}
                        >
                            {/* <AddData
                                wrappedComponentRef={(inst) => { this.AddForm = inst;}}
                                num={this.state.num}
                            /> */}
                            <AddData
                                hide={this.hideModal}
                            />
                        </Modal>
                    </Form.Item>
                </Form>



            </div>
        )
    }

    handleSearch(e) {
        const { resetFields } = this.props.form;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (values.ori_device_code === undefined || values.device_name === undefined) {
                message.error("请分别输入设备编号和名称")
            } else {
                resetFields()//清空表单里的数据的
            }

        });
    }

    handleAdd(e) {
        e.preventDefault();
        this.setState({
            visible: true
        })
    }

    handleReset(e) {
        e.preventDefault();
    }

    hideModal() {
        this.setState({
            visible: false
        })
    }
}

FilteTable = Form.create()(FilteTable);


//放到新增出现的Modal里的子组件
class AddData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // subData: {device_name: ''}
            visible: false
        }
        // this.onchange = this.onchange.bind(this)
        this.submitModal = this.submitModal.bind(this)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ overflow: "hidden" }}>
                <Form layout="inline" >
                    <Form.Item label="出厂编号：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('oriDeviceCode')(
                            <Input className="name" style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备类型：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceType')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备名称：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceName')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备描述：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceDesc')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="生效日期：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('effDate')(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="当天点数：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('effTime')(
                            <TimePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="过期日期：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('expDate')(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="当天点数：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('expTime')(
                            <TimePicker />
                        )}
                    </Form.Item>
                </Form>
                <Form>
                    <Button onClick={this.submitModal} type="primary" style={{ float: "right", marginTop: 30 }}>提交</Button>
                </Form>
            </div>
        )
    }

    //提交新增的数据到接口
    submitModal() {

        const { resetFields, setFieldsValue, validateFields } = this.props.form;
        this.props.form.validateFields((err, values) => {
            // let time = new Date(values.expTime)
            // console.log(time.getHours())
            if (values.effDate === undefined || values.effTime === undefined || values.deviceDesc === undefined
                || values.deviceName === undefined || values.deviceType === undefined || values.expDate === undefined
                || values.expTime === undefined || values.oriDeviceCode === undefined) {
                message.error("请将各项信息输入完整")
                this.setState({
                    visible: true
                })
            } else {//写接口内容

                console.log(values.expTime)
                resetFields()//清空表单里的数据的            
                this.props.hide();

            }
        });
    }

}

AddData = Form.create()(AddData);


//点击编辑出现的Modal里的子组件
class EditData extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.submitModalEdit = this.submitModalEdit.bind(this)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ overflow: "hidden" }}>
                <Form layout="inline" >
                    <Form.Item label="出厂编号：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('oriDeviceCode')(
                            <Input className="name" style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备类型：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceType')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备名称：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceName')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备描述：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceDesc')(
                            <Input style={{ width: 350 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="生效日期：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('effDate')(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="当天点数：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('effTime')(
                            <TimePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="过期日期：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('expDate')(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="当天点数：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('expTime')(
                            <TimePicker />
                        )}
                    </Form.Item>
                </Form>
                <Form>
                    <Button onClick={this.submitModalEdit} type="primary" style={{ float: "right", marginTop: 30 }}>提交</Button>
                </Form>
            </div>
        )
    }

    submitModalEdit() {

        const { resetFields, setFieldsValue, validateFields } = this.props.form;
        this.props.form.validateFields((err, values) => {
            console.log("deviceId", this.props.recordEdit.deviceId)
            console.log("我是编辑的内容", values)
            if (values.effDate === undefined || values.effTime === undefined || values.deviceDesc === undefined
                || values.deviceName === undefined || values.deviceType === undefined || values.expDate === undefined
                || values.expTime === undefined || values.oriDeviceCode === undefined) {
                message.error("请将各项信息输入完整")
                return
            } else {//写接口内容
                let effDT = Untils.dates(values.effDate) + Untils.times(values.effTime)
                let expDT = Untils.dates(values.expDate) + Untils.times(values.expTime)
                fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/mod", {
                    deviceId: this.props.recordEdit.deviceId,
                    oriDeviceCode: values.oriDeviceCode,
                    deviceType: values.deviceType,
                    deviceName: values.deviceName,
                    deviceDesc: values.deviceDesc,
                    effDate: effDT,
                    expDate: expDT,
                }).then(res => {
                    console.log("修改提交按钮的res"res)
                    
                    resetFields()//清空表单里的数据的            
                    this.props.hideEdit();
                })




            }
        });
    }
}
// Form.create()返回了一个function, 然后将EditData作为参数传给这个function执行.
EditData = Form.create()(EditData);