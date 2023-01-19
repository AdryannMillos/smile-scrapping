const { executablePath } = require("puppeteer");
const { setTimeout } = require("timers/promises");
const puppeteer = require("puppeteer-extra");
const { default: RecaptchaPlugin, BuiltinSolutionProviders } = require("puppeteer-extra-plugin-recaptcha");
const CapMonsterProvider = require("puppeteer-extra-plugin-recaptcha-capmonster");

CapMonsterProvider.use(BuiltinSolutionProviders);

puppeteer.use(
	RecaptchaPlugin({
		provider: {
			id: "capmonster",
			token: "f7dc3be65398fac7898c5e221a086c57" // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
		},
		visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
	})
);

async function checkLogin(login, pass) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
    defaultViewport: null,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  );
  await page.setViewport({ width: 1440, height: 1024 });


  const initialURl =
    "https://login.smiles.com.br/login?state=hKFo2SBlTUhYa0hxRS0yS2JsTGlxQ2tOemtXSjRFMUxYTzdaSKFupWxvZ2luo3RpZNkgNFlaQ3NvSGZzaW9GNzhrR1FTZmRTWFZaeGRKVnF6WGejY2lk2SB5eU42S2h5T2IyUEdHUDhkcGhVZ0U1ODRXY2lHcFRySA&client=yyN6KhyOb2PGGP8dphUgE584WciGpTrH&protocol=oauth2&prompt=login&redirect_uri=https%3A%2F%2Fwww.smiles.com.br%2Flogincb%3Fdest%3D&audience=https%3A%2F%2Fsmiles.api&scope=openid%20profile%20email&response_type=code";

  await page.goto(initialURl, { waitUntil: "networkidle2", timeout: 0 });
  await page.waitForSelector("#identifier");

  await page.type("#identifier", login);
  await setTimeout(2000);

  await page.click(".main-content button");
  await setTimeout(1000);
  await page.type("#password", pass);

  await setTimeout(2000);
    const elementHandle = await page.$("iframe");
    const iframe = await elementHandle.contentFrame();
    await iframe.click("div.recaptcha-checkbox-border");
    await page.solveRecaptchas();

  await setTimeout(1000);
  const actualPage = page.url();
  await page.click("button.animation ");
  
  await setTimeout(4000);
  await browser.close();

    if(actualPage === page.url()) return false
    return true

}
module.exports = {
  checkLogin,
};
