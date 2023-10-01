const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const bodyParser=require('express').json;
const Blogstats_Router=require('./api/blog-stats');
const Blogsearch_Router=require('./api/blog-search.js');


app.use('/api',Blogstats_Router)
app.use('/api',Blogsearch_Router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});