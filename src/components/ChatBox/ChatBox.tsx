import moment from 'moment';
import React from 'react';

export interface ChatBoxProps {
  name: string;
  text: string;
  timestamp: number;
}

const ChatBox: React.FC<ChatBoxProps> = (props) => {
  return (
    <div className='h-auto w-full border-t-2 px-[5%] py-2 max-sm:px-2'>
      <div className='flex justify-between'>
        <p className='font-semibold'>{props.name}</p>
        <p className='text-right'><i>{moment(props.timestamp).format('LT')}</i></p>
      </div>
      <p className='whitespace-pre-wrap'>{props.text}</p>
    </div>
  );
}

export default ChatBox;