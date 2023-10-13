import { create } from 'zustand';
import getUsername from '../api/get-username';

type Username = string;
type UserId = string;

export interface Message {
  timestamp: number;
  sender: Username,
  receiver: Username,
  data: string
}

interface State {
  currentUser: UserId | undefined,
  users: Map<UserId, Username>;
  chats: Map<UserId, Message[]>;
}

interface Actions {
  addChat: (userId: UserId, message: Message) => Promise<void> | void;
  addCurrentUser: (userId: UserId, username: Username) => void;
  addUser: (userId: UserId, username: Username) => void;
  removeUser: (userId: UserId) => void;
  clear: () => void;
}

export const useChatStore = create<State & Actions>((set, get) => ({
  currentUser: undefined,
  users: new Map(),
  chats: new Map(),
  addChat: async (userId: UserId, message: Message) => {
    const users = get().users;

    if (!users.has(message.sender))
      users.set(message.sender, await getUsername(message.sender));
    if (!users.has(message.receiver))
      users.set(message.receiver, await getUsername(message.receiver));

    const messages = get().chats.get(userId) ?? [];
    const newMessages = [message, ...messages].sort((a, b) => a.timestamp - b.timestamp);

    set(state => ({ 
      users: state.users,
      chats: new Map(state.chats).set(userId, newMessages)
    }));
  },
  addCurrentUser: (userId: UserId, username: Username) => {
    set(state => ({ 
      currentUser: userId,
      users: new Map(state.users).set(userId, username),
      chats: state.chats
    }));
  },
  addUser: (userId: UserId, username: Username) => {
    set(state => ({ 
      users: new Map(state.users).set(userId, username),
      chats: state.chats
    }));
  }, 
  removeUser: (userId: UserId) => {
    const users = get().users;
    const chats = get().chats;

    // Delete the user including messages
    users.delete(userId);
    chats.delete(userId);

    set(() => ({
      users: new Map(users),
      chats: new Map(chats)
    }));
  },
  clear: () => {
    set(() => ({
      currentUser: undefined,
      users: new Map(),
      chats: new Map()
    }));
  }
}));
