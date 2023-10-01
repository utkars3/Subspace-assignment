const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const _ = require('lodash');


router.get('/blog-search/:query', async (req, res) => {

    try {
        const curlCommand = `curl -H "x-hasura-admin-secret:32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6" https://intent-kit-16.hasura.app/api/rest/blogs`;

        // Execute the curl command using child_process
        exec(curlCommand, (error, stdout) => {
            if (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Failed to fetch blog data' });
                return;
            }

            // Parse the JSON response from curl
            let jsondata;
            try {
                jsondata = JSON.parse(stdout);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ error: 'Failed to parse blog data' });
                return;
            }




            function filterBlogsByQuery(blogs, query) {
                return _.filter(blogs, (blog) =>
                    _.includes(_.toLower(blog.title), query)
                );
            }

            const filteredData = _.memoize(filterBlogsByQuery);
            const filteredData2 = filteredData(jsondata.blogs, req.params.query)


            res.json({
                filteredData2
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch blog data' });
    }
});












module.exports = router


