
let posts = [];

exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        // Return the list of posts
        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    }

    if (event.httpMethod === 'POST') {
        const newPost = JSON.parse(event.body);
        posts.push(newPost);
        return {
            statusCode: 201,
            body: JSON.stringify(newPost),
        };
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed',
    };
};
