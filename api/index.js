module.exports = (req, res) => {
  console.log('test Hello from san bartolo')
  res.status(200).json({ message: 'Hello from San Bartolo serverless!' });
}
  