export default function handleSendErrors(message, success, status, next) {
	const error = new Error(message);
	error.status = status;
	error.success = success;
	return next(error);
}