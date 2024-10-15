import { SmileIcon } from "../../svg/Smile";
import { GalleryIcon } from "../../svg/Gallery";
import { useSelector } from "react-redux";
import avatarImage from "../../assets/avatar.png";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import { getDownloadURL, getStorage, ref as Ref, uploadBytesResumable } from "firebase/storage"
import { MicrophoneIcon } from "../../svg/Microphone";

const Chatting = () => {
  const user = useSelector((state) => state.login.loggedIn);
  const singleFriend = useSelector((state) => state.active.active);
  const [message, setMessage] = useState("");
  const [singleMessage, setSingleMessage] = useState([]);
  const db = getDatabase();
  const [emojiShow, setEmojiShow] = useState(false)
  const storage = getStorage();
  const chooseFile = useRef(null)

  const sendMessage = () => {
    if (singleFriend?.status === "single") {
      set(push(ref(db, "singleMessage")), {
        senderId: user.uid,
        senderName: user.displayName,
        receiverId: singleFriend.id,
        receiverName: singleFriend.name,
        message: message,
        date: new Date().toISOString(), // Store date as ISO string
      }).then(() => {
        setMessage("");
      });
      setEmojiShow(false)
    }
  };

  const formatDate = (date) => {
    const messageDate = moment(date);
    const now = moment();

    // Determine how to format the date
    if (now.diff(messageDate, "Minutes") < 60) {
      return messageDate.fromNow(); // "x minutes ago"
    } else if (now.diff(messageDate, "Hours") < 24) {
      return messageDate.fromNow(); // "x hours ago"
    } else if (now.isSame(messageDate, "Year")) {
      return messageDate.format("MMMM Do"); // "August 29th"
    } else {
      return messageDate.format("MMMM Do YYYY"); // "August 29th 2023"
    }
  };

  useEffect(() => {
    if (singleFriend?.status === "single") {
      onValue(ref(db, "singleMessage"), (snapshot) => {
        const data = [];
        snapshot.forEach((item) => {
          if (
            (item.val().senderId === user.uid &&
              item.val().receiverId === singleFriend.id) ||
            (item.val().receiverId === user.uid &&
              item.val().senderId === singleFriend.id)
          ) {
            data.push(item.val());
          }
        });
        setSingleMessage(data);
      });
    }
  }, [db, singleFriend?.id]);

  const handleEmojiSelect = ({ emoji }) => {
    setMessage(message + emoji);
  };

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0]
    const storageRef = Ref(storage,
      `${user.displayName} = "sendImageMessage/ ${imageFile}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "singleMessage")), {
            senderId: user.uid,
            senderName: user.displayName,
            receiverId: singleFriend.id,
            receiverName: singleFriend.name,
            message: message,
            image: downloadURL,
            date: new Date().toISOString(), // Store date as ISO string
          }).then(() => {
            setMessage("");
          });
        });
      }
    );
  }

  return (
    <>
      {singleFriend?.status ? (
        <>
          <div className="w-[100%] bg-white rounded-md shadow-md overflow-hidden">
            <div className="py-4 bg-[#F9F9F9] px-6">
              <div className="flex items-center gap-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={singleFriend?.photoURL || avatarImage}
                    alt={singleFriend?.name || "Please Select atleast a Friend"}
                  />
                </div>
                <div>
                  <span className="text-blcak font-interMedium capitalize text-base md:text-[20px]">
                    {singleFriend?.name || "Please Select atleast a Friend"}
                  </span>
                </div>
              </div>
            </div>
            <div className="min-h-[75vh] bg-white px-6 pb-2 overflow-scroll scrollbar-thin scrollbar-webkit">
              {/* Sender Massage */}

              {singleFriend?.status === "single"
                ? singleMessage.map((item, index) => (
                  <>
                    {item?.senderId === user?.uid ? (
                      <div className="w-[60%] ml-auto" key={index}>
                        <div className="flex items-center gap-x-3 my-3">
                          <div className="w-full ml-auto text-right">
                            <p className="text-white font-reguler text-sm bg-blue-500 px-4 py-2 rounded-md inline-block">
                              {item.message}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={user?.photoURL || avatarImage}
                              alt={
                                user?.displayName || "Please Select  atleast a Friend"
                              }
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 block ml-auto text-right">
                          {formatDate(item?.date)}
                        </span>
                      </div>
                    ) : (
                      <div className="w-[60%] mr-auto" key={index}>
                        <div className="flex items-center gap-x-3 my-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={singleFriend?.photoURL || avatarImage}
                              alt={
                                singleFriend?.name || "Please Select a Friend"
                              }
                            />
                          </div>
                          <div className="w-full ml-auto">
                            <p className="text-black font-reguler text-sm bg-[#e5e5e5] px-4 py-2 rounded-md inline-block">
                              {item?.message}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 block mr-auto">
                          {formatDate(item?.date)}
                        </span>
                      </div>
                    )}
                  </>
                ))
                : "Message Not Found!"}
            </div>
            <div className="py-1.5 md:py-4  px-[25px]">
              <div className="bg-[#F5F5F5] pl-4">
                <div className=" ml-[15px] rounded-md mx-auto py-1.5 md:py-3 px-1.5 md:px-0 grid grid-cols-[70px_auto_88px] items-center gap-x-0.5 md:gap-x-3">
                  <div className="flex items-center md:justify-end gap-x-0.5 md:gap-x-3">
                    <div className="relative">

                      <div className="voice flex items-center gap-2">
                        <div className="cursor-pointer" onClick={() => setEmojiShow((prev) => !prev)}>
                          <MicrophoneIcon />
                        </div>
                        <div className="cursor-pointer" onClick={() => setEmojiShow((prev) => !prev)}>
                          <SmileIcon />
                        </div>
                      </div>
                      {
                        emojiShow && (
                          <div className=" absolute bottom-8 -left-3 shadow-xl">
                            <EmojiPicker onEmojiClick={handleEmojiSelect} />
                          </div>
                        )}
                    </div>
                    <div className="cursor-pointer" onClick={() => chooseFile.current.click()}>
                      <GalleryIcon />
                    </div>
                    <input ref={chooseFile} hidden type="file" onChange={handleImageUpload} />
                  </div>
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="outline-none bg-[#F5F5F5]"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                  <div className="md:pr-2">
                    <button
                      onClick={sendMessage}
                      className="cursor-pointer w-full py-2 bg-[#3E8DEB] text-white rounded-md fontRegular text-xl"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-[100%] bg-white overflow-hidden py-3 px-5 flex flex-col items-center justify-center min-h-80">
            <h2 className="text-center font-fontBold text-xl">
              Please Select atleast a Friend
            </h2>
            {/* <div className="w-40 h-40 rounded-full overflow-hidden mt-5">
              <Lottie animationData={registrationAnimation} loop={true} />
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default Chatting;
