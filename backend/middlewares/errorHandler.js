export default function errorHandler(err, req, res, next) {
	const status = err.status || 500;
	const message = err.message?.trim() || "Something went wrong.";
	const success = err.success ?? false;
	return res.status(status).json({ message, success });
}