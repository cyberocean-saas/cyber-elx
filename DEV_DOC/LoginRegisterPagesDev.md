# CyberOcean Custom Login & Register Pages

## Summary

- [CyberOcean Custom Login \& Register Pages](#cyberocean-custom-login--register-pages)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Login Page](#login-page)
    - [Component Structure](#component-structure)
    - [Project Colors (Required)](#project-colors-required)
    - [Available Props](#available-props)
    - [Login Flow Steps](#login-flow-steps)
    - [Events to Emit](#events-to-emit)
    - [Example Login Page:](#example-login-page)
  - [Register Page](#register-page)
    - [Component Structure](#component-structure-1)
    - [Project Colors (Required)](#project-colors-required-1)
    - [Available Props](#available-props-1)
    - [inputsData Object](#inputsdata-object)
    - [Register Flow States](#register-flow-states)
    - [Events to Emit](#events-to-emit-1)
    - [Example Register Page:](#example-register-page)
  - [Vue Component Format](#vue-component-format)
    - [Basic Structure](#basic-structure)
    - [Available Fields](#available-fields)
    - [Key Rules](#key-rules)
    - [Minimal Example](#minimal-example)

## Overview

The Login and Register pages are Vue.js components that handle user authentication. These pages are written as Vue.js component modules with a specific structure.
IMPORTANT: You will only handle UI and styles, all logic and functionality is handled by the parent component.

**Key Notes for Development:**
- Component-based architecture with props and events
- Multi-step form flows managed via the `step` prop
- Built-in translation support via `$t()` function
- Events are emitted to parent for state management

## Login Page

The login page handles multiple authentication flows:
1. **Standard Login** - Email → Password → Login
2. **Password Recovery** - Email → Send Code → Verify Code → New Password

### Component Structure

The login component must export a module with:
- `name` - Component name (should be `"LoginPage"`)
- `props` - Required props object
- `template` - HTML template string
- `style` - CSS styles string (optional but recommended)

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `step` | String | Current step in the login flow (`loading`, `email`, `password`, `sendCode`, `verifyCode`, `newPassword`) |
| `email` | String | User's email address |
| `password` | String | User's password |
| `verificationCode` | String | Code sent to user's email for password recovery |
| `checkbox_remember_me` | Boolean | Remember me checkbox state |
| `snackbar` | Boolean | Whether to show error message |
| `errorMessages` | String | Error message to display |
| `color` | String | Theme color |
| `showPassword` | Boolean | Toggle password visibility |
| `processing` | Boolean | Whether a request is in progress |
| `hidePassword` | Boolean | Toggle password visibility (inverse) |
| `newPassword` | String | New password for recovery flow |
| `repeatNewPassword` | String | Confirm new password |
| `showNewPassword` | Boolean | Toggle new password visibility |
| `showRepeatNewPassword` | Boolean | Toggle confirm password visibility |
| `logo` | String | Path to the logo image |
| `store` | Object | Vuex store instance |
| `getters` | Object | Vuex getters |

### Login Flow Steps

1. **`loading`** - Initial loading state, show a spinner
2. **`email`** - User enters their email address
3. **`password`** - User enters their password (email field disabled)
4. **`sendCode`** - Password recovery: inform user a code will be sent
5. **`verifyCode`** - User enters the verification code
6. **`newPassword`** - User creates a new password

### Events to Emit

| Event | When to Emit | Description |
|-------|--------------|-------------|
| `update` | On input change | Update a prop value: `$emit('update', { key: 'propName', value: newValue })` |
| `checkForStepTwo` | Email step submit | Validate email and proceed to password step |
| `login` | Password step submit | Attempt login with credentials |
| `goToSendCodeStep` | Forgot password click | Switch to password recovery flow |
| `sendVerificationCode` | Send code step submit | Send verification code to email |
| `verifyCode` | Verify code step submit | Verify the entered code |
| `createNewPassword` | New password step submit | Set the new password |

### Example Login Page:
```js
module.exports = {
  name: "LoginPage",
  props: [
    'step',
    'email',
    'password',
    'verificationCode',
    'checkbox_remember_me',
    'snackbar',
    'errorMessages',
    'color',
    'showPassword',
    'processing',
    'hidePassword',
    'newPassword',
    'repeatNewPassword',
    'showNewPassword',
    'showRepeatNewPassword',
    'logo',
    'store',
    'getters',
  ],
  template: /* html */`
    <div class="lp">
      <img v-if="logo" class="lp__logo" :src="logo" alt="Logo" />

      <div class="lp__card">
        <div class="lp__top">
          <div class="lp__title">{{ $t('public-pages.login.title') }}</div>
          <router-link class="lp__link" to="@PVP/register">{{ $t('public-pages.login.register-link') }}</router-link>
        </div>

        <div v-if="step === 'loading'" class="lp__center" aria-live="polite">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ $t('public-pages.login.loading') }}</span>
          </div>
        </div>

        <div v-else>
          <div class="lp__subtitle">{{ $t('public-pages.login.welcome') }}</div>

          <div v-if="snackbar" class="lp__alert" role="alert">{{ errorMessages }}</div>

          <form class="lp__form" @submit.prevent>
            <div v-if="step === 'email' || step === 'password'" class="lp__field">
              <label class="lp__label">{{ $t('public-pages.login.your-email') }}</label>
              <input
                class="lp__input"
                type="email"
                autocomplete="email"
                inputmode="email"
                :value="email"
                :disabled="step === 'password'"
                :placeholder="$t('public-pages.login.enter-email')"
                @input="$emit('update', { key: 'email', value: $event.target.value })"
                @keydown.enter="$emit('checkForStepTwo')"
              />
            </div>

            <div v-if="step === 'password'" class="lp__field">
              <div class="lp__row">
                <label class="lp__label">{{ $t('public-pages.login.your-password') }}</label>
                <a class="lp__link" href="#" @click.prevent="$emit('goToSendCodeStep')">{{ $t('public-pages.login.forgot-password') }}</a>
              </div>
              <div class="lp__pass">
                <input
                  class="lp__input"
                  :type="hidePassword ? 'password' : 'text'"
                  autocomplete="current-password"
                  :value="password"
                  :placeholder="$t('public-pages.login.enter-password')"
                  @input="$emit('update', { key: 'password', value: $event.target.value })"
                  @keydown.enter="$emit('login')"
                />
                <button type="button" class="lp__icon" @click="$emit('update', { key: 'hidePassword', value: !hidePassword })">
                  <v-icon>{{ hidePassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </button>
              </div>
            </div>

            <div v-if="step === 'sendCode'" class="lp__hint">
              {{ $t('public-pages.login.verification-message') }} "<b>{{ email }}</b>".
            </div>

            <div v-if="step === 'verifyCode'" class="lp__field">
              <label class="lp__label">{{ $t('public-pages.login.verification-code') }}</label>
              <input
                class="lp__input"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                :value="verificationCode"
                :placeholder="$t('public-pages.login.enter-code')"
                @input="$emit('update', { key: 'verificationCode', value: $event.target.value })"
                @keydown.enter="$emit('verifyCode')"
              />
            </div>

            <template v-if="step === 'newPassword'">
              <div class="lp__field">
                <label class="lp__label">{{ $t('public-pages.login.new-password') }}</label>
                <div class="lp__pass">
                  <input
                    class="lp__input"
                    :type="showNewPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    :value="newPassword"
                    :placeholder="$t('public-pages.login.new-password')"
                    @input="$emit('update', { key: 'newPassword', value: $event.target.value })"
                  />
                  <button type="button" class="lp__icon" @click="$emit('update', { key: 'showNewPassword', value: !showNewPassword })">
                    <v-icon>{{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </button>
                </div>
              </div>

              <div class="lp__field">
                <label class="lp__label">{{ $t('public-pages.login.confirm-password') }}</label>
                <div class="lp__pass">
                  <input
                    class="lp__input"
                    :type="showRepeatNewPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    :value="repeatNewPassword"
                    :placeholder="$t('public-pages.login.confirm-password')"
                    @input="$emit('update', { key: 'repeatNewPassword', value: $event.target.value })"
                  />
                  <button type="button" class="lp__icon" @click="$emit('update', { key: 'showRepeatNewPassword', value: !showRepeatNewPassword })">
                    <v-icon>{{ showRepeatNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </button>
                </div>
              </div>
            </template>

            <button v-if="step === 'email'" type="button" class="lp__btn" @click="$emit('checkForStepTwo')">{{ $t('public-pages.login.next') }}</button>
            <button v-if="step === 'password'" type="button" class="lp__btn" @click="$emit('login')">{{ $t('public-pages.login.login-button') }}</button>
            <button v-if="step === 'sendCode'" type="button" class="lp__btn" @click="$emit('sendVerificationCode')">{{ $t('public-pages.login.send-code') }}</button>
            <button v-if="step === 'verifyCode'" type="button" class="lp__btn" @click="$emit('verifyCode')">{{ $t('public-pages.login.verify-code') }}</button>
            <button v-if="step === 'newPassword'" type="button" class="lp__btn" @click="$emit('createNewPassword')">{{ $t('public-pages.login.create-new-password') }}</button>
          </form>
        </div>
      </div>
    </div>
  `,
  style: /* css */`
    :root {
      --clr-theme-primary: #1268eb;
      --clr-body-heading: #1e1e1e;
      --lp-border: rgba(0, 0, 0, 0.15);
    }
    .lp { max-width: 520px; margin: 40px auto; padding: 0 16px; }
    .lp__logo { display: block; height: 52px; margin: 0 auto 16px; }
    .lp__card { border: 1px solid var(--lp-border); border-radius: 12px; padding: 16px; background: #fff; }
    .lp__top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .lp__title { font-weight: 700; color: var(--clr-body-heading); }
    .lp__subtitle { margin: 10px 0 0; color: rgba(0,0,0,.65); }
    .lp__link { color: var(--clr-theme-primary); text-decoration: none; font-weight: 600; font-size: 14px; }
    .lp__link:hover { text-decoration: underline; }
    .lp__alert { margin-top: 12px; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(220,53,69,.25); background: #fef2f2; color: #b91c1c; }
    .lp__form { margin-top: 12px; display: grid; gap: 12px; }
    .lp__field { display: grid; gap: 6px; }
    .lp__row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
    .lp__label { font-size: 13px; font-weight: 600; color: rgba(0,0,0,.8); }
    .lp__input { width: 100%; height: 40px; padding: 0 10px; border: 1px solid var(--lp-border); border-radius: 8px; box-sizing: border-box; }
    .lp__input:focus { outline: none; border-color: var(--clr-theme-primary); box-shadow: 0 0 0 3px rgba(18,104,235,.15); }
    .lp__pass { position: relative; }
    .lp__pass .lp__input { padding-right: 44px; }
    .lp__icon { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border: 1px solid var(--lp-border); background: #fff; border-radius: 8px; cursor: pointer; }
    .lp__hint { padding: 10px 12px; border: 1px solid rgba(0,0,0,.08); border-radius: 8px; background: #f8fafc; color: rgba(0,0,0,.75); }
    .lp__btn { height: 40px; border: none; border-radius: 8px; background: var(--clr-theme-primary); color: #fff; font-weight: 700; cursor: pointer; }
    .lp__btn:hover { background: #0d5bcd; }
    .spinner-border { width: 2.25rem; height: 2.25rem; }
    .text-primary { color: var(--clr-theme-primary) !important; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  `
};
```

## Register Page

The register page handles user registration with optional email verification. It supports:
1. **Standard Registration** - User fills form → Submit → Done
2. **Registration with Email Verification** - User fills form → Verify Email → Done

### Component Structure

The register component must export a module with:
- `name` - Component name (should be `"RegisterPage"`)
- `props` - Required props object
- `template` - HTML template string
- `style` - CSS styles string (optional but recommended)

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `USE_VERIFICATION` | Boolean | Whether email verification is enabled |
| `loading` | Boolean | Whether a request is in progress |
| `finished` | Boolean | Whether registration completed successfully |
| `activationCodeError` | Boolean | Whether the activation code is invalid |
| `willCallYourdialog` | Boolean | Dialog state flag |
| `pageState` | String | Current page state (`register`, `verification`) |
| `inputsData` | Object | Form data object (see below) |
| `itemsTunisiaGrades` | Array | List of grade options `[{ value, text }]` |
| `phoneNumberRequire` | Boolean | Whether phone number is required |
| `showPassword` | Boolean | Toggle password visibility |
| `showRepeatPassword` | Boolean | Toggle repeat password visibility |
| `gradesListSettings` | Object | Grade list configuration |
| `logo` | String | Path to the logo image |
| `gradeOption` | Boolean | Whether to show grade selection |
| `isThirdOrFourthGrade` | Boolean | Special grade flag |

### inputsData Object

The `inputsData` prop contains all form field values:

| Field | Type | Description |
|-------|------|-------------|
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `phoneNumber` | String | User's phone number |
| `grade` | String | Selected grade value |
| `email` | String | User's email address |
| `password` | String | User's password |
| `repeatPassword` | String | Password confirmation |
| `agree` | Boolean | Terms agreement checkbox |
| `activationCode` | String | Email verification code |

### Register Flow States

1. **`register`** - Main registration form with all fields
2. **`verification`** - Email verification step (if `USE_VERIFICATION` is true)

### Events to Emit

| Event | When to Emit | Description |
|-------|--------------|-------------|
| `update` | On state change | Update a prop value: `$emit('update', { key: 'propName', value: newValue })` |
| `update-inputs-data` | On form input | Update form field: `$emit('update-inputs-data', { key: 'fieldName', value: newValue })` |
| `fixEmail` | On email input | Sanitize email input |
| `goToEmailActivation` | Form submit (with verification) | Proceed to email verification step |
| `submitForm` | Form submit (no verification) | Submit registration directly |
| `verifyActivationCode` | Verification submit | Verify the activation code and complete registration |

### Example Register Page:
```js
module.exports = {
  name: "RegisterPage",
  props: [
    'USE_VERIFICATION',
    'loading',
    'finished',
    'activationCodeError',
    'willCallYourdialog',
    'pageState',
    'inputsData',
    'itemsTunisiaGrades',
    'phoneNumberRequire',
    'showPassword',
    'showRepeatPassword',
    'gradesListSettings',
    'logo',
    'gradeOption',
    'isThirdOrFourthGrade',
  ],
  template: /* html */`
    <div class="rp">
      <img v-if="logo" class="rp__logo" :src="logo" alt="Logo" />

      <div class="rp__card">
        <div class="rp__top">
          <div class="rp__title">{{ $t('public-pages.register.title') }}</div>
          <router-link class="rp__link" to="@PVP/login">{{ $t('public-pages.register.login-link') }}</router-link>
        </div>

        <div v-if="loading" class="rp__center" aria-live="polite">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading</span>
          </div>
        </div>

        <div v-else-if="finished" class="rp__center">
          <v-icon color="success" size="72">mdi-check-circle</v-icon>
          <div class="rp__success">{{ $t('public-pages.register.success') }}</div>
          <div class="rp__muted">{{ $t('public-pages.register.success-message') }}</div>
        </div>

        <div v-else>
          <form
            v-if="pageState === 'register'"
            class="rp__form"
            @submit.prevent="USE_VERIFICATION ? $emit('goToEmailActivation') : $emit('submitForm')"
          >
            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.first-name') }}</label>
              <input
                class="rp__input"
                type="text"
                required
                :placeholder="$t('public-pages.register.first-name')"
                :value="inputsData.firstName"
                @input="$emit('update-inputs-data', { key: 'firstName', value: $event.target.value })"
              />
            </div>

            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.last-name') }}</label>
              <input
                class="rp__input"
                type="text"
                required
                :placeholder="$t('public-pages.register.last-name')"
                :value="inputsData.lastName"
                @input="$emit('update-inputs-data', { key: 'lastName', value: $event.target.value })"
              />
            </div>

            <div class="rp__field">
              <label class="rp__label">
                {{ phoneNumberRequire ? $t('public-pages.register.phone-number') : $t('public-pages.register.phone-number-optional') }}
              </label>
              <input
                class="rp__input"
                type="number"
                :required="phoneNumberRequire"
                :placeholder="$t('public-pages.register.phone-placeholder')"
                :value="inputsData.phoneNumber"
                @input="$emit('update-inputs-data', { key: 'phoneNumber', value: $event.target.value })"
              />
            </div>

            <div v-if="gradeOption" class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.grade') }}</label>
              <select
                class="rp__select"
                required
                :value="inputsData.grade"
                @input="$emit('update-inputs-data', { key: 'grade', value: $event.target.value })"
              >
                <option value="" disabled>{{ $t('public-pages.register.choose-grade') }}</option>
                <option v-for="g in itemsTunisiaGrades" :key="g.value" :value="g.value">{{ g.text }}</option>
              </select>
            </div>

            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.email') }}</label>
              <input
                class="rp__input"
                type="email"
                required
                :placeholder="$t('public-pages.register.email')"
                :value="inputsData.email"
                @input="$emit('update-inputs-data', { key: 'email', value: $event.target.value });$emit('fixEmail', $event);"
              />
            </div>

            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.password') }}</label>
              <div class="rp__pass">
                <input
                  class="rp__input"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :placeholder="$t('public-pages.register.password')"
                  :value="inputsData.password"
                  @input="$emit('update-inputs-data', { key: 'password', value: $event.target.value })"
                />
                <button type="button" class="rp__icon" @click="$emit('update', { key: 'showPassword', value: !showPassword })">
                  <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </button>
              </div>
            </div>

            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.repeat-password') }}</label>
              <div class="rp__pass">
                <input
                  class="rp__input"
                  :type="showRepeatPassword ? 'text' : 'password'"
                  required
                  :placeholder="$t('public-pages.register.repeat-password')"
                  :value="inputsData.repeatPassword"
                  @input="$emit('update-inputs-data', { key: 'repeatPassword', value: $event.target.value })"
                />
                <button type="button" class="rp__icon" @click="$emit('update', { key: 'showRepeatPassword', value: !showRepeatPassword })">
                  <v-icon>{{ showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </button>
              </div>
            </div>

            <label class="rp__check">
              <input
                type="checkbox"
                :checked="!!inputsData.agree"
                @input="$emit('update-inputs-data', { key: 'agree', value: $event.target.checked })"
              />
              <span>{{ $t('public-pages.register.terms-agreement') }}</span>
            </label>

            <button type="submit" class="rp__btn">{{ $t('public-pages.register.register-button') }}</button>
          </form>

          <div v-else-if="pageState === 'verification'" class="rp__form">
            <div class="rp__subtitle">{{ $t('public-pages.register.email-verification') }}</div>

            <div class="rp__field">
              <label class="rp__label">{{ $t('public-pages.register.activation-code') }}</label>
              <input
                class="rp__input"
                type="text"
                :placeholder="$t('public-pages.register.activation-code')"
                :value="inputsData.activationCode"
                @input="$emit('update-inputs-data', { key: 'activationCode', value: $event.target.value })"
              />
            </div>

            <div v-if="activationCodeError" class="rp__error">{{ $t('public-pages.register.invalid-activation-code') }}</div>

            <div class="rp__actions">
              <button class="rp__btn rp__btn--secondary" @click="$emit('update', { key: 'pageState', value: 'register' })">
                {{ $t('public-pages.register.previous') }}
              </button>
              <button class="rp__btn" @click="$emit('verifyActivationCode')">
                {{ $t('public-pages.register.verify-and-register') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  style: /* css */`
    :root {
      --clr-theme-primary: #1268eb;
      --clr-body-heading: #1e1e1e;
      --rp-border: rgba(0, 0, 0, 0.15);
    }

    .rp { max-width: 640px; margin: 40px auto; padding: 0 16px; }
    .rp__logo { display: block; height: 52px; margin: 0 auto 16px; }
    .rp__card { border: 1px solid var(--rp-border); border-radius: 12px; padding: 16px; background: #fff; }
    .rp__top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .rp__title { font-weight: 700; color: var(--clr-body-heading); }
    .rp__subtitle { margin-top: 10px; font-weight: 700; color: var(--clr-body-heading); }
    .rp__link { color: var(--clr-theme-primary); text-decoration: none; font-weight: 600; font-size: 14px; }
    .rp__link:hover { text-decoration: underline; }
    .rp__muted { color: rgba(0,0,0,.65); margin-top: 6px; }
    .rp__center { padding: 18px 0; display: grid; gap: 10px; justify-items: center; }
    .rp__success { font-weight: 800; color: #2e7d32; }

    .rp__form { margin-top: 12px; display: grid; gap: 12px; }
    .rp__field { display: grid; gap: 6px; }
    .rp__label { font-size: 13px; font-weight: 600; color: rgba(0,0,0,.8); }
    .rp__input, .rp__select { width: 100%; height: 40px; padding: 0 10px; border: 1px solid var(--rp-border); border-radius: 8px; box-sizing: border-box; background: #fff; }
    .rp__input:focus, .rp__select:focus { outline: none; border-color: var(--clr-theme-primary); box-shadow: 0 0 0 3px rgba(18,104,235,.15); }
    .rp__pass { position: relative; }
    .rp__pass .rp__input { padding-right: 44px; }
    .rp__icon { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border: 1px solid var(--rp-border); background: #fff; border-radius: 8px; cursor: pointer; }
    .rp__check { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(0,0,0,.8); }
    .rp__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .rp__error { color: #b91c1c; font-weight: 600; }

    .rp__btn { height: 40px; border: none; border-radius: 8px; background: var(--clr-theme-primary); color: #fff; font-weight: 700; cursor: pointer; }
    .rp__btn:hover { background: #0d5bcd; }
    .rp__btn--secondary { background: rgba(0,0,0,.10); color: rgba(0,0,0,.85); }
    .rp__btn--secondary:hover { background: rgba(0,0,0,.14); }

    .spinner-border { width: 2.25rem; height: 2.25rem; }
    .text-primary { color: var(--clr-theme-primary) !important; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  `
};
```

## Vue Component Format

### Basic Structure

```js
module.exports = {
  name: "MyComponent",
  
  props: {
    title: { required: true },
    count: { default: 0 }
  },
  // Or in array format:
  // props: [
  //   'title',
  //   'count'
  // ],
  
  template: /* html */`
    <div class="my-component">
      <h1>{{ title }}</h1>
      <button @click="increment">Count: {{ counter }}</button>
    </div>
  `,
  
  style: /* css */`
    .my-component { padding: 20px; }
    .my-component h1 { color: blue; }
  `,
  
  data: /* js */`
    function() {
      return {
        counter: 0
      };
    }
  `,
  
  computed: /* js */`
    {
      counterText() {
        return this.counter + " Counts";
      }
    }
  `,
  
  methods: /* js */`
    {
      increment() {
        this.counter++;
      }
    }
  `,
  
  mounted: /* js */`
    function() {
      console.log('Component mounted!');
    }
  `
};
```

### Available Fields

| Field | Format | Description |
|-------|--------|-------------|
| `name` | String | Component name (required) |
| `props` | Object | Props definition (not a string) |
| `template` | Template literal | HTML template with Vue syntax |
| `style` | Template literal | CSS styles for the component |
| `data` | Template literal | Function returning initial state |
| `computed` | Template literal | Object with computed properties |
| `watch` | Template literal | Object with watchers |
| `methods` | Template literal | Object with methods |
| `mounted` | Template literal | Lifecycle hook function |
| `created`, `beforeMount`, `beforeUpdate`, `updated`, `beforeDestroy`, `destroyed` | Template literal | Other lifecycle hooks |

### Key Rules

1. **Use template literals** (backticks) for `template`, `style`, `data`, `methods`, etc.
2. **Props is an object**, not a template literal
3. **Comments are optional** but recommended: `/* html */`, `/* css */`, `/* js */`
4. **Unused fields** can be omitted or set to `null`
5. **Empty file marker**: `/* EMPTY FILE */` for placeholder files

### Minimal Example

```js
module.exports = {
  name: "HelloWorld",
  template: /* html */`
    <div>Hello, World!</div>
  `
};
```