# CyberOcean Custom Student Profile Page

## Summary

This document describes how to customize the **Student Profile Page** using a Vue.js component. The page allows students to view and edit their profile information including name, profile image, grade (if enabled), and password. It features a view/edit mode toggle, form validation, and updates the VueX store after saving.

> **IMPORTANT:** This component handles both **UI and logic** including API calls to save the profile and VueX store updates. The `additionalFields` object is used for extensible user data like grade.

## Overview

The Student Profile Page displays the current user's information and allows editing. The parent component provides the user object, grade options, and grade list. Your component manages the edit state, form validation, and API submission.

**Key Features:**
- **View/Edit mode toggle** - Switch between viewing and editing profile
- **Profile header** - Avatar with user image or default icon
- **Profile image upload** - CLoader component for image upload (edit mode only)
- **Email display** - Read-only email field (view mode only)
- **Name fields** - Editable first name and last name
- **Grade selection** - Dropdown for grade (only if `gradeOption` is true and user is a student)
- **Password change** - New password and confirm password with real-time validation
- **Form validation** - Validates changes and password matching before save
- **API integration** - Calls `/api/users/update_my_profile` to save changes
- **VueX store update** - Updates `auth/setUser` after successful save

## Student Profile Page

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│ .profile-component                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ .profile-header                                         │ │
│ │ [Avatar] "My Profile"                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ .profile-image-uploader (edit mode only)                │ │
│ │ [CLoader FilesInput]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ .profile-content                                        │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ .info-section                                       │ │ │
│ │ │ Email:      user@example.com (view mode only)       │ │ │
│ │ │ First Name: [___________] or "John"                 │ │ │
│ │ │ Last Name:  [___________] or "Doe"                  │ │ │
│ │ │ Grade:      [Dropdown___] (if gradeOption)          │ │ │
│ │ │ Password:   [___________] (edit mode only)          │ │ │
│ │ │ Confirm:    [___________] (edit mode only)          │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ .button-row                                             │ │
│ │ [Edit Profile] or [Cancel] [Save]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | Object | The current logged-in user object (see structure below) |
| `gradeOption` | Boolean | Whether grade selection is enabled for this website |
| `itemsTunisiaGrades` | Array | List of available grades (see structure below) |

### The `user` Object

```js
{
  id: "user-id",
  email: "user@example.com",           // Read-only, displayed in view mode
  first_name: "John",
  last_name: "Doe",
  customer_locale: "en",               // User's language preference
  image: {                             // Profile image (optional)
    id: "image-id",
    path: "/uploads/profile.jpg"
  },
  role: {                              // User role
    key: "student"                     // "student" or "teacher"
  },
  additionalFields: {                  // Dynamic extensible fields
    grade: "grade-9"                   // Grade key (if gradeOption is true)
    // Can contain other custom fields in the future
  }
}
```

### The `additionalFields` Object

This is a **dynamic object** used to store extensible user data. Currently used for:

| Field | Type | Description |
|-------|------|-------------|
| `grade` | String | Grade key (e.g., "grade-9") - only used when `gradeOption` is true |

**Why `additionalFields`?**
- Allows adding new user properties without changing the core user schema
- Grade is stored here because it's specific to educational platforms
- Future extensions (country, school, etc.) can be added here

### The `itemsTunisiaGrades` Array

```js
[
  { key: "grade-7", title: "7th Grade" },
  { key: "grade-8", title: "8th Grade" },
  { key: "grade-9", title: "9th Grade" },
  // ... more grades
]
```

### Local State (data)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | Boolean | `false` | Loading state during API call |
| `isEditing` | Boolean | `false` | Whether in edit mode |
| `newData` | Object | `{}` | Object holding modified field values |
| `originalData` | Object | `{}` | Original user data for reset |
| `newPassword` | String | `''` | New password input |
| `confirmPassword` | String | `''` | Confirm password input |
| `passwordError` | String | `''` | Password validation error message |

### Computed Properties

| Property | Description |
|----------|-------------|
| `grade` | Returns grade from `newData.additionalFields.grade` or `user.additionalFields.grade` |
| `first_name` | Returns first name from `newData` or `user` |
| `last_name` | Returns last name from `newData` or `user` |
| `customer_locale` | Returns locale from `newData` or `user` |
| `isFormValid` | Returns true if form has changes and password validation passes |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `toggleEditMode()` | - | Toggles edit mode on/off, resets form when exiting |
| `cancelEdit()` | - | Resets form and exits edit mode |
| `resetForm()` | - | Clears `newData` (except password), resets password fields |
| `update(key, val)` | `key: String, val: any` | Updates a field in `newData` using `$set` |
| `updateCountry(val)` | `val: String` | Updates `additionalFields.countryKey` (for future use) |
| `updateGrade(val)` | `val: String` | Updates `additionalFields.grade` |
| `validatePassword()` | - | Validates password fields, returns true if valid |
| `saveProfile()` | - | Validates form, calls API, updates VueX store |
| `getGradeText(value)` | `value: String` | Converts grade key to display text |

### Page Sections

1. **Profile Header** (`.profile-header`)
   - User avatar (image or default icon)
   - "My Profile" title

2. **Profile Image Uploader** (`.profile-image-uploader`) - Edit mode only
   - Uses `CLoader` component with `cpn="FilesInput"`
   - Props: `v-model`, `:value`, `@input`, `SingleFile`, `tag="picture"`

3. **Info Section** (`.info-section`)
   - **Email** - Display only (view mode only, read-only)
   - **First Name** - Text field or display
   - **Last Name** - Text field or display
   - **Grade** - Select dropdown (only if `user.role.key === 'student'` AND `gradeOption === true`)
   - **Password Section** - Two password fields (edit mode only)

4. **Button Row** (`.button-row`)
   - View mode: "Edit Profile" button
   - Edit mode: "Cancel" and "Save" buttons (Save disabled if `!isFormValid`)

### CLoader Component

The `CLoader` component is a platform-provided file uploader:

```html
<CLoader
  cpn="FilesInput"
  v-model="user.image"
  :value="user.image.id"
  @input="update('image', $event)"
  label="Profile Photo"
  SingleFile
  tag="picture"
  class="file-uploader"
/>
```

| Prop | Description |
|------|-------------|
| `cpn` | Component type: `"FilesInput"` for file upload |
| `v-model` | Bound to user image object |
| `:value` | Current image ID |
| `@input` | Handler to update newData |
| `SingleFile` | Only allow one file |
| `tag` | File category: `"picture"` |

### API Integration

**Endpoint:** `POST /api/users/update_my_profile`

**Request body:**
```js
{
  first_name: "John",
  last_name: "Doe",
  image: { id: "image-id", path: "/uploads/new.jpg" },
  password: "newpassword123",           // Only if changing password
  additionalFields: {
    grade: "grade-10"                   // Only if gradeOption is true
  }
}
```

**After successful save:**
```js
this.$store.dispatch('auth/setUser', updatedUser);
```

### Password Validation

The `isFormValid` computed property performs real-time validation:

1. If neither password field is filled → Valid (no password change)
2. If only one field is filled → Invalid, show appropriate error
3. If both filled but don't match → Invalid, show "Passwords do not match"
4. If both filled and match → Valid

### Available translations (Use what you need)

- `profile.my-profile` → "My Profile"
- `profile.first-name` → "First Name"
- `profile.last-name` → "Last Name"
- `profile.grade` → "Grade"
- `profile.change-password` → "Change Password"
- `profile.new-password` → "New Password"
- `profile.confirm-password` → "Confirm Password"
- `profile.edit-profile` → "Edit Profile"
- `profile.cancel` → "Cancel"
- `profile.save` → "Save"
- `toast.profile-updated-successfully` → "Profile updated successfully"
- `toast.error-saving-profile` → "Error saving profile"

If you want another text, just put it in English.

### Example Student Profile Page:
```js
module.exports = {
  name: "ProfilePage",
  props: [
    'itemsTunisiaGrades',
    'gradeOption',
    'user',
  ],
  template: /* html */`
  <div class="profile-component">
    <div class="profile-header">
      <div class="user-avatar">
        <img v-if="user.image" :src="user.image.path" alt="Profile" class="avatar-img" />
        <v-icon v-else size="24" color="white">mdi-account</v-icon>
      </div>
      <h2 class="profile-title">{{ $t("profile.my-profile") }}</h2>
    </div>
    <!-- Profile Image Section (Only visible in edit mode) -->
    <div v-if="isEditing" class="profile-image-uploader">
      <CLoader
        cpn="FilesInput"
        v-model="user.image"
        :value="user.image.id"
        @input="update('image', $event)"
        label="Profile Photo" SingleFile tag="picture" class="file-uploader"></CLoader>
    </div>

    <div class="profile-content">

      <div class="info-section">
      <!-- Email -->
      <div v-if="!isEditing" class="info-field">
        <label class="field-label"> E-mail</label>
        <div class="field-container">
          <div class="field-display" style="font-weight: bold;">{{ user.email }}</div>
        </div>
      </div>

      <!-- First Name -->
      <div class="info-field">
        <label class="field-label">{{ $t("profile.first-name") }}</label>
        <div class="field-container">
          <div v-if="!isEditing" class="field-display">{{ first_name }}</div>
          <v-text-field v-else :value="first_name" @input="update('first_name', $event)" outlined hide-details dense rounded class="profile-input-field"
            />
        </div>
      </div>

      <!-- Last Name -->
      <div class="info-field">
        <label class="field-label">{{ $t("profile.last-name") }}</label>
        <div class="field-container">
          <div v-if="!isEditing" class="field-display">{{ last_name }}</div>
          <v-text-field v-else :value="last_name" @input="update('last_name', $event)" outlined hide-details dense rounded class="profile-input-field"
            />
        </div>
      </div>

      <!-- Grade - Only visible for students when gradeOption is true -->
      <div class="info-field" v-if="user.role && user.role.key === 'student' && gradeOption">
        <label class="field-label">{{ $t("profile.grade") }}</label>
        <div class="field-container">
          <div v-if="!isEditing" class="field-display">
            {{ getGradeText(grade) || 'Not specified' }}
          </div>
          <v-select v-else :value="grade" @input="updateGrade($event)" :items="itemsTunisiaGrades"
            outlined hide-details dense rounded class="profile-input-field" item-text="title" item-value="key" />
        </div>
      </div>

      <!-- Password Section -->
      <div class="info-field password-field" v-if="isEditing">
        

        <label class="field-label">{{ $t("profile.change-password") }}</label>
        <div class="password-section">
          <v-text-field v-model="newPassword" type="password" outlined hide-details dense rounded class="profile-input-field"
            :placeholder="$t('profile.new-password')" />
          <v-text-field v-model="confirmPassword" type="password" outlined hide-details dense rounded class="profile-input-field"
            :placeholder="$t('profile.confirm-password')"
            :error-messages="passwordError ? [passwordError] : []" />

          <div class="password-error" v-if="passwordError">
            {{ passwordError }}
          </div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <v-btn v-if="!isEditing" 
        color="primary" 
        @click="toggleEditMode"
        depressed 
        rounded 
        class="action-button"
      >
        <v-icon left size="18">mdi-pencil</v-icon>
        {{ $t("profile.edit-profile") }}
      </v-btn>
      <template v-else>
        <v-btn
          class="mr-4 action-button"
          text
          @click="cancelEdit"
          rounded
        >
          {{ $t("profile.cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          @click="saveProfile"
          depressed
          rounded
          :disabled="!isFormValid"
          class="action-button"
        >
          <v-icon left size="18">mdi-content-save</v-icon>
          {{ $t("profile.save") }}
        </v-btn>
      </template>
    </div>
    </div>
  </div>
  `,
  
  data: /* js */`
    function() {
      return {
        loading: false,
        isEditing: false,
        newData: {},
        originalData: {},
        newPassword: '',
        confirmPassword: '',
        passwordError: '',
      };
    }
  `,
  mounted: /* js */`
    function() {
      this.originalData = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        customer_locale: this.user.customer_locale,
        image: this.user.image,
        additionalFields: this.user.additionalFields || {}
      };
    }
  `,
  computed: /* js */`
    {
      grade() {
        return this.newData.additionalFields?.grade
          ? this.newData.additionalFields.grade
          : this.user?.additionalFields?.grade || '';
      },
      first_name() {
        return this.newData.first_name
          ? this.newData.first_name
          : this.user.first_name;
      },
      last_name() {
        return this.newData.last_name
          ? this.newData.last_name
          : this.user.last_name;
      },
      customer_locale() {
        return this.newData.customer_locale
          ? this.newData.customer_locale
          : this.user.customer_locale;
      },
      isFormValid() {
        // Only require changes in edit mode
        if (!this.isEditing) return false;

        // Check if form has changes
        const hasChanges = Object.keys(this.newData).length > 0 || this.newPassword || this.confirmPassword;

        // Real-time password validation
        let passwordValid = true;
        if (this.newPassword || this.confirmPassword) {
          // If either password field is filled, both must be filled and match
          passwordValid = this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword;

          // Update error message for immediate feedback
          if (this.newPassword && !this.confirmPassword) {
            this.passwordError = 'Please confirm your password';
          } else if (!this.newPassword && this.confirmPassword) {
            this.passwordError = 'Please enter your new password';
          } else if (this.newPassword !== this.confirmPassword) {
            this.passwordError = 'Passwords do not match';
          } else {
            this.passwordError = '';
          }
        }

        return hasChanges && passwordValid;
      }
    }
  `,
  methods: /* js */`
    {
      toggleEditMode() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
          this.resetForm();
        }
      },
      cancelEdit() {
        this.resetForm();
        this.isEditing = false;
      },
      resetForm() {
        // Create a new object without the password property
        const newDataWithoutPassword = { ...this.newData };
        if (newDataWithoutPassword.hasOwnProperty('password')) {
          delete newDataWithoutPassword.password;
        }

        this.newData = newDataWithoutPassword;
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordError = '';
      },
      update(key, val) {
        this.$set(this.newData, key, val);
      },
      updateCountry(val) {
        if (!this.newData.additionalFields) {
          this.$set(this.newData, 'additionalFields', {});
        }
        this.$set(this.newData.additionalFields, 'countryKey', val);
      },
      updateGrade(val) {
        if (!this.newData.additionalFields) {
          this.$set(this.newData, 'additionalFields', {});
        }
        this.$set(this.newData.additionalFields, 'grade', val);
      },
      // Modify the validatePassword method to only add password to newData if both fields are filled
      validatePassword() {
        // Clear previous error
        this.passwordError = '';

        // If both fields are empty, no password change is intended
        if (!this.newPassword && !this.confirmPassword) {
          // Remove password from newData if it exists
          if (this.newData.hasOwnProperty('password')) {
            delete this.newData.password;
          }
          return true;
        }

        // If only one field is filled
        if (this.newPassword && !this.confirmPassword) {
          this.passwordError = 'Please confirm your password';
          return false;
        }

        if (!this.newPassword && this.confirmPassword) {
          this.passwordError = 'Please enter your new password';
          return false;
        }

        // Check if passwords match
        if (this.newPassword !== this.confirmPassword) {
          this.passwordError = 'Passwords do not match';
          return false;
        }

        // Password is valid, update newData only if both fields are filled
        if (this.newPassword && this.confirmPassword) {
          this.update('password', this.newPassword);
        }
        return true;
      },
      saveProfile() {
        if (!this.isFormValid) return;

        // Validate password before saving
        if (!this.validatePassword()) return;

        // Create a copy of the data to send
        const dataToSend = { ...this.newData };

        // Always include first_name and last_name
        dataToSend.first_name = this.first_name;
        dataToSend.last_name = this.last_name;
        
        // Only include password if both fields are filled
        if (!this.newPassword && !this.confirmPassword) {
          delete dataToSend.password;
        }

        this.loading = true;
        this.$dataCaller("post", "/api/users/update_my_profile" ,dataToSend)
          .then((response) => {
            this.loading = false;
            this.isEditing = false;
            this.resetForm();
            this.$toast.success(this.$t('toast.profile-updated-successfully'));

            // IMPORTANT: Update the VueX Store with the new user data
            const updatedUser = { 
              ...this.user, 
              ...dataToSend,
              additionalFields: {
                ...this.user.additionalFields,
                ...(dataToSend.additionalFields || {})
              }
            };
            this.$store.dispatch('auth/setUser', updatedUser);
          })
          .catch((error) => {
            this.loading = false;
            this.$toast.error(error?.message || this.$t('toast.error-saving-profile'));
          });
      },
      getGradeText(value) {
        const grade = this.itemsTunisiaGrades.find(item => item.key === value);
        return grade ? grade.title : value;
      }
    }
  `,
  style: /* css */`
  .profile-component .profile-input-field>.v-input__control>.v-input__slot>.v-text-field__slot {
    padding-left: 10px !important;
  }

  /* Base Styles - Apply to both themes */
  .profile-component {
    padding: 20px;
    transition: all 0.3s ease;
    min-height: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Profile Image Section */
  .profile-component .profile-image-uploader {
    max-width: 220px;
    margin: 20px auto;
  }

  /* Profile Header with User Avatar */
  .profile-component .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .profile-component .theme--dark .profile-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .profile-component .user-avatar {
    width: 40px;
    height: 40px;
    background: var(--v-primary-base);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .profile-component .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-component .profile-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  /* Content Section */
  .profile-component .profile-content {
    width: 100%;
  }

  .profile-component .info-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .profile-component .info-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .profile-component .field-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    letter-spacing: 0.3px;
  }

  .profile-component .field-container {
    width: 100%;
  }

  .profile-component .field-display {
    font-size: 16px;
    padding: 6px 0;
    border-bottom: 1px solid #eee;
  }

  .profile-component .profile-input-field {
    margin-top: 0;
    border-radius: 8px !important;
  }

  /* Password Section */
  .profile-component .password-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 10px 0;
    margin-top: 5px;
  }

  .profile-component .password-error {
    color: #ff5252;
    font-size: 14px;
    margin-top: 4px;
  }

  /* Button Styles */
  .profile-component .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 40px;
  }

  .profile-component .action-button {
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.3px;
  }



  /* Responsive Styles */
  @media (min-width: 768px) {
    .profile-component .info-field {
      flex-direction: row;
      align-items: center;
    }

    .profile-component .field-label {
      width: 150px;
      text-align: right;
      padding-right: 20px;
    }

    .profile-component .field-container {
      flex: 1;
    }
  }

  @media (max-width: 767px) {
    .profile-component .profile-card {
      padding: 30px 20px;
      border-radius: 15px;
    }
    
    .profile-component .section-title {
      font-size: 20px;
    }
    
    .profile-component .action-button {
      padding: 10px 20px;
      min-width: 100px;
    }
    
    .profile-component .button-row {
      justify-content: center;
    }
  }
  `
}
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