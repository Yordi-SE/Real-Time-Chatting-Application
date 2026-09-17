const senderNameExtractor = (userId, usersArray) => {
  const sender = usersArray.find((user) => user._id !== userId);
  return sender;
};

export default senderNameExtractor;
