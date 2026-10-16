# Test cases and execution results

Application under test: https://the-internet.herokuapp.com (public practice site)

Executed: 2026-10-15 in Google Chrome (headless), fresh session per test. Raw results: [../evidence/results.json](../evidence/results.json). Screenshots: [../evidence/screenshots/](../evidence/screenshots/).

Test data (shown on the login page of the site): username `tomsmith`, password `SuperSecretPassword!`

| ID | Module | Scenario | Steps | Expected | Actual | Result | Bug |
|---|---|---|---|---|---|---|---|
| TC-L01 | Login | Login with valid credentials | Open /login; enter tomsmith / SuperSecretPassword!; click Login | Goes to /secure, success message | /secure: "You logged into a secure area!" | Pass |  |
| TC-L02 | Login | Valid username, wrong password | Enter tomsmith / wrong; click Login | Stays on /login, error message | /login: "Your password is invalid!" | Pass |  |
| TC-L03 | Login | Unknown username | Enter nouser / valid password; click Login | Stays on /login, error message | /login: "Your username is invalid!" | Pass |  |
| TC-L04 | Login | Both fields empty | Leave both fields empty; click Login | Clear message that username and password are required | /login: "Your username is invalid!" | Fail | BUG-03 |
| TC-L05 | Login | Password empty | Enter tomsmith, leave password empty; click Login | Clear message that password is required | /login: "Your password is invalid!" | Fail | BUG-03 |
| TC-L06 | Login | Username in capital letters | Enter TOMSMITH / valid password | Login rejected (username is case-sensitive) | /login: "Your username is invalid!" | Pass |  |
| TC-L07 | Login | Username with leading space | Enter ' tomsmith' / valid password | Login rejected | /login: "Your username is invalid!" | Pass |  |
| TC-L08 | Login | Password in lowercase | Enter tomsmith / supersecretpassword! | Login rejected | /login: "Your password is invalid!" | Pass |  |
| TC-L09 | Login | SQL-style text in username | Enter ' OR 1=1 -- / x | Login rejected, no error page | /login: "Your username is invalid!" | Pass |  |
| TC-L10 | Login | Password field is masked | Open /login; check the password field type | type = password | password field type = password | Pass |  |
| TC-L11 | Login | Open /secure without login | Open /secure directly in a new session | Redirected to /login with message | /login: "You must login to view the secure area!" | Pass |  |
| TC-L12 | Login | Logout | After login, click Logout | Back on /login with logout message | /login: "You logged out of the secure area!" | Pass |  |
| TC-L13 | Login | Open /secure after logout | After logout, open /secure | Redirected to /login | /login: "You must login to view the secure area!" | Pass |  |
| TC-L14 | Login | Submit with Enter key | Type valid credentials; press Enter | Logged in, on /secure | /secure | Pass |  |
| TC-F01 | Forgot Password | Valid email | Open /forgot_password; enter tester@example.com; click Retrieve password | Confirmation message | HTTP 200: "Your e-mail's been sent!" | Pass |  |
| TC-F02 | Forgot Password | Empty email | Leave email empty; click Retrieve password | Error asking for an email; no confirmation | HTTP 200: "Your e-mail's been sent!" | Fail | BUG-01 |
| TC-F03 | Forgot Password | Invalid email format | Enter not-an-email; click Retrieve password | Error about invalid email; no confirmation | HTTP 200: "Your e-mail's been sent!" | Fail | BUG-02 |
| TC-C01 | Checkboxes | Toggle both checkboxes | Open /checkboxes; click each checkbox once | Each checkbox changes state | before [false,true], after clicking both [true,false] | Pass |  |
| TC-D01 | Dropdown | Select Option 2 | Open /dropdown; choose Option 2 | Option 2 is selected | options: Please select an option (disabled) / Option 1 / Option 2; selected: Option 2 | Pass |  |
| TC-D02 | Dropdown | Placeholder not selectable | Check the first option 'Please select an option' | Disabled | first option: Please select an option (disabled) | Pass |  |
| TC-A01 | Add/Remove | Add 3 elements, delete 1 | Open /add_remove_elements/; click Add Element 3 times; click one Delete | 3 buttons, then 2 | after 3 adds: 3 Delete buttons, after 1 delete: 2 | Pass |  |
| TC-I01 | Inputs | Letters in number field | Open /inputs; type abc | Field stays empty | typed "abc" into number field, value = "" | Pass |  |

Total: 22 test cases, 18 passed, 4 failed.

Note: TC-L03 vs TC-L02 pass as written, but the different messages for unknown username and wrong password are a separate observation, see BUG-04.

Note on screenshots: some cases end on the exact same page state, so their screenshots are identical files. After a failed login the site reloads the login page with cleared fields, so every case that ends with "Your username is invalid!" (TC-L03, TC-L04, TC-L06, TC-L07, TC-L09) has the same final screen, and the same goes for cases ending with "Your password is invalid!" (TC-L02, TC-L05, TC-L08). TC-F01, TC-F02 and TC-F03 all end on the same "Your e-mail's been sent!" confirmation page (that identical behaviour for empty and invalid emails is exactly what BUG-01 and BUG-02 report). Each file is a real capture from its own run; identical results mean identical pages, not reused files.
