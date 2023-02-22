import { Avatar, Modal } from 'antd';
import React, { useState } from 'react';
import { AvatarProps } from 'antd/lib/avatar';
import _ from 'lodash';

type IProps = AvatarProps & {
  canPreview?: boolean;
  previewTitle?: string;
};

// 支持预览的头像组件
const PreviewAvator: React.FC<IProps> = (props: IProps) => {
  const { canPreview = true, previewTitle = '头像预览' } = props;
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const onClick = () => {
    if (!canPreview) {
      return;
    }

    setPreviewOpen(true);
  };

  return (
    <>
      <div onClick={onClick}>
        <Avatar {..._.omit(props, ['previewTitle', 'canPreview'])}></Avatar>
      </div>
      {/* 预览 */}
      {canPreview && (
        <Modal
          centered
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <img
              width={300}
              height={300}
              src={props.src as string}
              alt="头像预览"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PreviewAvator;
