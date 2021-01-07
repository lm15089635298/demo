const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const swig = require('swig');
const mongoose = require('mongoose');
const Cookies = require('cookies'); //cookie模块
const cookieParser = require('cookie-parser');
const session = require('express-session');
let app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', swig.renderFile);
swig.setDefaults({ cache: false });
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public')); //静态资源托管
app.use(require('./models/userCookies'));
app.use(cookieParser());
app.use(session({
    secret: '12345', //用来对session数据进行加密的字符串，必须指定
    name: 'name', //表示cookie的name，默认是：connect.sid
    cookie: { maxAge: 60000 }, //cookie过期时间，毫秒
    resave: false, //每次请求都重新设置session cookie
    saveUninitialized: true, //
}));
//路由
app.use('/', require('./routes/index')); //首页
app.use('/admin', require('./routes/admin')); //管理系统首页
app.use('/user', require('./routes/user'));
//数据库
mongoose.connect('mongodb://localhost:27019/BIYE', { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        app.listen('3000', () => console.log('server is running'));
    }
})