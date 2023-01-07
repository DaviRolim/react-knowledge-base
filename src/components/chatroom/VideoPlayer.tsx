import { Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  console.log('userVideo', userVideo)
  return (
    <>
      <div className="justify-content-center align-content-center m-3 grid grid-cols-2 place-content-center gap-2">
        {stream && (
          <div className={`col-span-2 border-2 border-black px-2 py-3 ${callAccepted && !callEnded ? "md:col-span-1" : ""}`}>
            <Text fontSize={"xl"}>{name || "Name"}</Text>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="h-full w-full"
            />
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className="col-span-2 border-2 border-black px-2 py-3 md:col-span-1">
            <Text fontSize={"xl"}>{call?.name || "Name"}</Text>
            <video
              playsInline
              muted
              ref={userVideo}
              autoPlay
              className="h-full w-full"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
