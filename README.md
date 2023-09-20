https://aws-compare-yourself.vercel.app/

# About
This project is a simple SPA application with React.
The main goal here was to practice Amazon Web Services.

So here is a breaf description of architecture.

1. First of all - I used `React` to create front-end for application
2. Before any work inside the app user needs to authorize. For authorization process (`Sign in`, `Sign up`, `Email verification`) I used `AWS Cognito` service.
3. Inside, the application wants to receive some external data. To do that it sends HTTP request to created `AWS API Gateway`. Here are the possible requests:
- `POST /compare-yourself` - to add personal data to compare
- `DELETE /compare-yourself` - to delete personal data
- `OPTIONS /compare-yourself` - for preflight request to check CORS
- `GET /compare-yourself/:type` - type can be `all` or `single` that allows client to get all data or only authorized user data.
- `OPTIONS /compare-yourself/:type` - for preflight request to check CORS
4. After request was send `API Gateway` transforms the data using created models, verifies authorization and invokes `AWS Lambda Functions`.
5. Inside of `Lambda` there is some logic to `get/delete/add` data to database.
6. For database I used `AWS Dynamo DB` that is a NoSQL database from Amazon.
7. All important data is hidden in `.env` files
8. To deploy `React app` I used `Vercel` because its very fast and free.
