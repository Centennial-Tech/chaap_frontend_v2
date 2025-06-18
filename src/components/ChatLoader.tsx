const ChatLoader = () => {
  return (
    <div className="inline-block py-3 rounded-[20px] rounded-bl-[2px]">
      <div className="flex items-center h-[14px]">
        <div className="w-[7px] h-[7px] bg-[#034da2] rounded-full mr-1 animate-bounce1"></div>
        <div className="w-[7px] h-[7px] bg-[#034da2] rounded-full mr-1 animate-bounce2"></div>
        <div className="w-[7px] h-[7px] bg-[#034da2] rounded-full animate-bounce3"></div>
      </div>
    </div>
  );
};

export default ChatLoader;
