import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avatarImage from "../../assets/avatar.png";

const FriendRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((user) => user.login.loggedIn);
  const [friendRequest, setFriendRequest] = useState([]);
  const db = getDatabase();

  // Show friend request
  useEffect(() => {
    setIsLoading(true);
    const starCountRef = ref(db, "friendRequest/");
    onValue(starCountRef, (snapshot) => {
      let data = [];
      snapshot.forEach((item) => {
        if (item.val().receiverId === user.uid) {
          data.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequest(data);
      setIsLoading(false);
    });
  }, [db, user.uid]);
  const handelAccept = (data) => {
    const db = getDatabase();
    set(push(ref(db, "friends")), {
      ...data,
    }).then(() => {
      remove(ref(db, "friendRequest/" + data.id));
    });
  };
  const handelReject = (data) => {
    const db = getDatabase();
    remove(ref(db, "friendRequest/" + data.id));
  };
  return (
    <div className="px-3 h-full lg:px-8 pt-3 pb-5 bg-white rounded-[10px] md:shadow-md overflow-y-auto scrollbar-thin scrollbar-webkit">
      <h1 className="text-lg md:text-xl font-interSemiBold text-[#494949]">
        Friend Requests{" "}
        {friendRequest.length ? `(${friendRequest.length})` : null}
      </h1>
      {isLoading ? (
        <p className="mt-[18px] mb-[18px]">Loading...</p>
      ) : (
        <>
          {friendRequest.length ? (
            <>
              {friendRequest.map((item) => (
                <div
                  className="flex items-center justify-between mt-5"
                  key={item.id}
                >
                  <div className="flex items-center gap-x-2">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                      <img
                        src={item.senderProfile || avatarImage}
                        alt={item.senderName}
                      />
                    </div>
                    <h3 className="text-[14px] lg:text-lg font-fontRegular text-black">
                      {item.senderName}
                    </h3>
                  </div>
                  <div className="text-black cursor-pointer flex gap-x-2 items-center">
                    <button
                      className="text-white bg-[#4A81D3] focus:outline-none font-medium rounded-lg text-sm px-1.5 lg:px-5 py-2 text-center"
                      onClick={() => handelAccept(item)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-white bg-[#D34A4A] focus:outline-none font-medium rounded-lg text-sm px-1.5 lg:px-5 py-2 text-center"
                      onClick={() => handelReject(item)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="mt-[18px] mb-[18px]">There are No Friend Requests to show</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FriendRequest;
