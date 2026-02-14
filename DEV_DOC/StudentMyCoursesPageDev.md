# CyberOcean Custom Student My Courses Page

## Summary

- [CyberOcean Custom Student My Courses Page](#cyberocean-custom-student-my-courses-page)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Student My Courses Page](#student-my-courses-page)
    - [Component Structure](#component-structure)
    - [Project Colors (Required)](#project-colors-required)
    - [Available Props](#available-props)
    - [cardsInfos Array](#cardsinfos-array)
    - [courses Array](#courses-array)
    - [websiteInfo Object](#websiteinfo-object)
    - [Page Sections](#page-sections)
    - [Events to Emit](#events-to-emit)
    - [Available translations (Use what you need)](#available-translations-use-what-you-need)
    - [Example Student My Courses Page:](#example-student-my-courses-page)
  - [Vue Component Format](#vue-component-format)
    - [Basic Structure](#basic-structure)
    - [Available Fields](#available-fields)
    - [Key Rules](#key-rules)
    - [Minimal Example](#minimal-example)

## Overview

The Student My Courses Page is the default page when a student logs in (like the Student Dashboard). It displays the student's enrolled courses with progress tracking and certificate generation. It provides a dashboard view of course statistics and **the list of purchased courses**.

**IMPORTANT:** You will only handle UI and styles, all logic and functionality is handled by the parent component.

**Key Features:**
- Statistics cards showing course counts and certificates
- Course list with progress bars
- Certificate generation for completed courses (if enabled)
- Search/filter functionality for courses
- Vuetify components (Optional)

## Student My Courses Page

The page displays:
1. **Statistics Cards** - Shows total courses, completed courses, and certificates (if enabled)
2. **Courses Table** - Lists all purchased courses with progress and actions

### Component Structure

The component must export a module with:
- `name` - Component name (`"MyCoursesPage"`)
- `props` - Required props (array or object format)
- `template` - HTML template string
- `style` - CSS styles string (optional but recommended)
- `data` - Local state (search field)
- `computed` - Computed properties (filteredCourses, headers)

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `loading` | Boolean | Whether data is being loaded |
| `cardsInfos` | Array | Statistics cards data (see below) |
| `certificates` | Array | List of user's certificates |
| `courses` | Array | List of purchased courses (see below) |
| `websiteInfo` | Object | Website information (see below) |
| `generateCertAccess` | Boolean | Whether certificate generation is enabled |

### cardsInfos Array

Each item in `cardsInfos` contains:

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Card title (e.g., "Total Courses") |
| `value` | Number | Statistic value |
| `icon` | String | MDI icon name (e.g., `mdi-book-open`) |
| `iconClass` | String | CSS class for icon color (e.g., `icon--orange`) |
| `bgColor` | String | Background color class (e.g., `info-box--orange`) |

### courses Array

Each course object contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Course ID |
| `name` | String | Course name |
| `title` | String | Course title (for table display) |
| `cover.path` | String | Path to course cover image |
| `progress` | Number | Completion percentage (0-100) |

### websiteInfo Object

| Field | Type | Description |
|-------|------|-------------|
| `websiteUrl` | String | Main website URL |
| `websiteName` | String | Website name |

### Page Sections

1. **Statistics Cards** - Row of cards showing course statistics
2. **Courses List Card** - Contains the data table with:
   - Loading state with spinner
   - Empty state with link to website
   - Data table with course info, progress, and actions

### Events to Emit

| Event | When to Emit | Description |
|-------|--------------|-------------|
| `openCourse` | Open button click | Open the course player: `$emit('openCourse', item)` |
| `openCertificate` | Certificate button click | Generate/view certificate: `$emit('openCertificate', item)` |

### Available translations (Use what you need)

`student-courses.my-courses-list` -> My Course List
`student-courses.no-courses-purchased` -> No courses purchased
`student-courses.visit` -> Visit
`student-courses.to-see-courses` -> to see courses
`student-courses.get-my-certificate` -> Get my certificate
`student-courses.course-completed` -> Course completed
`student-courses.open` -> Open
`student-courses.total-courses` -> Total courses
`student-courses.completed-lessons` -> Completed lessons
`student-courses.certificates-obtained` -> Certificates obtained
`student-courses.course-title` -> Course Title
`student-courses.progress` -> Progress
`student-courses.action` -> Action
`student-courses.continue` -> Continue
`student-courses.start` -> Start
`student-courses.search-courses` -> Search your courses...
- If you want another text, just put it in English

### Example Student My Courses Page:
```js
module.exports = {
  name: "MyCoursesPage",
  props: 
    [
    'loading',
    'cardsInfos',
    'certificates',
    'courses',
    'websiteInfo',
    'generateCertAccess'
  ],
  template: /* html */`
    <div class="my-courses-page">
      <v-row style="margin-top: 20px">
        <v-col v-for="info in cardsInfos" :key="info.title" cols="12" :md="!generateCertAccess ? '6' : '4'">
          <v-card
            :color="info.bgColor"
            class="info-box"
            density="compact"
            elevation="2"
          >
            <v-icon size="40" :class="info.iconClass">{{ info.icon }}</v-icon>
            <v-col class="info-text">
              <p class="mb-0 text--secondary">{{ info.title }}</p>
              <h5 class="mb-0 fw-bold" style="font-size: 25px">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  size="20"
                  width="1"
                  color="gray"
                />
                <span v-else>{{ info.value }}</span>
              </h5>
            </v-col>
          </v-card>
        </v-col>
      </v-row>

      <v-card
        class="mt-4"
        style=" border-radius: 10px; padding: 0px 10px; margin-top: 50px !important; background-color: #dfe2f1; "
      >
        <v-card-title> {{ $t('student-courses.my-courses-list') }} </v-card-title>
        <v-card-text v-if="loading">
          <div
            style=" background-color: white; padding: 50px; display: flex; place-content: center; border-radius: 10px; "
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="30"
              width="1"
              color="gray"
            />
          </div>
        </v-card-text>
        <v-card-text v-else-if="filteredCourses.length == 0">
          <div
            style=" background-color: white; padding: 50px; display: flex; border-radius: 10px; flex-direction: column; align-items: center; "
          >
            <div style="font-size: 18px; font-weight: 300; margin-bottom: 15px">
              {{ $t('student-courses.no-courses-purchased') }}
            </div>
            <div style="font-weight: 500; color: black">
              {{ $t('student-courses.visit') }}
              <a :href="websiteInfo.websiteUrl" Target="_ Blank">
                {{ websiteInfo.websiteName }}
              </a>
              {{ $t('student-courses.to-see-courses') }}
            </div>
          </div>
        </v-card-text>
        <v-card-text v-else>
          <v-data-table
            :headers="headers"
            :items="filteredCourses"
            class="mt-4"
            :items-per-page="5"
            style="border-radius: 10px"
          >
            <template v-slot:item.title="{ item }">
              <div class="d-flex align-center" style="margin-bottom: 5px">
                <img
                  :src="item.cover ? item.cover.path : '/images/placeholder.png'"
                  class="course-icon"
                  style=" width: 70px; height: 70px; margin-right: 10px; border-radius: 10px; object-fit: contain; padding: 10px; border: 1px solid black; "
                />
                <span style="font-size: 15px">{{ item.name }}</span>
              </div>
            </template>
            <template v-slot:item.progress="{ item }">
              <v-progress-linear
                v-if="item.progress < 100"
                :value="item.progress"
                class="progress-striped"
                height="10"
                striped
              ></v-progress-linear>
              <v-btn
                v-else-if="generateCertAccess"
                color="success"
                dark
                flat
                class="action-btn"
                style="box-shadow: unset !important; border-radius: 20px"
                @click="$emit('openCertificate', item)"
              >
                <v-icon left>mdi-check</v-icon>
                {{ $t('student-courses.get-my-certificate') }}
              </v-btn>
              <v-chip
                v-else
                color="grey lighten-1"
                text-color="black"
                small
                class="px-2"
              >
                <v-icon left small>mdi-check-circle</v-icon>
                {{ $t('student-courses.course-completed') }}
              </v-chip>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn
                color="primary"
                dark
                flat
                class="action-btn"
                style="box-shadow: unset !important; border-radius: 20px"
                @click="$emit('openCourse', item)"
              >
                <v-icon left>mdi-play-circle</v-icon>
                {{ $t('student-courses.open') }}
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  `,
  
  data: /* js */`
    function() {
      return {
        search: "", // Search query for locally filtering courses
      };
    }
  `,
  computed: /* js */`
    {
      filteredCourses() {
        return (this.search || "").trim().length > 0
          ? this.courses.filter((course) => course.title.toLowerCase().includes(this.search.toLowerCase()))
          : this.courses;
      },
      headers() {
        return [
          { text: this.$t('student-courses.course-title'), value: "title", sortable: false },
          { text: this.$t('student-courses.progress'), value: "progress", sortable: false },
          { text: this.$t('student-courses.action'), value: "action", sortable: false },
        ];
      },
    }
  `,
  style: /* css */`
  .my-courses-page .info-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 8px 20px;
    padding-right: 0px;
    border-radius: 8px;
  }

  .my-courses-page .info-box--orange {
    border: 15px solid rgba(253, 126, 20);
    background-color: rgba(253, 126, 20, 0.15);
  }

  .my-courses-page .info-box--purple {
    border: 15px solid rgba(111, 66, 193);
    background-color: rgba(111, 66, 193, 0.15);
  }

  .my-courses-page .info-box--green {
    border: 15px solid rgba(12, 188, 135);
    background-color: rgba(12, 188, 135, 0.1);
  }

  .my-courses-page .icon--orange {
    color: rgba(253, 126, 20, 1) !important;
  }

  .my-courses-page .icon--purple {
    color: rgba(111, 66, 193, 1) !important;
  }

  .my-courses-page .icon--green {
    color: rgba(12, 188, 135, 1) !important;
  }

  .my-courses-page .info-text {
    margin-left: 7px !important;
  }

  .my-courses-page .progress-striped {
    background-color: rgba(6, 106, 201, 0.1);
    border-radius: 10px;
  }

  .my-courses-page .action-btn {
    background-color: transparent;
    color: rgba(6, 106, 201, 1);
    transition: color 0.3s ease-in-out;
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