/*
 * Name: Basic Authentication Sample to HPE NextGen ALM/QC on HPE SaaS Environment
 * Author: Andrew M. Flick
 * Date: 04/06/2016
 */

var https = require('https');
var fs = require('fs');

var token = auth_token("Enter Your ClientID Here.", "Enter Your Client Secret Here.");

//Encoding function for the ClientID/ClientSecret
function auth_token(ClientID, ClientSecret)
{
    var auth = ClientID + ':' + ClientSecret;
    var buffer = new Buffer(auth);
    var token = buffer.toString('base64');
    return "Basic " + token;
} 

/*
  Authentication for the API is handled through the path /authentication/sign_in.
  Note: The credentials are encoded, but not encyrpted.  It is important to pass them 
  over a secure connection.
*/

var options = {
    host: 'someurl.saas.hpe.com',
    path: '/authentication/sign_in',
    method: 'POST',
    Connection: 'keep-alive',
    headers: {
        "authorization" : token
    }
};

var req = https.request(
    options,
    function (res) {
        //Check to see that we are connected to NGA
        if(res.statusCode == 200)
        {
            var ALM_COOKIES_ARRAY = res.headers["set-cookie"];
            if (ALM_COOKIES_ARRAY)
            {
                var ALM_COOKIES = "";
                for(i = 0; i < ALM_COOKIES_ARRAY.length; i++)
                {
                    ALM_COOKIES = ALM_COOKIES + ALM_COOKIES_ARRAY[i] + ";";
                }
                /*You now have the cookies in a format that will allow you to authenticate 
                  and access the NextGen ALM API's*/
                console.log(ALM_COOKIES);
                fs.writeFile('cookies.txt', ALM_COOKIES);
            }
            else
                console.log("Cookie Monster has no cookies!");
        }
        else
            console.log("Error: " + res.statusCode + " " +res.statusMessage);
    });

req.on('error', function(e)
{
    console.log("Error: " + e.message);
});

req.end();
