# Manual QA Practice: The Internet (login, forms, UI controls)

A practice test project on a public practice website: 22 test cases, execution results with screenshots (cases that end on the same page state share identical captures - see the note in docs/TEST_CASES.md), and 4 bug reports.

**Note:** This is a learning project. The site is [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public practice app made for testers. It is not client work.

## Result summary

| Item | Value |
|---|---|
| Test cases | 22 |
| Passed | 18 |
| Failed | 4 |
| Bugs reported | 4 (1 Major, 3 Minor) |
| Browser | Google Chrome, 2026-10-15 |

## Modules tested

- **Login / Logout** (14 cases): valid and invalid logins, empty fields, case sensitivity, SQL-style input, masked password, direct URL access, logout, Enter key
- **Forgot Password** (3 cases)
- **Checkboxes, Dropdown, Add/Remove Elements, Inputs** (5 cases)

## Bugs found

| ID | Summary | Severity |
|---|---|---|
| BUG-01 | Forgot Password says "e-mail sent" when email is empty | Major |
| BUG-02 | Forgot Password accepts an invalid email format | Minor |
| BUG-03 | Empty login fields show "invalid" instead of "required" | Minor |
| BUG-04 | Different login errors reveal whether a username exists | Minor |

## Folders

| Path | What is in it |
|---|---|
| `docs/TEST_CASES.md` | Test cases with steps, expected result, actual result |
| `docs/BUG_REPORTS.md` | Bug reports with steps and screenshots |
| `evidence/screenshots/` | Screenshots from the test run |
| `evidence/results.json` | Raw results of the run |
| `scripts/execute.js` | Script I used to run the same steps in Chrome and capture screenshots |

## Approach

I wrote the test cases from the page behaviour (positive, negative, boundary and security-style cases), ran them in a fresh browser session each time, and logged the actual result. A test is marked Fail only when the actual result differs from the expected result written for it.

The script is optional. To run it: install Node.js and Chrome, then in `scripts/` run `npm install` and `node execute.js`.

## Author

Nikhil Pratap Singh, manual QA fresher, New Delhi.
