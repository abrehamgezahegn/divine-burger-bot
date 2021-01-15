exports.getUserName = (msg) => {
  const userName = msg.chat.username;
  if (userName) return `💬 @${userName}`;
  else return "";
};
