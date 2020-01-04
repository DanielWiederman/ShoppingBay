import React, { Component } from "react";
import "../CSS/Admin  CSS/salesPanel.css";
import {
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Modal,
  AutoComplete,
  InputNumber,
  message
} from "antd";

import moment from "moment";
import "../CSS/Admin  CSS/salesPanel.css";
import AllProdsToSale from "./AllProdsToSale";
import { GET_ALL_PROD, ADD_SALE, GET_ALL_SALES, UPLOAD_PICTURE } from "../Api/api";
import { requestData } from "../RequestData/RequestData";
import { withRouter } from "react-router-dom";
var endDateValue = null;
var startDateValue = null;
const initState = {
  modalVisible: false,
  modalOkBtn: true,
  newPriceInput: true,
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
      }
    },
    img: {
      imgValue: "",
      imgErr: "",
      fileName: ""
    }
  },
  newProd: {
    price: "",
    prod: ""
  },
  dataSource: [],
  allProdacts: [],
  allProdFromServer: [],
  productsTouploade: [],
  allSales: [],
  loading: false,
};
export class AddSale extends Component {
  state = { ...initState };

  onSubmitHandler = e => {
    this.setState({ loading: true }, () => {
      message.loading('Action in progress..', 0);
    })
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.allProdFromServer.map(index => {
      copyState.allProdacts.map(index2 => {
        if (index.productName === index2.prod) {
          copyState.productsTouploade.push({
            prodId: index._id,
            newPrice: index2.price
          });
        }
      });
    });
    this.setState(copyState, () => {
      let dataToServer = {
        saleName: this.state.campaign.saleName.value,
        dateStart: this.state.campaign.saleDate.start.startValue,
        dateEnd: this.state.campaign.saleDate.end.endValue,
        prods: this.state.productsTouploade,
        status: true,
        image: this.state.campaign.img.imgValue
      };
      let data = {
        url: ADD_SALE,
        method: "post",
        data: dataToServer
      };
      requestData(data)
        .then(res => {
          endDateValue = null;
          startDateValue = null;
          this.setState(initState, () => {
            this.setState({ loading: false }, () => {
              message.destroy()
              message.success('Sale added successfully!', 4);
            })
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false }, () => {
            message.destroy()
            message.error('Error :(', 4);
          })
        });
    });
  };

  onChangeHeadler = e => {
    let copyCampaign = JSON.parse(JSON.stringify(this.state.campaign));
    if (e.target.name === "saleName") {
      if (e.target.value !== "") {
        copyCampaign.saleName.value = e.target.value;
        copyCampaign.saleName.err = "";
      } else {
        copyCampaign.saleName.value = e.target.value;
        copyCampaign.saleName.err = "Please check the sale name";
      }
    }
    this.setState({ campaign: copyCampaign });
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
    this.setState({ campaign: copyState });
  };

  FilterProductOnModal = () => {
    let data = {
      url: GET_ALL_PROD,
      method: "post"
    };
    requestData(data).then(allProdsData => {
      let data2 = {
        url: GET_ALL_SALES,
        method: "post"
      }
      requestData(data2).then(allSalesData => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.allSales = []
        copyState.dataSource = [];

        //copyState recieve all the sales data.
        allSalesData.data.map(index => {
          copyState.allSales.push(index);
        });

        //filter products that are already listened in other sales.
        copyState.allSales.map(sales => {
          let saleProd = [];
          saleProd = sales.prods
          saleProd.map(index => {
            allProdsData.data = allProdsData.data.filter(prod => prod._id !== index.prodId)
          })
        })

        //insert into the select the products after filter.
        allProdsData.data.map(index => {
          copyState.dataSource.push(index.productName);
        });

        //this prevent to double insert the same product.
        if (copyState.allProdacts.length > 0) {
          copyState.dataSource.map(index => {
            copyState.allProdacts.map(index2 => {
              if (index === index2.prod) {
                copyState.dataSource = copyState.dataSource.filter(
                  prod => prod !== index
                );
              }
            });
          });
        }

        //if everything is set and ready this will make modal visible.
        this.setState(copyState, () => {
          copyState.allProdFromServer = allProdsData.data;
          this.setState(copyState, () => {
            this.setState({
              modalVisible: true
            });
          });
        });
      }).catch(err => {
        console.log(err)
      })
    })
      .catch(err => {
        console.log(err);
      });
  };

  handleAddingProductIntoSale = e => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.allProdacts.push(this.state.newProd);
    this.setState(copyState, () => {
      copyState.modalOkBtn = true;
      copyState.newPriceInput = true;
      copyState.modalVisible = false;
      this.setState(copyState, () => {
        this.setState(copyState, () => {
          copyState.newProd.prod = "";
          copyState.newProd.price = "";
          this.setState(copyState, () => {
            console.log(this.state.allProdacts)
          });
        });
      });
    });
  };

  handleRemoveProductIntoSale = e => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.modalOkBtn = true;
    copyState.newPriceInput = true;
    copyState.modalVisible = false;
    copyState.newProd.prod = "";
    copyState.newProd.price = "";
    this.setState(copyState);
  };

  handleSearch = value => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.newProd.prod = value;
    if (value === "") {
      copyState.newPriceInput = true;
      copyState.modalOkBtn = true;
      copyState.newProd.price = "";
    }
    this.setState(copyState);
  };

  onSelect = value => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.newProd.prod = value;
    copyState.newPriceInput = false;
    this.setState(copyState);
  };

  onChangePriceHeadler = value => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (value > 0) {
      copyState.newProd.price = value;
      copyState.modalOkBtn = false;
    } else {
      copyState.modalOkBtn = true;
    }
    this.setState(copyState);
  };

  onConfirmHandler = index => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.allProdacts = copyState.allProdacts.filter(
      prod => prod.prod !== index.prod
    );
    copyState.dataSource.push(index.prod);
    this.setState(copyState);
  };

  onChangeFile = e => {
    e.preventDefault();
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].type.includes("image")) {
        let formData = new FormData();
        formData.append("img", e.target.files[0]);
        copyState.campaign.img.fileName = e.target.files[0].name
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
            copyState.campaign.img.imgErr = ""
            copyState.campaign.img.imgValue = res.data
            this.setState(copyState, () => {
              message.destroy();
            })
          }).catch(err => {
            console.log(err)
          })

      } else {
        copyState.campaign.img.imgValue = ""
        copyState.campaign.img.fileName = ""
        copyState.campaign.img.imgErr = "Please check the image"
      }
    } else {
      copyState.campaign.img.imgValue = ""
      copyState.campaign.img.fileName = ""
      copyState.campaign.img.imgErr = " Please enter image for this sale"
    }
    this.setState(copyState, () => {
    })
  };


  render() {
    let allProdsToSale = this.state.allProdacts.map(index => {
      return (
        <AllProdsToSale
          key={index.prod}
          prodName={index.prod}
          prodPrice={index.price}
          confirm={() => {
            this.onConfirmHandler(index);
          }}
        />
      );
    });

    return (
      <div style={{ height: "100%" }}>
        <Row type="flex" justify="center" style={{ height: "50%" }}>
          <Col span={24}>
            <Row type="flex" justify="center" className="saleNameNDate">
              {/*I added this col and row and throw inside all the inputs, i did it because you want have a group control and set
                            col length in the main COL and not in each input container... */}
              <Col span={22} md={20} lg={10} xl={8}>
                <Row type="flex" justify="center" style={{ height: "100%" }}>
                  {/*I Throwed all your inputs and logic here, inside but its still not enough, you DONT NEED to be in situation when
                            you need to change span/md/lg/xl to each input... THIS IS WRONG and alot of work! */}
                  <Col span={23}>
                    {/*You should make each input warpper that listen and set his size by the main Col here. */}
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ height: "50%" }}
                    >
                      <Col xs={24} md={5} lg={7} xl={5}>
                        <Row type="flex" justify="start" align="middle">
                          <Col>
                            <span>Sale name:</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} md={19} lg={17} xl={19}>
                        <Row type="flex" justify="center" align="middle">
                          <Col span={24}>
                            <Input
                              name="saleName"
                              placeholder="Sale name"
                              value={this.state.campaign.saleName.value}
                              onChange={this.onChangeHeadler}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row type="flex" justify="center" align="middle">
                          <Col>
                            <span style={{ color: "red" }}>
                              {this.state.campaign.saleName.err}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={23}>
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ height: "50%" }}
                    >
                      <Col xs={24} md={3}>
                        <Row type="flex" justify="start" align="middle">
                          <Col>
                            <span>Date:</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={11} md={8}>
                        <Row type="flex" justify="center" align="middle">
                          <Col>
                            <DatePicker
                              placeholder="Start sale date"
                              format="DD-MM-YYYY"
                              value={startDateValue}
                              onChange={this.onDateStartChange}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={2} md={5}>
                        <Row type="flex" justify="center" align="middle">
                          <Col>
                            <span>-</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={11} md={8}>
                        <Row type="flex" justify="center" align="middle">
                          <Col>
                            <DatePicker
                              placeholder="End sale date"
                              format="DD-MM-YYYY"
                              value={endDateValue}
                              onChange={this.onDateEndChange}
                              disabled={
                                this.state.campaign.saleDate.start.tempStart !==
                                  "" &&
                                  this.state.campaign.saleDate.start.startErr ===
                                  ""
                                  ? false
                                  : true
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row type="flex" justify="center" align="middle">
                      <Col >
                        <div style={{ color: "red" }}>
                          {this.state.campaign.saleDate.start.startErr}
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                      <Col>
                        <span style={{ color: "red" }}>
                          {this.state.campaign.saleDate.end.endErr}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row ype="flex" justify="center" align="middle">
                  <Col span={24}>
                    <Row type="flex" justify="center" align="middle">
                      <Col span={5}>
                        <Row type="flex" justify="center" align="middle">
                          <Col span={23}>
                            <span>Image: </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={3}>
                        <Row type="flex" justify="center" align="middle" >
                          <Col span={23}>
                            <input type="file" onChange={event => { this.onChangeFile(event) }} filename={this.state.campaign.img.fileName} />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" >
                      <Col span={19}>
                        <Row type="flex" justify="center" align="middle" >
                          <Col span={10} style={{ paddingTop: "10px" }}>
                            <Row type="flex" justify="center" align="middle" >
                              <Col span={6}>
                                {this.state.campaign.img.imgValue ? <span>Your image sale:</span> : ""}
                              </Col>
                              <Col span={18}>
                                <Row type="flex" justify="center" align="middle">
                                  {this.state.campaign.img.imgValue ? <img src={this.state.campaign.img.imgValue} alt="avatar" style={{ width: '200px', height: "125px" }} /> : ""}
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                      <Col>
                        <span style={{ color: "red" }}>
                          {this.state.campaign.img.imgErr}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row type="flex" justify="center" align="middle">
                  <Col>
                    <Button type="primary" onClick={this.FilterProductOnModal}>
                      Add product
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="center"
              align="middle"
              className="submitConCss"
            >
              <Col>
                <Button
                  ghost={true}
                  onClick={() => {
                    this.onSubmitHandler();
                  }}
                  disabled={
                    (this.state.allProdacts.length > 0) &&
                      (this.state.campaign.img.imgValue !== "") &&
                      (this.state.campaign.saleDate.end.endValue !== "") &&
                      (this.state.campaign.saleDate.start.startValue !== "") &&
                      (this.state.campaign.saleName.value !== "") &&
                      (this.state.loading !== true)
                      ? false
                      : true
                  }
                  loading={this.state.loading ? true : false}
                  type="primary"
                >
                  Submit
                </Button>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="center"
              className="allProdsNTitleCon"
              style={{
                display: this.state.allProdacts.length > 0 ? "block" : "none"
              }}
            >
              <Col span={24}>
                <Row type="flex" justify="center" align="middle">
                  <Col>
                    <h4>
                      <u>Products</u>
                    </h4>
                  </Col>
                </Row>
                <Row type="flex" justify="center">
                  <Col span={23} style={{ padding: "2px" }}>
                    <Row type="flex" style={{ height: "100%" }}>
                      {allProdsToSale}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          title="Product"
          visible={this.state.modalVisible}
          onOk={this.handleAddingProductIntoSale}
          onCancel={this.handleRemoveProductIntoSale}
          okButtonProps={{ disabled: this.state.modalOkBtn }}
        >
          <div>
            <Row type="flex" justify="center" align="middle">
              <Col span={24}>
                <Row type="flex" justify="center" align="middle">
                  <Col span={12}>
                    <span>Product name: </span>
                  </Col>
                  <Col span={12}>
                    <AutoComplete
                      dataSource={this.state.dataSource}
                      onSelect={this.onSelect}
                      onSearch={this.handleSearch}
                      placeholder="Product name"
                      value={this.state.newProd.prod}
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row type="flex" justify="center" align="middle">
                  <Col span={12}>
                    <span>New price: </span>
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      className="inputNumberModal"
                      value={this.state.newProd.price}
                      placeholder="New price"
                      min={0}
                      onChange={this.onChangePriceHeadler}
                      disabled={this.state.newPriceInput}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal>
      </div >
    );
  }
}
export default withRouter(AddSale);
