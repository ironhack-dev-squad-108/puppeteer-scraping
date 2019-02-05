const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.drivy.com/search?address_source=google&only_responsive=true&country_scope=DE&latitude=52.506378&longitude=13.3732383&page=1&address=Eichhornstra%C3%9Fe+3%2C+10785+Berlin%2C+Allemagne&city_display_name=Berlin');
  // await page.screenshot({ path: `images/drivy${Math.floor(Math.random()*100)}.png`});
  
  await page.waitForSelector('.picks_car_card')

  const cars = []

  const $cards = await page.$$('.picks_car_card')

  for (let i = 0; i < $cards.length; i++) {
    // Click to open the current card
    const dataCardId = await page.evaluate(async ($card) => $card.getAttribute('data-car-id'), $cards[i])
    await page.click(`.picks_car_card[data-car-id="${dataCardId}"]`)
    await page.waitFor(1000)

    
    cars.push(await page.evaluate(() => ({
      name: document.querySelector('.js_car_name').innerText,
      address: document.querySelector('.location_section_address__content>.cobalt-text-titleTiny').innerText,
    })))
    
    // Click to close the current card
    await page.waitForSelector('.side_panel_close_button.js_preview_panel_close.hidden-xs')
    await page.click(`.side_panel_close_button.js_preview_panel_close.hidden-xs`)
    await page.waitFor(1000)
  }
  
  console.log('TCL: cars', cars)
  await page.waitFor(5000)

  await browser.close();
})();