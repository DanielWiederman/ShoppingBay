import React from 'react'
import { Row, Col } from 'antd'
import '../CSS/Admin  CSS/adminPanel.css'
import '../CSS/Admin  CSS/genericClass.css'

const Apps = (props) => {
    return (
        <Col span={8}>
            <Row type="flex" justify="center">
                <Col span={18} md={14} lg={15} xl={9}>
                    <Row onClick={props.click} type="flex" justify="center" align="middle" className={props.name === "Home Page" ? "appBox homeBox" :"appBox"}>
                        <Col span={22}>
                            {props.name}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}
export default Apps

