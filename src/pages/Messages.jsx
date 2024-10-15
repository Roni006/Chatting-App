import Chatting from "../components/Chatting";
import Friends from "../components/Friends";

const Messages = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr,4fr] gap-8 p-8 ">
      <div className="w-full">
        <Friends />
      </div>
      <div className="w-full">
        <Chatting />
      </div>
    </div>
  );
};

export default Messages;
