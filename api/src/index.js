const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const requestIP = require("request-ip");

const baseRoute = require("./routes/base");
const pollsRoute = require("./routes/polls");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(requestIP.mw());
app.use(morgan('dev'));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use("/", baseRoute);
app.use("/poll", pollsRoute);

app.listen(app.get("port"), () => {
    console.log(`API is running on port $(app.get('port'))`);
})
