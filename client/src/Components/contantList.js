import React, { Component } from "react";
import "../CSS/Admin  CSS/contactList.css";
import {
  Row,
  Col,
  Input,
  Table,
  Spin,
  Icon,
  Button,
  Tag,
  Tooltip,
  Select,
  Radio,
  message,
  Popconfirm,
  Checkbox
} from "antd";
import { GET_ALL_USERS, UPDATE_USER } from "../Api/api";
import { requestData } from "../RequestData/RequestData";
import { connect } from "react-redux";
import * as action from "../Store/action/action";
import AntModal from "./AntModal";
import GoBack from "./goBack";

const initState = {
  dataSource: [],
  queryContacts: [],
  dataSourceByFind: [],
  submitDisabled: true,
  selectedRowKeys: [],
  modalSendMessage: false,
  loading: true,
  itemsPerChangeLoading: false,
  paginationPosition: "bottom",
  currentContact: [],
  pageSize: 25
};

const { Option } = Select;

export class contantList extends Component {
  state = { ...initState };

  async componentDidMount() {
    await this.initContacts();
    this.setState({
      pageSize: this.props.ItemPerPage,
      paginationPosition: this.props.paginationPosition
    });
  }

  initContacts() {
    this.setState({ loading: true });
    let data = {
      url: GET_ALL_USERS,
      method: "post"
    };
    requestData(data)
      .then(res => {
        var copyState = JSON.parse(JSON.stringify(this.state));
        copyState.dataSource = res.data;
        copyState.loading = false;
        this.setState(copyState, () => {});
      })
      .catch(err => {
        console.log(err);
      });
  }

  onSearchHandler = e => {
    let contactName = e.target.value;
    var copyState = JSON.parse(JSON.stringify(this.state));
    copyState.queryContacts = copyState.dataSource.filter(product =>
      (
        product.firstName.toLowerCase() +
        " " +
        product.lastName.toLowerCase()
      ).includes(contactName.toLowerCase())
    );
    this.setState(copyState);
  };

  onItemsPerPageChange = value => {
    this.setState({ itemsPerChangeLoading: true }, () => {
      this.props
        .userSettingsChangeItemsPerPage({ value: value, action: "changeItem" })
        .then(res =>
          this.setState({
            itemsPerChangeLoading: false,
            pageSize: parseInt(this.props.ItemPerPage, 10)
          })
        );
    });
  };

  handlePaginationLocationChange = value => {
    this.props
      .userSettingsChangeItemsPerPage({
        value: value.target.value,
        action: "changePagePos"
      })
      .then(res =>
        this.setState({ paginationPosition: this.props.paginationPosition })
      );
  };

  closeModal = () => {
    this.setState({ modalSendMessage: false, currentContact: [] });
  };

  openModal = id => {
    this.setState({ modalSendMessage: true }, () => {});
  };

  handleLockStatus = (userEmail, lockStatus) => {
    this.setState({ loading: true });
    let data = {
      url: UPDATE_USER,
      method: "post",
      data: {
        email: userEmail,
        userChange: {
          lock: !lockStatus
        }
      }
    };
    requestData(data)
      .then(res => {
        this.initContacts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  onAdminChangeHandler = (userEmail, adminStatus) => {
    this.setState({ loading: true });
    if (userEmail === "admin@ShoppingBay.com") {
      message.error("You can't disable admin premission to this user!", 7);
      this.setState({ loading: false });
      return;
    } else if (userEmail === this.props.userData.email) {
      message.error("You can't disable admin premission to yourself!", 5);
      this.setState({ loading: false });
      return;
    }
    let data = {
      url: UPDATE_USER,
      method: "post",
      data: {
        email: userEmail,
        userChange: {
          admin: !adminStatus
        }
      }
    };
    requestData(data)
      .then(res => {
        this.initContacts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const columns = [
      {
        title: "Full name",
        dataIndex: "fullName",
        key: "fullName",
        onFilter: (value, record) => record.fullName.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.fullName.toUpperCase() < b.fullName.toUpperCase()) {
            return 1;
          }
          if (a.fullName.toUpperCase() > b.fullName.toUpperCase()) {
            return -1;
          }
        },
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        sorter: (b, a) => a.age - b.age,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        onFilter: (value, record) => record.gender.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.gender.toUpperCase() < b.gender.toUpperCase()) {
            return 1;
          }
          if (a.gender.toUpperCase() > b.gender.toUpperCase()) {
            return -1;
          }
        },
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        onFilter: (value, record) => record.address.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.address.toUpperCase() < b.address.toUpperCase()) {
            return 1;
          }
          if (a.address.toUpperCase() > b.address.toUpperCase()) {
            return -1;
          }
        },
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Admin",
        key: "admin",
        render: record => (
          <span>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() =>
                this.onAdminChangeHandler(record.email, record.admin)
              }
              okText="Yes"
              cancelText="No"
            >
              <Checkbox checked={record.admin} />
            </Popconfirm>
          </span>
        ),
        sorter: (b, a) => a.admin - b.admin,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Action",
        key: "action",
        render: record =>
          record.admin ? (
            ""
          ) : (
            <span style={{ fontSize: "18.5px" }}>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() =>
                  this.handleLockStatus(record.email, record.lock)
                }
                okText="Yes"
                cancelText="No"
              >
                <Tooltip
                  title={
                    record.lock ? (
                      <span>
                        {" "}
                        This user is locked.
                        <br /> Press to unlock this user.
                      </span>
                    ) : (
                      <span>
                        {" "}
                        This user is unlock.
                        <br />
                        Press to lock this user.
                      </span>
                    )
                  }
                  placement="left"
                >
                  <Icon
                    className="pr-3"
                    type={record.lock ? "unlock" : "lock"}
                  />
                </Tooltip>
              </Popconfirm>

              {/* <Icon
                className="pl-3"
                type="edit"
                onClick={() => {
                  this.setState({ currentContact: record }, () => {
                    this.openModal(record);
                  });
                }}
              /> */}
            </span>
          )
      }
    ];

    const dataSource = [];

    this.state.dataSource.length && this.state.queryContacts.length
      ? this.state.queryContacts.map(contact => {
          return dataSource.push({
            key: contact._id,
            fullName: contact.fullName,
            age: contact.age,
            address: contact.address,
            gender: contact.gender,
            lock: contact.lock,
            email: contact.email,
            admin: contact.admin
          });
        })
      : this.state.dataSource.map(contact => {
          return dataSource.push({
            key: contact._id,
            fullName: contact.fullName,
            age: contact.age,
            address: contact.address,
            gender: contact.gender,
            lock: contact.lock,
            email: contact.email,
            admin: contact.admin
          });
        });

    return (
      <div style={{ height: "100%" }}>
        {/* <AntModal
              visible={this.state.modalEditProduct}
              title={"Edit " + this.state.currentItem.productName}
              cancel={this.closeModal}
              submit={this.editProductHandler}
              content={contact}
            /> */}
        <Row className="h-100" type="flex" justify="center">
          <Col
            span={22}
            md={16}
            className="mt-5 mb-5 pb-4 pt-4 contact-list-container border shadow-lg"
          >
            <Row justify="center">
              {/* First Col for filter bar */}
              <Col span={22} style={{ fontSize: "22.5px" }} className="pb-2">
                <div className="ml-5 pb-5">
                  <GoBack color={"black"} />
                </div>
                <Row type="flex" justify="center" align="middle">
                  <Col xl={4} md={8} className="text-xl-center text-left mb-3">
                    <Tooltip
                      placement="top"
                      title="Click to refresh product list"
                    >
                      <Icon
                        type="sync"
                        spin={this.state.loading ? true : false}
                        onClick={() => {
                          this.initContacts();
                        }}
                      />
                    </Tooltip>
                  </Col>
                  <Col xl={5} md={10} className="text-right text-xl-left">
                    <span
                      className="w-50 text-center pr-1"
                      style={{ fontSize: "15px" }}
                    >
                      Items per page:{" "}
                    </span>
                    <Select
                      defaultValue={this.props.ItemPerPage}
                      loading={this.state.itemsPerChangeLoading ? true : false}
                      className="w-30"
                      onChange={this.onItemsPerPageChange}
                    >
                      <Option value="5">5</Option>
                      <Option value="25">25</Option>
                      <Option value="50">50</Option>
                      <Option value="100">100</Option>
                      <Option value="200">200</Option>
                    </Select>
                  </Col>
                  <Col
                    xl={7}
                    md={24}
                    className="text-center mt-3 mb-3 mt-xl-0 mb-xl-0"
                  >
                    <span
                      className="pr-1 text-left"
                      style={{ fontSize: "15px" }}
                    >
                      Pagination:{" "}
                    </span>
                    <Radio.Group
                      value={this.props.paginationPosition}
                      onChange={this.handlePaginationLocationChange}
                    >
                      <Radio.Button value="top">Top</Radio.Button>
                      <Radio.Button value="bottom">Bottom</Radio.Button>
                      <Radio.Button value="both">Both</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col xl={8} md={24} className="text-xl-right text-center">
                    <Input
                      className="w-75 mb-3 mb-xl-0"
                      placeholder="Search contact by first name"
                      suffix={<Icon type="search" />}
                      onChange={this.onSearchHandler}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {this.state.loading ? (
              <Col span={24} style={{ height: "100%" }}>
                <Row
                  type="flex"
                  justify="center"
                  align="middle"
                  style={{ height: "60%" }}
                >
                  <Col>
                    <Spin size="large" />
                  </Col>
                </Row>
              </Col>
            ) : (
              <Row type="flex" justify="center" align="middle" className="mt-2">
                <Col span={22}>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: true }}
                    pagination={{
                      pageSize: this.state.pageSize,
                      position: this.state.paginationPosition
                    }}
                  />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ItemPerPage: state.reducerUserSettings.itemsPerPage,
    paginationPosition: state.reducerUserSettings.paginationPosition,
    userData: state.userData.userData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userSettingsChangeItemsPerPage: data => dispatch(action.userSettings(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(contantList);
