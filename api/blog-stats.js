const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { exec } = require('child_process');


router.get('/blog-stats', async (req, res) => {
    try {
    
    const curlCommand = `curl -H "x-hasura-admin-secret:32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6" https://intent-kit-16.hasura.app/api/rest/blogs`;

    // Execute the curl command using child_process
    exec(curlCommand, (error, stdout) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch blog data' });
        return;
      }

      const len=(stdout)=>{
        return stdout.length;
      }
      const memlen=_.memoize(len);
      const bloglength=memlen(stdout);

      // Parse the JSON response from curl
      let jsondata;
      try {
        jsondata = JSON.parse(stdout);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Failed to parse blog data' });
        return;
      }



      

      


      const longtitle=(data)=>{return _.maxBy(data.blogs,'title.length')}
      const memlongtitle=_.memoize(longtitle)
      const longestblogtitle=memlongtitle(jsondata)



      const blogsWithTitlePrivacy =(data)=>{ return (_.filter(data.blogs, (blog) =>
        _.includes(_.toLower(blog.title), 'privacy')
      )).length};
        const memblogsWithTitlePrivacy=_.memoize(blogsWithTitlePrivacy)
        const blogprivacy=memblogsWithTitlePrivacy(jsondata)
        

      const uniqueBlog =(data)=>{return (_.uniqBy(data.blogs, 'title')).map((blog)=>blog.title)};
      const memuniqueBlog=_.memoize(uniqueBlog)
      const uniblog=memuniqueBlog(jsondata)

  
      
      
        
      res.json({
        "Total number of blogs":bloglength,
        "Title of the longest blog":longestblogtitle.title,
        "Number of blogs with 'privacy' in the title":blogprivacy,
        "Array of unique blog titles":uniblog
        
        });
        
    });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch blog data' });
    }
  });


  









module.exports = router


