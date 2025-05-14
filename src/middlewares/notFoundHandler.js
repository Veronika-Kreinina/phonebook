// notFoundHandler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Contact not found',
  });
};
