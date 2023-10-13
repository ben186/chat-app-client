import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatBar from '../components/ChatBar/ChatBar';
import { Message, useChatStore } from '../stores/use-chat-store';
import { useEffect, useRef, useState } from 'react';
import { MdOutlinePersonAddAlt, MdOutlineExitToApp } from 'react-icons/md';
import Modal from '../components/Modal/Modal';
import ChatBox from '../components/ChatBox/ChatBox';
import getUsername from '../api/get-username';
import moment from 'moment';

const Chat: React.FC = () => {
  const addChat = useChatStore((state) => state.addChat);
  const addUser = useChatStore((state) => state.addUser);
  const clear = useChatStore((state) => state.clear);

  const chats = useChatStore((state) => state.chats);
  const users = useChatStore((state) => state.users);
  const currentUser = useChatStore((state) => state.currentUser);

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<Message | null>('wss://localhost:7281/chat', { shouldReconnect: () => true });

  const [showAddUser, setShowAddUser] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [currentSelectedUser, setCurrentSelectedUser] = useState('');
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    if (lastJsonMessage === null) return;

    void addChat(lastJsonMessage.sender, {
      timestamp: lastJsonMessage.timestamp,
      sender: lastJsonMessage.sender,
      receiver: lastJsonMessage.receiver,
      data: lastJsonMessage.data,
    });
  }, [addChat, lastJsonMessage]);

  if (readyState !== ReadyState.OPEN || currentUser === undefined)
    return <div></div>;

  const handleOnSend = (text: string) => {
    const currentTimestamp = new Date().valueOf();

    sendJsonMessage({
      timestamp: currentTimestamp,
      sender: currentUser,
      receiver: currentSelectedUser,
      data: text,
    });

    void addChat(currentSelectedUser, {
      timestamp: currentTimestamp,
      sender: currentUser,
      receiver: currentSelectedUser,
      data: text,
    });
  };

  const handleAddUser = () => {
    if (userIdInput === currentUser) {
      setShowAddUser(false);
      return;
    }

    getUsername(userIdInput)
      .then((username) => {
        addUser(userIdInput, username);
        setShowAddUser(false);
        setCurrentSelectedUser(userIdInput);
      })
      .catch((err) => console.error(err));
  };

  const renderChat = () => {
    const userChats = chats.get(currentSelectedUser);
    if (userChats === undefined) return;

    return userChats
      .map((c, i) => (
        <ChatBox
          key={i}
          timestamp={c.timestamp}
          name={users.get(c.sender) ?? '[???]'}
          text={c.data}
        />
      ));
  };

  const renderItem = (name: string, lastChat: string, timestamp: number, key: string) => {
    const handleOnClick = () => {
      setCurrentSelectedUser(key);
    }

    return (
      <div key={key} onClick={handleOnClick} className='h-auto w-full border-b-2 px-[3%] py-2'>
        <div className='flex justify-between'>
          <p className='font-semibold'>{name}</p>
          <p className='text-right'><i>{moment(timestamp).format('LT')}</i></p>
        </div>
        <p className='truncate'>{lastChat}</p>
      </div>
    )
  };

  const renderUserList = () => {
    let userMessages: Message[] = [];

    for (const key of chats.keys()) {
      const messages = chats.get(key);
      if (messages === undefined) continue;

      userMessages.push(messages.slice(-1)[0]);
    }

    userMessages = userMessages.sort((a, b) => b.timestamp - a.timestamp);
    const processUserMessages = () => userMessages.map(msg => {
      const peer = msg.sender === currentUser ? msg.receiver : msg.sender;
      const lastChat = msg.sender === currentUser ? ('You: ' + msg.data) : msg.data;
      return renderItem(users.get(peer) ?? '', lastChat, msg.timestamp, peer);
    });

    return (
      <div className='w-full'>
        {processUserMessages()}
      </div>
    );
  };

  return (
    <div className='flex flex-row justify-end'>
      <Modal isOpen={showAddUser} hasCloseButton={true} onClose={() => setShowAddUser(false)}>
        <div className='flex flex-col p-4'>
          <input
            onChange={(e) => setUserIdInput(e.target.value)}
            className='my-3 text-center text-lg'
            type='text'
            placeholder='Enter user id here...'
          />
          <button onClick={handleAddUser} className='border-2 py-1'>
            Add User
          </button>
        </div>
      </Modal>
      <div className='fixed left-0 top-0 z-10 flex h-full w-[30%] flex-col border-r-2 border-slate-500'>
        <div className='flex h-12 w-full flex-row justify-end border-b-2 border-slate-500'>
          <button
              onClick={() => setShowAddUser(true)}
              className='flex h-10 w-10 items-center self-center outline-none'
            >
            <MdOutlinePersonAddAlt size={30} />
          </button>
          <button
              onClick={() => clear()}
              className='flex h-10 w-10 items-center self-center outline-none'
            >
            <MdOutlineExitToApp size={30} />
          </button>
        </div>
        {renderUserList()}
      </div>
      <div className='flex max-h-full min-h-screen w-[70%] flex-col justify-between'>
        <div className='sticky top-0 flex h-12 flex-row justify-between border-b-2 border-slate-500 bg-white px-[5%] max-sm:px-2'>
          <p className='self-center text-lg font-bold'>
            {users.get(currentSelectedUser)}
          </p>
        </div>
        <div className='flex flex-col justify-end'>
          {renderChat()}
          <div ref={scrollEndRef} />
          <ChatBar handleOnSend={handleOnSend} disabled={currentSelectedUser === ''} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
