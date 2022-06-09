var axios = require("axios");

module.exports = {
  telegram: {
    sendMessageToChannel: async function (text) {
      var data = JSON.stringify({
        text: text,
        chat_id: "@factorymachine_error",
      });

      var config = {
        method: "post",
        url: "https://api.telegram.org/bot5358849811:AAEleLRx6CiC7ZLxoxpi1M58zRj5r2Ps8CE/sendMessage",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          return response.data;
          //console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};


// const { telegram } = require("./telegram_service")
// telegram.sendMessageToChannel(`Can't get certificate file, status code: ` + certificateInfo.status)
