import fs from "fs";
import express from "express";
import SessionDatabase from "../../database/db/session.db.js";
import { AutoReply } from "../../database/db/messageRespon.db.js";
import HistoryMessage from "../../database/db/history.db.js";
import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const router = express.Router();

const { SESSION_PATH, LOG_PATH } = process.env;

const db = new SessionDatabase();


router.get("/login", async (req, res) => {
	res.render("dashboard/login", {
		layout: "layouts/login",
	});
});

router.post('/auth', function(req, res, next) {
    const user_name = req.body.user_name;
	const user_password = req.body.user_password;

	connection.query('SELECT * FROM table_user WHERE user_name = ? AND user_password = SHA2(?,512)', [user_name, user_password], function(err, rows, fields) {
        if(err) throw err;
        
        if (rows.length <= 0) {
            req.flash('error_msg', 'Username or password not valid')
            res.redirect(`/`)
        } else { 
            req.session.loggedin = true;
            req.session.user_name = rows[0].user_name;
            res.redirect(`/dashboard/index`);
        }            
    });
});

function verify (req, res, next){
	if(req.session.loggedin === true){
		next();
		return;
	} else {
		req.session.destroy(function(err) {
			res.redirect('/dashboard/login');
		})
	}
}

router.get("/index", verify, async (req, res) => {
		let sessionCheck = fs.readdirSync(SESSION_PATH).filter((x) => x != "store")[0];
		let session_name = sessionCheck ? sessionCheck : null;
		let loggerPath = fs.existsSync(`index/${LOG_PATH}/${session_name}.txt`) ? `${LOG_PATH.replace("./public/", "")}/${session_name}.txt` : null;
		const session = session_name ? await db.findOneSessionDB(session_name) : null;
		res.render("dashboard/dashboard", {
			loggerPath,
			session,
			session_name,
			layout: "layouts/main",
		});
});

router.get("/send-message", verify, async (req, res) => {
	const session = await db.findAllSessionDB();
	res.render("dashboard/sendMessage", {
		session,
		layout: "layouts/main",
	});
});

router.get("/auto-reply", verify, async (req, res) => {
	const session = await db.findAllSessionDB();
	const replyList = await new AutoReply().checkReplyMessage();
	res.render("dashboard/autoReply", {
		session,
		replyList,
		layout: "layouts/main",
	});
});

router.get("/api-doc", verify, async (req, res) => {
	res.render("dashboard/apidoc", {
		layout: "layouts/main",
	});
});

router.get("/history-message", verify, async (req, res) => {
	let db = await new HistoryMessage().getAllMessage();
	res.render("dashboard/history", {
		layout: "layouts/main",
		db,
	});
});

export default router;
