import React, { Component } from "react";
import "../CSS/Admin  CSS/salesPanel.css";
import {
  Row,
  Col,
  Input,
  Table,
  Spin,
  Icon,
  Tooltip,
  Select,
  Radio,
  message,
  Popconfirm,
  Switch,
  Checkbox,
  DatePicker
} from "antd";
import {
  GET_ALL_SALES,
  GET_ALL_PROD,
  DELETE_SALE,
  GET_PROD_BY_ID,
  UPDATE_SALE,
  GET_SALE_BY_ID,
  UPLOAD_PICTURE
} from "../Api/api";
import moment from "moment";
import { requestData } from "../RequestData/RequestData";
import { connect } from "react-redux";
import * as action from "../Store/action/action";
import AntModal from "./AntModal";
var endDateValue = null;
var startDateValue = null;
const initState = {
  saleToDelete: "",
  dataSource: [],
  querySales: [],
  dataSourceByFind: [],
  submitDisabled: true,
  selectedRowKeys: [],
  loading: true,
  itemsPerChangeLoading: false,
  paginationPosition: "bottom",
  pageSize: 25,
  selectedSaleProds: [],
  hideDefaultSelections: false,
  modalEditSale: false,
  currentSale: [],
  allProd: [],
  getSaleProds: [],
  currentSaleProd: null,
  currentSaleProdOldPrice: null,
  loading: false,
  campaign: {
    saleName: {
      value: "",
      err: ""
    },
    saleDate: {
      start: {
        tempStart: "",
        startValue: "",
        startErr: ""
      },
      end: {
        endValue: "",
        endErr: ""
      },
      image: ""
    }
  }
};

export class salesList extends Component {
  state = { ...initState };

  async componentDidMount() {
    await this.initProducts();
    this.setState({
      pageSize: this.props.ItemPerPage,
      paginationPosition: this.props.paginationPosition
    });
  }

  onSearchHandler = e => {
    let saleName = e.target.value;
    var copyState = JSON.parse(JSON.stringify(this.state));
    copyState.querySales = copyState.dataSource.filter(sale =>
      sale.saleName.toLowerCase().includes(saleName.toLowerCase())
    );
    this.setState(copyState);
  };

  initProducts() {
    this.setState({ loading: true });
    let data = {
      url: GET_ALL_SALES,
      method: "post"
    };
    requestData(data)
      .then(res => {
        var copyState = JSON.parse(JSON.stringify(this.state));
        copyState.dataSource = res.data;

        this.setState(copyState, () => {
          let data = {
            url: GET_ALL_PROD,
            method: "post"
          };
          requestData(data)
            .then(res => {
              copyState.allProd = res.data;
              copyState.loading = false;
              this.setState(copyState, () => { });
            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onDeleteHandler = index => {
    let data = {
      url: DELETE_SALE,
      method: "post",
      data: { _id: index }
    };
    requestData(data)
      .then(res => {
        this.setState(initState, () => {
          this.initProducts();
        })
      })
      .catch(err => {
        console.log(err);
      });
  };
  getColor = quantity => {
    var color;
    if (quantity > 3 && quantity < 6) {
      color = "geekblue";
    } else if (quantity <= 3) {
      color = "volcano";
    } else {
      color = "green";
    }
    return color;
  };

  onChangeHandler = e => {
    var copyState = JSON.parse(JSON.stringify(this.state));
    copyState.saleToDelete = e.target.value;
    if (e.target.value === "") {
      copyState.dataSourceByFind = [];
    } else {
      copyState.dataSourceByFind = copyState.dataSource.filter(
        index => index.productName == e.target.value
      );
    }
    this.setState(copyState);
  };

  editItemChange = (key, value) => {
    let currentSaleCopyState = JSON.parse(
      JSON.stringify(this.state.currentSale)
    );
    currentSaleCopyState[key] = value;
    this.setState({ currentSale: currentSaleCopyState }, () => {
      var copyState = JSON.parse(JSON.stringify(this.state));
      if (value !== "") {
        copyState.submitDisabled = false;
      } else {
        copyState.submitDisabled = true;
      }
      this.setState(copyState, () => { });
    });
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
  onExpandedRowsChange = e => { };

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

  onEditHandler = item => {
    this.setState(
      {
        modalEditSale: true
      },
      () => {
        var copyState = JSON.parse(JSON.stringify(this.state));
        let selectedSale = copyState.dataSource.filter(
          index => index._id === item
        );
        this.setState({ currentSale: selectedSale[0] }, () => {
          var copyState = JSON.parse(JSON.stringify(this.state));
          copyState.currentSale.prods.map(index => {
            copyState.getSaleProds = [];
            let data = {
              url: GET_PROD_BY_ID,
              method: "post",
              data: { _id: index.prodId }
            };
            requestData(data)
              .then(prod => {
                if (prod.data === "") {
                  return;
                }
                copyState.getSaleProds.push(prod.data);
                this.setState(copyState, () => { });
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    );
  };
  closeModal = () => {
    this.setState(
      {
        modalEditSale: false,
        currentSale: [],
        getSaleProds: [],
        currentSaleProd: null,
        currentSaleProdOldPrice: null
      },
      () => {
        var copyState = JSON.parse(JSON.stringify(this.state));
        copyState.campaign.saleDate.start.startValue = "";
        copyState.campaign.saleDate.end.endValue = "";
        copyState.campaign.saleDate.start.startErr = "";
        copyState.campaign.saleDate.end.endErr = "";
        endDateValue = null;
        startDateValue = null;
        copyState.submitDisabled = true;
        this.setState(copyState);
      }
    );
  };

  onSaleEditHandler = () => {
    this.setState({ loading: true }, () => {
      message.loading("Proccesing changes...");
      var copyState = JSON.parse(JSON.stringify(this.state));
      if (
        copyState.campaign.saleDate.end.endValue !== "" &&
        copyState.campaign.saleDate.start.startValue != ""
      ) {
        copyState.currentSale.dateStart =
          copyState.campaign.saleDate.start.startValue;
        copyState.currentSale.dateEnd =
          copyState.campaign.saleDate.end.endValue;
      }
      if (copyState.campaign.image !== "") {
        copyState.currentSale.image = this.state.campaign.image;
      }
      this.setState(copyState, () => {
        let data = {
          url: UPDATE_SALE,
          method: "post",
          data: {
            _id: this.state.currentSale["_id"],
            saleChange: this.state.currentSale
          }
        };
        console.log(this.state.currentSale);
        requestData(data)
          .then(res => {
            console.log(data);
            this.setState({ loading: false }, () => {
              message.destroy();
              message.success(
                "Succes, sale changed! Refreshing sale list...",
                3
              );
              this.closeModal();
              this.initProducts();
              this.setState({ currentSale: [] });
            });
          })
          .catch(err => {
            message.destroy();
            message.error("Cannot handle the request :(", 3);
          });
      });
    });
  };

  getOriginPrice = () => {
    let currentProduct = this.state.currentSaleProd;
    let allProducts = this.state.getSaleProds;
    return allProducts.map(product => {
      if (product._id === currentProduct) {
        return product.price;
      }
    });
  };

  getSalePrice = () => {
    let currentProduct = this.state.currentSaleProd;
    let saleProducts = this.state.currentSale.prods;
    return saleProducts.map(saleProduct => {
      if (saleProduct.prodId === currentProduct) {
        return saleProduct.newPrice;
      }
    });
  };

  changeProductSalePrice = (products, newPrice) => {
    if (
      /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/.test(newPrice)
    ) {
      this.setState({ submitDisabled: false });
    } else {
      newPrice = this.state.currentSaleProdOldPrice;
      this.setState({ submitDisabled: true });
    }
    let selectedProduct = this.state.currentSaleProd;
    let saleProducts = products;
    let objIndex = saleProducts.findIndex(
      product => product.prodId === selectedProduct
    );
    if (!this.state.currentSaleProdOldPrice) {
      this.setState({
        currentSaleProdOldPrice: saleProducts[objIndex].newPrice
      });
    }
    saleProducts[objIndex].newPrice = newPrice;
    return saleProducts;
  };
  onSaleStatusChangeHandler = sale => {
    let data = {
      url: GET_SALE_BY_ID,
      method: "post",
      data: { data: sale.key }
    };
    requestData(data).then(res => {
      let updateSaleData = {
        url: UPDATE_SALE,
        method: "post",
        data: {
          _id: sale.key,
          saleChange: { status: !res.data.status }
        }
      };
      requestData(updateSaleData).then(saleUpdated => {
        this.initProducts();
      });
    });
  };
  onDateStartChange = dateString => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    startDateValue = dateString;
    let startDate = moment(dateString).format("DD-MM-YYYY");
    let isValid = moment(startDate, "DD-MM-YYYY").fromNow();
    if (startDate.includes("Invalid date")) {
      copyState.campaign.saleDate.start.startErr = "Please enter start date";
      copyState.campaign.saleDate.start.startValue = "";
      copyState.campaign.saleDate.end.endValue = "";
    } else {
      if (isValid.includes("in ") || isValid.includes("hours ago")) {
        copyState.campaign.saleDate.start.tempStart = dateString;
        copyState.campaign.saleDate.start.startErr = "";
      } else {
        copyState.campaign.saleDate.start.startValue = "";
        copyState.campaign.saleDate.start.startErr =
          "Please check the start date";
      }
    }
    this.setState(copyState);
  };

  onDateEndChange = dateString => {
    let copyState = JSON.parse(JSON.stringify(this.state.campaign));
    let endDate = moment(dateString).format("DD-MM-YYYY");
    let startDate = moment(copyState.saleDate.start.tempStart).format(
      "DD-MM-YYYY"
    );
    endDateValue = dateString;
    if (endDate.includes("Invalid date")) {
      copyState.saleDate.end.endErr = "Please enter end date";
      copyState.saleDate.end.endValue = "";
    } else {
      let diff = dateString.diff(copyState.saleDate.start.tempStart, "days");
      if (diff >= 1) {
        copyState.saleDate.end.endValue = endDate;
        copyState.saleDate.start.startValue = startDate;
        copyState.saleDate.end.endErr = "";
      } else {
        copyState.saleDate.end.endValue = "";
        copyState.saleDate.end.endErr = "Please check the end date";
      }
    }
    this.setState({ campaign: copyState }, () => {
      let copyState = JSON.parse(JSON.stringify(this.state));
      if (
        copyState.campaign.saleDate.start.startValue !== "" &&
        copyState.campaign.saleDate.end.endValue !== ""
      ) {
        copyState.submitDisabled = false;
      } else {
        copyState.submitDisabled = true;
      }
      this.setState(copyState);
    });
  };

  onChangeFile = e => {
    e.preventDefault();
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].type.includes("image")) {
        let formData = new FormData();
        formData.append("img", e.target.files[0]);
        let data = {
          method: "post",
          url: UPLOAD_PICTURE,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: formData
        };
        message.loading("Proccesing changes...");
        requestData(data)
          .then(res => {
            copyState.submitDisabled = false;
            copyState.campaign.image = res.data;
            this.setState(copyState, () => {
              message.destroy();
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        copyState.submitDisabled = true;
        copyState.campaign.image = "";
      }
    } else {
      copyState.submitDisabled = true;
      copyState.campaign.image = "";
    }
    this.setState(copyState, () => { });
  };

  render() {
    const { Option } = Select;
    const columns = [
      {
        title: "Sale name",
        dataIndex: "saleName",
        key: "saleName",
        onFilter: (value, record) => record.saleName.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.saleName.toUpperCase() < b.saleName.toUpperCase()) {
            return 1;
          }
          if (a.saleName.toUpperCase() > b.saleName.toUpperCase()) {
            return -1;
          }
        },
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "date",
        key: "date",
        sorter: (b, a) => a.diff - b.diff,
        sortDirections: ["ascend", "descend"],
        render: dataIndex => (
          <Row type="flex" align="middle" justify="center">
            <Col span={24}>
              <Row type="flex" align="middle" justify="center">
                <Col span={24}>
                  <Row type="flex" align="middle" justify="center">
                    <Col span={3}>
                      <span>Sale start in</span>
                    </Col>
                    <Col span={6}>{dataIndex.dateStart}</Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row type="flex" align="middle" justify="center">
                    <Col span={3}>
                      <span>Sale end in</span>
                    </Col>
                    <Col span={6}>{dataIndex.dateEnd}</Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row type="flex" align="middle" justify="center">
                    <Col span={3}>
                      <span>Days left</span>
                    </Col>
                    <Col span={6}>
                      {dataIndex.diff > 0 ? (
                        dataIndex.diff
                      ) : (
                          <span>
                            <u>sale was end before {dataIndex.diff * -1} days</u>
                          </span>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        )
      },

      {
        title: "Status",
        key: "status",
        render: record => (
          <span>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.onSaleStatusChangeHandler(record)}
              okText="Yes"
              cancelText="No"
            >
              <Checkbox checked={record.status} />
            </Popconfirm>
          </span>
        ),
        sorter: (b, a) => a.status - b.status,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <span style={{ fontSize: "18.5px" }}>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.onDeleteHandler(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Icon className="pr-3" type="delete" />
            </Popconfirm>

            <Icon
              className="pl-3"
              type="edit"
              onClick={() => this.onEditHandler(record.key)}
            />
          </span>
        )
      }
    ];
    const dataSource = [];
    let salesProds;
    this.state.dataSource.length && this.state.querySales.length
      ? this.state.querySales.map(item => {
        var dateEnd = moment(item.dateEnd, "DD-MM-YYYY");
        let diff = dateEnd.diff(new Date(), "days");
        return dataSource.push({
          key: item._id,
          saleName: item.saleName,
          dateStart: item.dateStart,
          dateEnd: item.dateEnd,
          status: item.status,
          diff: diff
        });
      })
      : this.state.dataSource.map(item => {
        var dateEnd = moment(item.dateEnd, "DD-MM-YYYY");
        let diff = dateEnd.diff(new Date(), "days");
        return dataSource.push({
          key: item._id,
          saleName: item.saleName,
          dateStart: item.dateStart,
          dateEnd: item.dateEnd,
          status: item.status,
          diff: diff
        });
      });

    if (this.state.getSaleProds.length != 0) {
      salesProds = this.state.getSaleProds.map(index => {
        return <Option key={index._id}>{index.productName}</Option>;
      });
    }
    let saleData = (
      <Row>
        {this.state.currentSale &&
          Object.keys(this.state.currentSale).map(sale => {
            let copyState = JSON.parse(JSON.stringify(this.state.currentSale));
            let saleTitle = sale[0].toUpperCase() + sale.substr(1);
            saleTitle = saleTitle.replace("_", " ");
            {
              if (
                sale !== "prods" &&
                sale !== "status" &&
                sale !== "dateStart" &&
                sale !== "dateEnd" &&
                sale !== "image"
              ) {
                return sale === "_id" || sale === "__v" ? null : (
                  <Col span={24} key={sale} className="mt-2 mb-2">
                    <Row type="flex" justify="center" align="middle">
                      <Col md={7} span={24}>
                        <label>{saleTitle}</label>
                      </Col>
                      <Col md={15} span={24}>
                        <Input
                          value={this.state.currentSale[sale]}
                          placeholder={sale}
                          onChange={e =>
                            this.editItemChange(sale, e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                );
              } else if (sale === "status") {
                return sale === "_id" || sale === "__v" ? null : (
                  <Col span={24} key={sale} className="mt-2 mb-2">
                    <Row type="flex" justify="center" align="middle">
                      <Col md={7} span={24}>
                        <label>{saleTitle}</label>
                      </Col>
                      <Col md={15} span={24}>
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          checked={this.state.currentSale[sale]}
                          onChange={() => {
                            copyState[sale] = !copyState[sale];
                            this.setState({ currentSale: copyState }, () => {
                              this.setState({ submitDisabled: false });
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                );
              } else if (sale === "dateStart" || sale === "dateEnd") {
                return sale === "_id" || sale === "__v" ? null : (
                  <Col span={24} key={sale} className="mt-2 mb-2">
                    <Row type="flex" justify="center" align="middle">
                      <Col xs={11} md={8}>
                        <Row type="flex" justify="center" align="middle">
                          <Col>
                            <DatePicker
                              placeholder={sale}
                              format="DD-MM-YYYY"
                              value={
                                sale === "dateEnd"
                                  ? endDateValue
                                  : startDateValue
                              }
                              onChange={
                                sale === "dateEnd"
                                  ? this.onDateEndChange
                                  : this.onDateStartChange
                              }
                              disabled={
                                sale === "dateEnd"
                                  ? this.state.campaign.saleDate.start
                                    .tempStart !== "" &&
                                    this.state.campaign.saleDate.start
                                      .startErr === ""
                                    ? false
                                    : true
                                  : false
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Col span={24}>
                      <Row type="flex" justify="center" align="middle">
                        <Col>
                          <div style={{ color: "red" }}>
                            {sale === "dateEnd"
                              ? this.state.campaign.saleDate.end.endErr
                              : this.state.campaign.saleDate.start.startErr}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                );
              } else if (sale === "image") {
                return sale === "_id" || sale === "__v" ? null : (
                  <Col span={24} key={sale} className="mt-2 mb-2">
                    <Row type="flex" justify="center" align="middle">
                      <Col md={7} span={24}>
                        <label>{saleTitle}</label>
                      </Col>
                      <Col md={15} span={24}>
                        <input
                          type="file"
                          onChange={event => {
                            this.onChangeFile(event, sale);
                          }}
                        />
                        {this.state.campaign.image ? (
                          <img
                            src={this.state.campaign.image}
                            alt="avatar"
                            style={{ width: "50%" }}
                          />
                        ) : (
                            <img
                              src={this.state.currentSale[sale]}
                              alt="avatar"
                              style={{ width: "50%" }}
                            />
                          )}
                      </Col>
                    </Row>
                  </Col>
                );
              } else {
                return sale === "_id" || sale === "__v" ? null : (
                  <Col span={24} key={sale} className="mt-2 mb-2">
                    <Row type="flex" justify="center" align="middle">
                      <Col md={7} span={24}>
                        <label>{saleTitle}</label>
                      </Col>
                      <Col md={15} span={24}>
                        <Select
                          onChange={value =>
                            this.setState({ currentSaleProd: value })
                          }
                          style={{ width: "100%" }}
                        >
                          {salesProds}
                        </Select>
                      </Col>
                      {this.state.currentSaleProd ? (
                        <Col span={24} key={sale}>
                          <Row
                            type="flex"
                            align="middle"
                            justify="center"
                            className="mt-3 mb-3"
                          >
                            <Col md={7} span={24}>
                              <label>Origin price</label>
                            </Col>
                            <Col md={15} span={24}>
                              <Input
                                value={this.getOriginPrice()}
                                disabled={true}
                              />
                            </Col>
                          </Row>
                          <Row
                            type="flex"
                            align="middle"
                            justify="center"
                            className="mt-3 mb-3"
                          >
                            <Col md={7} span={24}>
                              <label>Current price</label>
                            </Col>
                            <Col md={15} span={24}>
                              <Input
                                value={
                                  this.state.currentSaleProdOldPrice
                                    ? this.state.currentSaleProdOldPrice
                                    : this.getSalePrice()
                                }
                                disabled={true}
                              />
                            </Col>
                          </Row>
                          <Row
                            type="flex"
                            align="middle"
                            justify="center"
                            className="mt-3 mb-3"
                          >
                            <Col md={7} span={24}>
                              <label>New price</label>
                            </Col>
                            <Col md={15} span={24}>
                              <Input
                                placeholder="Type new product price for this sale."
                                onChange={event => {
                                  copyState.prods = this.changeProductSalePrice(
                                    copyState.prods,
                                    event.target.value
                                  );
                                  this.setState({ currentSale: copyState });
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      ) : (
                          ""
                        )}
                    </Row>
                  </Col>
                );
              }
            }
          })}
      </Row>
    );
    return (
      <div style={{ height: "100%" }}>
        <Row className="mt-1">
          <AntModal
            visible={this.state.modalEditSale}
            title={"Edit " + this.state.currentSale.saleName}
            cancel={this.closeModal}
            submit={this.onSaleEditHandler}
            content={saleData}
            disabled={
              this.state.submitDisabled ||
              (this.state.campaign.saleDate.end.endValue !== "" &&
                this.state.campaign.saleDate.start.startValue !== "" &&
                this.state.currentSale.saleName !== "" &&
                (this.state.loading !== true ? false : true))
            }
          />
          {/* First Col for filter bar */}
          <Col span={22} style={{ fontSize: "22.5px" }}>
            <Row type="flex" justify="center" align="middle">
              <Col xl={4} md={8} className="text-xl-center text-left mb-3">
                <Tooltip placement="top" title="Click to refresh product list">
                  <Icon
                    type="sync"
                    spin={this.state.loading ? true : false}
                    onClick={() => {
                      this.initProducts();
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
                <span className="pr-1 text-left" style={{ fontSize: "15px" }}>
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
                  placeholder="Search sale by name"
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ItemPerPage: state.reducerUserSettings.itemsPerPage,
    paginationPosition: state.reducerUserSettings.paginationPosition
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
)(salesList);
