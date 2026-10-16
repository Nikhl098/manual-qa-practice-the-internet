# Bug reports

Application: https://the-internet.herokuapp.com (public practice site, no real users or data). Found on 2026-10-15 in Google Chrome. These are practice reports, not reported to the site owner.

---

## BUG-01: Forgot Password says "e-mail sent" when the email field is empty

| Field | Value |
|---|---|
| Related test | TC-F02 |
| Severity | Major |
| Priority | Medium |
| Status | Open |

**Steps**
1. Open `/forgot_password`
2. Leave the Email field empty
3. Click "Retrieve password"

**Expected:** An error asking for an email address. No confirmation message.

**Actual:** Page shows "Your e-mail's been sent!" (HTTP 200).

**Evidence:** [TC-F02.png](../evidence/screenshots/TC-F02.png)

---

## BUG-02: Forgot Password accepts an invalid email format

| Field | Value |
|---|---|
| Related test | TC-F03 |
| Severity | Minor |
| Priority | Low |
| Status | Open |

**Steps**
1. Open `/forgot_password`
2. Enter `not-an-email` in the Email field
3. Click "Retrieve password"

**Expected:** Error about invalid email format.

**Actual:** Page shows "Your e-mail's been sent!".

**Evidence:** [TC-F03.png](../evidence/screenshots/TC-F03.png)

---

## BUG-03: Empty login fields show a misleading error message

| Field | Value |
|---|---|
| Related tests | TC-L04, TC-L05 |
| Severity | Minor |
| Priority | Low |
| Status | Open |

**Steps**
1. Open `/login`
2. Leave Username and Password empty (TC-L04), or enter `tomsmith` and leave Password empty (TC-L05)
3. Click "Login"

**Expected:** A message that the empty field is required.

**Actual:**
- TC-L04: "Your username is invalid!"
- TC-L05: "Your password is invalid!"

An empty field is reported as invalid, not as missing. This does not tell the user what to fix.

**Evidence:** [TC-L04.png](../evidence/screenshots/TC-L04.png), [TC-L05.png](../evidence/screenshots/TC-L05.png)

---

## BUG-04: Login error tells an attacker whether a username exists

| Field | Value |
|---|---|
| Related tests | TC-L02, TC-L03 |
| Severity | Minor (security observation) |
| Priority | Low |
| Status | Open |

**Steps**
1. Open `/login`, enter `nouser` and any password. Message: "Your username is invalid!"
2. Open `/login`, enter `tomsmith` and a wrong password. Message: "Your password is invalid!"

**Expected:** The same generic message for both, for example "Username or password is incorrect".

**Actual:** The two messages are different, so anyone can find out which usernames are real (username enumeration).

**Evidence:** [TC-L02.png](../evidence/screenshots/TC-L02.png), [TC-L03.png](../evidence/screenshots/TC-L03.png)
