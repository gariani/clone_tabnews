function status(request, response) {
  response.status(200).json({ message: "testing response..." });
}

export default status;
