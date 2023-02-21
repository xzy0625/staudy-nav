import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { Modal, Upload } from 'antd';
import { baseUrlDev, baseUrl } from '../../const/index';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

interface IProps {
  maxCount?: number;
  onChange?: (value: any) => void | IAnyObject;
  action?: string;
  shape?: 'round' | 'rect';
  modalWidth?: number | string;
}

// 图片裁剪上传组件
const ImgUpload: React.FC<IProps> = (porops: IProps) => {
  const {
    maxCount,
    onChange,
    action = `${baseUrlDev}common/uploadFile`,
    shape = 'round',
    modalWidth,
  } = porops;

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const innerOnChange = ({
    fileList,
    file,
  }: {
    fileList: UploadFile[];
    file: UploadFile;
  }) => {
    if (file.status === 'uploading') {
      setLoading(true);
    }
    if (file.status === 'done') {
      setLoading(false);
      if (file.response?.data?.Location)
        onChange?.(`https://${file.response?.data.Location}`);
    }
    setFileList(fileList);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 处理预览
  const handlePreview = async (file: UploadFile) => {
    // 没有拿到url就用base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  const uploadBtn = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <ImgCrop grid rotate shape={shape} modalWidth={modalWidth || 520}>
        <Upload
          action={action}
          listType="picture-card"
          fileList={fileList}
          maxCount={maxCount}
          onPreview={handlePreview}
          onChange={innerOnChange}
        >
          {fileList.length < 1 && uploadBtn}
        </Upload>
      </ImgCrop>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImgUpload;
