import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import avatarImage from "../../assets/avatar.png";
import { ActiveSingle } from "../../fetures/slice/ActiveSingleSlice";
const Friends = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((user) => user.login.loggedIn);
  const location = useLocation();
  const navigateTo = useNavigate();
  const db = getDatabase();
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();

  // Show friend
  useEffect(() => {
    setIsLoading(true);
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let data = [];
      snapshot.forEach((item) => {
        if (
          item.val().senderId === user.uid ||
          item.val().receiverId === user.uid
        ) {
          data.push({ ...item.val(), id: item.key });
        }
      });
      setFriends(data);
      setIsLoading(false);
    });
  }, [db, user.uid]);

  const handellSingleChat = (data) => {
    if (data.receiverId === user.uid) {
      dispatch(
        ActiveSingle({
          status: "single",
          id: data.senderId,
          name: data.senderName,
          photoURL: data.senderProfile,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "single",
          id: data.senderId,
          name: data.senderName,
          photoURL: data.senderProfile,
        })
      );
    } else {
      dispatch(
        ActiveSingle({
          status: "single",
          id: data.receiverId,
          name: data.receiverName,
          photoURL: data.receiverProfile,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "single",
          id: data.receiverId,
          name: data.receiverName,
          photoURL: data.receiverProfile,
        })
      );
    }
  };
  return (
    <div className="px-3 h-full lg:px-8 pt-3 pb-5 bg-white rounded-[10px] md:shadow-md overflow-y-auto scrollbar-thin scrollbar-webkit">
      <h1 className="text-lg md:text-xl font-interSemiBold text-[#494949]">
        Friends {friends.length ? `(${friends.length})` : null}
      </h1>
      {isLoading ? (
        <>
          <p className="mt-[18px] mb-[18px]">Loading...</p>
        </>
      ) : (
        <>
          {friends.length ? (
            <>
              {friends.map((item, index) => (
                <div
                  className="flex items-center justify-between mt-5 hover:bg-[#e5e5e5] cursor-pointer rounded-md p-3"
                  key={index}
                  onClick={() => handellSingleChat(item)}
                >
                  <div className="flex items-center gap-x-2">
                    <div className="w-12 h-12 rounded-full bg-black overflow-hidden">
                      {user.uid === item.receiverId ? (
                        <img
                          src={item.senderProfile || avatarImage}
                          alt={item.senderName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.receiverProfile || avatarImage}
                          alt={item.receiverName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-base lg:text-[23px] font-interMedium text-[#3D3C3C] capitalize">
                      {user.uid === item.receiverId
                        ? item.senderName
                        : item.receiverName}
                    </h3>
                  </div>
                  {location.pathname === "/" && (
                    <div className="text-black cursor-pointer flex gap-x-2 items-center">
                      <button
                        onClick={() => {
                          navigateTo("/messages");
                        }}
                        className="text-white bg-[#4A81D3] focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center"
                      >
                        Message
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="mt-[18px] mb-[18px]">There Are No Friends To Show</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Friends;
