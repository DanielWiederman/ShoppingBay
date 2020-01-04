import React from "react";
import { Modal, Button } from "antd";
const AntModal = props => {
  return (
    <div>
      <Modal
        title={props.title}
        visible={props.visible}
        onCancel={props.cancel}

        footer={props.hideFooter ? null : [
          <Button key="back" onClick={props.cancel}>
            Return
            </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={props.submit}
            disabled={props.disabled}
          >
            Submit
            </Button>
        ]}
      >
        {props.content && props.content}
      </Modal>
    </div>
  );
};

export default AntModal;
