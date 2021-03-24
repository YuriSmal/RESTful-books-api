const express = require('express');
const app = express();
const port = 5000;
const booksRouter = require('./routers/router');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

booksRouter(app);

app.listen(port, () => {
    console.log(`Book app is listening at port ${port}`)
})

