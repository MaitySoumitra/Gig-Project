const success = (res, message, data = null) => {
    return res.status(200).json({
      success: true,
      message: message,
      data: data,
    });
  };
  
  const error = (res, message, data = null) => {
    return res.status(400).json({
      success: false,
      message: message,
      data: data,
    });
  };
  
  module.exports = { success, error };
  