import React from "react";
import SaleCard from "../SaleCard";
import GoBack from "../../../Components/goBack";
import { Col, Row } from "antd";

function CategoryProducts(props) {
  const Products =
    props.prods &&
    props.prods.map(product => {
      return (
        <SaleCard
          key={product._id}
          title={product.productName}
          price={product.price}
          imageUrl={product.image}
          product={product}
          favorite={
            props.favorites &&
            props.favorites.filter(
              favorProd => favorProd.productId === product._id
            ).length
          }
          clickFavor={() => {
            props.toggleFavorite(product);
          }}
          clickCart={() => {
            props.addToCartHandler(product);
          }}
        />
      );
    });

  return (
    <div>
      <Row>
        <Col span={24}>
          <Row type="flex" justify="center">
          <Col span={22} className="mt-2 mb-2">
             <GoBack color={"black"} home={true}/>
            </Col>
            <Col span={24} md={18} xl={12}>
              <Row>
                {Products}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default CategoryProducts;
