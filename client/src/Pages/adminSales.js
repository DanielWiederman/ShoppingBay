import React, { Component } from 'react'
import {
    Row,
    Col,
    Button,
    Table,
    Drawer,
} from 'antd';
import AddSale from "../Components/AddSale"
import Swiper from '../Components/swiperMobile'
import CustomMenu from "../Components/AdminMenu"
import TotalInfo from "../Components/AdminTotalInfo"
import GoBack from '../Components/goBack'
import SalesList from "../Components/salesList"

const copyState = {
    navTabs: ["Active sales", "Add sale", "saleList", "End or delete sale"],
    menu: [
        {
            title: "Add sale", icon: "fas fa-plus"
        },
        {
            title: "Sale list", icon: "fas fa-file-contract"
        },
    ],
    totalInfo: [{
        title: "TOTAL SALES",
        total: "130$"
    }, {
        title: "MY EARNINGS",
        total: "114$"
    }, {
        title: "AFILIATE EARINIGS",
        total: "0$"
    }, {
        title: "REFUNDS",
        total: "10$"
    }],
    table: {
        dataSource: [
            {
                key: '1',
                saleName: 'Mike',
                buyersQuantity: 32,
                earn: '10',
                saleNumber: "500",
                date: "30/10/2019-30/8/2019 "
            },
            {
                key: '2',
                saleName: 'John',
                buyersQuantity: 42,
                earn: '20 ',
                saleNumber: "500",
                date: "30/10/2019 - 30/8/2019 "
            },

        ],

        columns: [
            {
                title: 'Sale name',
                dataIndex: 'saleName',
                key: 'saleName',
            },
            {
                title: 'Buyers quantity',
                dataIndex: 'buyersQuantity',
                key: 'buyersQuantity',
            },
            {
                title: 'Earn',
                dataIndex: 'earn',
                key: 'earn',
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date ',
            },
            {
                title: 'Sale number',
                dataIndex: 'saleNumber',
                key: 'saleNumber',
            },
        ]
    },
    dataToDisplay: "",
    visible: false,
}



export class adminSales extends Component {
    state = { ...copyState }

    onMenuClickHeadler = (userClicked) => {
        if (userClicked.title === "Add sale") {
            this.setState({ dataToDisplay: userClicked.title })
        }
        else if (userClicked.title === "saleList") {
            this.setState({ dataToDisplay: userClicked.title })
        }
        else {
            this.setState({ dataToDisplay: userClicked.title })
        }

    }
    showDrawer = () => {
        this.setState({ visible: true })
    };

    onClose = () => {
        this.setState({ visible: false });
    };
    render() {

        let totalInfo = this.state.totalInfo.map(index => {
            return (
                <TotalInfo
                    key={index.title}
                    title={index.title}
                    total={index.total}
                />
            )
        })
        let menu = this.state.menu.map(index => {
            return (
                <CustomMenu
                    key={index.title}
                    title={index.title}
                    icon={index.icon}
                    selectedRow={this.state.dataToDisplay}
                    click={() => this.onMenuClickHeadler(index)}
                />
            )
        })



        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Row>
                    <Col span={24} md={0} >
                        <Swiper data={this.state.navTabs} />
                    </Col>
                </Row>
                <Row type="flex" justify="center" className="mobileHeight">
                    <Col span={23} md={24} className="contentCon" >
                        <Row type="flex" style={{ height: "100%" }}>
                            <Col span={0} md={6} lg={6} xl={4} className="menuCon">
                                <Row type="flex" justify="center">
                                    <Col span={22}>
                                        <GoBack color={"white"} />
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" align="top" style={{ height: "10%", borderBottom: "2px solid gray" }}>
                                    <Col xl={16} md={21} style={{ height: "100%" }}>
                                        <Row type="flex" justify="center" align="middle" style={{ height: "50%" }}>
                                            <Col className="menuTitle"><span>{"Admin Panel"}</span></Col>
                                        </Row>
                                        <Row type="flex" justify="center" align="middle" style={{ height: "50%" }}>
                                            <Col className="menuPathname"><span>{this.props.location.pathname.slice(1).charAt(0).toUpperCase() + this.props.location.pathname.slice(2)}</span></Col>
                                        </Row>

                                    </Col>
                                </Row>

                                <Row type="flex" justify="center" align="middle" style={{ height: "80%" }}  >
                                    <Col md={24} style={{ height: "100%" }}   >
                                        <Row type="flex" justify="center" align="middle" className="pt-2 pb-2">
                                            {menu}
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" align="top" style={{ borderTop: "2px solid gray" }} >
                                    <Col span={24} style={{ height: "100%" }}>
                                        <Row type="flex" justify="center" align="middle" style={{ height: "100%" }}>
                                            <Col className="menuTitle"><span></span></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24} md={0} style={{ height: "10%" }} >
                                <Row type="flex" justify="center">
                                    <Col span={24} >
                                        <Drawer
                                            bodyStyle={{ height: "100%", backgroundColor: "#18113a" }}
                                            placement="right"
                                            onClose={this.onClose}
                                            visible={this.state.visible} >
                                            <Row type="flex" align="middle" justify="center" style={{ height: "100%" }}>
                                                <Col span={24} className="menuCon" >
                                                    <Row type="flex" justify="center" align="top" style={{ height: "10%", borderBottom: "2px solid gray" }} >
                                                        <Col span={24} style={{ height: "100%" }}>
                                                            <Row type="flex" justify="center" align="middle" style={{ height: "50%" }}>
                                                                <Col className="menuTitle"><span>{"Admin Panel"}</span></Col>
                                                            </Row>
                                                            <Row type="flex" justify="center" align="middle" style={{ height: "50%" }}>
                                                                <Col className="menuPathname"><span>{this.props.location.pathname.slice(1).charAt(0).toUpperCase() + this.props.location.pathname.slice(2)}</span></Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                    <Row type="flex" justify="center" align="middle" style={{ height: "80%" }}  >
                                                        <Col md={24} style={{ height: "100%" }}   >
                                                            <Row type="flex" justify="center" align="middle" className="iconCon">
                                                                {menu}
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                    <Row type="flex" justify="center" align="top">
                                                        <Col span={24} style={{ height: "100%" }}>
                                                            <Row type="flex" justify="center" align="middle" style={{ height: "100%" }}>
                                                                <Col className="menuTitle"><span>{"Admin Email"}</span></Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Drawer>
                                    </Col>
                                </Row>
                                <Row type="flex" align="bottom" justify="center" style={{ height: "100%" }}>
                                    <Col span={23}>
                                        <Button type="primary" onClick={this.showDrawer}>
                                            Menu
                                    </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} md={18} xl={20} style={{ height: "90%" }}>
                                <Row type="flex" align="middle" justify="center" style={{ height: "100%" }}>
                                    <Col span={23} md={21} style={{ display: this.state.dataToDisplay === "" ? "block" : "none" }}  >
                                        <Row type="flex" justify="center" style={{ height: "100%" }}>
                                            <Col>
                                                <h1><u>Welcome to manage sales</u></h1>
                                                <h3>Here you can manage your sales</h3>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} md={21} className="tableNtotalInfoCon mt-5 mb-5" style={{ display: this.state.dataToDisplay !== "" ? "block" : "none", height: "100%" }}>
                                        <Row type="flex" justify="center" style={{ height: "20%" }} >
                                            <Col span={24} >
                                                <Row type="flex" align="middle" justify="center" style={{ height: "100%" }} className="pt-3">
                                                    <Col>
                                                        <h3><u>{this.state.dataToDisplay}</u></h3>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={24} md={23} style={{ height: "80%" }}>
                                                <Row type="flex" justify="center" style={{ display: this.state.dataToDisplay === "Active sales" ? "block" : "none" }} >
                                                    <Col span={24} md={24} className="totalInfo" >
                                                        <Row type="flex" justify="center">
                                                            {totalInfo}
                                                        </Row>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Table dataSource={this.state.table.dataSource} columns={this.state.table.columns} size={"middle"} />
                                                    </Col>
                                                </Row>
                                                <Row type="flex" justify="center" style={{ display: this.state.dataToDisplay === "Add sale" ? "block" : "none", height: "100%" }}  >
                                                    <Col span={24}>
                                                        <AddSale />
                                                    </Col>
                                                </Row>
                                                <Row type="flex" justify="center" style={{ display: this.state.dataToDisplay === "Sale list" ? "block" : "none", height: "100%" }}  >
                                                    <Col span={24}>
                                                        <SalesList />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default adminSales
