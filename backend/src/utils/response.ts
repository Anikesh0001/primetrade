export const response = <T>(data: T, message = "") => ({
  success: true,
  data,
  message
});
