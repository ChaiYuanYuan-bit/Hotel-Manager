import React,{ useState,useEffect } from 'react';
import { PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import {$upload} from '../../../api/adminApi'
import { Upload, message } from 'antd';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  //判断图片类型
  const beforeUpload = (file) => {
    //只能是jpg或png
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 类型文件!');
    }
    //判断图片大小
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

const UpLoadAdmin = ({form}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    useEffect(()=>{
        if(form.getFieldValue('photo'))
        {
            //这里写死了
            let photoUrl = 'https://tupian.qqw21.com/article/UploadPic/2019-4/201942420443049051.jpg'
            setImageUrl(photoUrl)
        }
    },[form.getFieldValue('photo')])
    //上传成功调用的方法
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
        setLoading(true);
        return;
        }
        if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
            setLoading(false);
            setImageUrl(url); //更新图片地址
            form.setFieldValue('photo',info.file.response.fileName)
        });
        }
    };
    const uploadButton = (
        <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div
            style={{
            marginTop: 8,
            }}
        >
            上传
        </div> 
        </div>
    );

    const upLoadImage = (options)=>{
        //这里只返回了{fileName:'.....',success:true,massage:"上传成功"}，欺骗一下upload，让其展示图片
        $upload({fileName:options.file.name}).
        then((res)=>{
            options.onSuccess(res, options.file)});
    }

    return (
        <>
            <Upload
            name="photo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={upLoadImage}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            >
            {imageUrl ? (
            <img
                src={imageUrl}
                alt="avatar"
                style={{
                width: '100%',
                height: '100%'
                }}
            />
            ) : (
            uploadButton
            )}
            </Upload>
        </>
    );
}

export default UpLoadAdmin;
