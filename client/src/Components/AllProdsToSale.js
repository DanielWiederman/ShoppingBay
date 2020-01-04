import React from 'react'
import { Row, Col, Icon, Popconfirm } from 'antd'
import '../CSS/Admin  CSS/salesPanel.css'

const AllProdsToSale = (props) => {
    return (
        <Col span={12} md={8} xl={4} style={{height:"70%",paddingTop:"15px"}} >
            <Row type="flex" justify="center">
                <Col span={23} xl={22} className="prodToSale">
                    <Row type="flex" align="middle" justify="center" >
                        <Col md={0} span={24}>
                            <Row type="flex" align="middle" justify="center" >
                                <Col span={22} style={{textAlign:"right"}}>
                                    <Popconfirm
                                        title="Are you sure delete this product?"
                                        onConfirm={props.confirm}
                                        onCancel={props.cancel}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <span className="deletPhoneBtn"><Icon type="delete" /></span>
                                    </Popconfirm>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={24}>
                            <Row type="flex">
                                <Col span={24} md={24}>
                                    <Row type="flex" align="middle">
                                        <Col xl={24} span={24}>
                                            <Row type="flex" align="middle">
                                                <Col md={23} xs={0}>
                                                <div style={{textAlign: "right"}}>
                                                    <Popconfirm
                                                        title="Are you sure delete this product?"
                                                        onConfirm={props.confirm}
                                                        onCancel={props.cancel}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Icon type="close" style={{ color: "red" }} />
                                                    </Popconfirm>
                                                    </div>  
                                                </Col>
                                                <Col span={24}>
                                                    <div className="prodsToSaleTitle" style={{textAlign:"center"}}><u>Product name</u></div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={23}> <Row type="flex" align="middle" justify="center"><Col><span className="prodsToSaleInfo">{props.prodName}</span></Col></Row></Col>
                            </Row>
                            <Row type="flex" justify="center" >
                                <Col xs={23} xl={24}>
                                    <Row type="flex" align="middle" justify="center">
                                        <Col xl={24}>
                                            <Row type="flex" align="middle" justify="center">
                                                <Col>
                                                    <span className="prodsToSaleTitle"><u>Product price</u></span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={2}>
                                            <Row type="flex" align="middle" justify="end">
                                                <Col>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={23}> <Row type="flex" align="middle" justify="center"><Col><span className="prodsToSaleInfo">{props.prodPrice}</span></Col></Row></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}
export default AllProdsToSale

