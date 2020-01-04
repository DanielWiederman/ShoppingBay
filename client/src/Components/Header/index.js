import React, { Component, useEffect } from "react";
import {
  Row,
  Col,
  Icon,
  Input,
  Select,
  Badge,
  Form,
  Button,
  Checkbox,
  message,
  Popover
} from "antd";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
  LOGIN_WITH_CRED,
  UPDATE_USER,
  GET_USER,
  FORGOT_PASSWORD,
  GET_FAVORIT_PRODUCTS_ID_BY_USER_ID,
} from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import { GET_PROD_CATEGORIES } from "../../Api/api";
import { reqLocalStorage } from "../../localStorage/file";
import * as action from "../../Store/action/userDataActions";
import "../../CSS/Header.css";
import Logo from "../../img/ShoppingBay.svg";
import AntModal from "../AntModal";

import CardIcon from "./CardIcon";

const { Option } = Select;
const { Search } = Input;

// u ugly mutherfucker
var copyState = {
  categories: [
    {
      name: "category 1",
      id: 0
    },
    {
      name: "category 2",
      id: 1
    }
  ],
  cartCount: 2,
  searchInput: "",
  selectedCatSearch: "",
  selectedCat: "",
  searchWindow: false,
  loginModal: false,
  isAuth: false, //this property should be in store ONLY and not component query!!! just made example.
  modalData: "",
  findEmail: true,
  forgotPasswordUserData: {
    email: "",
    secAns: "",
    secQes: "",
    newPassword: ""
  },
  emailErrMsg: "",
  userCurrectQus: "",
  showQesInputs: false,
  getPassBtn: true,
  secAnsErrMsg: "",
  cartLength: 0
};

export class Header extends Component {
  state = { ...copyState };

  componentDidMount() {
    this.initCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cartData.length !== prevState.cartLength) {
      this.setState({ cartLength: prevProps.cartData.length });
    }
  }
  //   shouldComponentUpdate(nextProps, nextState) {
  //     return nextProps.cartData.length !== nextState.cartLength
  // }

  initCategories = () => {
    let categories = {
      url: GET_PROD_CATEGORIES,
      method: "get"
    };
    requestData(categories).then(categories => {
      this.setState({ categories: categories.data });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        message.destroy();
        message.loading("checking...", 0);
        let data = {
          url: LOGIN_WITH_CRED,
          method: "post",
          data: {
            email: values.email,
            password: values.password
          }
        };
        requestData(data)
          .then(res => {
            message.destroy();
            let localData = {
              method: "set",
              data: res.data.tokens[res.data.tokens.length - 1].token
            };
            if (values.remember) {
              reqLocalStorage(localData);
            }
            let user = res.data;
            user.fullName = user.firstName + " " + user.lastName;
            delete user.password;
            delete user.tokens;
            delete user.secAns;
            delete user.secQes;
            this.props.saveUser(user).then(res => {
              this.props.turnAuth().then(result => {
                this.setState({ loginModal: false }, () => {
                  const { history } = this.props;
                  this.initFavorite()
                  history.push("/");
                });
              });
            });
          })
          .catch(err => {
            if (err.response.data.msg === "Email not found...") {
              this.props.form.setFieldsValue({
                email: "",
                password: ""
              });
            } else {
              this.props.form.setFieldsValue({
                password: ""
              });
            }
            message.destroy();
            message.error(err.response.data.msg, 5);
          });
      }
    });
  };
  initFavorite = () => {
    let data = {
      url: GET_FAVORIT_PRODUCTS_ID_BY_USER_ID,
      method: "post",
      data: {
        userId: this.props.userData._id,
      }
    };
    requestData(data)
      .then(res => {
        localStorage.setItem("favorite", JSON.stringify(res.data))
      })
      .catch(err => {
        console.log(err);
      });
  }
  onLogoutHandler = () => {
    this.props.saveUser("");
    let dataStorage = {
      method: "remove"
    };
    reqLocalStorage(dataStorage);
    this.props.turnAuth().then(res => {
      const { history } = this.props;
      history.push("/");
    });
  };
  selectCatChange = value => {
    this.setState({ selectCatChange: value }, () => { });
  };

  selectQueryChange = value => {
    this.setState({ selectedCatSearch: value }, () => { });
  };

  searchChangeHandler = value => {
    this.setState({ searchInput: value }, () => { });
  };

  searchHandler = e => {
    if (e.key === "Enter") {
      const { history } = this.props;
      history.push({
        pathname: "/search",
        search:
          `?q=${this.state.searchInput}` +
          `?cat=${this.state.selectedCatSearch}`,
        state: {
          searchInput: this.state.searchInput,
          selectedCatSearch: this.state.selectedCatSearch
        }
      });
    }
  };

  openModal = () => {
    this.setState({ loginModal: true }, () => {
      this.setState({ modalData: "" }, () => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.forgotPasswordUserData.email = "";
        copyState.forgotPasswordUserData.secAns = "";
        copyState.forgotPasswordUserData.secQes = "";
        copyState.forgotPasswordUserData.newPassword = "";
        copyState.emailErrMsg = "";
        copyState.secAnsErrMsg = "";
        copyState.userCurrectQus = "";
        this.setState(copyState, () => {
          this.setState({ showQesInputs: false });
        });
      });
    });
  };

  openForgotPasswordModal = () => {
    this.setState({ modalData: "forGotPassword" });
  };
  closeModal = () => {
    this.setState({ loginModal: false }, () => {
      this.setState({ modalData: "" }, () => {
        let copyState = JSON.parse(JSON.stringify(this.state));
        copyState.forgotPasswordUserData.email = "";
        copyState.forgotPasswordUserData.secAns = "";
        copyState.forgotPasswordUserData.secQes = "";
        copyState.forgotPasswordUserData.newPassword = "";
        copyState.emailErrMsg = "";
        copyState.secAnsErrMsg = "";
        copyState.userCurrectQus = "";
        this.setState(copyState, () => {
          this.setState({ showQesInputs: false });
        });
      });
    });
  };
  emailValid = val => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      val
    );
  };
  checkEmail = event => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.forgotPasswordUserData.email = event.target.value;
    this.setState(copyState, () => {
      if (this.state.forgotPasswordUserData.email !== "") {
        if (this.emailValid(this.state.forgotPasswordUserData.email)) {
          this.setState(copyState, () => {
            this.setState({ findEmail: false }, () => {
              this.setState({ emailErrMsg: "" }, () => { });
            });
          });
        } else {
          this.setState({ emailErrMsg: "Invalid email" }, () => {
            this.setState({ findEmail: true }, () => {
              this.setState({ showQesInputs: false });
            });
          });
        }
      } else {
        this.setState({ emailErrMsg: "Please input your email" }, () => {
          this.setState({ findEmail: true }, () => {
            this.setState({ showQesInputs: false });
          });
        });
      }
    });
  };
  onGetUserHadler = () => {
    let data = {
      url: GET_USER,
      method: "post",
      data: { email: this.state.forgotPasswordUserData.email }
    };
    requestData(data)
      .then(res => {
        if (res.data === "") {
          this.setState({ emailErrMsg: "No email found!" }, () => {
            // if want to delet email input!
            this.setState({ showQesInputs: false }, () => {
              let copyState = JSON.parse(JSON.stringify(this.state));
              copyState.secAnsErrMsg = "";
              copyState.userCurrectQus = "";
              this.setState(copyState, () => {
                this.setState({ showQesInputs: false });
              });
            });
          });
        } else {
          let copyState = JSON.parse(JSON.stringify(this.state));
          copyState.secAnsErrMsg = "";
          copyState.emailErrMsg = "";
          copyState.userCurrectQus = "";
          copyState.forgotPasswordUserData.secQes = res.data.secQes;
          copyState.forgotPasswordUserData.secAns = res.data.secAns;
          this.setState(copyState, () => {
            this.setState({ showQesInputs: true });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  onGetNewPasswordHedler = () => {
    if (
      this.state.forgotPasswordUserData.secAns === this.state.userCurrectQus
    ) {
      var randomstring = Math.random()
        .toString(36)
        .slice(-8);
      let userChangeData = {
        url: UPDATE_USER,
        method: "post",
        data: {
          email: this.state.forgotPasswordUserData.email,
          userChange: {
            password: randomstring
          }
        }
      };
      message.loading("checking...", 0);
      requestData(userChangeData)
        .then(res => {
          let sendEmailData = {
            url: FORGOT_PASSWORD,
            method: "post",
            data: {
              email: this.state.forgotPasswordUserData.email,
              userChange: { password: randomstring }
            }
          };
          requestData(sendEmailData).then(serverRes => {
            message.destroy();
            message.success("Your new password was sended to your mail", 5);
            this.closeModal();
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      message.destroy();
      message.error("Wrong answer", 5);
    }
  };

  onChangeSecAnsHendler = event => {
    let copyState = JSON.parse(JSON.stringify(this.state));
    copyState.userCurrectQus = event.target.value;
    this.setState(copyState, () => {
      let copyState = JSON.parse(JSON.stringify(this.state));
      if (copyState.userCurrectQus.length >= 2) {
        this.setState({ getPassBtn: false }, () => {
          this.setState({ secAnsErrMsg: "" });
        });
      } else {
        this.setState(
          { secAnsErrMsg: "Secret answer most be bigger then 2 word!" },
          () => {
            this.setState({ getPassBtn: true });
          }
        );
      }
    });
  };
  render() {
    var category = this.state.categories.map(index => {
      return (
        <Option
          key={index}
          value={index}
          onClick={() => {
            this.props.history.push({
              pathname: "/category",
              search: "?q=" + index
            });
          }}
        >
          {index}
        </Option>
      );
    });

    const popContent = (
      <div>
        <Row>
          <Col span={24} className="mb-2">
            <span
              onClick={() => {
                const { history } = this.props;
                history.push("/wishlist");
              }}
            >
              <Button type="link">My wishlist</Button>
            </span>
          </Col>
          <Col span={24} className="pb-3">
            <span
              onClick={() => {
                const { history } = this.props;
                history.push("/orderList");
              }}
            >
              <Button type="link" >My orders</Button>
            </span>
          </Col>
        </Row>
        <Row className="text-right border-top border-black">
          <Col span={24} className="pt-2 p-0">
            <span
              onClick={() => {
                this.onLogoutHandler();
              }}
            >
              <Button type="danger" style={{ verticalAlign: "middle" }}><span >Logout</span></Button>
            </span>
          </Col>
        </Row>
      </div>
    );

    const { getFieldDecorator } = this.props.form;

    var loginContent = (
      <Row>
        <Col>
          <Form
            style={{ width: "95%", marginTop: "4%" }}
            onSubmit={this.handleSubmit}
            className="login-form"
          >
            <Form.Item>
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    required: true,
                    message: "Please input your email!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox style={{ float: "left" }}>Remember me</Checkbox>)}

              <div style={{ float: "right" }}>
                <span
                  onClick={() => {
                    this.openForgotPasswordModal();
                  }}
                  className="login-form-forgot"
                >
                  <u> Forgot password</u>
                </span>
              </div>
              <br />
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              <div>
                {" "}
                Or{" "}
                <span onClick={() => this.setState({ loginModal: false })}>
                  <Link to="/Register">register now!</Link>
                </span>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );

    var forgotPasswordContent = (
      <Row type="flex" justify="center" align="middle" className="pb-5">
        <Col span={24} md={20}>
          <Row type="flex" justify="center" align="middle">
            <Col span={4} md={3}>
              <span>
                <b>Email: </b>
              </span>
            </Col>
            <Col span={12} md={12}>
              <Input
                placeholder="Input your email"
                value={this.state.forgotPasswordUserData.email}
                onChange={e => this.checkEmail(e)}
              />
            </Col>
            <Col span={8} md={6} className="text-right text-md-center">
              <Button
                type="primary"
                disabled={this.state.findEmail}
                onClick={this.onGetUserHadler}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="center" align="middle">
            <Col span={12}>
              <span style={{ color: "red" }}>{this.state.emailErrMsg}</span>
            </Col>
          </Row>
        </Col>
        <Col
          span={24}
          style={{ display: this.state.showQesInputs ? "block" : "none" }}
        >
          <Row type="flex" justify="center" align="middle">
            <Col span={24}>
              <Row>
                <Col span={6}>
                  <span>
                    <b>Secret question: </b>
                  </span>
                </Col>
                <Col span={16}>
                  <Input
                    disabled={true}
                    value={this.state.forgotPasswordUserData.secQes}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={6}>
                  <span>
                    <b>Secret answer: </b>
                  </span>
                </Col>
                <Col span={16}>
                  <Input
                    onChange={this.onChangeSecAnsHendler}
                    value={this.state.userCurrectQus}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row type="flex" justify="center" align="middle">
                <Col span={16}>
                  <span style={{ color: "red" }}>
                    {this.state.secAnsErrMsg}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{ paddingTop: "10px" }}
          >
            <Col span={24}>
              <Row type="flex" justify="center" align="middle">
                <Col span={6}>
                  <Button
                    disabled={this.state.getPassBtn}
                    onClick={this.onGetNewPasswordHedler}
                  >
                    Get new password
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );

    return (
      <div className="headerHeight">
        <AntModal
          visible={this.state.loginModal}
          cancel={this.closeModal}
          title={
            this.state.modalData !== "forGotPassword"
              ? "Log in"
              : "Forgot Password"
          }
          content={
            this.state.modalData !== "forGotPassword"
              ? loginContent
              : forgotPasswordContent
          }
          hideFooter={true}
        />
        <Row type="flex" className="headerRow rowLine" align="middle">
          <Col span={0} md={0}></Col>
          <Col span={10} md={10} lg={8} xl={3}>
            <Row>
              <Col>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const { history } = this.props;
                    history.push("/");
                  }}
                >
                  <img className="logoHeader" alt={""} src={Logo} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={14} md={0}>
            <Row>
              <Col span={23}>
                <Row type="flex" justify="end">
                  {this.props.isAuth ? (
                    <Col>
                      <Row>
                        <Col span={24} className="pr-2 mb-2">
                          <Popover
                            placement="bottomRight"
                            title={
                              "Hello " +
                              this.props.userData.userName[0].toUpperCase() +
                              this.props.userData.userName
                                .slice(1)
                                .toLowerCase()
                            }
                            content={popContent}
                            className="uniq-header"
                            trigger="click"
                          >
                            <Button type="primary" shape="circle">
                              {this.props.userData.userName[0].toUpperCase()}
                            </Button>
                          </Popover>
                        </Col>
                      </Row>
                    </Col>
                  ) : (
                      <div
                        className="mainNavs"
                        onClick={() => {
                          this.openModal();
                        }}
                      >
                        Sign In
                    </div>
                    )}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={0} md={14} lg={16} xl={21}>
            <Row type="flex" justify="center">
              <Select
                defaultValue="all"
                className="selectSize"
                style={{
                  width: "auto",
                  height: 50,
                  border: "0px 0px 0px 0px solid black"
                }}
                onChange={this.selectQueryChange}
                dropdownMatchSelectWidth={false}
              >
                <Option value="all">All</Option>
                {category}
              </Select>
              <Search
                onSearch={this.searchChangeHandler}
                onKeyPress={this.searchHandler}
                className="searchInput"
                placeholder="Search products here..."
              />
            </Row>
          </Col>
        </Row>
        <Row className="headerRow">
          <Col span={16} sm={10} lg={8} xl={8}>
            <Row>
              <Col>
                <Row type="flex" justify="center">
                  <Col>
                    <span className="catPicker">Categories:</span>
                    <Select
                      defaultValue="all"
                      className="catSelect"
                      style={{ width: "auto" }}
                      onChange={this.selectCatChange}
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value="all">Choose Category</Option>
                      {category}
                    </Select>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={0} sm={10} lg={10} xl={12}>
            <Row type="flex" justify="end">
              {this.props.isAuth ? (
                <Col>
                  <Row>
                    <Col span={24}>
                      <Row type="flex" justify="end">
                        <Col span={24} className="text-right">
                          <Popover
                            placement="bottom"
                            title={
                              "Hello " +
                              this.props.userData.userName[0].toUpperCase() +
                              this.props.userData.userName
                                .slice(1)
                                .toLowerCase()
                            }
                            content={popContent}
                            trigger="click"
                          >
                            <Button type="primary" shape="circle">
                              {this.props.userData.userName[0].toUpperCase()}
                            </Button>
                          </Popover>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              ) : (
                  <div
                    className="mainNavs"
                    onClick={() => {
                      this.openModal();
                    }}
                  >
                    Sign In
                </div>
                )}
            </Row>
          </Col>
          <Col span={8} sm={4} lg={4} xl={2}>
            <Row type="flex" justify="end" align="middle">
              <Col span={12} md={0}>
                <Icon
                  type="search"
                  style={{ verticalAlign: "middle" }}
                  className="shoppingCartIcon pb-1 pb-md-0"
                  onClick={() => {
                    this.setState({ searchWindow: !this.state.searchWindow });
                  }}
                />
              </Col>
              <Col span={12} md={24} className="text-sm-right">
                <CardIcon />
              </Col>
            </Row>
          </Col>
        </Row>
        {/*Display the search window*/}
        <div
          className={
            this.state.searchWindow
              ? "searchWindow scale-in-center mt-2 mb-2"
              : "searchWindow scale-out-center  mt-2 mb-2"
          }
        >
          <Row type="flex" justify="center">
            <Col span={24} sm={0} md={0}>
              <Row
                type="flex"
                justify="center"
                style={{ backgroundColor: "rgb(224, 209, 209) !important" }}
              >
                <Select
                  defaultValue="all"
                  className="selectSize"
                  style={{
                    width: "auto",
                    height: 25,
                    border: "0px 0px 0px 0px solid black",
                    outline: "none"
                  }}
                  onChange={this.selectQueryChange}
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="all">All</Option>
                  {category}
                </Select>
                <Search
                  onSearch={this.searchChangeHandler}
                  onKeyPress={this.searchHandler}
                  className="searchInput"
                  placeholder="Search products here..."
                />
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

// 690 rows component.
// you become the very thing you swore to destroy
// you was chosen oneLOL

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    isAuth: state.userData.isAuth,
    cartData: state.cartData.cartData
  };
};
// wut!?xD
const mapDispatchToProps = dispatch => {
  return {
    saveUser: data => dispatch(action.saveUser(data)),
    turnAuth: () => dispatch(action.turnAuth())
  };
};

const WrappedLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default withRouter(Form.create({ name: "normal_login" })(WrappedLogin));

// some weird shit with form
// idk, something wrong with react\redux versions maybe...
// go for functional component maybe? i can try but it need kind of re-factor inside the header
// let me do it
