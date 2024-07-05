require('dotenv').config()

/********* SERVER ********/

const PORT   =   process.env.PORT

/********* DATABASE *********/

const PG_USER = process.env._USER
const PG_NAME = process.env._NAME
const PG_PASS = process.env._PASS
const PG_HOST = process.env._HOST

/*********** KEY **********/

const KEY  =   process.env.KEY


/*********** SERVICE MAIL *********/

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REFRESH_TOKEN =  process.env.REFRESH_TOKEN
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

/************ ROUTES *********/

const FORGOT  = process.env.FORGOT
const UPDATE  = process.env.UPDATE

module.exports = {
    //server
    PORT,
    //database
    PG_USER,
    PG_NAME,
    PG_PASS,
    PG_HOST,
    //key
    KEY,
    //service
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    ACCESS_TOKEN,
    //routes
    FORGOT,
    UPDATE
}