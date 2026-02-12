# CyberOcean Custom Student Course Player

## Summary

This document describes how to customize the **Student Course Player** using a Vue.js component. The player is a two-panel layout with a sidebar (course info, files, chapters) and a viewer area (video player or slot for other content types). It supports mobile responsiveness, progress tracking, downloadable course files, and RTL for Arabic locales.

> **IMPORTANT:** Your custom component handles **UI and styles only**. All logic and functionality (progress saving, quiz handling, PDF rendering) are handled by the parent component. The parent uses a **slot** to render non-video elements.

## Overview

The Student Course Player is rendered when a student opens a course they are enrolled in. The parent component provides the user and course data. Your custom component receives these as props and renders the UI. For non-video elements (quiz, pdf, iframe, youtube), your component must provide a **named slot** that the parent will fill with the appropriate viewer.

**Key Features:**
- **Two-panel layout** - Sidebar with course info/chapters + Viewer for content
- **Mobile responsive** - Sidebar and player toggle on mobile (< 900px)
- **Course card** - Logo and name display
- **Description/Files tabs** - Toggle between course description and downloadable files
- **Accordion chapters** - Expandable chapters with element list
- **Element type icons** - Different icons for video, quiz, pdf, iframe, youtube
- **Progress tracking** - Green icons for completed elements via `course.progressData`
- **Video viewer** - Native HTML5 video player with custom styling
- **Element viewer slot** - Named slot for parent to render non-video content
- **RTL support** - Layout adjustment for Arabic locale

## Student Course Player

### Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ .course-player                                                  │
│ ┌──────────────────┬────────────────────────────────────────────┤
│ │ .course-sidebar  │ .course-viewer                             │
│ │                  │ ┌────────────────────────────────────────┐ │
│ │ [Course Card]    │ │ .course-viewer-mobile-title            │ │
│ │ Logo + Name      │ │ (Chapter/Course name + back button)    │ │
│ │                  │ ├────────────────────────────────────────┤ │
│ │ [Tabs]           │ │ .course-viewer-title                   │ │
│ │ Description|Files│ │ (Current element title)                │ │
│ │                  │ ├────────────────────────────────────────┤ │
│ │ [Tab Content]    │ │ <video> or <slot name="elementViewer"> │ │
│ │ Desc or Files    │ │                                        │ │
│ │                  │ │                                        │ │
│ │ [Chapters]       │ │                                        │ │
│ │ ▼ Chapter 1      │ │                                        │ │
│ │   ● Lesson 1     │ │                                        │ │
│ │   ○ Lesson 2     │ │                                        │ │
│ │ ▶ Chapter 2      │ │                                        │ │
│ └──────────────────┴────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

### Available Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | Object | The current logged-in user object (see structure below) |
| `course` | Object | The course object with chapters, elements, files, and progress (see structure below) |

### The `user` Object

```js
{
  id: "user-id",
  name: "John Doe",
  email: "john@example.com",
  customer_locale: "en"  // "en", "fr", "ar" - used for RTL detection
}
```

### The `course` Object

```js
{
  name: "Course Name",
  description: "Course description text...",
  logo: { path: "/uploads/logo.jpg" },
  chaptersEnabled: true,                    // Whether chapters mode is enabled
  files: [                                  // Downloadable course files
    {
      name: "resource.pdf",
      path: "/uploads/resource.pdf",
      size: 1048576                         // Size in bytes
    }
  ],
  chapters: [                               // Array of chapters
    {
      title: "Chapter 1: Introduction",     // Or "i18n:key" for translation
      elements: [                           // Array of elements in this chapter
        {
          id: "el-1",
          title: "Welcome Video",
          type: "video",                    // "video", "quiz", "pdf", "iframe", "youtube", "video-iframe"
          content: { path: "/uploads/video.mp4" }
        }
      ]
    }
  ],
  progressData: {                           // Progress tracking (element ID → completed)
    "el-1": true,
    "el-2": false
  }
}
```

### Element Types

| Type | Icon | Description |
|------|------|-------------|
| `video` | Play circle SVG | Uploaded video file (rendered by your component) |
| `youtube` | Play circle SVG | YouTube video (rendered by parent via slot) |
| `video-iframe` | Play circle SVG | Video in iframe (rendered by parent via slot) |
| `quiz` | `mdi-help-box-multiple` | Quiz/assessment (rendered by parent via slot) |
| `pdf` | `mdi-note` | PDF document (rendered by parent via slot) |
| `iframe` | `mdi-text-box` | Embedded iframe content (rendered by parent via slot) |
| (other) | `mdi-card` | Default icon for unknown types |

### Local State (data)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isNotMobile` | Boolean | `true` | Whether screen width > 900px |
| `courseDetailsCard` | String | `"description"` | Active tab: `"description"` or `"files"` |
| `currentMobileView` | String | `"sidebar"` | Mobile view: `"sidebar"` or `"player"` |
| `widthListener` | Function | `null` | Reference to resize event listener |
| `currentChapter` | Object | `null` | Currently selected chapter |
| `currentElement` | Object | `null` | Currently selected element |
| `selectedElement` | Object | `null` | Selected element for v-model binding |
| `activePanel` | Number | `0` | Index of open accordion panel (first chapter) |

### Computed Properties

| Property | Description |
|----------|-------------|
| `coursePageStyle` | Returns transform style for RTL support (Arabic locale shifts layout) |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `onElementSelect(chapter, element)` | `chapter: Object, element: Object` | Handles element selection, updates current chapter/element, switches to player view on mobile |
| `bytesToHumanReadableSize(bytes)` | `bytes: Number` | Converts bytes to human-readable format (KB, MB, GB) |
| `downloadFile(path)` | `path: String` | Opens file URL in new tab for download |
| `capitalizeText(str)` | `str: String` | Capitalizes first letter of each word |
| `translateTitle(title)` | `title: String` | Translates title if it starts with `i18n:`, otherwise capitalizes |
| `defaultSelectFirstElement()` | - | Sets first element of first chapter as default selection |

### Page Sections

1. **Sidebar** (`.course-sidebar`)
   - **Course Card** - Logo image and course name
   - **Tab Buttons** - Toggle between Description and Files
   - **Description Panel** - Shows `course.description`
   - **Files Panel** - List of downloadable files with name, size, and download on click
   - **Chapters Accordion** - Expandable panels for each chapter with element list

2. **Viewer** (`.course-viewer`)
   - **Mobile Title Bar** - Chapter/course name with back button (mobile only)
   - **Element Title** - Current element title
   - **Video Viewer** - Native `<video>` element for video type elements
   - **Element Viewer Slot** - Named slot for parent to render other element types

### The Element Viewer Slot

This is **critical** for the component to work properly. The parent component uses this slot to render non-video elements:

```html
<slot v-else name="elementViewer" :element="currentElement"></slot>
```

**How it works:**
1. When `currentElement.type === 'video'`, your component renders the `<video>` element
2. For all other types (quiz, pdf, iframe, youtube, video-iframe), the slot is rendered
3. The parent fills this slot with the appropriate viewer (quiz component, PDF viewer, iframe, etc.)
4. The `element` is passed as a slot prop so the parent knows which element to render

**You must include this slot** in your template for non-video content to display.

### Events to Emit

| Event | When to Emit | Payload | Description |
|-------|--------------|---------|-------------|
| `onElementComplete` | When video is clicked or touched | `currentElement` | Notifies parent that element should be marked as complete |

**Example:**
```html
<video
  @click="$emit('onElementComplete', currentElement)"
  @touchstart="$emit('onElementComplete', currentElement)"
>
</video>
```

### Special URL Patterns

| Pattern | Description |
|---------|-------------|
| `@PS/images/video-poster.png` | Path to static assets (video poster image) |

### Available translations (Use what you need)

- `course-player.description` → "Description"
- `course-player.files` → "Files"
- `course-player.no-files-in-course` → "No files in this course"
- `course-player.content` → "Content"
- `course-player.awesome` → "Awesome!"
- `course-player.xp-earned` → "XP earned"
- `course-player.continue` → "Continue"
- `course-player.xp` → "XP"
- `course-player.course-progress` → "Course Progress"
- `course-player.lessons` → "lessons"
- `course-player.unit` → "UNIT"
- `course-player.tap-to-start` → "Tap to start learning"
- `course-player.finish` → "Finish"
- `course-player.course-resources` → "Course Resources"

If you want another text, just put it in English.

### Chapter Title Translation

Chapter titles can use the `i18n:` prefix for translation:
```js
{
  title: "i18n:chapter-one.title"  // Will call $t('chapter-one.title')
}
```

Regular titles are capitalized automatically.

### Example Student Course Player:
```js
module.exports = {
  name: "CoursePlayer",
  props: [
    'user',
    'course',
  ],
  template: /* html */`
  <div class="course-player" :style="coursePageStyle">
    <div class="d-flex course-page-container" style="background-color: #121523;">
      <!-- Sidebar for Chapters -->
      <div v-show="isNotMobile || currentMobileView == 'sidebar'" class="course-sidebar" :style="isNotMobile ? '' : 'width: 100% !important;'">
        <!-- COURSE CARD -->
        <div class="course-sidebar-heading" style="border: 2px solid #323851; border-radius: 7px; padding: 5px 10px; text-align: center;">
          <img
            :src="course.logo ? course.logo.path : '/images/placeholder.png'"
            alt="Course Logo"
            style="width: 100%; height: 80px; object-fit: contain;"
          />
          <span style="color: white; font-weight: 300; font-size: 20px;">{{ course.name }}</span>
        </div>
        <!-- COURSE DETAILS CARD -->
        <div class="course-sidebar-buttons" style="background-color: #323851; border-radius: 7px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; margin-top: 5px; height: 30px; color: white; display: flex; padding: 0px 20px; padding-top: 1px;">
          <span @click="courseDetailsCard = 'description'" class="opacity-pointer-on-hover course-sidebar-button-description" style="width: 50%; display: flex; align-items: center; justify-content: center; gap: 5px;">
            <svg style="width: 15px; margin-top: -3px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {{ $t('course-player.description') }}
          </span>
          <span @click="courseDetailsCard = 'files'" class="opacity-pointer-on-hover course-sidebar-button-files" style="width: 50%; display: flex; align-items: center; justify-content: center; gap: 5px;">
            <svg style="width: 17px; margin-top: -3px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            {{ $t('course-player.files') }}
          </span>
        </div>
        <div class="course-sidebar-description" v-if="courseDetailsCard === 'description'" style="border: 2px solid rgb(50, 56, 81); border-radius: 7px; padding: 5px 10px; border-top-left-radius: 0px; border-top-right-radius: 0px; height: 200px; overflow: auto; text-align: center;">
          <span style="color: white; font-weight: 300; font-size: 14px;">{{ course.description }}</span>
        </div>
        <div class="course-sidebar-files" v-if="courseDetailsCard === 'files'" style="border: 2px solid rgb(50, 56, 81); border-radius: 7px; padding: 5px 10px; border-top-left-radius: 0px; border-top-right-radius: 0px; height: 200px; overflow: auto; text-align: center;">
          <div v-if="course.files.length == 0" style="color: #535c87; font-weight: 300; font-size: 16px; margin-top: 20px;">
            {{ $t('course-player.no-files-in-course') }}
          </div>
          <v-list style="background-color: #00000000;">
            <v-list-item 
              v-for="(file, index) in course.files" 
              :key="index" 
              style="height: fit-content; padding: 0px; border-bottom: 1px solid #282d45; margin-top: 7px;" 
              @click="downloadFile(file.path)">
              
              <!-- Left Part (Icon) -->
              <v-list-item-icon style="background-color: #00000000; width: 20px; height: 20px; margin: 10px 10px 0px 0px; justify-content: center; border-radius: 5px;">
                <svg style="width: 30px; color: white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </v-list-item-icon>
              
              <!-- Right Part (Name and Size) -->
              <v-list-item-content style="text-align: left; padding: 0px; margin: 0px; color: white;">
                <v-list-item-title style="font-size: 14px; font-weight: 400;">
                  {{ file.name }}
                </v-list-item-title>
                <v-list-item-subtitle style="color: white; font-weight: 200; font-size: 13px;">{{ bytesToHumanReadableSize(file.size) }}</v-list-item-subtitle>
              </v-list-item-content>
              
            </v-list-item>
          </v-list>
        </div>


        <!-- CHAPTERS -->
        <v-list dense style="background-color: #ff000000; margin-bottom: 50vh;" class="course-sidebar-chapters">
          <v-expansion-panels v-model="activePanel" accordion>
            <v-expansion-panel v-for="(chapter, index) in course.chapters" :key="index">
              <v-expansion-panel-header>
                {{ translateTitle(chapter.title) }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-content">
                <v-list-item-group v-model="selectedElement" @change="onElementSelect(chapter, $event)">
                  <v-list-item
                    v-for="(element, elIndex) in chapter.elements"
                    :key="elIndex"
                    :value="element"
                    style="border-bottom: 1px solid #ffffff0f;"
                  >
                    <v-list-item-content v-if="element.type == 'video'" style="font-size: 12px; color: white;">
                      <svg  :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                      </svg>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else-if="element.type == 'quiz'" style="font-size: 12px; color: white;" >
                      <v-icon :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px; color: white;font-size:18px ;" >mdi-help-box-multiple</v-icon>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else-if="element.type == 'pdf'" style="font-size: 12px; color: white;" >
                      <v-icon :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px; color: white;font-size:18px ;" >mdi-note</v-icon>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else-if="element.type == 'iframe'" style="font-size: 12px; color: white;" >
                      <v-icon :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px; color: white;font-size:18px ;" >mdi-text-box</v-icon>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else-if="element.type == 'youtube'" style="font-size: 12px; color: white;">
                      <svg  :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                      </svg>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else-if="element.type == 'video-iframe'" style="font-size: 12px; color: white;">
                      <svg  :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                      </svg>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                    <v-list-item-content v-else style="font-size: 12px; color: white;" >
                      <v-icon :style="(course.progressData[element.id]) ? 'color: #00dd04;' : ''" style="width: 19px; position: absolute; left: 7px; color: white;font-size:18px ;" >mdi-card</v-icon>
                      <span style="padding-left: 17px;">{{ capitalizeText(element.title) }}</span>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-list>

      </div>

      <!-- Viewer for Videos or Quiz -->
      <div v-show="isNotMobile || currentMobileView == 'player'" class="course-viewer">
        <div class="course-viewer-mobile-title" style="color: white; font-weight: 400; font-size: 20px; padding: 7px 10px 5px; background-color: #ffffff17;">
          <v-btn v-if="!isNotMobile" @click="currentMobileView = 'sidebar'" icon fav color="white" style="background-color: #ffffff24;">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span
            :style="isNotMobile ? '' : 'display: inline-block; transform: translateY(2px); margin-left: 10px;'"
          >
            {{
              course.chaptersEnabled ?
                (currentChapter ? capitalizeText(currentChapter.title) : '') :
                capitalizeText(course.name)
            }}
          </span>
        </div>
        <div class="course-viewer-title" style="height: 50px; background-color: black; color: white; font-weight: bold; font-size: 20px; padding: 10px 10px 5px;">
          {{ currentElement ? capitalizeText(currentElement.title) : '' }}
        </div>

        <!-- Video Viewer -->
        <video
          v-if="currentElement && currentElement.type === 'video'"
          controls
          controlslist="nodownload"
          class="video-viewer course-viewer-video"
          :src="currentElement ? currentElement.content.path : ''"
          poster="@PS/images/video-poster.png"
          @touchstart="$emit('onElementComplete', currentElement); $event.target.paused ? $event.target.play() : $event.target.pause()"
          @click="$emit('onElementComplete', currentElement);"
        >
        </video>
        <!-- Element Viewer SLOT -->
        <slot v-else name="elementViewer" :element="currentElement"></slot>

      </div>
    </div>
  </div>
  `,
  data: /* js */`
    function() {
      return {
        isNotMobile: true,
        courseDetailsCard: "description", // OR "files"
        currentMobileView: "sidebar",
        widthListener: null,
        currentChapter: null,
        currentElement: null,
        selectedElement: null, 
        activePanel: 0, // Open the first chapter by default
      };
    }
  `,
  computed: /* js */`
    {
      coursePageStyle() {
        const isArabic = this.user && this.user.customer_locale === 'ar';
        return {
          transform: isArabic ? 'translateX(40px)' : 'translateX(-40px)'
        };
      },
    }
  `,
  mounted: /* js */`
    function() {
      // Set default
      this.defaultSelectFirstElement();

      // Check if the screen is mobile
      this.isNotMobile = window.innerWidth > 900;
      this.widthListener = () => {
        this.isNotMobile = window.innerWidth > 900;
      };
      window.addEventListener("resize", this.widthListener);
    }
  `,
  beforeDestroy: /* js */`
    function() {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("resize", this.widthListener);
    }
  `,
  methods: /* js */`
    {
      onElementSelect(chapter, element) {
        if(!this.isNotMobile) {
          this.currentMobileView = 'player';
        }
        if (!element) {
          return;
        }
        if (element && element.id && this.currentElement && element.id == this.currentElement.id) {
          return;
        }
        this.currentElement = element;
        this.currentChapter = chapter;
      },
      bytesToHumanReadableSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      },
      downloadFile(path) {
        window.open(path, "_blank");
      },
      capitalizeText(str) {
        return (str || '').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      },
      translateTitle(title) {
        if (title && title.startsWith('i18n:')) {
          return this.$t(title.replace('i18n:', ''));
        }
        return this.capitalizeText(title);
      },
      defaultSelectFirstElement() {
        // Set default to first element of first chapter
        if (this.course.chapters.length > 0 && this.course.chapters[0].elements.length > 0) {
          this.selectedElement = this.course.chapters[0].elements[0];
          this.currentChapter = this.course.chapters[0];
          this.currentElement = this.selectedElement;
        }
      },
    }
  `,
  style: /* css */`
  .course-player {
    width: calc(100% + 80px);
    margin-top: -12px;
    height: calc(100vh - 76px);
  }

  .course-player .v-overlay--active {
    backdrop-filter: blur(8px);
  }
  .course-player .v-expansion-panel {
    background-color: #d7deff;
  }

  .course-player .opacity-pointer-on-hover:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  /* ------------- VIDEO -------------- */
  .course-player .video-viewer {
    max-width: 100%;
  }
  .course-player video {
    width: 100%;
    height: calc(100% - 100px);
    background-color: #000;
    border-radius: 7px;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
  }
  .course-player video::-webkit-media-controls-play-button {
    background-color: var(--v-primary-base);
    color: white; 
    margin-right: 15px;
  }
  .course-player video::-webkit-media-controls-timeline {
    background-color: rgba(255, 255, 255, 0.2); 
  }
  .course-player video::-webkit-media-controls-volume-slider {
    background-color: var(--v-primary-base);
    border-radius: 6px;
    padding: 10px 10px;
    align-self: center;
  }
  .course-player video::-webkit-media-controls-fullscreen-button {
    background-color: var(--v-primary-base);
    color: white;
  }
  .course-player video::-webkit-media-controls-current-time-display {
    color: white;
  }
  .course-player video::-webkit-media-controls-time-remaining-display {
    color: var(--v-primary-base);
  }
  .course-player video::-webkit-media-controls-timeline {
    width: calc(100% - 30px) !important;
    padding: 0px;
    position: absolute;
    top: calc(100% - 70px) !important;
    left: 15px;
    border-radius: 0px !important;
  }

  /* ------------- SIDEBAR -------------- */
  .course-player .course-sidebar {
    height: calc(100vh - 64px);
    width: 280px;
    border-right: 1px solid #1f243b;
    overflow-y: auto;
    padding: 7px 7px;
    flex-shrink: 0;
  }
  .course-player .course-sidebar {
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #6b7291 transparent !important;
  }

  .course-player .course-sidebar:hover {
    scrollbar-color: #98a1c7 transparent !important;
  }
  .course-player .course-sidebar .v-expansion-panel-header {
    padding: 10px;
    background-color: #23273d;
    color: white;
  }
  .course-player .course-sidebar .v-expansion-panel-header:hover {
    background-color: #394061;
  }
  .course-player .course-sidebar .v-expansion-panels .v-expansion-panel {
    background-color: #00000000 !important;
  }
  .course-player .course-sidebar .v-expansion-panels {
    border-radius: 7px;
    overflow: hidden;
    border: unset !important;
  }
  .course-player .course-sidebar .expansion-panel-content {
    background-color: #12172b !important;
    color: white;
    font-weight: 500;
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }

  /* ------------- VIEWER -------------- */
  .course-player .course-viewer {
    display: block;
    flex-grow: 1;
    justify-content: flex-start;
    flex-direction: column;
    height: calc(100vh - 65px);
  }

  .course-player .course-sidebar .expansion-panel-content > :first-child {
    padding: 0px !important;
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