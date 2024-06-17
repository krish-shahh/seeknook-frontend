import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import ConfirmDeleteUser from './ConfirmDeleteUser';

const DeleteUser = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button type="primary" danger onClick={() => setOpen(true)}>
        Delete Account
      </Button>
      <Modal
        title="Confirm Account Deletion"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <ConfirmDeleteUser setOpen={setOpen} />
      </Modal>
    </div>
  );
};

export default DeleteUser;
