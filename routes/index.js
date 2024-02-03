
import express from 'express';
import { MongoClient } from 'mongodb';
import readline from 'readline';

// Interface for reading password
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Reads from the terminal
async function query() {
    return await new Promise(resolve => read.question("Password: ", resolve));
}

// Gets password
async function getPassword(){
    try {
        const answer = await query();
        return answer;
    } catch (error) {
        console.log(`Error: ${error}`);
    } finally {
        read.close();
    }
}

// Get the password
const password = await getPassword();

// Set up client with mongoDB database
const client = new MongoClient(`mongodb+srv://dbo:${password}@physteach.dl3xqy3.mongodb.net/?retryWrites=true&w=majority`)

// Set up router
const router = express.Router();

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
