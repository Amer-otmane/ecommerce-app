const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use('/api/products', require('./routes/products'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/orders',   require('./routes/orders'));

app.get('/', (req, res) => {
  res.json({ message: 'API E-Shop en ligne ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur sur http://localhost:${PORT}`);
});