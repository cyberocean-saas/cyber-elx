# CyberOcean Custom Payment Page

## Summary

- [CyberOcean Custom Payment Page](#cyberocean-custom-payment-page)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Payment Page](#payment-page)
    - [Component Structure](#component-structure)
    - [Project Colors](#project-colors)
    - [Available Props](#available-props)
    - [course Object](#course-object)
    - [user Object](#user-object)
    - [Page Sections](#page-sections)
    - [Events to Emit](#events-to-emit)
    - [Example Payment Page:](#example-payment-page)
  - [Vue Component Format](#vue-component-format)
    - [Basic Structure](#basic-structure)
    - [Available Fields](#available-fields)
    - [Key Rules](#key-rules)
    - [Minimal Example](#minimal-example)

## Overview

The Payment Page handles course enrollment and payment processing. It displays course information, handles user authentication state, and provides payment options.
IMPORTANT: You will only handle UI and styles, all logic and functionality is handled by the parent component.

**Key Features:**
- Course information display with price breakdown
- User authentication check (login/register prompts for guests)
- Vuetify components for dialogs (Recommended)

## Payment Page

The payment page manages the course purchase flow:
1. **Guest User** - Prompts to login or register
2. **Logged-in User (Paid Course)** - Shows payment method dialog, just emit `payClick` event
3. **Logged-in User (Free Course)** - Direct enrollment, just emit `payClick` event

### Component Structure

The payment component must export a module with:
- `name` - Component name (`"PaymentPage"`)
- `props` - Required props (array or object format)
- `template` - HTML template string
- `style` - CSS styles string (optional but recommended)

### Project Colors

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`
### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `loading` | Boolean | Whether a request is in progress |
| `isFreeCourse` | Boolean | Whether the course is free (`course.price == 0`) |
| `courseId` | String | The course ID |
| `course` | Object | Course data object (see below) |
| `paymentMethods` | Array | List of available payment method names |
| `showPaymentMethodDialog` | Boolean | Controls payment method dialog visibility |
| `showSuccessDialog` | Boolean | Controls success dialog visibility |
| `websiteLogo` | String | Path to the website logo |
| `user` | Object/null | Current user object or `null` if not logged in |

### course Object

The `course` prop contains course information:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Course name |
| `description` | String | Course description |
| `price` | Number | Course price (0 if free) |
| `barredPrice` | String | Original price before discount |
| `logo.path` | String | Path to course image |

### user Object

The `user` prop (when logged in) contains:

| Field | Type | Description |
|-------|------|-------------|
| `email` | String | User's email address |
| `name` | String | User's name |
| `image.path` | String | User's profile image |

### Page Sections

1. **Course Info Section** - Displays course image, name, price, and description
2. **Auth Section** - Shows login/register buttons for guests, or user email for logged-in users
3. **Payment Methods Display** - Visual display of available payment methods
4. **Purchase Info Section** - Price breakdown and pay button
5. **Payment Method Dialog** - Modal to choose between online payment or course request
6. **Success Dialog** - Confirmation after successful course request

### Events to Emit

| Event | When to Emit | Description |
|-------|--------------|-------------|
| `redirectToAuth` | Login/Register click | Redirect to auth page: `$emit('redirectToAuth', '@PVP/login')` or `'@PVP/register'` |
| `payClick` | Pay button click | Initiate payment flow (opens payment method dialog) |
| `processOnlinePayment` | Online payment selected | Process online payment (redirects to payment gateway) |
| `requestCourse` | Request course selected | Submit course request (admin will contact user) |
| `closePaymentMethodDialog` | Dialog close | Close the payment method dialog |
| `closeSuccessDialog` | Success dialog close | Close the success confirmation dialog |

### Example Payment Page:
```js
module.exports = {
  name: "PaymentPage",
  props: [
    'loading',
    'isFreeCourse',
    'courseId',
    'course',
    'paymentMethods',
    'showPaymentMethodDialog', // Handled by parent component
    'showSuccessDialog', // Handled by parent component
    'websiteLogo',
    'user'
  ],
  template: /* html */`
    <div class="enroll-page-class">
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <div class="d-flex" style="padding: 15px 40px 0px;">
        <img v-if="websiteLogo" :src="websiteLogo" alt="Logo" style="height: 50px;">
      </div>
      <div class="enroll-page-content">
        <div class="course-info">
          <!-- Course Info -->
          <div class="course-holder">
            <img :src="course.logo.path" alt="Course Image" class="course-image" />
            <h2 class="course-title">{{ course.name }}</h2>
            <v-spacer></v-spacer>
            <p class="lesson-price">{{ course.price }} DT</p>
          </div>
          <span style="max-height: 100px; overflow: auto; border-bottom: 1px solid gray; margin-bottom: 20px; font-size: 12px; color: #474747;">
            <b>{{ $t('public-pages.course-payment.description') }}</b>
            {{ course.description }}
          </span>

          <!-- User Info or Auth -->
          <div v-if="!user">
            <span>{{ $t('public-pages.course-payment.login-to-continue') }}</span>
            <div>
              <v-btn @click="$emit('redirectToAuth', '@PVP/login')" class="normal-btn" color="primary" style="margin-top: 20px; width: 100%;">{{ $t('public-pages.course-payment.login') }}</v-btn>
              <v-btn @click="$emit('redirectToAuth', '@PVP/register')" class="normal-btn" color="primary" style="margin-top: 20px; width: 100%;">{{ $t('public-pages.course-payment.create-account') }}</v-btn>
            </div>
          </div>
          <div v-else style="padding: 2px 7px; border: 2px solid var(--v-primary-base); border-radius: 7px; background-color: #ebf3ff; text-align: center; font-size: 17px;">
            <p style="margin: 0px;">{{ $t('public-pages.course-payment.logged-in-as') }} <b style="color: var(--v-primary-base);">{{ user.email }}</b></p>
          </div>

          <!-- UI Decoration (Payment Methods) -->
          <v-card style="margin-top: 15px; border-radius: 10px; box-shadow: 0px 0px 20px #00000012 !important; padding-bottom: 10px;" elevation="0">
            <v-card-title style="font-size: 16px;">{{ $t('public-pages.course-payment.available-payment-methods') }}</v-card-title>
            <v-card-text>
              <v-row style="justify-content: center;">
                <v-col
                  v-for="(method, index) in paymentMethods"
                  :key="index"
                  cols="2"
                  class="text-center"
                  style="min-width: 140px;"
                >
                  <img
                    :src="'@PS/images/icons/bank-' + (index + 1) + '.png'"
                    style="width: 70px; height: 70px; object-fit: contain; border: 1px solid gray; padding: 3px; border-radius: 7px;"
                  />
                  <div style="font-weight: 500; color: black;">{{ method }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

        </div>
        <!-- Order Info and Price break down -->
        <div class="purchase-info">
          <p class="item-price"><span>{{ $t('public-pages.course-payment.course-price') }}</span> <span>{{ course.price.toFixed(3) }} DT</span></p>
          <p v-if="isFreeCourse" class="item-price"><span>{{ $t('public-pages.course-payment.original-price') }}</span> <span>{{ parseFloat(course.barredPrice || "100").toFixed(3) }} DT</span></p>
          <p class="total-price"><span>{{ $t('public-pages.course-payment.total') }} </span><span>{{ course.price.toFixed(3) }} DT</span></p>
          <button
            class="payment-button"
            :style="!user ? 'filter: grayscale(1); opacity: 0.8;' : ''"
            @click="$emit('payClick')"
          >
            <span v-if="isFreeCourse">
              {{ $t('public-pages.course-payment.get-course-free') }}
            </span>
            <span v-else>
              {{ $t('public-pages.course-payment.pay') }} {{course.price.toFixed(3)}} DT
            </span>
          </button>
        </div>

        <!-- Payment Dialog -->
        <v-dialog
          :value="showPaymentMethodDialog"
          @input="$event ? null : $emit('closePaymentMethodDialog')"
          max-width="400px"
          transition="dialog-bottom-transition"
        >
          <v-card class="rounded-lg">
            <v-card-title class="text-center primary white--text">
              <v-icon left color="white">mdi-credit-card-outline</v-icon>
              {{ $t('public-pages.course-payment.choose-payment-method') }}
            </v-card-title>
            
            <v-card-text class="pt-6">
              <v-row justify="center" class="mb-4">
                <v-col cols="12" sm="10">
                  <v-btn
                    block
                    color="primary"
                    elevation="2"
                    class="mb-4 py-6"
                    @click="$emit('processOnlinePayment')"
                  >
                    <v-icon left>mdi-bank</v-icon>
                    {{ $t('public-pages.course-payment.online-payment') }}
                    <v-icon right>mdi-arrow-right</v-icon>
                  </v-btn>
                  
                  <v-btn
                    block
                    color="secondary"
                    elevation="2"
                    class="py-6"
                    @click="$emit('requestCourse')"
                  >
                    <v-icon left>mdi-email-outline</v-icon>
                    {{ $t('public-pages.course-payment.request-course') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-divider></v-divider>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="grey darken-1"
                @click="$emit('closePaymentMethodDialog')"
              >
                <v-icon left>mdi-close</v-icon>
                {{ $t('public-pages.course-payment.cancel') }}
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Success Dialog -->
      <v-dialog :value="showSuccessDialog" @input="$event ? null : $emit('closeSuccessDialog')" persistent max-width="400">
          <v-card>
            <v-card-title class="headline">{{ $t('public-pages.course-payment.request-sent') }}</v-card-title>
            <v-card-text>
              {{ $t('public-pages.course-payment.request-sent-message') }}
            </v-card-text>
          </v-card>
        </v-dialog>

      </div>
    </div>
  `,
  style: /* css */`
    .enroll-page-class {
      overflow: auto;
      max-height: calc(100vh - 7px);
      max-width: 1100px;
      margin: auto;
    }

    .enroll-page-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
      padding: 20px;
    }

    .purchase-info {
      justify-content: flex-start !important;
      gap: 8px;
      
    }

    .course-info,
    .purchase-info {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adds shadow for a lifted look */
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
    }

    .course-info {
      flex-grow: 1;
    }

    .purchase-info {
      flex-grow: 1;
    }

    .purchase-info p {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .purchase-info p input {
      width: 15%;
    }
    .course-holder {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      width: 100%;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .course-holder {
        flex-direction: column;
      }
    }

    .course-image {
      object-fit: contain;
      width: 60px;
      border: 1px solid black;
      padding: 5px;
      height: auto;
      border-radius: 6px;
      margin-bottom: 0px;
      max-height: 110px;
    }
    @media (max-width: 768px) {
      .course-image {
        width: 80%;
        margin: auto;
      }
    }

    .course-title {
      width: 50%;
      max-width: 50%;
      font-size: 1em;
      text-wrap:wrap ;
    }

    .lesson-price {
      width: fit-content;
      font-size: 1.2em;
      color: #333;
      margin-bottom: 0px !important;
      font-weight: 300;
      font-size: 22px;
    }

    .payment-methods {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-top: 16px;
    }

    .payment-option {
      padding: 10px 20px;
      background-color: #255ca838;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: #255ca8;
      transition: background-color 0.3s;
      width: 45%;
      font-weight: 600;
      border: 2px solid #255ca8;

    }

    .payment-option:hover {
      background-color: #255ca857;
    }

    .item-price,
    .quantity,
    .total-price {
      font-size: 1em;
      margin: 8px 0;
    }

    .payment-button {
      width: 100%;
      padding: 12px;
      background-color: #255ca8;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    .payment-button:hover {
      background-color: #0056b3;
    }

    /* Tablet and Desktop Styling */
    @media (min-width: 768px) {
      .enroll-page-content {
        flex-direction: row;
        gap: 20px;
        padding: 40px;
      }

      .course-info {
        width: 60%;
      }

      .purchase-info {
        width: 40%;
      }
    }
    .payment-method-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .payment-method-container {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .payment-method-container h3 {
      margin-top: 0;
      text-align: center;
      margin-bottom: 20px;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .payment-option {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f8f8f8;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .payment-option:hover {
      background-color: #eaeaea;
    }

    .close-button {
      width: 100%;
      padding: 10px;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
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