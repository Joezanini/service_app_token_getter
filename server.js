const http = require('http');
const axios = require('axios');
const base64url = require('base64url');

// Configuration
const clientId = 'your_client_id';
const clientSecret = 'your_client_secret';
const token = 'your_bearer_token'; // Replace with your actual token

// Function to generate application_Id
function generateApplicationId(clientId) {
    const prefix = "ciscospark://us/APPLICATION/";
    const applicationId = base64url(prefix + clientId);
    return applicationId;
}

// Function to get orgId from the encoded value
function getOrgId(encodedvalue) {
    const decodedvalue = base64url.decode(encodedvalue);
    const orgId = decodedvalue.split("/")[4];
    return orgId;
}

const application_Id = generateApplicationId(clientId);

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';

        // Collect the data from the request
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Handle the end of the request
        req.on('end', async () => {
            const event = JSON.parse(body);

            if (event.event === 'authorized') {
                const orgId = getOrgId(event.orgId);

                try {
                    const response = await axios.post(
                        'https://webexapis.com/v1/applications/' + application_Id + '/token',
                        {
                            clientId: clientId,
                            clientSecret: clientSecret,
                            targetOrgId: orgId
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    console.log('Token obtained successfully:', response.data);
                } catch (error) {
                    console.error('Error obtaining token:', error);
                }
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
