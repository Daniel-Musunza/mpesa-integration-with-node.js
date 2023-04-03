const express = require("express");
const cors = require('cors');
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");

const port = 3000;
const hostname = "localhost";
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("MPESA DARAJA API WITH NODE JS BY MR THREE COMAS");
  var timeStamp = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});
//ACCESS TOKEN ROUTE
app.get("/access_token", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});


// //MPESA STK PUSH ROUTE
app.get("/stkpush", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const url =
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + accessToken;
      var timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "174379" +
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
          timestamp
      ).toString("base64");

      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: "your Phone number starting with 254",
            PartyB: "174379",
            PhoneNumber: "Your Phone Number starting with 254",
            CallBackURL: "https://umeskiasoftwares.com/umswifi/callback",
            AccountReference: "Your Account Number",
            TransactionDesc: "Mpesa Daraja API stk push test",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
          }
        }
      );
    })
    .catch(console.log);
});




//REGISTER URL FOT C2B
app.get("/registerurl",cors(), (req, resp) => {
  getAccessToken()
    .then((accessToken) => {
      let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
      let auth = "Bearer " + accessToken;
      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            ShortCode: "174379",
            ResponseType: "Complete",
            ConfirmationURL: "http://example.com/confirmation",
            ValidationURL: "http://example.com/validation",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          }
          resp.status(200).json(body);
        }
      );
    })
    .catch(console.log);
});

app.get("/confirmation", (req, res) => {
  console.log("All transaction  will be send to this url");
  console.log(req.body);
});

app.get("/validation", (req, resp) => {
  console.log("Validating payment");
  console.log(req.body);
});

//B2C ROUTE OR AUTO WITHDRAWAL
app.get("/b2curlrequest", (req, res) => {
  getAccessToken()
  .then((accessToken) => {
    const securityCredential = "Qjcj1dZPZSzvZ1xAopnKeQ9l19ESwSCnsS8Qel0ZkJ==";
    const url =
        "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      auth = "Bearer " + accessToken;
    request(
      {
        url: url,

        method: "POST",

        headers: {
          Authorization: auth,
        },

        json: {
          InitiatorName: "testapi",

          SecurityCredential: securityCredential,

          CommandID: "PromotionPayment",

          Amount: "1",

          PartyA: "600996",

          PartyB: "254794711950",

          Remarks: "Withdrawal",

          QueueTimeOutURL:
            "https://mydomain.com/b2c/queue",

          ResultURL:
            "https://mydomain.com/b2c/result",

          Occasion: "Withdrawal",
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
        }
        res.status(200).json(body);
      }
      );
    })
      .catch(console.log);
});   
      
// ACCESS TOKEN FUNCTION
function getAccessToken() {
  const consumer_key = "xxxxxxxxxxxxxxxxxxxxxxxxx";
  const consumer_secret = "xxxxxxxxxxxxx";
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  return new Promise((response, reject) => {
    request(
      {
        url: url,
        headers: {
          Authorization: auth,
        },
      },
      function (error, res, body) {
        var jsonBody = JSON.parse(body);
        if (error) {
          reject(error);
        } else {
          const accessToken = jsonBody.access_token;
          response(accessToken);
        }
      }
    );
  });
}


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
