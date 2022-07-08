import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                <Avatar
                  mt='7px'
                  mr={1}
                  size='sm'
                  cursor='pointer'
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#bee3f8" : "#0d11fc"
                }`,
                color: `${m.sender._id === user._id ? "black" : "white"}`,
                padding: "5px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                // marginLeft: `${m.sender._id === user._id ? "auto" : "30"}`,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
