require('dotenv').config(); 
const express = require('express');
const professorsRoutes = require('./routes/professors');
const roomsRoutes = require('./routes/rooms');

const app = express();
app.use(express.json());

app.use('/professors', professorsRoutes);
app.use('/rooms', roomsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
