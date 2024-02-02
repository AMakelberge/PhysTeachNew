
import express from 'express';
import path from 'path';
import { fileURLToPath  } from 'url';
import { dirname } from 'path';
import indexRouter from './routes/index.js';

// Set dirname to configure requests
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialise parameters for app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', indexRouter);

// Set the port used
const PORT = process.env.PORT || 3000;

// Confirm server is running
app.listen(PORT, function() {
    console.log('Server is running on port '+ PORT);
});