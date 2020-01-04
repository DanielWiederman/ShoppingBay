import React from "react";
import { Table, Row, Col, Tag, Select, Descriptions, message } from "antd";
import { withRouter } from "react-router-dom";
import { UPDATE_ORDER } from "../../../Api/api";
import { requestData } from "../../../RequestData/RequestData";
import OrderView from "./orderView";
import moment from "moment";

const { Option } = Select;

const ordersAdminListView = props => {
  const colors = {
    pending: "red",
    approved: "orange",
    shipped: "green",
    canceled: "#111111"
  };

  function redirectToProduct(product) {
    props.history.push({
      pathname: "/product",
      search: "?q=" + product._id,
      state: { product: product }
    });
  }

  function toggleStatus(status, orderId) {
    let data = {
      url: UPDATE_ORDER,
      method: "post",
      data: { orderId: orderId, status: status }
    };
    requestData(data).then(res => {
      message.success(res.data.msg, 2)
      props.getOrders();
    });
  }

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
      title: "Customer name",
      dataIndex: "customer",
      key: "customer",
      sorter: (b, a) => {
        if (a.customer.firstName.toUpperCase() < b.customer.firstName.toUpperCase()) {
          return 1;
        }
        if (a.customer.firstName.toUpperCase() > b.customer.firstName.toUpperCase()) {
          return -1;
        }
      },
      sortDirections: ["ascend", "descend"],
      render: record => (
        <span>
          {record.firstName[0].toUpperCase() +
            record.firstName.slice(1).toLowerCase() +
            " " +
            record.lastName[0].toUpperCase() +
            record.lastName.slice(1).toLowerCase()}
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (b, a) => a.diff - b.diff,
      sortDirections: ["ascend", "descend"],
      render: (record, dataIndex) => (
        <span>
          <Tag color={colors[record]}>{record}</Tag>
          {record !== "canceled" ? (
            <Col span={24} className="mt-4 mb-2">
              Change order status:
              <br />
              <Select
                className="mt-1"
                defaultValue={record}
                style={{ width: 140 }}
                onSelect={value => toggleStatus(value, dataIndex.orderId)}
              >
                <Option value="pending" disabled={record === "pending"}>
                  pending
                </Option>
                <Option value="approved" disabled={record === "approved"}>
                  approved
                </Option>
                <Option value="shipped" disabled={record === "shipped"}>
                  shipped
                </Option>
                <Option value="canceled">cancel</Option>
              </Select>
            </Col>
          ) : (
              ""
            )}
        </span>
      )
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (b, a) => moment(a).unix() - moment(b).unix(),
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend"
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
        status: order.status,
        customer: order.user
      };
    });

  const customer = props.orders.user;

  return (
    <div>
      <Row type="flex" justify="center">
        <Col
          span={24}
          className="mt-3 mb-5"
          style={{ backgroundColor: "white" }}
        >
          <Table
            size="middle"
            columns={columns}
            dataSource={tableData}
            pagination={props.pagination}
            expandedRowRender={record => (
              <Row>
                <Col span={24}>
                  <Descriptions title="Customer Info" layout="vertical">
                    <Descriptions.Item label="Customer name">
                      {record.customer.firstName[0].toUpperCase() +
                        record.customer.firstName.slice(1).toLowerCase() +
                        " " +
                        record.customer.lastName[0].toUpperCase() +
                        record.customer.lastName.slice(1).toLowerCase()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telephone">
                      {record.customer.phoneNumber.slice(0, -7) +
                        "-" +
                        record.customer.phoneNumber.slice(3)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {record.customer.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>
                      {record.customer.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark">empty</Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={24} className="mt-5">
                  <div className="ant-descriptions-title">Order Info</div>
                  <OrderView
                    noSpacing={true}
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

export default withRouter(ordersAdminListView);
