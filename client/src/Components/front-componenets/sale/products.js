import React from "react";
import GoBack from "../../../Components/goBack";
import SaleCard from "../SaleCard";
import { Col, Row } from "antd";


function SaleProducts(props) {
  const Products =
    props.prods &&
    props.prods.map(product => {
      console.log(product)
      return (
        <SaleCard
          key={product._id}
          title={product.productName}
          price={props.sale.prods.map(saleProduct => {
            if (product._id === saleProduct.prodId) {
              return saleProduct.newPrice;
            }
          })}
          favorite={
            props.favorites &&
            props.favorites.filter(
              favorProd => favorProd.productId === product._id
            ).length
          }
          clickFavor={() => {
            props.toggleFavorite(product);
          }}
          oldPrice={product.price}
          imageUrl={product.image}
          product={product}
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
             <GoBack color={"black"}/>
            </Col>
            <Col span={22} className="text-center">
              <h2>{props.sale.saleName}</h2>
            </Col>
            <Col span={24} md={18} xl={12}>
              <Row>{Products}</Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SaleProducts;
