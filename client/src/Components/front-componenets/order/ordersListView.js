import React from "react";
import { Table, Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import OrderView from "./orderView";
import moment from "moment";
const ordersListView = props => {

    function redirectToProduct(product){
        props.history.push({
          pathname: "/product",
          search: "?q=" + product._id,
          state: { product: product }
        });
      };

  const columns = [
    {
      title: "Order id",
      dataIndex: "orderId",
      key: "order",
      render: record => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            const { history } = props;
            history.push({
              pathname: "/order",
              search: "?q=" + record
            });
          }}
        >
          <Col className="d-none d-md-block">{record}</Col>
          <Col className="d-md-none">{record.slice(3, -15) + "..."}</Col>
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (b, a) => a.diff - b.diff,
      sortDirections: ["ascend", "descend"]
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (b, a) => moment(a).unix() - moment(b).unix(),
      sortDirections: ["ascend", "descend"]
    }
  ];

  const tableData =
    props.orders &&
    props.orders.length &&
    props.orders.map(order => {
      return {
        key: order._id,
        orderId: order._id,
        date: moment(order.dateOfPurchased).format("DD-MM-YYYY"),
        products: order.products,
        totalSum: order.totalSum,
        status: order.status
      };
    });

  return (
    <div>
      <Row type="flex" justify="center">
        <Col
          span={22}
          sm={18}
          lg={12}
          className="mt-3 mb-3"
          style={{ backgroundColor: "white" }}
        >
          <Table
            size="middle"
            columns={columns}
            dataSource={tableData}
            expandedRowRender={record => (
              <Row>
                <Col span={24}>
                  <OrderView
                    totalSum={record.totalSum}
                    orderItems={record.products}
                    redirectToProduct={redirectToProduct}
                  />
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(ordersListView);
