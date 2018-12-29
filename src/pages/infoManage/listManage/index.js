import React, { Component } from 'react'
import {
    Table, Form, Icon, Input, Button, Card, message, Modal, DatePicker, TimePicker,
    InputNumber, Popconfirm,
} from 'antd'
import './index.css'
import moment from 'moment';
import $ from 'jquery'
import { fetchPost } from './../../../fetch/fetch.js'
import Untils from './../../../untils/index1.js'

export default class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = { editingKey: '', num: false };
        this.params = { pageNo: 1 }
        this.columns = [
            {
                title: '初始设备号',
                dataIndex: 'oriDeviceCode',
                key: 'oriDeviceCode',
                editable: true,
                width: "12%",
            },
            {
                title: '设备类型',
                dataIndex: 'deviceType',
                key: 'deviceType',
                editable: true,
                width: "8%",
            },
            {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
                editable: true,
                width: "10%",
            },
            {
                title: '设备描述',
                dataIndex: 'deviceDesc',
                key: 'deviceDesc',
                editable: true,
                width: "20%",
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                editable: true,
                width: "8%",

            },
            {
                title: '生效时间',
                dataIndex: 'effDate',
                key: 'effDate',
                editable: true,
                width: "16%",
            },
            {
                title: '过期时间',
                dataIndex: 'expDate',
                key: 'expDate',
                editable: true,
                width: "16%",
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <a
                                                href="javascript:;"
                                                onClick={() => this.save(form, record.key)}
                                                style={{ marginRight: 8 }}
                                            >
                                                保存
                                             </a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定取消吗?"
                                        onConfirm={() => this.cancel(record.key)}
                                    >
                                        <a>取消</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <a onClick={() => this.edit(record.key)}>编辑</a>
                                )}
                        </div>
                    );
                },
            },
        ];
    }
    componentDidMount() {
        this.questRender()
    }

    questRender() {
        fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/query-by-page", {
            pageInfo: {
                pageNo: this.params.pageNo,
                // pageSize: 5
            }
        }).then(res => {
            let _this = this
            if (res.code === "0") {
                let arr = []
                let ids = []
                console.log("res.data.rows", res.data.rows)
                res.data.rows.map((ite, ind) => {
                    let obj = {
                        key: ind,
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
                    ids.push(ite.deviceId)
                })
                console.log(arr)
                this.setState({
                    data: arr,
                    deviceIds: ids,
                    pagination: Untils.pagination(res, (current) => {
                        if (this.state.num) {
                            message.error("数据只有这一页哦")

                        }
                        _this.params.pageNo = current

                        this.questRender()
                    })
                })
            }
        })
    }
    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            console.log(this.state.deviceIds[key])
            if (error) {
                return;
            } else {
                fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/mod", {
                    deviceId: this.state.deviceIds[key],
                    oriDeviceCode: row.oriDeviceCode,
                    deviceType: row.deviceType,
                    deviceName: row.deviceName,
                    deviceDesc: row.deviceDesc,
                    effDate: row.effDate,
                    expDate: row.expDate,
                }).then(res => {
                    if (res.code === "0") {
                        console.log("修改提交按钮的res", res)
                        const newData = [...this.state.data];
                        const index = newData.findIndex(item => key === item.key);
                        if (index > -1) {
                            const item = newData[index];
                            newData.splice(index, 1, {
                                ...item,
                                ...row,
                            });
                            this.setState({ data: newData, editingKey: '' });
                        } else {
                            newData.push(row);
                            this.setState({ data: newData, editingKey: '' });
                        }
                    } else {
                        message.error("状态格式：00A ;日期格式：2018-03-12 14:29:00,请重新输入"
                            , 3, () => {
                                // this.questRender()
                            })
                    }
                })
            }

        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }
    //查询得到的列表
    dataListSearch(ins) {
        console.log(ins)
        this.setState({
            num: true,
            dataListSearchs: ins,
        })
    }
    //重置列表
    questRenderReset() {
        this.setState({
            num: false
        })
    }
    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <div>
                <FilteTable
                    // questRenderSearch={this.questRender}
                    dataListSearch={this.dataListSearch.bind(this)}
                    questRenderReset={this.questRenderReset.bind(this)}
                />
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.num == true ? this.state.dataListSearchs : this.state.data}
                    columns={columns}
                    pagination={this.state.pagination}
                    rowClassName="editable-row"
                />
            </div>

        );
    }
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: false,
                                            message: `输入${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

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
                    <Form.Item label="初始编号" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('oriDeviceCode')(
                            <Input style={{ width: 200 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备类型：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceType')(
                            <Input style={{ width: 200 }} placeholder="请输入" />
                        )}
                    </Form.Item>
                    <Form.Item label="设备名称：" style={{ marginLeft: 30 }}>
                        {getFieldDecorator('deviceName')(
                            <Input style={{ width: 200 }} placeholder="请输入" />
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
        const { resetFields, setFieldsValue, validateFields } = this.props.form;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (values.oriDeviceCode === undefined || values.deviceType === undefined || values.deviceName === undefined) {
                message.error("请分别输入设备编号和名称")
            } else {
                fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/query", {
                    oriDeviceCode: values.oriDeviceCode,
                    deviceType: values.deviceType,
                    deviceName: values.deviceName,
                    // pageInfo:{
                    //     pageSize:5,
                    //     pageNo:1
                    // }

                }).then(res => {
                    // this.props.questRenderSearch()
                    this.props.dataListSearch(res.data)
                    resetFields()//清空表单里的数据的
                })

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
        this.props.questRenderReset()
    }

    hideModal() {
        this.setState({
            visible: false
        })
    }
}

FilteTable = Form.create()(FilteTable);

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
                    <Form.Item label="初始编号：" style={{ marginLeft: 30 }}>
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
            if (values.effDate === undefined || values.effTime === undefined || values.deviceDesc === undefined
                || values.deviceName === undefined || values.deviceType === undefined || values.expDate === undefined
                || values.expTime === undefined || values.oriDeviceCode === undefined) {
                message.error("请将各项信息输入完整")
                this.setState({
                    visible: true
                })
            } else {//写接口内容
                let effDT = Untils.dates(values.effDate) + Untils.times(values.effTime)
                let expDT = Untils.dates(values.expDate) + Untils.times(values.expTime)
                console.log(expDT, effDT)
                fetchPost("https://test.dongkenet.com/api/bms/1.0.0.daily/device-list/add", {
                    oriDeviceCode: values.oriDeviceCode,
                    deviceType: values.deviceType,
                    deviceName: values.deviceName,
                    deviceDesc: values.deviceDesc,
                    effDate: effDT,
                    expDate: expDT,
                    deviceCode: "123"
                }).then(res => {
                    console.log("res", res)
                    if (res.code === "0") {
                        console.log("res新增成功的", res)
                        resetFields()//清空表单里的数据的            
                        this.props.hide();
                    }

                })
            }
        });
    }

}

AddData = Form.create()(AddData);


