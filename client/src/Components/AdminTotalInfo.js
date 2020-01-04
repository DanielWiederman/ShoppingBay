import React from 'react'
import { Row, Col } from 'antd'
import '../CSS/Admin  CSS/adminPanel.css'
import '../CSS/Admin  CSS/genericClass.css'


const AdminTotalInfo = (props) => {
    const eleheight = 100;
    return (
        <Col span={6}>
            <Row type="flex" style={{ height: eleheight + "px" }}>
                <Col span={24} md={24}>
                    <Row type="flex" align="middle" justify="center" >
                        <Col span={24} >
                            <Row type="flex" align="bottom" justify="center" style={{ height: (eleheight / 2) + "px" }}>
                                <Col><span className="totalNum">{props.total}</span></Col>
                            </Row>
                        </Col>
                        <Col span={20} md={24}>
                            <Row type="flex" align="top" justify="center" style={{ textAlign: "center", height: (eleheight / 2) + "px" }}>
                                <Col><span className="totalTitle">{props.title}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}
export default AdminTotalInfo

