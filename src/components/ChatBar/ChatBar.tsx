import React, { useRef, useState } from 'react';
import useAutosizeTextArea from './use-autosize-text-area';

interface ChatBarProps {
  disabled?: boolean;
  handleOnSend: (text: string) => void;
}

const ChatBar: React.FC<ChatBarProps> = (props) => {
  const [value, setValue] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textInputRef.current, value, 4);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleOnClick = () => {
    props.handleOnSend(value);
    setValue('');
  };

  return (
    <div className='sticky bottom-0 flex w-full flex-row items-center border-t-2 border-slate-500 
                  bg-white px-[5%] py-2 max-sm:px-2'
    >
      <textarea 
        className='w-full resize-none outline-none'
        onChange={handleTextInputChange}
        value={value}
        ref={textInputRef} 
        rows={1} 
        placeholder='Type your message here...'
      />
      <button disabled={props.disabled} className='ml-2 border-2 px-4 py-1' onClick={handleOnClick} type='button'>Send</button>
    </div>
  );
}

export default ChatBar;