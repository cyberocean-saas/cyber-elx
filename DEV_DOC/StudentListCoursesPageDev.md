# CyberOcean Custom Student List Courses Page

## Summary

- [CyberOcean Custom Student List Courses Page](#cyberocean-custom-student-list-courses-page)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Student List Courses Page](#student-list-courses-page)
    - [Component Structure](#component-structure)
    - [Project Colors (Required)](#project-colors-required)
    - [Available Props](#available-props)
    - [allCategories Array](#allcategories-array)
    - [coursesList / promotedCourses Arrays](#courseslist--promotedcourses-arrays)
    - [Local State (data)](#local-state-data)
    - [Computed Properties](#computed-properties)
    - [Methods](#methods)
    - [Page Sections](#page-sections)
    - [Events to Emit](#events-to-emit)
    - [Available translations (Use what you need)](#available-translations-use-what-you-need)
    - [Example Student List Courses Page:](#example-student-list-courses-page)
  - [Vue Component Format](#vue-component-format)
    - [Basic Structure](#basic-structure)
    - [Available Fields](#available-fields)
    - [Key Rules](#key-rules)
    - [Minimal Example](#minimal-example)

## Overview

The Student List Courses Page displays available courses for students to browse and purchase. It shows categories, featured courses, and promoted courses with a slider. This is the course catalog/store page within the student dashboard.

**IMPORTANT:** You will only handle UI and styles, all logic and functionality is handled by the parent component.

**Key Features:**
- Categories grid with clickable cards to filter courses
- Featured courses grid with flip-card hover effect
- Promoted courses horizontal slider with navigation
- Responsive design (1-4 columns based on screen size)
- Empty state when no categories are assigned (grade system)
- Price display with promo/barred price support
- Primary color theming via Vuex store

## Student List Courses Page

The page displays:
1. **Empty State** - Message when no categories are available (grade not assigned)
2. **Categories Section** - Grid of category cards for filtering
3. **Courses List Section** - Grid of featured course cards
4. **Promoted Courses Section** - Horizontal slider of courses on promotion

### Component Structure

The component must export a module with:
- `name` - Component name (`"CoursesList"`)
- `props` - Required props (array or object format)
- `template` - HTML template string
- `style` - CSS styles string
- `data` - Local state for slider (currentSlide, slideWidth, slidesToShow)
- `computed` - Computed properties (primaryColor, maxSlides)
- `methods` - Navigation and utility methods
- `mounted` - Initialize slider width and resize listener
- `beforeDestroy` - Clean up resize listener

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `allCategories` | Array | List of available categories (see below) |
| `coursesList` | Array | List of featured courses (see below) |
| `promotedCourses` | Array | List of courses on promotion (same structure as coursesList) |

### allCategories Array

Each category object contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Category ID |
| `name` | String | Category name |
| `parentId` | String/null | Parent category ID (null for root categories) |
| `logo.path` | String | Path to category image |

### coursesList / promotedCourses Arrays

Each course object contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Course ID |
| `name` | String | Course name |
| `description` | String | Course description |
| `logo.path` | String | Path to course cover image |
| `price` | String | Course price (`"0"` if free) |
| `barredPrice` | String | Original price before discount |
| `promo` | Boolean | Whether course is on promotion |
| `elements` | Array | Course elements (for counting lessons) |

### Local State (data)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `currentSlide` | Number | 0 | Current slide index in promo slider |
| `slideWidth` | Number | 320 | Width of each slide in pixels |
| `slidesToShow` | Number | 4 | Number of visible slides (responsive) |

### Computed Properties

| Property | Description |
|----------|-------------|
| `primaryColor` | Gets primary color from Vuex store: `$nuxt.$store.state.shop.settings?.["el-x.primary_color"]?.value` |
| `maxSlides` | Maximum slide index for navigation: `promotedCourses.length - slidesToShow` |

### Methods

| Method | Description |
|--------|-------------|
| `goToCourse(courseId)` | Navigate to course detail page: `this.$router.push("/p/el-x/courses/" + courseId)` |
| `nextSlide()` | Move to next slide (loops to start) |
| `previousSlide()` | Move to previous slide (loops to end) |
| `updateSlideWidth()` | Recalculate slide width and slidesToShow based on viewport |

### Page Sections

1. **Empty State** - Shown when `allCategories.length === 0` (no grade assigned)
2. **Categories Section** - Grid of category cards
   - Clicking a category emits `loadCoursesByCategoryId` event
   - Parent categories styled differently via `is-parent` class
3. **Courses List Section** - Grid of course cards with:
   - Front: Image, title, lesson count, price
   - Back (on hover): Title, description, "Go to course" button
4. **Promoted Courses Slider** - Horizontal carousel with:
   - Previous/Next navigation buttons
   - Responsive slides (1-4 based on screen width)
   - Same card design as courses grid

### Events to Emit

| Event | When to Emit | Description |
|-------|--------------|-------------|
| `loadCoursesByCategoryId` | Category card click | Filter courses by category: `$emit('loadCoursesByCategoryId', category.id)` |

### Available translations (Use what you need)

`courses-page.no-grade-assigned` -> You are not assigned to any grade yet!
`courses-page.explore-the` -> Explore the
`courses-page.categories` -> Categories
`courses-page.featured-courses` -> Featured courses
`courses-page.explore-featured-courses` -> featured courses
`courses-page.courses-on-promotion` -> Courses on promotion
`courses-page.courses` -> Courses
`courses-page.on-promotion` -> on promotion
`courses-page.courses-list` -> Courses List
`courses-page.course-description` -> Course Description
`courses-page.course-content` -> Course Content
`courses-page.free` -> FREE
`courses-page.lessons` -> Lessons
`courses-page.language` -> Language
`courses-page.english` -> English
`courses-page.get-course-free` -> Get the course for free
`courses-page.buy-now` -> Buy now
`courses-page.request-now` -> Request now
`courses-page.expires-on` -> Expires on
`courses-page.lifetime-access` -> Lifetime access
`courses-page.featured-course` -> Featured Course
`courses-page.certificate` -> Certificate
`courses-page.chapters` -> chapters
`courses-page.preview` -> Preview
`courses-page.included` -> Included
`courses-page.free-preview` -> Free Preview
`courses-page.secure-payment` -> Secure Payment
`courses-page.money-back-guarantee` -> Money Back Guarantee
`courses-page.ready-to-learn` -> Ready to learn?
`courses-page.start` -> Start
`courses-page.promo` -> PROMO
`courses-page.hot-deal` -> HOT DEAL
- If you want another text, just put it in English

### Example Student List Courses Page:
```js
module.exports = {
  name: "CoursesList",
  props: [
    'allCategories',
    'coursesList',
    'promotedCourses',
  ],
  template: /* html */`
    <div class="courses-list-page">
      <!-- Empty State -->
      <h1 class="empty-state" v-if="!allCategories.length">
        {{ $t('courses-page.no-grade-assigned') }}
      </h1>

      <!-- Categories Section -->
      <section v-if="allCategories?.length > 0" class="categories-section">
        <h2 class="section-title">
          {{ $t('courses-page.explore-the') }}
          <span>{{ $t('courses-page.categories') }}</span>
        </h2>
        <div class="categories-grid">
          <div
            v-for="category in allCategories"
            :key="category.id"
            class="category-card"
            :class="{ 'is-parent': !category.parentId || category.parentId === '' }"
            @click="$emit('loadCoursesByCategoryId', category.id)"
          >
            <img :src="category.logo?.path" alt="" class="category-img" />
            <h5 class="category-name">{{ category.name }}</h5>
          </div>
        </div>
      </section>

      <!-- Courses List Section -->
      <section v-if="coursesList?.length > 0" class="courses-section">
        <div class="section-header">
          <span class="section-subtitle">{{ $t('courses-page.featured-courses') }}</span>
          <h2 class="section-title">
            {{ $t('courses-page.explore-the') }}
            <span>{{ $t('courses-page.explore-featured-courses') }}</span>
          </h2>
        </div>
        <div class="courses-grid">
          <div v-for="course in coursesList" :key="course.id" class="course-card" @click="goToCourse(course.id)">
            <div class="course-card-front">
              <div class="course-image">
                <img :src="course.logo?.path" :alt="course.name" />
              </div>
              <div class="course-info">
                <h3 class="course-title">{{ course.name }}</h3>
                <div class="course-meta">
                  <span class="course-stat">📚 {{ course.elements?.length || 'N/A' }}</span>
                  <div class="course-price">
                    <span v-if="course.promo && course.barredPrice" class="price-original" :style="{ color: primaryColor }">{{ course.barredPrice }} dt</span>
                    <span class="price-current" :style="course.price !== '0' ? { color: primaryColor } : {}">{{ course.price === '0' ? 'GRATUIT' : course.price + ' dt' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="course-card-back">
              <h3 class="course-hover-title">{{ course.name }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <button class="course-btn" :style="{ backgroundColor: primaryColor }">Aller au cours</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Promoted Courses Slider -->
      <section v-if="promotedCourses?.length > 0" class="promo-section">
        <div class="promo-header">
          <div>
            <span class="section-subtitle">{{ $t('courses-page.courses-on-promotion') }}</span>
            <h2 class="section-title">
              {{ $t('courses-page.courses') }}
              <span>{{ $t('courses-page.on-promotion') }}</span>
            </h2>
          </div>
          <div class="slider-nav">
            <button class="nav-btn" @click="previousSlide">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M15 8H1M8 1L1 8L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="nav-btn" @click="nextSlide">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8H15M8 1L15 8L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="slider-container">
          <div class="slider-track" :style="{ transform: 'translateX(-' + currentSlide * slideWidth + 'px)' }">
            <div v-for="course in promotedCourses" :key="course.id" class="slide-item">
              <div class="course-card" @click="goToCourse(course.id)">
                <div class="course-card-front">
                  <div class="course-image">
                    <img :src="course.logo?.path" :alt="course.name" />
                  </div>
                  <div class="course-info">
                    <h3 class="course-title">{{ course.name }}</h3>
                    <div class="course-meta">
                      <span class="course-stat">📚 {{ course.elements?.length || 'N/A' }}</span>
                      <div class="course-price">
                        <span v-if="course.promo && course.barredPrice" class="price-original" :style="{ color: primaryColor }">{{ course.barredPrice }} dt</span>
                        <span class="price-current" :style="course.price !== '0' ? { color: primaryColor } : {}">{{ course.price === '0' ? 'GRATUIT' : course.price + ' dt' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="course-card-back">
                  <h3 class="course-hover-title">{{ course.name }}</h3>
                  <p class="course-description">{{ course.description }}</p>
                  <button class="course-btn" :style="{ backgroundColor: primaryColor }">Aller au cours</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  data: /* js */`
    function() {
      return {
        currentSlide: 0,
        slideWidth: 320,
        slidesToShow: 4
      };
    }
  `,
  mounted: /* js */`
    function() {
      this.$nextTick(() => {
        this.updateSlideWidth();
        window.addEventListener("resize", this.updateSlideWidth);
      });
    }
  `,
  beforeDestroy: /* js */`
    function() {
      window.removeEventListener("resize", this.updateSlideWidth);
    }
  `,
  computed: /* js */`
    {
      primaryColor() {
        return $nuxt.$store.state.shop.settings?.["el-x.primary_color"]?.value || "#ff6b35";
      },
      maxSlides() {
        return Math.max(0, (this.promotedCourses?.length || 0) - this.slidesToShow);
      }
    }
  `,
  methods: /* js */`
    {
      goToCourse(courseId) {
        this.$router.push("/p/el-x/courses/" + courseId);
      },
      nextSlide() {
        this.currentSlide = this.currentSlide < this.maxSlides ? this.currentSlide + 1 : 0;
      },
      previousSlide() {
        this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.maxSlides;
      },
      updateSlideWidth() {
        const container = document.querySelector(".slider-container");
        const containerWidth = container?.offsetWidth || 1200;
        if (window.innerWidth <= 768) {
          this.slidesToShow = 1;
        } else if (window.innerWidth <= 992) {
          this.slidesToShow = 2;
        } else if (window.innerWidth <= 1200) {
          this.slidesToShow = 3;
        } else {
          this.slidesToShow = 4;
        }
        this.slideWidth = containerWidth / this.slidesToShow;
      }
    }
  `,
  style: /* css */`
  .courses-list-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Empty State */
  .courses-list-page .empty-state {
    text-align: center;
    margin-top: 20%;
    font-weight: 300;
    font-size: 24px;
    color: #666;
  }

  /* Section Styles */
  .courses-list-page .section-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .courses-list-page .section-title span {
    color: var(--v-primary-base, #d2093c);
  }

  .courses-list-page .section-subtitle {
    display: inline-block;
    color: #d2093c;
    font-size: 14px;
    font-weight: 500;
    background: rgba(210, 9, 60, 0.08);
    padding: 8px 16px;
    margin-bottom: 8px;
    border-left: 2px solid #d2093c;
  }

  .courses-list-page .section-header {
    text-align: center;
    margin-bottom: 40px;
  }

  /* Categories Section */
  .courses-list-page .categories-section {
    text-align: center;
    padding: 40px 0;
  }

  .courses-list-page .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .courses-list-page .category-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .courses-list-page .category-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .courses-list-page .category-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .courses-list-page .category-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  /* Courses Section */
  .courses-list-page .courses-section {
    padding: 60px 0;
  }

  .courses-list-page .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  /* Promo Section */
  .courses-list-page .promo-section {
    padding: 60px 0;
    background: #f9f9f9;
    margin: 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .courses-list-page .promo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .courses-list-page .slider-nav {
    display: flex;
    gap: 10px;
  }

  .courses-list-page .nav-btn {
    width: 44px;
    height: 44px;
    border: none;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .courses-list-page .nav-btn:hover {
    background: var(--v-primary-base, #d2093c);
    color: #fff;
  }

  .courses-list-page .slider-container {
    overflow: hidden;
  }

  .courses-list-page .slider-track {
    display: flex;
    transition: transform 0.3s ease;
  }

  .courses-list-page .slide-item {
    flex: 0 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .slide-item {
      width:100%;
      margin-right: 0
    }
  }

  @media (min-width: 769px) and (max-width:992px) {
    .slide-item {
      width:calc(50% - 10px)
    }
  }

  @media (min-width: 993px) and (max-width:1200px) {
    .slide-item {
      width:calc(33.333% - 14px)
    }
  }

  @media (min-width: 1201px) {
    .slide-item {
      width:calc(25% - 15px)
    }
  }

  /* Course Card */
  .courses-list-page .course-card {
    position: relative;
    height: 350px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    background: #fff;
    cursor: pointer;
  }

  .courses-list-page .course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .courses-list-page .course-card-front {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .courses-list-page .course-card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .courses-list-page .course-card:hover .course-card-front {
    display: none;
  }

  .courses-list-page .course-card:hover .course-card-back {
    opacity: 1;
  }

  .courses-list-page .course-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    padding: 15px;
  }

  .courses-list-page .course-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .courses-list-page .course-card:hover .course-image img {
    transform: scale(1.05);
  }

  .courses-list-page .course-info {
    padding: 16px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .courses-list-page .course-info .course-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 12px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .courses-list-page .course-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 10px;
  }

  .courses-list-page .course-stat {
    color: #6c757d;
    font-size: 14px;
  }

  .courses-list-page .course-price {
    text-align: right;
  }

  .courses-list-page .price-original {
    text-decoration: line-through;
    color: #6c757d;
    font-size: 13px;
    margin-right: 6px;
  }

  .courses-list-page .price-current {
    font-weight: 600;
    font-size: 15px;
  }

  .courses-list-page .course-hover-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 12px 0;
  }

  .courses-list-page .course-description {
    font-size: 14px;
    line-height: 1.6;
    color: #6c757d;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }

  .courses-list-page .course-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .courses-list-page .course-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .courses-list-page .section-title {
      font-size: 24px;
    }

    .courses-list-page .promo-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .courses-list-page .categories-grid,
    .courses-list-page .courses-grid {
      grid-template-columns: 1fr;
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