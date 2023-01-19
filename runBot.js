const converted = require("./converted");
const bot = require("./bot");
const fs = require("fs");

(async () => {
  const data = [];
  for (let i = 0; i < converted.length; i++) {
    const value = await bot.checkLogin(converted[i].login, converted[i].pass)
    data.push({login:converted[i].login, pass:converted[i].pass, aproved: value});
    console.log( i+1, 'checked', value)
  }
  const aproved = data.filter(item => item.aproved == true)
  const disapproved = data.filter(item => item.aproved == false)

  fs.writeFileSync("aprovados.json", JSON.stringify(aproved), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  fs.writeFileSync("desaprovados.json", JSON.stringify(disapproved), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  console.log('finished');
})();
