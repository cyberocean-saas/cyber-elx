# CyberOcean Custom Student Course Detail Page

## Summary

This document describes how to customize the **Student Course Detail Page** using a Vue.js component. The page displays comprehensive course information including cover image, description, curriculum with chapters/lessons, and a sticky price card for enrollment. It supports free preview videos, accordion-style chapter navigation, and responsive layout.

> **IMPORTANT:** Your custom component handles **UI and styles only**. All logic and functionality (data fetching, payment processing, navigation) are handled by the parent component.

## Overview

The Student Course Detail Page is rendered when a student views a specific course. The parent component provides the course data, payment mode settings, and primary color. Your custom component receives these as props and renders the UI.

**Key Features:**
- **Breadcrumb navigation** - Link back to courses list with current course name
- **Course header** - Cover image, logo, and course name
- **Description section** - Course description text
- **Curriculum section** - Accordion-style chapters with lessons, element type icons, duration, and free preview buttons
- **Price card** - Sticky sidebar with pricing (supports promo), course info, buy button, and expiration text
- **Video modal** - Fullscreen modal for free preview video playback
- **Responsive design** - 2-column layout on desktop, single column on mobile with price card on top

## Student Course Detail Page

### Project Colors

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `course` | Object | The course object containing all course data (see structure below) |
| `courseId` | String | The unique identifier of the course |
| `onlineMode` | Boolean | Whether online payment is enabled |
| `offlineMode` | Boolean | Whether offline/request mode is enabled |

### The `course` Object

```js
{
  id: "course-id",
  name: "Course Name",
  description: "Course description text...",
  cover: { path: "/uploads/cover.jpg" },      // Cover image
  logo: { path: "/uploads/logo.jpg" },        // Course logo/thumbnail
  price: "99",                                 // Current price (string)
  barredPrice: "149",                          // Original price before discount
  promo: true,                                 // Whether course is on promotion
  expirationType: "in-months",                 // "in-months", "fixed-date", or "lifetime"
  expirationMonthsCount: "6",                  // Months until expiration (if type is "in-months")
  expirationDate: "1735689600000",             // Timestamp (if type is "fixed-date")
  chapters: [                                  // Array of chapters (optional)
    {
      id: "chapter-1",
      title: "Chapter 1: Introduction",
      elementsIds: ["el-1", "el-2", "el-3"]   // References to elements by ID
    }
  ],
  elements: [                                  // Array of all course elements
    {
      id: "el-1",
      title: "Welcome Video",
      type: "video",                           // "video", "youtube", "pdf", "quiz", "iframe"
      time: { minutes: 5, seconds: 30 },       // Duration
      freePreview: true,                       // Whether element is free to preview
      content: { path: "/uploads/video.mp4" }  // Content URL
    }
  ]
}
```

### Element Types

| Type | Icon | Description |
|------|------|-------------|
| `video` | `mdi-youtube` | Uploaded video file |
| `youtube` | `mdi-youtube` | YouTube embedded video |
| `pdf` | `mdi-file-pdf-box` | PDF document |
| `quiz` | `mdi-clipboard-text-outline` | Quiz/assessment |
| `iframe` | `mdi-picture-in-picture-bottom-right-outline` | Embedded iframe content |
| (other) | `mdi-file` | Default file icon |

### Local State (data)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showModal` | Boolean | `false` | Controls video modal visibility |
| `modalVideoUrl` | String | `''` | URL of the video to play in modal |
| `openChapters` | Array | `[]` | Array of chapter IDs that are currently expanded |

### Computed Properties

| Property | Description |
|----------|-------------|
| `chapterWithElements` | Maps chapters with their full element objects (not just IDs) |
| `buttonText` | Returns appropriate button text: "Get Course Free", "Buy Now", or "Request Now" |
| `expirationText` | Returns expiration info: calculated date, fixed date, or "Lifetime Access" |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `getElementById(id)` | `id: String` | Finds and returns an element from `course.elements` by ID |
| `formatTime(time)` | `time: Object` | Formats `{ minutes, seconds }` to "MM:SS" string |
| `toggleChapter(id)` | `id: String` | Toggles chapter accordion open/closed state |
| `openVideoModal(url)` | `url: String` | Opens video modal and starts playback |
| `closeModal()` | - | Closes modal and stops video playback |
| `calculateExpirationDate()` | - | Calculates expiration date based on months from now |
| `formatDate(timestamp)` | `timestamp: String/Number` | Formats timestamp to locale date string |

### Page Sections

1. **Breadcrumb** - Navigation showing "Courses List / Course Name"
2. **Cover Image** - Full-width course cover image
3. **Layout Container** - Two-column grid (main content + price card)
4. **Header** - Course logo and name in a card
5. **Description** - Course description section
6. **Curriculum** - Accordion chapters with lessons:
   - If `course.chapters` exists: Show chapters with nested elements
   - If no chapters: Show single "Course Content" accordion with all elements
   - Each lesson shows: type icon, title, duration, and lock/preview button
7. **Price Card** (sticky sidebar):
   - Price display (with strikethrough for promo)
   - Course info rows (lessons count, language)
   - Buy/Request button (links to payment page)
   - Expiration text
8. **Video Modal** - Overlay with video player for free previews

### Available translations (Use what you need)

- `courses-page.courses-list` → "Courses List"
- `courses-page.course-description` → "Course Description"
- `courses-page.course-content` → "Course Content"
- `courses-page.free` → "Free"
- `courses-page.lessons` → "Lessons"
- `courses-page.language` → "Language"
- `courses-page.english` → "English"
- `courses-page.buy-now` → "Buy Now"
- `courses-page.request-now` → "Request Now"
- `courses-page.get-course-free` → "Get Course Free"
- `courses-page.expires-on` → "Expires on"
- `courses-page.lifetime-access` → "Lifetime Access"
- `courses-page.featured-course` → "Featured Course"
- `courses-page.certificate` → "Certificate"
- `courses-page.chapters` → "chapters"
- `courses-page.preview` → "Preview"
- `courses-page.included` → "Included"
- `courses-page.free-preview` → "Free Preview"
- `courses-page.secure-payment` → "Secure Payment"
- `courses-page.money-back-guarantee` → "Money Back Guarantee"

If you want another text, just put it in English.

### Special URL Patterns

| Pattern | Description |
|---------|-------------|
| `@PV/courses/courses` | Link to courses list page (router-link) |
| `@PVP/course-payment/{id}` | Link to payment page (opens in new tab) |

### Example Student Course Detail Page:
```js
module.exports = {
  name: "CourseDetail",
  props: [
    'course',
    'courseId',
    'onlineMode',
    'offlineMode',
    'primaryColor',
  ],
  template: /* html */`
  <div class="course-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="@PV/courses/courses">{{ $t('courses-page.courses-list') }}</router-link>
      <span :style="{ color: primaryColor }">{{ course.name }}</span>
    </nav>

    <!-- Cover -->
    <img :src="course.cover?.path" alt="" class="cover-img" />

    <!-- Layout -->
    <div class="layout">
      <!-- Main -->
      <div class="main">
        <header class="header">
          <img :src="course.logo?.path" :alt="course.name" class="logo" />
          <h1>{{ course.name }}</h1>
        </header>

        <section class="description">
          <h2>{{ $t('courses-page.course-description') }}</h2>
          <p>{{ course.description }}</p>
        </section>

        <!-- Curriculum -->
        <section class="curriculum">
          <template v-if="course.chapters?.length > 0">
            <div v-for="chapter in chapterWithElements" :key="chapter.id" class="chapter">
              <div class="chapter-head" @click="toggleChapter(chapter.id)">
                <span>{{ chapter.title }}</span>
                <span>{{ openChapters.includes(chapter.id) ? '−' : '+' }}</span>
              </div>
              <div v-if="openChapters.includes(chapter.id)" class="lessons">
                <div v-for="elId in chapter.elementsIds" :key="elId" class="lesson">
                  <div class="lesson-left">
                    <v-icon v-if="getElementById(elId).type == 'quiz'">mdi-clipboard-text-outline</v-icon>
                    <v-icon v-else-if="getElementById(elId).type == 'youtube'">mdi-youtube</v-icon>
                    <v-icon v-else-if="getElementById(elId).type == 'video'">mdi-youtube</v-icon>
                    <v-icon v-else-if="getElementById(elId).type == 'pdf'">mdi-file-pdf-box</v-icon>
                    <v-icon v-else-if="getElementById(elId).type == 'iframe'">mdi-picture-in-picture-bottom-right-outline</v-icon>
                    <v-icon v-else>mdi-file</v-icon>
                    <span>{{ getElementById(elId).title }}</span>
                  </div>
                  <div class="lesson-right">
                    <span class="duration">{{ formatTime(getElementById(elId).time) }}</span>
                    <button v-if="getElementById(elId).freePreview" class="play-btn" @click="openVideoModal(getElementById(elId).content?.path)">
                      <v-icon small>mdi-play-circle</v-icon>
                    </button>
                    <v-icon v-else small color="#999">mdi-lock</v-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="chapter">
              <div class="chapter-head" @click="toggleChapter('default')">
                <span>{{ $t('courses-page.course-content') }}</span>
                <span>{{ openChapters.includes('default') ? '−' : '+' }}</span>
              </div>
              <div v-if="openChapters.includes('default')" class="lessons">
                <div v-for="el in course.elements" :key="el.id" class="lesson">
                  <div class="lesson-left">
                    <v-icon small>mdi-play-circle</v-icon>
                    <span>{{ el.title }}</span>
                  </div>
                  <div class="lesson-right">
                    <span class="duration">{{ formatTime(el.time) }}</span>
                    <button v-if="el.freePreview" class="play-btn" @click="openVideoModal(el.content?.path)">
                      <v-icon small>mdi-play</v-icon>
                    </button>
                    <v-icon v-else small color="#999">mdi-lock</v-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </section>
      </div>

      <!-- Price Card -->
      <div class="price-card-container">
        <div class="price-card">
          <div class="price">
            <span v-if="course.promo" class="old-price">{{ course.barredPrice }} dt</span>
            <span class="current-price">{{ course.price === '0' ? $t('courses-page.free') : course.price + ' dt' }}</span>
          </div>
          <div class="info-container">
            <div class="info-row">
              <v-icon small :color="primaryColor">mdi-file-document-outline</v-icon>
              <span>{{ $t('courses-page.lessons') }}</span>
              <span>{{ course.elements?.length || 0 }}</span>
            </div>
            <div class="info-row">
              <v-icon small :color="primaryColor">mdi-translate</v-icon>
              <span>{{ $t('courses-page.language') }}</span>
              <span>{{ $t('courses-page.english') }}</span>
            </div>
          </div>
          <a :href="'@PVP/course-payment/' + course.id" target="_blank" class="buy-btn" :style="{ backgroundColor: primaryColor }">
            {{ buttonText }}
          </a>
          <p class="expiry">{{ expirationText }}</p>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-box" @click.stop>
        <button class="close-btn" @click="closeModal">✕</button>
        <video ref="videoPlayer" controls class="video">
          <source :src="modalVideoUrl" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
  `,
  data: /* js */`
    function() {
      return {
        showModal: false,
        modalVideoUrl: '',
        openChapters: []
      };
    }
  `,
  computed: /* js */`
    {
      chapterWithElements() {
        if (!this.course.chapters) return [];
        return this.course.chapters.map(ch => ({
          ...ch,
          elements: ch.elementsIds.map(id => this.getElementById(id))
        }));
      },
      buttonText() {
        if (this.course.price === "0") return this.$t('courses-page.get-course-free');
        return this.onlineMode ? this.$t('courses-page.buy-now') : this.$t('courses-page.request-now');
      },
      expirationText() {
        if (this.course.expirationType === 'in-months') {
          return this.$t('courses-page.expires-on') + ' : ' + this.calculateExpirationDate();
        }
        if (this.course.expirationType === 'fixed-date' && this.course.expirationDate) {
          return this.$t('courses-page.expires-on') + ' : ' + this.formatDate(this.course.expirationDate);
        }
        return this.$t('courses-page.lifetime-access');
      }
    }
  `,
  mounted: /* js */`
    function() {
      if (this.course.chapters?.length > 0) {
        this.openChapters.push(this.course.chapters[0].id);
      } else {
        this.openChapters.push('default');
      }
    }
  `,
  methods: /* js */`
    {
      getElementById(id) {
        return this.course.elements?.find(el => el.id === id) || {};
      },
      formatTime(time) {
        if (!time) return '';
        const m = time.minutes || 0;
        const s = time.seconds || 0;
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
      },
      toggleChapter(id) {
        const idx = this.openChapters.indexOf(id);
        idx > -1 ? this.openChapters.splice(idx, 1) : this.openChapters.push(id);
      },
      openVideoModal(url) {
        this.modalVideoUrl = url;
        this.showModal = true;
        this.$nextTick(() => this.$refs.videoPlayer?.play());
      },
      closeModal() {
        this.showModal = false;
        this.modalVideoUrl = '';
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.pause();
          this.$refs.videoPlayer.currentTime = 0;
        }
      },
      calculateExpirationDate() {
        const months = parseInt(this.course.expirationMonthsCount) || 0;
        const ts = Date.now() + months * 2629746 * 1000;
        return new Date(ts).toLocaleDateString('fr-FR');
      },
      formatDate(timestamp) {
        if (!timestamp) return '';
        const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
        return new Date(ts).toLocaleDateString('fr-FR');
      }
    }
  `,
  style: /* css */`
  .course-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Breadcrumb */
  .course-detail .breadcrumb {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .course-detail .breadcrumb a {
    color: #333;
    text-decoration: none;
  }
  .course-detail .breadcrumb a::after {
    content: "/";
    margin-left: 8px;
    color: #999;
  }

  /* Cover */
  .course-detail .cover-img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: -20px;
  }

  /* Layout */
  .course-detail .layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
  }

  /* Header */
  .course-detail .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .course-detail .logo {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
  }
  .course-detail .header h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }

  /* Description */
  .course-detail .description {
    margin-bottom: 32px;
  }
  .course-detail .description h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px;
    color: #333;
  }
  .course-detail .description p {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }

  /* Curriculum */
  .course-detail .chapter {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  .course-detail .chapter-head {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
    background: #f8f8f8;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }
  .course-detail .chapter-head:hover {
    background: #f0f0f0;
  }
  .course-detail .lessons {
    background: #fff;
  }
  .course-detail .lesson {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
  }
  .course-detail .lesson-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
  }
  .course-detail .lesson-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .course-detail .duration {
    font-size: 12px;
    color: #888;
  }
  .course-detail .play-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #007bff;
  }

  /* Price Card */
  .course-detail .price-card-container {
    position: sticky;
    top: 20px;
    height: fit-content;
  }
  .course-detail .price-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }
  .course-detail .price {
    text-align: center;
    margin-bottom: 20px;
  }
  .course-detail .old-price {
    display: block;
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 4px;
  }
  .course-detail .current-price {
    font-size: 28px;
    font-weight: 700;
    color: #333;
  }
  .course-detail .info-container {
    margin-bottom: 20px;
  }
  .course-detail .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    color: #666;
  }
  .course-detail .info-row span:nth-child(2) {
    flex: 1;
  }
  .course-detail .info-row span:last-child {
    font-weight: 500;
    color: #333;
  }
  .course-detail .buy-btn {
    display: block;
    width: 100%;
    padding: 14px;
    text-align: center;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 12px;
    transition: opacity 0.2s;
  }
  .course-detail .buy-btn:hover {
    opacity: 0.9;
  }
  .course-detail .expiry {
    font-size: 12px;
    color: #888;
    text-align: center;
    margin: 0;
  }

  /* Modal */
  .course-detail .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .course-detail .modal-box {
    background: #fff;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    overflow: hidden;
    position: relative;
  }
  .course-detail .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0,0,0,0.5);
    color: #fff;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    z-index: 10;
  }
  .course-detail .video {
    width: 100%;
    display: block;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .course-detail .layout {
      grid-template-columns: 1fr;
    }
    .course-detail .price-card-container {
      position: static;
      order: -1;
    }
    .course-detail .cover-img {
      height: 200px;
    }
  }
  @media (max-width: 480px) {
    .course-detail {
      padding: 12px;
    }
    .course-detail .header h1 {
      font-size: 20px;
    }
    .course-detail .lesson {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .course-detail .lesson-right {
      align-self: flex-end;
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