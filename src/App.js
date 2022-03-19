import { Modal } from "@material-ui/core";
import styled from "styled-components";

import { getToken, onMessage } from "firebase/messaging";
import React, { useEffect, useRef, useState } from "react";
import { useReactPWAInstall } from "react-pwa-install";
import { messaging } from "./firebase";
import InstallPWA from "./InstallPWA";
import ModalTest from "./ModalTest";
import ModalPopUp from "./ModalPopUp";
import MyModal from "./MyModal";

import ReactModal from "react-modal";
import ChatRoom from "./Chat/ChatRoom";
import url from "sockjs-client/lib/utils/url";
import Mymodaltest from "./Mymodaltest";

// import ConvertImage from "react-convert-image";

// ReactModal.setAppElement("#root");

function App() {
  let swRegist = null;
  const [Token, setToken] = useState(null);
  console.log("getToken");

  //pwa 알림
  getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  }).then((token) => {
    console.log("token", token);
    setToken(token);
    swRegist = messaging.swRegistration;
  });

  // // Push 초기화
  // const initPush = (isSubscribed) => {
  //   if (isSubscribed) {
  //     subscribe();
  //   } else {
  //     unsubscribe();
  //   }
  // };

  //알림 구독
  function subscribe() {
    console.log(onMessage(messaging));
    // getToken(messaging, {
    //   vapidKey: process.env.REACT_APP_VAPID_KEY,
    // }).then((token) => {
    //   console.log("token", token);
    //   setToken(token);
    //   swRegist = messaging.swRegistration;
    //   console.log("swRegist", swRegist);
    //   console.log("swRegist2", swRegist.pushManager);
    // });
    // swRegist.pushManager.getSubscription().then((res) => {
    //   return res.subscribe().then((res) => {
    //     console.log(res);
    //   });
    //   console.log(res);
    // });
    // swRegist.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: process.env.REACT_APP_APPLICATION_SERVER_KEY,
    // });
    // swRegist.pushManager
    //   .subscribe({
    //     userVisibleOnly: true,
    //     applicationServerKey: process.env.REACT_APP_APPLICATION_SERVER_KEY,
    //   })
    //   .then((subscription) => {
    //     console.log(subscription);
    //   })
    //   .catch((err) => {
    //     console.log("Failed to subscribe the user: ", err);
    //   });
    console.log(swRegist.pushManager.getSubscription());
  }

  // 알림 구독 취소
  function unsubscribe() {
    swRegist.pushManager
      .getSubscription()
      .then((subscription) => {
        if (subscription) {
          return subscription // 토글 시 메세지 안날라오게 하는 방법
            .unsubscribe()
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error unsubscribing", error);
      });
    console.log("swRegist", swRegist);
    console.log("swRegist2", swRegist.pushManager);
  }
  // getToken(messaging, {
  //   vapidKey:
  //     "BNS_aAOcAujyzvIRpw2qWAcPuag2WBc23zP24HPgWI45D6tLCjX7dEwUuB5uInsO4XLEAbH8NuSHC3BC24NtKUU",
  // })
  //   .then((token) => {
  //     console.log(token);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  function test1() {
    // console.log(isSupported());
    if ("Notification" in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Unable to get permission to notify.");
        }
      });
    }
  }

  const { pwaInstall } = useReactPWAInstall;

  const handleClick = () => {
    console.log("handleClick");

    pwaInstall({
      title: "Zzz 다운받기",
    })
      .then(() => {
        // 설치 성공
      })
      .catch((error) => {
        console.log(error);
        console.log("설치 실패");
      });
    console.log("handleClick2");
  };

  const filesrc = React.useRef();
  const [file, setFile] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [preview, setPreview] = useState(null);

  const imageJpg =
    "https://media.crystallize.com/demo/19/4/9/6/@200/candy_kid.jpg";
  const imageWebp =
    "https://media.crystallize.com/demo/19/4/9/6/@200/candy_kid.webp";
  const inputChagnge = (e) => {
    console.log(e.target.files);
    const files = e.target.files[0];
    const render = new FileReader();
    render.onload = () => {
      setFile(files);
      setPreview(render.result);

      // preview = render.result;
      // console.log(preview);

      // console.log(previewURL);
    };
    if (files) render.readAsDataURL(files);
  };
  const handleConvertedImage = (url) => {
    console.log(url);
    setPreviewURL(url);
  };
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);

  // const useInterval = (callback, delay) => {
  //   const savedCallback = useRef();

  //   // Remember the latest function.
  //   useEffect(() => {
  //     savedCallback.current = callback;
  //   }, [callback]);

  //   // Set up the interval.
  //   useEffect(() => {
  //     function tick() {
  //       savedCallback.current();
  //     }
  //     if (delay !== null) {
  //       let id = setInterval(tick, delay);
  //       return () => clearInterval(id);
  //     }
  //   }, [delay]);
  // };

  // useInterval(() => {
  //   setCount(count + 1);
  // }, delay);
  return (
    <div className="App">
      <h1>{count}</h1>

      <hr></hr>
      <div>{Token}</div>
      <hr></hr>
      <button onClick={test1}>test1</button>
      <button onClick={subscribe}>알림구독</button>
      <button onClick={unsubscribe}>알림구독취소</button>
      <button onClick={handleClick}>handleClick</button>
      <InstallPWA />
      <ChatRoom />
      <hr></hr>
      <input type="file" onChange={inputChagnge} />
      <img
        ref={filesrc}
        style={{
          width: "400px",
          height: "300px",
          backgroundImage: `url(${
            previewURL ? previewURL : "http://via.placeholder.com/400x300"
          })`,
        }}
      ></img>
      {/* <ConvertImage
        image={preview}
        onConversion={handleConvertedImage}
      ></ConvertImage> */}
      <Mymodaltest />
      <picture>
        <source srcSet={imageWebp} type="image/webp" />
        <source srcSet={imageJpg} type="image/jpeg" />
        <img src={imageJpg} alt="Alt Text!" />
      </picture>

      {/* <ModalPopUp close={false} /> */}
    </div>
  );
}

export default App;
// }src={preview ? preview : "http://via.placeholder.com/400x300"
