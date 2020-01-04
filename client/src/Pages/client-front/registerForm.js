import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  DatePicker,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  message,
  Radio,
  Upload
} from "antd";
import * as action from "../../Store/action/userDataActions";
import { NEW_USER, UPLOAD_PICTURE } from "../../Api/api";
import { requestData } from "../../RequestData/RequestData";
import "../../CSS/register.css";
import moment from "moment";
import GoBack from "../../Components/goBack";

//Date - check if the user is above 12 years old, if the user is under 12 years old give a warning by using Modal that saying its not allowed
//Check how to change value of inputs, without breaking AntD form design pattern and save data as a object and first+last name with capital letter
//Use function "capitalizeFirstLetter" to get first capital letter
//At the end check the object, if it is easy to work with.

//IF YOU DONT FIND A SOLUTION PLEASE TAKE THE EXISTED OBJECT AT THE END AND MODIFY IT! modify = תשנה.

//Build mobile register with same fields of inputs (look initState) using progress bar!

//I"m Daniel Wiederman the facka, thank you very much.

const { Option } = Select;

const initState = {
  userDetails: "",
  confirmDirty: false,
  autoCompleteResult: [],
  captchaActivated: false,
  buttonLoading: false,
  secAns: true,
  img: "",
  disabledUpload: false
};

export class BrowserForm extends Component {
  state = { ...initState };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, userInfo) => {
      if (!userInfo.agreement) {
        message.error("Please accept our terms of agreement!");
        return;
      }
      if (!err) {
        message.loading("Registering in progress..", 0);
        console.log("Received values of form: ", userInfo);
        let tempUserInfo = { ...userInfo };
        tempUserInfo.phoneNumber =
          tempUserInfo.prefix + tempUserInfo.phoneNumber;
        delete tempUserInfo.prefix;
        delete tempUserInfo.confirm;
        delete tempUserInfo.captcha;
        delete tempUserInfo.agreement;
        tempUserInfo.image = this.state.img;
        tempUserInfo.birthdate = moment(tempUserInfo.birthdate._d).format(
          "DD-MM-YYYY"
        );
        let data = {
          url: NEW_USER,
          method: "post",
          data: tempUserInfo
        };
        requestData(data)
          .then(res => {
            if (res.status === 200) {
              message.destroy();
              message.success("Succesfly signed up!");
              this.props.saveUser(res.data).then(res => {
                const { history } = this.props;
                history.push("/");
              });
            }
          })
          .catch(err => {
            message.destroy();
            message.error("Error :(");
            console.log(err);
          });
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  captchaHandler = () => {
    this.setState({ captchaActivated: true }, () => {
      setTimeout(() => {
        this.setState({ buttonLoading: true });
      }, 800);
    });
  };

  nameCheck = (rule, value, callback) => {
    if (/\d/.test(value)) {
      callback("Name cannot include numbers!");
    } else {
      callback();
    }
  };

  captchaValidator = (rule, value, callback) => {
    if (value === "10") {
      callback();
    } else callback("invalid input for verification!");
  };

  //this function will check if the age is above 18 by date given
  ageCheck = (day, month, year) => {
    return new Date(year + 18, month - 1, day) <= new Date();
  };

  dateCheck = (rules, value, callback) => {
    if (value) {
      let day = parseInt(moment(value._d).format("DD"));
      let month = parseInt(moment(value._d).format("MM"));
      let year = parseInt(moment(value._d).format("YYYY"));
      if (!this.ageCheck(day, month, year)) {
        callback("You must be above 18 years old!");
      } else {
        callback();
      }
    } else {
      callback("Pick a date please!");
    }
  };

  uploadHandler = e => {
    let formData = new FormData();
    formData.append("img", e.file);

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
        this.setState({ img: res.data });
      })
      .catch(err => {
        console.log("error\n", err);
      });
  };

  onFileChange(fileList) {
    console.log(fileList);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        md: { span: 8 },
        lg: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 16 },
        md: { span: 14 },
        lg: { span: 16 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 22,
          offset: 1
        },
        md: {
          span: 19,
          offset: 4
        },
        lg: {
          span: 17,
          offset: 6
        }
      }
    };

    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "050"
    })(
      <Select style={{ width: 70 }}>
        <Option value="050">050</Option>
        <Option value="051">051</Option>
        <Option value="052">052</Option>
        <Option value="053">053</Option>
        <Option value="054">054</Option>
      </Select>
    );

    return (
      <div>
        <div style={{ marginTop: "5%" }}></div>
        <Row type="flex" justify="center">
          <Col lg={10} sm={12} xs={22}>
            <div className="registerContainer">
              <div className="pl-3 pt-3">
                <span>
                  <GoBack />
                </span>
              </div>
              <div style={{ marginTop: "2.5%" }}></div>
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="First name">
                  {getFieldDecorator("firstName", {
                    rules: [
                      {
                        type: "",
                        message: "The name must contain at least 2 letters",
                        min: 2
                      },
                      {
                        required: true,
                        message: "Please input your first name"
                      },
                      {
                        validator: this.nameCheck
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Last name">
                  {getFieldDecorator("lastName", {
                    rules: [
                      {
                        type: "",
                        message: "The name must contain at least 2 letters",
                        min: 2
                      },
                      {
                        required: true,
                        message: "Please input your first name"
                      },
                      {
                        validator: this.nameCheck
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Gender">
                  {getFieldDecorator("gender", {
                    rules: [
                      {
                        message: "Please select your gender"
                      },
                      {
                        required: true,
                        message: "Please select your gender"
                      }
                    ]
                  })(
                    <Col offset={1}>
                      <Radio.Group>
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                        <Radio value="Queer">Queer</Radio>
                        <Radio value="Not sure">Not sure</Radio>
                      </Radio.Group>
                    </Col>
                  )}
                </Form.Item>
                <Form.Item label="Birthdate">
                  {getFieldDecorator("birthdate", {
                    rules: [
                      {
                        required: true
                      },
                      {
                        validator: this.dateCheck
                      }
                    ]
                  })(<DatePicker format={"DD-MM-YYYY"} />)}
                </Form.Item>
                <Form.Item label="E-mail">
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "The input is not valid E-mail!"
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Password&nbsp;
                      <Tooltip title='password need contain at least 8 letters including Alpha letters and numbers (example: "Aa123...")!'>
                        <Icon type="exclamation-circle" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message:
                          'Invalid password, insert at least 8 letters with unique combination like "Aa123..."!',
                        min: 8,
                        pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
                      },
                      {
                        validator: this.validateToNextPassword
                      }
                    ]
                  })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="Confirm Password">
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "Please confirm your password!"
                      },
                      {
                        validator: this.compareToFirstPassword
                      }
                    ]
                  })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item label="Profile picture">
                  {getFieldDecorator("image", {})(
                    <Upload
                      // previewFile={}
                      disabled={this.state.disabledUpload}
                      name="logo"
                      customRequest={this.uploadHandler}
                      listType="picture"
                      showUploadList={{ showRemoveIcon: false }}
                    >
                      <Button>
                        <Icon type="upload" /> Click to upload
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Nickname&nbsp;
                      <Tooltip title="What do you want others to call you?">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator("userName", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your nickname!",
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Phone Number">
                  {getFieldDecorator("phoneNumber", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your phone number!",
                        len: 7
                      }
                    ]
                  })(
                    <Input
                      addonBefore={prefixSelector}
                      style={{ width: "100%" }}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Address">
                  {getFieldDecorator("address", {
                    rules: [
                      {
                        type: "",
                        message: "The name must contain at least 2 letters",
                        min: 2
                      },
                      {
                        required: true,
                        message: "Please input your address"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Secret question&nbsp;
                      <Tooltip title="If you forget or lose your password we need to verify your details">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator("secQes", {
                    rules: [
                      {
                        required: true,
                        message: "Select answer to your secret question"
                      }
                    ]
                  })(
                    <Select
                      onChange={() => {
                        this.setState({ secAns: false });
                      }}
                    >
                      <Option value="Highschool name?">Highschool name?</Option>
                      <Option value="First pet name?">First pet name?</Option>
                    </Select>
                  )}
                </Form.Item>

                <Form.Item label="Secret answer">
                  {getFieldDecorator("secAns", {
                    rules: [
                      {
                        required: true,
                        message: "Invalid answer, insert at least 2 letters",
                        min: 2
                      },
                      {
                        required: true,
                        message: "Please input your Secret answer"
                      }
                    ]
                  })(<Input disabled={this.state.secAns} />)}
                </Form.Item>
                <Form.Item
                  label="Captcha"
                  extra="We must make sure that you're a human."
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator("captcha", {
                        rules: [
                          {
                            required: true,
                            message: "Please input the captcha you got!"
                          },
                          {
                            validator: this.captchaValidator
                          }
                        ]
                      })(<Input disabled={!this.state.buttonLoading} />)}
                    </Col>
                    <Col span={12}>
                      <div
                        style={{
                          padding: !this.state.buttonLoading ? "2.5px" : ""
                        }}
                      >
                        <Button
                          style={{
                            display: !this.state.buttonLoading
                              ? "block"
                              : "none"
                          }}
                          loading={this.state.captchaActivated}
                          onClick={() => this.captchaHandler()}
                        >
                          Get captcha
                        </Button>
                      </div>
                      <span
                        style={{
                          display: !this.state.buttonLoading ? "none" : "block"
                        }}
                      >
                        5+5 = ?
                      </span>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  {getFieldDecorator("agreement", {
                    valuePropName: "checked",
                    rules: [
                      {
                        required: true,
                        message: "Please agree our agreement term of use"
                      }
                    ]
                  })(
                    <Checkbox>
                      I have read the <a href="">ShoppingBay's agreement</a>
                    </Checkbox>
                  )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
        <div style={{ marginTop: "5%" }}></div>
      </div>
    );
  }
}

const RegisterForm = Form.create({ name: "register" })(BrowserForm);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    saveUser: data => dispatch(action.saveUser(data))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegisterForm)
);
