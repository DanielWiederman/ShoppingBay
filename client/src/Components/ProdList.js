import React, { Component } from "react";
import "../CSS/Admin  CSS/salesPanel.css";
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
  Checkbox,
  Popconfirm
} from "antd";
import {
  GET_ALL_PROD,
  DELETE_PROD,
  EDIT_PROD,
  ADD_HOT_PRODUCT,
  REMOVE_HOT_PRODUCT
} from "../Api/api";
import { requestData } from "../RequestData/RequestData";
import { connect } from "react-redux";
import * as action from "../Store/action/action";
import AntModal from "./AntModal";

const initState = {
  prodToDelete: "",
  dataSource: [],
  queryProducts: [],
  dataSourceByFind: [],
  submitDisabled: true,
  selectedRowKeys: [],
  modalEditProduct: false,
  loading: true,
  itemsPerChangeLoading: false,
  paginationPosition: "bottom",
  currentItem: [],
  pageSize: 25
};

const { Option } = Select;

export class ProdList extends Component {
  state = { ...initState };

  async componentDidMount() {
    await this.initProducts();
    this.setState({
      pageSize: this.props.ItemPerPage,
      paginationPosition: this.props.paginationPosition
    });
  }

  onSearchHandler = e => {
    let productName = e.target.value;
    var copyState = JSON.parse(JSON.stringify(this.state));
    copyState.queryProducts = copyState.dataSource.filter(product =>
      product.productName.toLowerCase().includes(productName.toLowerCase())
    );
    this.setState(copyState);
  };

  initProducts() {
    this.setState({ loading: true });
    let data = {
      url: GET_ALL_PROD,
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

  onDeleteHandler = productId => {
    let data = {
      url: DELETE_PROD,
      method: "post",
      data: { _id: productId }
    };
    requestData(data)
      .then(res => {
        message.success(res.data.msg, 4);
        this.setState(initState, () => {
          this.initProducts();
        });
      })
      .catch(err => {
        message.error("unknown error at deleting product productId", 4);
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
    copyState.prodToDelete = e.target.value;
    if (e.target.value === "") {
      copyState.dataSourceByFind = [];
    } else {
      copyState.dataSourceByFind = copyState.dataSource.filter(
        index => index.productName == e.target.value
      );
    }
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
    this.setState({ modalEditProduct: false, currentItem: [] });
  };

  openModal = id => {
    this.setState({ modalEditProduct: true }, () => {});
  };

  editItemChange = (key, value) => {
    if (key === "price" || key === "quantity") {
      if (!/^\d+$/.test(value)) return;
    }
    let currentItemCopyState = JSON.parse(
      JSON.stringify(this.state.currentItem)
    );
    currentItemCopyState[key] = value;
    this.setState({ currentItem: currentItemCopyState }, () => {});
  };

  editProductHandler = () => {
    message.loading("Proccesing changes");
    let data = {
      url: EDIT_PROD,
      method: "post",
      data: this.state.currentItem
    };
    requestData(data)
      .then(res => {
        message.destroy();
        message.success(
          "Succes, product changed! Refreshing product list...",
          4
        );
        this.closeModal();
        this.initProducts();
        this.setState({ currentItem: [] });
      })
      .catch(err => {
        message.destroy();
        message.error("Cannot handle the request :(", 4);
      });
  };

  hotProdToggle = (id, status) => {
    message.loading("Proccesing changes");
    let data = {
      url: status ? REMOVE_HOT_PRODUCT : ADD_HOT_PRODUCT,
      method: "post",
      data: { prodId: id }
    };
    requestData(data)
      .then(res => {
        message.destroy();
        message.success("Succes, refreshing product list...", 4);
        this.initProducts();
      })
      .catch(err => {
        message.destroy();
        message.error(err.response.data.msg, 4);
      });
  };

  render() {
    const columns = [
      {
        title: "Product name",
        dataIndex: "productName",
        key: "productName",
        onFilter: (value, record) => record.productName.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.productName.toUpperCase() < b.productName.toUpperCase()) {
            return 1;
          }
          if (a.productName.toUpperCase() > b.productName.toUpperCase()) {
            return -1;
          }
        },
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        sorter: (b, a) => a.price - b.price,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Brand",
        dataIndex: "brand",
        key: "brand",
        onFilter: (value, record) => record.brand.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.brand.toUpperCase() < b.brand.toUpperCase()) {
            return 1;
          }
          if (a.brand.toUpperCase() > b.brand.toUpperCase()) {
            return -1;
          }
        },
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        onFilter: (value, record) => record.category.indexOf(value) === 0,
        sorter: (b, a) => {
          if (a.category.toUpperCase() < b.category.toUpperCase()) {
            return 1;
          }
          if (a.category.toUpperCase() > b.category.toUpperCase()) {
            return -1;
          }
        },
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        render: quantity => (
          <span>
            <Tag key={quantity.key} color={this.getColor(quantity)}>
              {quantity}
            </Tag>
          </span>
        ),
        sorter: (b, a) => a.quantity - b.quantity,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Hot Product",
        key: "hotProd",
        render: record => (
          <span>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.hotProdToggle(record.key, record.hotProd)}
              okText="Yes"
              cancelText="No"
            >
              <Checkbox checked={record.hotProd} />
            </Popconfirm>
          </span>
        ),
        sorter: (b, a) => a.hotProd - b.hotProd,
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <span style={{ fontSize: "18.5px" }}>
            <Icon
              className="pr-3"
              type="delete"
              onClick={() => this.onDeleteHandler(record.key)}
            />
            <Icon
              className="pl-3"
              type="edit"
              onClick={() => {
                this.setState({ currentItem: record }, () => {
                  this.openModal(record);
                });
              }}
            />
          </span>
        )
      }
    ];

    const dataSource = [];

    this.state.dataSource.length && this.state.queryProducts.length
      ? this.state.queryProducts.map(item => {
          return dataSource.push({
            key: item._id,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            brand: item.brand,
            category: item.category,
            hotProd: item.hotProd
          });
        })
      : this.state.dataSource.map(item => {
          return dataSource.push({
            key: item._id,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            brand: item.brand,
            category: item.category,
            hotProd: item.hotProd
          });
        });

    let productData = (
      <Row>
        {this.state.currentItem &&
          Object.keys(this.state.currentItem).map(product => {
            let productTitle = product[0].toUpperCase() + product.substr(1);
            productTitle = productTitle.replace("_", " ");
            {
              return product === "key" || product === "hotProd" ? null : (
                <Col span={24} key={product} className="mt-2 mb-2">
                  <Row type="flex" justify="center" align="middle">
                    <Col md={7} span={24}>
                      <label>{productTitle}</label>
                    </Col>
                    <Col md={15} span={24}>
                      <Input
                        value={this.state.currentItem[product]}
                        placeholder={product}
                        onChange={e =>
                          this.editItemChange(product, e.target.value)
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              );
            }
          })}
      </Row>
    );

    return (
      <div style={{ height: "100%" }}>
        <AntModal
          visible={this.state.modalEditProduct}
          title={"Edit " + this.state.currentItem.productName}
          cancel={this.closeModal}
          submit={this.editProductHandler}
          content={productData}
        />
        <Row>
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
                  placeholder="Search product by name"
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
)(ProdList);
