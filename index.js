const express = require("express")
const { CronJob } = require("cron")
const axios = require("axios")
const app = express()
const port = process.env.PORT || 3000

require("dotenv").config()

const oh = {
  id: "supawee.borri@gmail.com",
  password: "06051999",
}

const kam = {
  id: "kampree27@gmail.com",
  password: "CS@kam123",
}

const callihniel = {
  // id: "callihniel@gmail.com",
  // password: "tcctbad2025",
  id: "tul.boonkuea@gmail.com",
  password: "boonkuea1234",
}

const porntip = {
  // id: "Porntip.r@tcc-technology.com",
  // password: "Im14022022",
  id: "nattpontos@gmail.com",
  password: "ice123456789",
}

const date = "2025-03-28"

const auth = async () => {
  console.log("Start booking court")
  const authData = {
    username: oh.id,
    password: oh.password,
  }

  axios({
    method: "get",
    url: "https://cstd.bangkok.go.th/app-service/api/auth",
    headers: {
      "Content-Type": "application/json",
    },
    auth: authData,
  })
    .then((response) => {
      getUserDetail(
        response.data.account_info.ID,
        response.data.token,
        "18:00:00"
      )
    })
    .catch((error) => {
      console.error(
        "Authentication Failed:",
        error.response ? error.response.data : error.message
      )
    })

  const authData2 = {
    username: kam.id,
    password: kam.password,
  }

  axios({
    method: "get",
    url: "https://cstd.bangkok.go.th/app-service/api/auth",
    headers: {
      "Content-Type": "application/json",
    },
    auth: authData2,
  })
    .then((response) => {
      getUserDetail(
        response.data.account_info.ID,
        response.data.token,
        "19:00:00"
      )
    })
    .catch((error) => {
      console.error(
        "Authentication Failed:",
        error.response ? error.response.data : error.message
      )
    })

  const authData3 = {
    username: callihniel.id,
    password: callihniel.password,
  }

  axios({
    method: "get",
    url: "https://cstd.bangkok.go.th/app-service/api/auth",
    headers: {
      "Content-Type": "application/json",
    },
    auth: authData3,
  })
    .then((response) => {
      getUserDetail2(
        response.data.account_info.ID,
        response.data.token,
        "19:00:00"
      )
    })
    .catch((error) => {
      console.error(
        "Authentication Failed:",
        error.response ? error.response.data : error.message
      )
    })

  const authData4 = {
    username: porntip.id,
    password: porntip.password,
  }

  axios({
    method: "get",
    url: "https://cstd.bangkok.go.th/app-service/api/auth",
    headers: {
      "Content-Type": "application/json",
    },
    auth: authData4,
  })
    .then((response) => {
      getUserDetail2(
        response.data.account_info.ID,
        response.data.token,
        "18:00:00"
      )
    })
    .catch((error) => {
      console.error(
        "Authentication Failed:",
        error.response ? error.response.data : error.message
      )
    })
}

const getUserDetail = async (id, token, time) => {
  try {
    const user = await axios.get(
      `${process.env.BASE_URL}/app-service/api/account/${id}/card?lang=th`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    // Book court 1
    // e525f2f2-a7a5-4a84-a28a-6b334015726d
    // Book court 2
    const courts = await axios.get(
      `${process.env.BASE_URL}/reservation/api/reservation/item/03bb7651-8c0c-4b82-a6f7-0f606d0d4731/slot?BOOKING_DATE=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const court = courts.data.find((e) => e.START_TIME === time)
    const job = CronJob.from({
      cronTime: "1-5 0 6 * * *",
      onTick: function () {
        booking(court.ID, user.data[0].card_id, token)
      },
      start: true,
      timeZone: "Asia/Bangkok",
    })
  } catch (error) {
    console.error(error)
  }
}

const getUserDetail2 = async (id, token, time) => {
  try {
    const user = await axios.get(
      `${process.env.BASE_URL}/app-service/api/account/${id}/card?lang=th`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const courts = await axios.get(
      `${process.env.BASE_URL}/reservation/api/reservation/item/e525f2f2-a7a5-4a84-a28a-6b334015726d/slot?BOOKING_DATE=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const court = courts.data.find((e) => e.START_TIME === time)
    const job = CronJob.from({
      cronTime: "1-5 0 6 * * *",
      onTick: function () {
        booking2(court.ID, user.data[0].card_id, token)
      },
      start: true,
      timeZone: "Asia/Bangkok",
    })
  } catch (error) {
    console.error(error)
  }
}

const booking = async (slotId, booker, token) => {
  try {
    // console.log({
    //   BOOKING_DATE: date,
    //   SLOT_ID: slotId,
    //   BOOKING_TITLE: "สนามแบดมินตัน แบดมินตัน สนาม 2",
    //   BOOKER_ID: booker,
    // })
    const response = await axios.post(
      `${process.env.BASE_URL}/reservation/api/reservation/booking?lang=th`,
      {
        BOOKING_DATE: date,
        SLOT_ID: slotId,
        BOOKING_TITLE: "สนามแบดมินตัน แบดมินตัน สนาม 2",
        BOOKER_ID: booker,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log("Booked !!! ", response.data)
  } catch (error) {
    console.error(error.response.data)
  }
}

const booking2 = async (slotId, booker, token) => {
  try {
    // console.log({
    //   BOOKING_DATE: date,
    //   SLOT_ID: slotId,
    //   BOOKING_TITLE: "สนามแบดมินตัน แบดมินตัน สนาม 1",
    //   BOOKER_ID: booker,
    // })
    const response = await axios.post(
      `${process.env.BASE_URL}/reservation/api/reservation/booking?lang=th`,
      {
        BOOKING_DATE: date,
        SLOT_ID: slotId,
        BOOKING_TITLE: "สนามแบดมินตัน แบดมินตัน สนาม 1",
        BOOKER_ID: booker,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log("Booked !!! ", response.data)
  } catch (error) {
    console.error(error.response.data)
  }
}

// app.get("/book", (req, res) => {
//   auth();
//   res.send("Hello! Node.js");
// });

// app.listen(port, () => {
//   console.log("Starting node.js at port " + port);
// });
auth()
