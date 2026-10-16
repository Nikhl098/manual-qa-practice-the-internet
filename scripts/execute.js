// Runs the manual test cases in a real Chrome browser (headless) against
// https://the-internet.herokuapp.com and records actual results + screenshots.
// Needs: npm install puppeteer-core, Google Chrome installed.  Usage: node execute.js
const p = require('puppeteer-core'); const fs = require('fs');
const BASE = 'https://the-internet.herokuapp.com';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const OUT = '../evidence/screenshots/';
(async () => {
  const b = await p.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 900, height: 600 } });
  const results = [];
  const flash = pg => pg.$eval('#flash', e => e.innerText.replace('×', '').trim()).catch(() => '(no message)');
  const fresh = async () => (await b.createBrowserContext()).newPage();
  const doLogin = async (pg, u, pw, shot) => {
    await pg.goto(BASE + '/login');
    if (u) await pg.type('#username', u); if (pw) await pg.type('#password', pw);
    await Promise.all([pg.waitForNavigation(), pg.click('button[type=submit]')]);
    if (shot) await pg.screenshot({ path: OUT + shot });
    return { url: pg.url().replace(BASE, ''), msg: await flash(pg) };
  };
  const rec = (id, actual, ok, shot) => results.push({ id, actual, result: ok ? 'Pass' : 'Fail', shot: shot || '' });
  let pg;
  pg = await fresh(); let r = await doLogin(pg, 'tomsmith', 'SuperSecretPassword!', 'TC-L01.png');
  rec('TC-L01', `${r.url}: "${r.msg}"`, r.url === '/secure' && /logged into a secure area/.test(r.msg), 'TC-L01.png');
  // logout from the session just created
  await Promise.all([pg.waitForNavigation(), pg.click('a.button')]); const m = await flash(pg);
  rec('TC-L12', `${pg.url().replace(BASE, '')}: "${m}"`, pg.url().endsWith('/login') && /logged out/.test(m));
  await pg.goto(BASE + '/secure'); rec('TC-L13', `${pg.url().replace(BASE, '')}: "${await flash(pg)}"`, pg.url().endsWith('/login'));
  const L = [['TC-L02', 'tomsmith', 'wrong'], ['TC-L03', 'nouser', 'SuperSecretPassword!'], ['TC-L04', '', ''], ['TC-L05', 'tomsmith', ''],
    ['TC-L06', 'TOMSMITH', 'SuperSecretPassword!'], ['TC-L07', ' tomsmith', 'SuperSecretPassword!'], ['TC-L08', 'tomsmith', 'supersecretpassword!'], ['TC-L09', "' OR 1=1 --", 'x']];
  for (const [id, u, pw] of L) {
    pg = await fresh(); r = await doLogin(pg, u, pw, id + '.png');
    const stayed = r.url === '/login';
    let ok = stayed && /invalid|required|enter/i.test(r.msg);
    if (id === 'TC-L04') ok = stayed && /required|enter|empty|provide/i.test(r.msg);          // expected a clear "required" message
    if (id === 'TC-L05') ok = stayed && /password/i.test(r.msg) && /required|enter|empty|provide/i.test(r.msg);
    rec(id, `${r.url}: "${r.msg}"`, ok, id + '.png');
  }
  pg = await fresh(); await pg.goto(BASE + '/login'); rec('TC-L10', `password field type = ${await pg.$eval('#password', e => e.type)}`, (await pg.$eval('#password', e => e.type)) === 'password');
  pg = await fresh(); await pg.goto(BASE + '/login'); await pg.type('#username', 'tomsmith'); await pg.type('#password', 'SuperSecretPassword!');
  await Promise.all([pg.waitForNavigation(), pg.keyboard.press('Enter')]); rec('TC-L14', pg.url().replace(BASE, ''), pg.url().endsWith('/secure'));
  pg = await fresh(); await pg.goto(BASE + '/secure'); rec('TC-L11', `${pg.url().replace(BASE, '')}: "${await flash(pg)}"`, pg.url().endsWith('/login') && /must login/.test(await flash(pg)));
  const forgot = async (id, email, expectError) => {
    const pg = await fresh(); await pg.goto(BASE + '/forgot_password'); if (email) await pg.type('#email', email);
    const [resp] = await Promise.all([pg.waitForNavigation(), pg.click('#form_submit')]);
    const body = await pg.evaluate(() => document.body.innerText.split('\n')[0].trim()); await pg.screenshot({ path: OUT + id + '.png' });
    const sent = /e-mail's been sent/i.test(body);
    rec(id, `HTTP ${resp.status()}: "${body}"`, expectError ? !sent : sent, id + '.png');
  };
  await forgot('TC-F01', 'tester@example.com', false); await forgot('TC-F02', '', true); await forgot('TC-F03', 'not-an-email', true);
  pg = await fresh(); await pg.goto(BASE + '/checkboxes'); const cb = await pg.$$('input[type=checkbox]'); const s0 = await pg.$$eval('input[type=checkbox]', a => a.map(x => x.checked));
  await cb[0].click(); await cb[1].click(); const s1 = await pg.$$eval('input[type=checkbox]', a => a.map(x => x.checked));
  rec('TC-C01', `before ${JSON.stringify(s0)}, after clicking both ${JSON.stringify(s1)}`, s1[0] === !s0[0] && s1[1] === !s0[1]);
  pg = await fresh(); await pg.goto(BASE + '/dropdown'); const opts = await pg.$$eval('#dropdown option', a => a.map(x => x.text + (x.disabled ? ' (disabled)' : '')));
  await pg.select('#dropdown', '2'); const v = await pg.$eval('#dropdown', e => e.options[e.selectedIndex].text);
  rec('TC-D01', `options: ${opts.join(' | ')}; selected: ${v}`, v === 'Option 2'); rec('TC-D02', `first option: ${opts[0]}`, /disabled/.test(opts[0]));
  pg = await fresh(); await pg.goto(BASE + '/add_remove_elements/'); for (let i = 0; i < 3; i++) await pg.click('button[onclick="addElement()"]');
  const n1 = (await pg.$$('.added-manually')).length; await pg.click('.added-manually'); const n2 = (await pg.$$('.added-manually')).length;
  rec('TC-A01', `after 3 adds: ${n1} Delete buttons, after 1 delete: ${n2}`, n1 === 3 && n2 === 2);
  pg = await fresh(); await pg.goto(BASE + '/inputs'); await pg.type('input', 'abc'); const t = await pg.$eval('input', e => e.value);
  rec('TC-I01', `typed "abc" into number field, value = "${t}"`, t === '');
  await b.close();
  fs.writeFileSync('../evidence/results.json', JSON.stringify({ run_on: new Date().toISOString(), site: BASE, results }, null, 1));
  console.log(results.map(x => `${x.id} ${x.result} | ${x.actual}`).join('\n'));
})();
