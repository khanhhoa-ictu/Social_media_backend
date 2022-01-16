import express, { Request, Response } from 'express';
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./api/routers/user.router');
const postRouter = require('./api/routers/post.router');
const conversationRouter = require('./api/routers/converstation.router')
const messageRouter = require('./api/routers/messages.router')
mongoose.Promise = global.Promise;

const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost/margatsni_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log(err);
    }
}
connect();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors())

userRouter(app);
postRouter(app);
conversationRouter(app)
messageRouter(app)
app.get('/', (req: Request, res: Response) => { res.send('welcome to Test') })

app.listen(port, () => console.log("server running on port " + port));