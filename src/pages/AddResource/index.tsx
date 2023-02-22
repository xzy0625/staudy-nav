import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Tooltip,
} from 'antd';
import ImgUpload from '@/components/imgUpload/index';
import { connect, Dispatch, history } from 'umi';
import React, { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { WholeTagsMap } from '@/models/tag';
import { ResourceType } from '@/models/resource';
import { getResource, searchResources } from '@/services/resource';
// import ResourceCard from '@/components/ResourceCard';
import reviewStatusEnum from '@/const/reviewStatusEnum';
import { URL_REG } from '@/utils/index';
import { SearchOutlined } from '@ant-design/icons/lib';
import { NoAuth } from '@/components/NoAuth';
import SelectTags from '@/components/SelectTags';
// import PicUploader from '../../components/PicUploader';
import './style.less';
import ResourceCard from '@/components/ResourceCard';

const FormItem = Form.Item;

interface AddResourceProps {
  submitting?: boolean;
  dispatch: Dispatch;
  wholeTagsMap: WholeTagsMap;
  currentUser?: CurrentUser;
  location?: IAnyObject;
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
    md: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 12,
    },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
      offset: 5,
    },
    md: {
      span: 8,
      offset: 4,
    },
    lg: {
      span: 7,
      offset: 4,
    },
  },
};

/**
 * 添加或修改资源
 * @param props
 * @constructor
 */
const AddResource: FC<AddResourceProps> = (props) => {
  const {
    submitting,
    wholeTagsMap,
    currentUser = {} as CurrentUser,
    location,
  } = props;
  const resourceId = location?.query?.id;
  const [form] = Form.useForm();
  // 相似检测
  const [showSameNameModal, setShowSameNameModal] = useState<boolean>(false);
  const [showSimilarModal, setShowSimilarModal] = useState<boolean>(false);
  const [similarResources, setSimilarResources] = useState<ResourceType[]>([]);
  const [previewResource, setPreviewResource] = useState<ResourceType>(
    {} as ResourceType,
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const initialValues = {};

  // 修改资源要获取资源的信息
  useEffect(() => {
    if (currentUser._id && resourceId) {
      searchResources({ _ids: [resourceId] })?.then((resData) => {
        const res = resData?.[0] || {};
        if (!res) {
          message.error('加载失败，请刷新重试');
          return;
        }
        if (res.user_id !== currentUser._id) {
          message.error('只能修改自己的资源哦');
          setDisabled(true);
          return;
        }
        const { name, desc, url, head_img, tags, detail } = res;
        form.setFieldsValue({ name, desc, url, head_img, tags, detail });
        setPreviewResource({ name, desc, url, head_img, tags, detail });
      });
    }
  }, [resourceId, currentUser]);

  const doSameCheck = () => {
    const name = form.getFieldValue('name');
    if (!name) {
      message.error('请先输入资源名称');
      return;
    }
    // 同名检测
    const searchParams = {
      name,
      pageSize: 5,
    };
    searchResources(searchParams).then((res) => {
      const similarResourcesData = res?.filter(
        (item: ResourceType) => item._id !== resourceId,
      );
      if (!similarResourcesData || similarResourcesData.length === 0) {
        message.success('未发现重复资源');
      } else {
        setSimilarResources(similarResourcesData);
        setShowSameNameModal(true);
      }
    });
  };
  const doSubmit = (values: { [key: string]: any }) => {
    if (!currentUser || !currentUser._id) {
      message.error('提交失败，请刷新页面重试！');
      return;
    }

    const sbmitValues = {
      ...values,
      user_id: currentUser._id,
      review_status: reviewStatusEnum.REVIEWING,
    };

    const { dispatch } = props;
    // 修改
    if (resourceId) {
      dispatch({
        type: 'resource/update',
        payload: {
          resourceId,
          resource: sbmitValues,
          user_id: currentUser._id,
        },
      });
      return;
    }
    // 新增
    dispatch({
      type: 'resource/add',
      payload: sbmitValues,
    });
  };

  const onFinish = (values: { [key: string]: any }) => {
    // 同名检测
    const searchParams = {
      name: values.name,
      pageSize: 5,
    };
    searchResources(searchParams).then((res) => {
      const similarResourcesData = res.filter(
        (res: ResourceType) => res._id !== resourceId,
      );
      if (!similarResourcesData || similarResourcesData.length === 0) {
        doSubmit(values);
      } else {
        setSimilarResources(similarResourcesData);
        setShowSimilarModal(true);
      }
    });
  };

  const onValuesChange = (
    changedValues: { [key: string]: any },
    allValues: { [key: string]: any },
  ) => {
    const tmpResource = { ...allValues } as ResourceType;
    setPreviewResource(tmpResource);
  };

  const handleSimilarModalOk = () => {
    setShowSimilarModal(false);
    doSubmit(form.getFieldsValue());
  };

  const handleSimilarModalCancel = () => {
    setShowSimilarModal(false);
  };

  const handleSameNameModalCancel = () => {
    setShowSameNameModal(false);
  };

  return currentUser._id ? (
    <PageContainer
      title="我要推荐"
      content={<span>欢迎推荐优质学习资源，共建繁荣学习社区</span>}
    >
      <Card bordered={false}>
        <Form
          style={{
            marginTop: 8,
            width: 1200,
            margin: '0 auto',
          }}
          form={form}
          name="resource"
          {...formItemLayout}
          labelAlign="left"
          scrollToFirstError
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          wrapperCol={{}}
        >
          <FormItem
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入资源名',
              },
            ]}
          >
            <Input
              placeholder="网站、文章等资源名，最多 25 字"
              maxLength={60}
              allowClear
              addonAfter={
                <Tooltip title="检测是否有重复资源" placement="topRight">
                  <SearchOutlined
                    style={{ fontSize: 16, cursor: 'pointer' }}
                    onClick={doSameCheck}
                  />
                </Tooltip>
              }
            />
          </FormItem>
          <FormItem
            label="描述"
            name="desc"
            rules={[
              {
                required: true,
                message: '请输入描述',
              },
            ]}
          >
            <Input
              placeholder="用一句话简单介绍资源，最多 60 字"
              maxLength={60}
              allowClear
            />
          </FormItem>
          <FormItem
            label="链接"
            name="url"
            rules={[
              {
                required: true,
                message: '请填写链接',
              },
              {
                pattern: URL_REG,
                message: '请填写合法链接',
              },
            ]}
          >
            <Input placeholder="便于找到资源的网址，http(s) 开头" allowClear />
          </FormItem>
          <FormItem
            label="标签"
            name="tags"
            rules={[
              {
                required: true,
                message: '至少填写 1 个标签',
              },
              {
                max: 5,
                type: 'array',
                message: '至多选择 5 个标签',
              },
            ]}
          >
            <SelectTags
              allTags={wholeTagsMap.allTags}
              groupTags={wholeTagsMap.groupTags}
              maxTagsNumber={5}
            />
          </FormItem>
          <FormItem
            label="图标"
            name="head_img"
            tooltip={{ title: '正方形图标展示效果最佳', placement: 'topLeft' }}
          >
            <ImgUpload shape="rect" />
          </FormItem>
          <FormItem label="详情" name="detail">
            <Input.TextArea
              placeholder="详细介绍该资源的作用、用法等"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={submitting}
                  disabled={submitting || disabled}
                >
                  {submitting ? '提交中' : '提交'}
                </Button>
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="topRight"
                  overlayStyle={{ minWidth: 260 }}
                  title={
                    <ResourceCard
                      resource={previewResource}
                      showMenus={false}
                    />
                  }
                >
                  <Button>预览</Button>
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Card>
      <Modal
        title="已有相似资源"
        visible={showSameNameModal}
        width={600}
        footer={null}
        onCancel={handleSameNameModalCancel}
      >
        <List<ResourceType>
          rowKey="_id"
          dataSource={similarResources}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          split={false}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard currentUser={currentUser} resource={item} />
              </List.Item>
            );
          }}
        />
      </Modal>
      <Modal
        title="已有相似资源，是否确认提交"
        cancelText="我再想想"
        visible={showSimilarModal}
        onOk={handleSimilarModalOk}
        onCancel={handleSimilarModalCancel}
      >
        <List<ResourceType>
          rowKey="_id"
          dataSource={similarResources}
          pagination={{
            pageSize: 1,
          }}
          split={false}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard currentUser={currentUser} resource={item} />
              </List.Item>
            );
          }}
        />
      </Modal>
    </PageContainer>
  ) : (
    <NoAuth />
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  submitting:
    loading.effects['resource/add'] || loading.effects['resource/update'],
  wholeTagsMap: tag.wholeTagsMap,
  currentUser: user.currentUser,
}))(AddResource);
