const path = require('path'); 
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars =  require('express-handlebars');
// require('dotenv').config();

const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 3030;



app.use(cookieParser());

//Cấu hình express-session
app.use(session({
  secret: 'your_secret_key', // Khóa bí mật để ký session ID
  resave: false, //
  saveUninitialized: false
}));



const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes');

// DB
const db = require('./config/db');
// connect to DB
db.connect();

app.use(express.static(path.join(__dirname,'public')));

// app.set('views', path.join(__dirname, 'path/to/your/views'));


app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(methodOverride('_method'));



// Custom middlewares

app.use(SortMiddleware);



// HTTP logge
app.use(morgan('combined'));


// Template engine
app.engine(
  'hbs', 
  handlebars.engine( { 
    extname: '.hbs',
    helpers: {
        sum: (a , b) => a + b,
        sortable: (field, sort) =>{
          const sortType = field === sort.column ? sort.type : 'default'
  
  
          const icons = {
            default: 'bi bi-chevron-expand',
            asc: 'bi bi-sort-down-alt',
            desc: 'bi bi-sort-down',
          }
  
          const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
          }
  
          const icon = icons[sortType];
          const type = types[sortType];
  
          return `<a href="?_sort&column=${field}&type=${type}">
          <i class="${icon}"></i>
          </a> `;
        }
          
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));






// Routes init
route(app);








// const PORT = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});