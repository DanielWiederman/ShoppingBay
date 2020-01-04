import React, { Component } from 'react'
import { Row, Col } from 'antd'
import "../CSS/Footer.css"

export class Footer extends Component {
    render() {
        return (
            <div className="footerContainer">
                <Row type="flex" style={{ height: "100%" }}>
                    <Col span={24} >
                        <Row style={{ height: "100%" }} type="flex" align="middle">
                            <Col span={8}>
                                <Row type="flex" justify="start">
                                    Footer
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row type="flex" justify="center">
                                    Footer
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row type="flex" justify="end">
                                    Footer
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Footer
