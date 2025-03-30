require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express()
const PORT = 3000
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(bodyParser.json())

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const events = req.body.events

  if (!events || events.length === 0) {
    return res.status(200).send("No events received")
  }

  // Loop through events
  for (let event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const userMessage = event.message.text
      const replyToken = event.replyToken

      console.log(userMessage)

      // Reply back to the user
      await sendReply(replyToken, `You said: ${userMessage}`)
    }
  }

  res.status(200).send("OK")
})

// Function to send reply message
const sendReply = async (replyToken, message) => {
  const url = "https://api.line.me/v2/bot/message/push"
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
  }

  //   const body = {
  //     replyToken: replyToken,
  //     messages: [{ type: "text", text: message }],
  //   }
  const body = {
    to: "C909231697f9a153e89bb6c3dbf49cc19",
    messages: [
      {
        type: "text",
        text: "oh จองคอร์ท สนามแบดมินตัน แบดมินตัน สนาม 1 เวลา 18:00:00 - 19:00:00 ไม่สำเร็จ",
      },
    ],
  }

  console.log(body)

  try {
    await axios.post(url, body, { headers })
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    )
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`LINE Webhook is running on port ${PORT}`)
})
