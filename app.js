const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const quotes = require('./quotes').quotes;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("HI")
})

let n = quotes.length;
app.get('/quotes/random', (req, res) => {
    const ind = Math.ceil(Math.random() * n);
    res.json(quotes[ind - 1]);
})
app.post('/quotes/random', (req, res) => {
    const { author, text } = req.body;
    if (!author || !text)
        res.json({ "error": 'empty field' });
    quotes.push({ author,text });
    res.json({ 'success': "Successfully updated" });
})
app.get('/quotes/random/:author', async(req, res) => {
    const author = req.params.author
    const arr = await quotes.filter((e) => e.author === author);
    if (!arr)
        res.json({ 'totalCount': arr.length, 'error': "Requested author is not found" });
    else
        res.json({'totalCount':arr.length,'Author':arr})
})


app.delete('/quotes/random/:author', (req, res) => {
    const author = req.params.author;
    const delIndex = quotes.findIndex((e) => e.author === author);
    quotes.pop(delIndex);
    if (delIndex === -1)
        res.json({ "error": "Requested author is not found" })
    else
        res.json({ "success": "Successfully Deleted" })
})
app.all('*', (req, res)=>{
    res.status(400).send("Bad request")
})
app.listen(3000, () => {
    console.log('listening')
}
)