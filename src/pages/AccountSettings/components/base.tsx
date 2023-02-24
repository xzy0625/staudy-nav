import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { CurrentUser, useRequest } from 'umi';
import { queryProvince, queryCity } from '../service';
import PreviewAvator from '@/components/PreviewAvator/index';

import styles from './BaseView.less';
import ImgUpload from '@/components/imgUpload';
import FormItem from 'antd/lib/form/FormItem';
import { updateUser } from '@/services/user';

const validatorPhone = (
  rule: any,
  value: string,
  callback: (message?: string) => void,
) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};
// // 头像组件 方便以后独立，增加裁剪之类的功能
// const AvatarView = ({ avatar }: { avatar: string }) => (
//   <>
//     <div className={styles.avatar_title}>头像</div>
//     <div className={styles.avatar}>
//       <ImgUpload />
//       <PreviewAvator style={{ width: '144px', height: '144px' }} src={avatar} alt="avatar"/>
//     </div>
//     <Upload showUploadList={false}>
//       <div className={styles.button_view}>
//         <Button>
//           <UploadOutlined />
//           更换头像
//         </Button>
//       </div>
//     </Upload>
//   </>
// );

const BaseView: React.FC<any> = ({
  currentUser,
}: {
  currentUser: CurrentUser;
}) => {
  const handleFinish = async (values: IAnyObject) => {
    console.log(values, '......');
    const status = await updateUser(currentUser._id, values);
    if (status) {
      message.success('更新基本信息成功');
    } else {
      message.error('基本信息更新失败');
    }
  };
  return (
    <div className={styles.baseView}>
      <>
        <div className={styles.left}>
          <ProForm
            layout="vertical"
            onFinish={handleFinish}
            submitter={{
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
              submitButtonProps: {
                children: '更新基本信息',
              },
            }}
            initialValues={{
              ...currentUser,
              phone: currentUser?.phone?.split?.('-'),
            }}
            hideRequiredMark
          >
            <FormItem
              label="头像"
              name="head_img"
              // tooltip={{ title: '请上传你的头像', placement: 'topLeft' }}
              rules={[
                {
                  required: true,
                  message: '请上传您的头像!',
                },
              ]}
            >
              <ImgUpload shape="rect" />
            </FormItem>
            <ProFormText
              width="md"
              name="phone"
              label="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入您的手机号!',
                },
              ]}
            />
            <ProFormText
              width="md"
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入您的用户名!',
                },
              ]}
            />
            <ProFormText
              width="md"
              name="nickname"
              label="昵称"
              rules={[
                {
                  required: true,
                  message: '请输入您的昵称!',
                },
              ]}
            />
            <ProFormTextArea
              name="desc"
              label="个人简介"
              rules={[
                {
                  required: false,
                  message: '请输入个人简介!',
                },
              ]}
              placeholder="个人简介"
            />
            <ProFormSelect
              width="sm"
              name="country"
              label="国家/地区"
              rules={[
                {
                  required: false,
                  message: '请输入您的国家或地区!',
                },
              ]}
              options={[
                {
                  label: '中国',
                  value: 'China',
                },
              ]}
            />

            <ProForm.Group title="所在省市" size={8}>
              <ProFormSelect
                rules={[
                  {
                    required: false,
                    message: '请输入您的所在省!',
                  },
                ]}
                width="sm"
                fieldProps={{
                  labelInValue: true,
                }}
                name="province"
                className={styles.item}
                request={async () => {
                  return queryProvince().then(({ data }) => {
                    return data.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    });
                  });
                }}
              />
              <ProFormDependency name={['province']}>
                {({ province }) => {
                  return (
                    <ProFormSelect
                      params={{
                        key: province?.value,
                      }}
                      name="city"
                      width="sm"
                      rules={[
                        {
                          required: false,
                          message: '请输入您的所在城市!',
                        },
                      ]}
                      disabled={!province}
                      className={styles.item}
                      request={async () => {
                        if (!province?.key) {
                          return [];
                        }
                        return queryCity(province.key || '').then(
                          ({ data }) => {
                            return data.map((item) => {
                              return {
                                label: item.name,
                                value: item.id,
                              };
                            });
                          },
                        );
                      }}
                    />
                  );
                }}
              </ProFormDependency>
            </ProForm.Group>
            <ProFormText
              width="md"
              name="address"
              label="街道地址"
              rules={[
                {
                  required: false,
                  message: '请输入您的街道地址!',
                },
              ]}
            />
          </ProForm>
        </div>
      </>
    </div>
  );
};

export default BaseView;
