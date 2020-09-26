const videogrid = document.getElementById("video-grid");
const socket = io("/");
const peer = new Peer(undefined, {
  host: "/",
  port: "3000",
});

const myvideo = document.createElement("video");
myvideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(stream => {
    addVideoStream(myvideo, stream);

    peer.on("call", call => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", userId => {
      connectToNewUser(userId, stream);
    });
  });

peer.on("open", id => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", userId => {
  console.log("user connected: ", userId);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videogrid.append(video);
}

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });
}
