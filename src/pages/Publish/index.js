import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
  } from 'antd'
  import { PlusOutlined } from '@ant-design/icons'
  import { Link, useSearchParams,useNavigate } from 'react-router-dom'
  import './index.scss'
  import ReactQuill from 'react-quill'
  import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { useState,useRef,useEffect } from 'react'
import { http } from '@/utils'
import '@/mock/index'

  const { Option } = Select
  
  const Publish = () => {
    const navigate = useNavigate()

    const cacheImageList = useRef([])
    const {channelStore} = useStore()
    const [fileList,setFileList] = useState([])
    const onUploadChange=({fileList})=>{
        // console.log(fileList)
        const formatList = fileList.map(file=>{
          if(file.response){
            return {
              url:file.response.data.url
            }
          }
          return file
        })
        setFileList(formatList)
        cacheImageList.current = formatList
    }
    const [imgCount,setImgCount] = useState(1)
    const radioChange= (e)=>{
        const rawValue = e.target.value
        setImgCount(e.target.value)
        if(rawValue===1){
            const img=cacheImageList.current? cacheImageList.current[0]:[]
            setFileList([img])
        }else if(rawValue===3){
            setFileList(cacheImageList.current)
        }
    }
    const onFinish= async(v)=>{
        // console.log(v)
        const {channel_id,content,title,type}=v
        const params = {
            channel_id,
            content,
            title,
            type,
            cover:{
                type:type,
                images:fileList.map(item=>item.url)
            }
        }
        // console.log(params)
        if(id){
          await http.put('/mp/articles?draft=false',params)
        }else{
          await http.post('/mp/articles?draft=false',params)
        }

        navigate('/article')
        message.success(`${id?'??????':'??????'}?????????`)
    }
    const [params] = useSearchParams()
    const id = params.get('id')
    const form = useRef(null)
    useEffect(()=>{
        const loadDetail = async()=>{
          const res = await http.post('/mp/articles/content',{id:id})
          const data = res.data
          console.log('dev',data)
          form.current.setFieldsValue({...data,type:data.cover.type})
          const formatImgList = data.cover.images.map(url=>({url})) //???????????????????????????????????????
          setFileList(formatImgList)
          cacheImageList.current =formatImgList 
        }
        if(id){
            loadDetail()
        }
    },[id])
    return (
      <div className="publish">
        <Card
          title={
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/home">??????</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{id?'??????':'??????'}??????</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form ref={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 1, content:'this is a content'}}
            onFinish={onFinish}
          >
            <Form.Item
              label="??????"
              name="title"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Input placeholder="?????????????????????" style={{ width: 400 }} />
            </Form.Item>

            <Form.Item
              label="??????"
              name="channel_id"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Select placeholder="?????????????????????" style={{ width: 400 }}>
                {channelStore.channelList.map(channel=>
                    <Option key={channel.id} value={channel.id}>{channel.name}</Option>
                )}

              </Select>
            </Form.Item>
  
            <Form.Item label="??????">
              <Form.Item name="type">
                <Radio.Group onChange={radioChange}>
                  <Radio value={1}>??????</Radio>
                  <Radio value={3}>??????</Radio>
                  <Radio value={0}>??????</Radio>
                </Radio.Group>
              </Form.Item>
              {imgCount>0&&              
                <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList
                    action="http://geek.itheima.net/v1_0/upload"
                    fileList={fileList}
                    onChange={onUploadChange}
                    multiple={imgCount>1}
                    maxCount={imgCount}
                    >
                    <div style={{ marginTop: 8 }}>
                        <PlusOutlined />
                    </div>
                </Upload>}

            </Form.Item>

            <Form.Item
              label="??????"
              name="content"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
                <ReactQuill
                    className="publish-quill"
                    theme="snow"
                    placeholder="?????????????????????"
                />
            </Form.Item>
  
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  {id?'??????':'??????'}??????
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  
  export default observer(Publish)