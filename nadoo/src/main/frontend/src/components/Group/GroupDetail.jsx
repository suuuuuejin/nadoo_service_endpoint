import React, { useEffect, useState } from 'react';
import { Badge, Button, Descriptions, Space } from 'antd';
import NavigatorTop from '../Navigator/NavigatorTop';
import { Outlet, useLocation } from 'react-router-dom';
import '../../styles/Group/GroupDetail.css'
import NavigatorMain from '../Navigator/NavigatorMain';
import axios from 'axios';
import KakaoMapContainer from '../KakaoMap/KakaoMapContainer';
import GroupChat from './GroupChat';

function GroupDetail() {
  var [time, setTime] = useState(0);
  const [toggleButton, setToggleButton] = useState(false);
  const location = useLocation();
  const originUrl = location.pathname;
  const url = originUrl.substring(0, 12);

  const idxState = location.state.tradeIdx;

  console.log(idxState);

  const [detailArticle, setDetailArticle] = useState([
    {
      tradeAddress: '',
      tradeTitle: '',
      tradeContent: '',
      userNick: '',
      tradeProduct: '',
      tradePrice: '',
      tradeMax: '',
      tradeViews: '',
      diffTime: ''
    }
  ]);

  function getGroupList() {
    axios
      .post('http://localhost:8088/nadoo/detail', {
        //.post(`http://localhost:8088/nadoo/detail/${idxState}`, {
        tradeIdx: idxState
      })
      .then((res) => {
        setDetailArticle(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
  };

  useEffect(() => {
    getGroupList();
  }, []);

  const originPrice = detailArticle.tradePrice;

  const price = [originPrice].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const timeCount = parseInt((detailArticle.diffTime - (Date.now() / 1000)));

  var day = Math.floor(timeCount / (24 * 3600))
  var hour = Math.floor(timeCount % (24 * 3600) / 3600)
  var minute = Math.floor((timeCount % 3600) / 60);
  var second = timeCount % 60;

  useEffect(() => {
    var timer = setInterval(() => {
      if (timeCount > 0) {
        setTime(timeCount);
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }, [timeCount]);

  return (
    <>
      <NavigatorTop detailUrl={url} />
      <Outlet />
      <KakaoMapContainer tradeAddress={detailArticle.tradeAddress} />
      <br />
      <Descriptions
        className='GroupDetail_article'
        title={detailArticle.tradeTitle}
        bordered
      >
        <Descriptions.Item label="?????? ??????">
          {detailArticle.tradeProduct}
        </Descriptions.Item>
        <Descriptions.Item label="?????? ??????">
          {
            timeCount === 0 || timeCount <= 0 ?
              <>
                <span className='GroupDetail_day'>
                  ?????????&nbsp;
                </span>
                <span className='GroupDetail_timer'>
                  ?????????????????????.
                </span>
              </>
              :
              <>
                <span className='GroupDetail_day'>
                  {day < 10 ? `0${day}` : day}???&nbsp;
                </span>
                <span className='GroupDetail_timer'>
                  {hour < 10 ? `0${hour}` : hour}:
                  {minute < 10 ? `0${minute}` : minute}:
                  {second < 10 ? `0${second}` : second}
                </span>
              </>
          }
        </Descriptions.Item>
        <Descriptions.Item label="?????? ??????">
          {detailArticle.tradeAddress}
        </Descriptions.Item>
        <Descriptions.Item label="?????? ??????">
          {detailArticle.tradeMax}
        </Descriptions.Item>
        <Descriptions.Item label="?????????">
          {detailArticle.userNick}
        </Descriptions.Item>
        <Descriptions.Item label="?????????">
          {detailArticle.tradeViews}
        </Descriptions.Item>
        <Descriptions.Item label="?????? ??????">
          {
            detailArticle.tradePrice === 0 ?
              '????????? ????????? ?????????!'
              :
              `${price}???`
          }
        </Descriptions.Item>
        {console.log(detailArticle.userAccount)}
        {
          detailArticle.userAccount === window.sessionStorage.getItem('userID') ?
            <Descriptions.Item label="?????? ??????">
              ????????? ??????????????????!
            </Descriptions.Item>
            :
            <Descriptions.Item label="?????? ??????">
              {
                toggleButton === true ?
                  <Badge status="error" text="?????? ??????" />
                  :
                  <Badge status="processing" text="?????? ??????" />
              }
              &nbsp;
              &nbsp;
              &nbsp;
              <Space wrap>
                <Button
                  style={{
                    width: '100%'
                  }}
                  type="dashed"
                  onClick={
                    () => {
                      setToggleButton(!toggleButton);
                    }
                  }
                >
                  ?????? ?????? ??????
                </Button>
              </Space>
            </Descriptions.Item>
        }
        <Descriptions.Item label="?????? ??????">
          {detailArticle.tradeContent}
        </Descriptions.Item>
      </Descriptions>
      <GroupChat
        idxState={idxState}
      />
      <NavigatorMain />
      <Outlet />
    </>
  );
}

export default GroupDetail;