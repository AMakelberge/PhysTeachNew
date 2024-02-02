
import express from 'express';
import { MongoClient } from 'mongodb';
import readline from 'readline';

// Get the password of the mongoDB database
let password;
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
read.question("Password: ", function(answer) {
    password = answer;
    read.close();
})

// Set up router
const router = express.Router();

// Set up client with mongoDB database
const client = new MongoClient(`mongodb+srv://dbo:${password}@physteach.dl3xqy3.mongodb.net/?retryWrites=true&w=majority`)

// Gets the presets from the database
async function GetPresets() {
    await client.connect();
    const dbo = client.db('presets');
    return await dbo.collection('preset-collection').find({}).toArray();
}

// Adds presets to database
async function InsertPreset(name, th1, th2, om1, om2) {
    await client.connect();
    let dbo = client.db('presets'); 
    await dbo.collection('preset-collection').insertOne({name, th1, th2, om1, om2});
}

// General get request handling
router.get('/', async function (req, res) {
    let presets = await GetPresets();
    res.render('index', {presets});
});

// Handles post requests for adding the presets
router.post('/addPreset', function (req, res){
    (async function () {
        await InsertPreset(req.body.name, req.body.th1, req.body.th2, req.body.om1, req.body.om2);
        res.redirect('/');
    })();
});

// Export router to app.js
export default router;
