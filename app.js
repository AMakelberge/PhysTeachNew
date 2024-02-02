
import express from 'express';
import path from 'path';
import { fileURLToPath  } from 'url';
import { dirname } from 'path';
import indexRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Server is running on port '+ PORT);
});