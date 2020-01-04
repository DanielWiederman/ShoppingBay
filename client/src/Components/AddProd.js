import React, { Component } from "react";
import "../CSS/Admin  CSS/salesPanel.css";
import { Row, Col, Button, message } from "antd";
import "../CSS/Admin  CSS/salesPanel.css";
import AddProdForm from "../Components/addProdForm";
import { UPLOAD_PICTURE, ADD_PROD } from "../Api/api";
import { requestData } from "../RequestData/RequestData";
import { withRouter } from "react-router-dom";

const initState = {
  submitDisabled: true,
  fileLoading: false,
  addProdForm: [
    {
      title: "Prod Name",
      type: "textarea",
      err: null
    },
    {
      title: "brand",
      type: "textarea",
      err: null
    },
    {
      title: "category",
      type: "textarea",
      err: null
    },
    {
      title: "price",
      type: "number",
      err: null
    },
    {
      title: "quantity",
      type: "number",
      err: null
    },
    {
      title: "image",
      type: "file",
      loading: false,
      err: null
    }
  ],
  formInfo: {
    ProdName: {
      value: ""
    },
    brand: {
      value: ""
    },
    category: {
      value: ""
    },
    price: {
      value: ""
    },
    quantity: {
      value: ""
    },
    image: {
      value: undefined
    }
  }
};

export class AddProd extends Component {
  state = { ...initState };

  onValueChangeHandler = (event, index) => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (index.title === "Prod Name") {
      if (event.target.value !== "") {
        copyState.formInfo.ProdName.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "";
          }
        });
      } else {
        copyState.formInfo.ProdName.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "You have fill this input!";
          }
        });
      }
    } else if (index.title === "brand") {
      if (event.target.value !== "") {
        copyState.formInfo.brand.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "";
          }
        });
      } else {
        copyState.formInfo.brand.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "You have fill this input!";
          }
        });
      }
    } else if (index.title === "category") {
      if (event.target.value !== "") {
        copyState.formInfo.category.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "";
          }
        });
      } else {
        copyState.formInfo.category.value = event.target.value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "You have fill this input!";
          }
        });
      }
    }
    this.setState(copyState, () => {
      let copyState = JSON.parse(JSON.stringify(this.state));
      if (
        copyState.formInfo.ProdName.value !== "" &&
        copyState.formInfo.brand.value !== "" &&
        copyState.formInfo.category.value !== "" &&
        copyState.formInfo.price.value !== "" &&
        copyState.formInfo.quantity.value !== "" &&
        copyState.formInfo.image.value !== undefined
      ) {
        copyState.submitDisabled = false;
      } else {
        copyState.submitDisabled = true;
      }
      this.setState(copyState);
    });
  };
  valueNumberChange = (value, index) => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (index.title === "price") {
      if (typeof value === "number") {
        copyState.formInfo.price.value = value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "";
          }
        });
      } else {
        copyState.formInfo.price.value = "";
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "You have fill this input!";
          }
        });
      }
    } else if (index.title === "quantity") {
      if (typeof value === "number") {
        copyState.formInfo.quantity.value = value;
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "";
          }
        });
      } else {
        copyState.formInfo.quantity.value = "";
        copyState.addProdForm.map(item => {
          if (item.title === index.title) {
            item.err = "You have fill this input!";
          }
        });
      }
    } else {
    }
    this.setState(copyState, () => {
      let copyState = JSON.parse(JSON.stringify(this.state));
      if (
        copyState.formInfo.ProdName.value !== "" &&
        copyState.formInfo.brand.value !== "" &&
        copyState.formInfo.category.value !== "" &&
        copyState.formInfo.price.value !== "" &&
        copyState.formInfo.quantity.value !== "" &&
        copyState.formInfo.image.value !== undefined
      ) {
        copyState.submitDisabled = false;
      } else {
        copyState.submitDisabled = true;
      }
      this.setState(copyState);
    });
  };

  onChangeFile = e => {
    this.setState({ fileLoading: true });
    let copyState = JSON.parse(JSON.stringify(this.state));
    if (e.target.files[0] !== undefined) {
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
      requestData(data)
        .then(res => {
          copyState.formInfo.image.value = res.data;
          copyState.addProdForm.map(item => {
            if (item.title === "image") {
              item.err = "";
            }
            this.setState({ fileLoading: true });
          });
          this.setState(copyState, () => {
            let copyState = JSON.parse(JSON.stringify(this.state));
            if (
              copyState.formInfo.ProdName.value !== "" &&
              copyState.formInfo.brand.value !== "" &&
              copyState.formInfo.category.value !== "" &&
              copyState.formInfo.price.value !== "" &&
              copyState.formInfo.quantity.value !== "" &&
              copyState.formInfo.image.value !== undefined
            ) {
              copyState.submitDisabled = false;
            } else {
              copyState.submitDisabled = true;
            }
            this.setState(copyState);
          });
        })
        .catch(err => {
          console.log("error\n", err);
        });
    } else {
      copyState.formInfo.image.value = undefined;
      copyState.addProdForm.map(item => {
        if (item.title === "image") {
          item.err = "You have fill this input!";
        }
      });
      this.setState(copyState, () => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        if (
          copyState.formInfo.ProdName.value !== "" &&
          copyState.formInfo.brand.value !== "" &&
          copyState.formInfo.category.value !== "" &&
          copyState.formInfo.price.value !== "" &&
          copyState.formInfo.quantity.value !== "" &&
          copyState.formInfo.image.value !== undefined
        ) {
          copyState.submitDisabled = false;
        } else {
          copyState.submitDisabled = true;
        }
        this.setState(copyState);
      });
    }
  };

  onclickHandler = () => {
    message.loading("Loading...")
    let newProd = {
      productName: this.state.formInfo.ProdName.value,
      brand: this.state.formInfo.brand.value,
      category: this.state.formInfo.category.value,
      price: this.state.formInfo.price.value,
      quantity: this.state.formInfo.quantity.value,
      image: this.state.formInfo.image.value
    };
    let data = {
      method: "post",
      url: ADD_PROD,
      data: newProd
    };
    requestData(data)
      .then(res => {
        message.destroy()
        message.success("Successfly added " + newProd.productName, 3)
      })
      .catch(err => {
        message.destroy()
        message.error("Error! :(")
        console.log(err);
      });
  };
  render() {
    let addProdForm = this.state.addProdForm.map(index => {
      return (
        <AddProdForm
          key={index.title}
          title={index.title}
          type={index.type}
          err={index.err}
          valueNumberChange={value => this.valueNumberChange(value, index)}
          valueChange={event => this.onValueChangeHandler(event, index)}
          uploadPic={event => this.onChangeFile(event)}
          loadingFile={this.state.fileLoading}
        />
      );
    });
    return (
      <div>
        <Row type="flex" align="middle" justify="center">
          <Col span={24}>
            <Row type="flex" justify="center">
              <Col span={12}>
                <Row type="flex" justify="center">
                  {addProdForm}
                </Row>
              </Col>
            </Row>
            <Row type="flex" align="middle" justify="center">
              <Col span={24}>
                <Row type="flex" align="middle" justify="center">
                  <Col span={2}>
                    <Button
                      onClick={this.onclickHandler}
                      disabled={this.state.submitDisabled}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(AddProd);
