import React, { Component } from "react";
import { Row, Col, Icon, Spin } from "antd";
import { GET_PROD_BY_ID } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import ProductNotFound from "../../Components/front-componenets/product/ProductNotFound";
import { goBack } from "../../Components/goBack";
import ProductPageItem from "../../Components/front-componenets/product/productPageItem";

const initState = {
  product: null,
  prodNotFound: false,
  loading: true
};

export class ProductPage extends Component {
  state = { ...initState };

  componentDidMount() {
    //in case there isnt any id in the params
    if (!this.props.location.search.slice(3)) {
      this.setState({ prodNotFound: true }, () => console.log(this.state));
    }
    this.props.location.search &&
      this.props.location.state &&
      this.props.location.state.product
      ? this.initProduct(this.props.location.state.product)
      : this.getProduct(this.props.location.search.slice(3));
  }

  initProduct = productItem => {
    this.setState({ product: productItem }, () => {
      this.setState({ loading: false });
    });
  };

  getProduct = productId => {
    let data = {
      url: GET_PROD_BY_ID,
      method: "post",
      data: { _id: productId }
    };
    requestData(data)
      .then(res => {
        this.setState({ product: res.data }, () => {
          this.setState({ loading: false });
        });
      })
      .catch(err => {
        this.setState({ prodNotFound: true }, () => {
          this.setState({ loading: false });
        });
      });
  };

  render() {
    return (
      <Row type="flex" justify="center" className="h-100 pb-sm-2 pt-sm-2">
        <Col span={24} className={this.state.loading ? "text-center" : ''}>
          {this.state.loading ? <Spin tip="Loading..."></Spin> : ''}
          {!this.state.loading && this.state.prodNotFound ? <ProductNotFound /> : ''}
          {!this.state.loading && this.state.product ? <ProductPageItem order={this.props.location.state.order} product={this.state.product} /> : ''}
        </Col>
      </Row>
    );
  }
}

export default ProductPage;
