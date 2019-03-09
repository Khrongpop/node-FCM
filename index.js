const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require("./go-firebase-94857-firebase-adminsdk-k2iot-6e9d47c810.json")
const databaseURL = "https://go-firebase-94857.firebaseio.com"
const URL =
  "https://fcm.googleapis.com/v1/projects/go-firebase-94857/messages:send"
const deviceToken =
  "eHScHsD-hNU:APA91bHis1hmhOpoxGTSTd09Es_Y8XIMxKoTsytR7ounjtaEMxs1yLCD9jkAgid2vc3igLKjbmtS8HU8EpsWieAHyv0KJ8wU8BZ94PKwLqsMXVltGDkm1rdNO_wyA1dPBjWgfRHRduqK"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'ทดสอบส่ง Push Notification',
        body: 'ทดสอบด้วย Node js'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()