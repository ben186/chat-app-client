import verifyAuth from './api/verify-auth';
import Modal from './components/Modal/Modal';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { useChatStore } from './stores/use-chat-store';

const App: React.FC = () => {
  const currentUser = useChatStore((state) => state.currentUser);
  const addCurrentUser = useChatStore((state) => state.addCurrentUser);

  const handleOnLogin = (username: string) => {
    verifyAuth(username)
      .then((userId) => {
        console.log(userId);
        addCurrentUser(userId, username);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {currentUser ? (
        <div>
          <Modal isOpen={true} hasCloseButton={true}>
            <div className='flex flex-col p-4'>
              <p>This is your generated ID to let other users identify you:</p>
              <p className='text-center font-bold'>{currentUser}</p>
            </div>
          </Modal>
          <Chat />
        </div>
      ) : (
        <Login handleOnLogin={handleOnLogin} />
      )}
    </div>
  );
};

export default App;
