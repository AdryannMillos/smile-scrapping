const fs = require("fs");
const readline = require("readline");

(async () => {
  let data = [];
  const fileStream = fs.createReadStream("login.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    data.push(line);
  }
  data = data.map(
    (item) =>
      (item = { login: item.substring(0, 11), pass: item.substring(12, 16) })
  );
  fs.writeFile("converted.json", JSON.stringify(data), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
})();
