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
const URL = 'mongodb+srv://admin:aGsnda87yYPgKEbr@cluster0.io9hj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
 mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            console.log('connect to MongoDB');
            app.listen(port, () => console.log("server running on port " + port));

        }).catch((err:string) => console.log(err))


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors())

userRouter(app);
postRouter(app);
conversationRouter(app)
messageRouter(app)
app.get('/', (req: Request, res: Response) => { res.send('welcome to Test') })
