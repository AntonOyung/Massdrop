Set up instructions:

In your console:
  1. npm install to install
  2. mongod to connect to database


Submit jobs like 'POST localhost:8080/jobs/url'

Get job status like 'GET localhost:8080/status/id'

Update and complete job like 'PUT localhost:8080/status/id'

Pop first item from queue and view results if job is complete
like 'DELETE localhost:8080/jobs/view'
