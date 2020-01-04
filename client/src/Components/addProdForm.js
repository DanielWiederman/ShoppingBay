import React from 'react'
import { Row, Col, Input, InputNumber, Icon } from 'antd'
import '../CSS/Admin  CSS/adminPanel.css'
import '../CSS/Admin  CSS/genericClass.css'
const addProdForm = (props) => {
    return (
        <Col span={24} >
            <Row type="flex" align="middle" justify="center" style={{ marginBottom: "15px" }}  >
                <Col span={8}>
                    <span>{props.title} :</span>
                </Col>
                <Col span={16} style={{ display: props.type === "textarea" ? "block" : "none" }} >
                    <Input onChange={props.valueChange} type={props.type} name={props.title} />
                </Col>
                <Col span={16} style={{ display: props.type === "number" ? "block" : "none" }} >
                    <InputNumber onChange={props.valueNumberChange} min={1} type={props.type} name={props.title} />
                </Col>
                <Col span={16} style={{ display: props.type === "file" ? "block" : "none" }} >
                    <input type={props.type} onChange={props.uploadPic} disabled={props.loadingFile} name={props.title} />
                    {props.loadingFile ? <span className="ml-2"><Icon type="loading" style={{ fontSize: 24 }} spin /></span> : null}
                </Col>
                <Col span={16} offset={8} style={{ textAlign: "center", paddingTop: "5px" }} >
                    <p style={{ color: "red" }}>{props.err}</p>
                </Col>
            </Row>

        </Col>

    )
}
export default addProdForm

