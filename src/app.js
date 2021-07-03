const express = require('express');
const logger = require('morgan')
const path = require('path');

const app = express();

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;