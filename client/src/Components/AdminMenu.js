import React from 'react'
import { Row, Col} from 'antd'
import "../CSS/Admin  CSS/salesPanel.css"

const AdminMenu = (props) => {
    return (
        <Col span={23} md={23} className={props.selectedRow===props.title?"mb-5 mt-2" : "mb-5 mt-2 highlight" }>
            <Row type="flex" justify="center" align="middle" >
                <Col xs={24} md={24}>
                    <Row type="flex"  justify="center" align="middle" className={props.selectedRow===props.title?"menuIconNTitleCon slectedRow" : "menuIconNTitleCon" } onClick={props.click}>
                        <Col xs={3} md={5} xl={5} >
                            <i className={'menuIcon' +
                             ` ${props.icon} `}></i>
                        </Col>
                        <Col xs={17} md={16} xl={12}> <span>{props.title}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}
export default AdminMenu
