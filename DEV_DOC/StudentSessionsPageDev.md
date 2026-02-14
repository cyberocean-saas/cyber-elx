# CyberOcean Custom Student Sessions Page

## Summary

This document describes how to customize the **Student Sessions Page** (live sessions calendar). The component has no props and handles all data fetching internally via API calls. The calendar displays live/scheduled sessions organized by month with color-coded indicators, session detail dialogs with join buttons, and attached file viewing.

## Overview

**Key Features:**
- **Monthly calendar view** with navigation arrows and month dropdown selector
- **Session indicators** on calendar days with color-coded dots and truncated names
- **Session detail dialog** showing teacher, time, duration, files, and join button
- **Session status logic** - Join Now (today), Upcoming (future), Not Started (no link), Ended (past)
- **Files dialog** for viewing and opening attached session files
- **i18n support** for day names and month names based on locale
- **API integration** - fetches sessions and teachers data on mount and month change

## Student Sessions Page

### Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Title: [icon] Live Sessions                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Calendar Card                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  [<]  February 2025  [>]     (navigation header)    │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │        [Select Month ▼]      (month dropdown)       │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │  Sun | Mon | Tue | Wed | Thu | Fri | Sat            │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │      |     |     |     |     |     |  1  |          │  │  │
│  │  │  2   |  3  |  4  |  5  |  6  |  7  |  8  |          │  │  │
│  │  │      |     | ● Session Name        |     |          │  │  │
│  │  │  9   | 10  | 11  | 12  | 13  | 14  | 15  |          │  │  │
│  │  │      |     |     | ● Session 1     |     |          │  │  │
│  │  │      |     |     | +2 more         |     |          │  │  │
│  │  │ ...                                                 │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

Session Detail Dialog:
┌─────────────────────────────────────────────────────────────────┐
│  Sessions for February 10, 2025                            [X] │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ │ Session Name                                            │  │
│  │ │ Teacher: John Doe                                       │  │
│  │ │ Starts at: 10:00 AM                                     │  │
│  │ │ Duration: 2 hours                         [Join Now]    │  │
│  │ │ [View Attached Files (3)]                               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

### Available Props

This component has **no props** — it is self-contained and fetches all data internally.

```js
props: []
```

### The `session` Object

Each session returned from the API has the following structure:

```js
{
  id: "abc123",              // String - Unique session ID
  name: "Math Lesson 1",     // String - Session display name
  formatted_date: 1707570000000, // Number - Timestamp (milliseconds)
  duration: 2,               // Number - Duration in hours
  link: "https://meet.google.com/xyz", // String|null - Meeting link (Google Meet, Zoom, etc.)
  teacherId: "teacher-456",  // String - Teacher ID for lookup
  files: [                   // Array - Attached files (Could be empty)
    { name: "notes.pdf", url: "https://..." },
    { filename: "slides.pptx", path: "/files/..." }
  ]
}
```

### The `teacher` Object

Teachers are fetched separately for name lookup:

```js
{
  id: "teacher-456",
  user: {
    name: "John Doe"
  }
}
```

### Local State

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | Boolean | `false` | Shows loading overlay during API calls |
| `sessions` | Array | `[]` | Sessions for the selected month |
| `teachers` | Array | `[]` | All teachers for name lookup |
| `currentDate` | Date | `new Date()` | Reference to current date |
| `selectedMonth` | Number | Current month (0-11) | Selected month index |
| `selectedYear` | Number | Current year | Selected year |
| `sessionDialog` | Boolean | `false` | Controls session details dialog visibility |
| `selectedDate` | String | `null` | Formatted date string for dialog title |
| `selectedDaySessions` | Array | `[]` | Sessions for the clicked day |
| `daysOfWeek` | Array | `[]` | Translated day names (initialized in `mounted`) |
| `filesDialog` | Boolean | `false` | Controls files dialog visibility |
| `selectedFiles` | Array | `[]` | Files for the selected session |

### Computed Properties

| Property | Returns | Description |
|----------|---------|-------------|
| `currentMonthName` | String | Localized month name using `$i18n.locale` |
| `currentYear` | Number | The `selectedYear` value |
| `daysInMonth` | Number | Number of days in selected month |
| `firstDayOfMonth` | Number | Day of week (0-6) for 1st day — used for empty cells |
| `emptyCellsAfterMonth` | Number | Empty cells needed to complete 5-row grid |
| `availableMonths` | Array | 13 months: 6 previous, current, 6 next with `{text, value}` |

### Methods

| Method | Description |
|--------|-------------|
| `loadSessions()` | Async. Fetches sessions for selected month from API with date filters |
| `loadTeachers()` | Async. Fetches all teachers for name lookup |
| `navigateMonth(direction)` | Navigate to previous (-1) or next (+1) month and reload sessions |
| `selectMonth(monthData)` | Select specific month/year from dropdown and reload sessions |
| `isToday(day)` | Returns true if day matches today's date |
| `isCurrentMonthSelected(monthValue)` | Returns true if monthValue matches selected month/year |
| `isSessionInPast(timestamp)` | Returns true if session date is before today |
| `isSessionInFuture(timestamp)` | Returns true if session date is after today |
| `hasSessions(day)` | Returns true if day has any sessions |
| `getDaySessions(day)` | Returns array of sessions for the given day |
| `showDaySessions(day)` | Opens session dialog with clicked day's sessions |
| `getTeacherName(session)` | Looks up teacher name from `teachers` array using `teacherId` |
| `formatTime(timestamp)` | Formats timestamp to localized time string (HH:MM) |
| `getSessionColor(session)` | Returns consistent color based on session ID hash |
| `showFilesDialog(session)` | Opens files dialog with session's attached files |
| `openFile(file)` | Opens file URL/path in new browser window |

### Session Status Logic

The join button displays different states based on session timing:

| Condition | Button State | Description |
|-----------|--------------|-------------|
| `link && !past && !future` | **Join Now** (green) | Session is today with link available |
| `link && future` | **Upcoming** (disabled) | Session is in future with link |
| `!link && !past` | **Not Started** (disabled) | Session not past, no link yet |
| `past` | **Ended** (disabled) | Session date has passed |

### Session Indicators

Calendar days show session indicators with smart truncation:

- **≤2 sessions**: Show all with colored dots and truncated names (max 15 chars)
- **>2 sessions**: Show first session + "+N more" indicator in grey

Colors are generated from a 6-color palette using a hash of the session ID for consistency.

### API Integration

**Load Sessions:**
```js
GET @PA/student-sessions?date_filter_start={startTimestamp}&date_filter_end={endTimestamp}
// Returns: { items: [...sessions] }
```

**Load Teachers:**
```js
GET @PA/get-all-teachers-for-students
// Returns: [...teachers]
```

Both APIs are called on `mounted` and sessions are reloaded on month navigation.

### Page Sections

1. **Page Header** - Title with video icon and "Live Sessions" text
2. **Calendar Card** - White card with shadow containing:
   - **Loading Overlay** - `v-overlay` with spinner during API calls
   - **Calendar Header** - Previous/Next buttons with month/year display
   - **Month Selector** - Dropdown menu with 13 available months
   - **Days of Week Header** - Localized day abbreviations (Sun-Sat)
   - **Calendar Grid** - 7-column grid with day cells, session indicators
3. **Session Details Dialog** - List of sessions for clicked day with:
   - Session name, teacher, start time, duration
   - Attached files button (if files exist)
   - Join/Status button based on session state
4. **Files Dialog** - List of clickable file items with icons

### Available Translations

- Page
`global.live-sessions` -> Live Sessions
`global.upcoming` -> upcoming
`global.loading-sessions` -> Loading sessions...
`global.no-sessions-this-month` -> No sessions this month
`global.check-back-later` -> Check back later or explore other months!
`global.today` -> TODAY
`global.completed` -> Completed
- Calendar
`global.select-month` -> Select month
`global.more` -> more
- Days of week
`global.sun` -> Sun
`global.mon` -> Mon
`global.tue` -> Tue
`global.wed` -> Wed
`global.thu` -> Thu
`global.fri` -> Fri
`global.sat` -> Sat
- Session dialog
`global.sessions-for` -> Sessions for
`global.teacher` -> Teacher
`global.starts-at` -> Starts at
`global.duration` -> Duration
`global.hours` -> hours
- Session buttons
`global.join-now` -> Join now
`global.upcoming-session` -> Upcoming session
`global.not-started-yet` -> Not started yet
`global.session-ended` -> Session ended
- Files
`global.attached-files` -> Attached files
`global.view-attached-files` -> View attached files
`global.no-attached-files` -> No attached files
`global.unnamed-file` -> Unnamed file
- Toast
`global.file-url-not-available` -> File URL not available
- If you want another text, just put it in English

### Example Student Sessions Page:
```js
module.exports = {
  name: "SessionsCalendar",
  props: [],
  template: /* html */`
  <div class="student-calendar-page">
    <h1><v-icon>mdi-video-outline</v-icon>{{ $t("global.live-sessions") }}</h1>
    <div class="sessions-calendar">
      <!-- Loader overlay -->
      <v-overlay :value="loading">
        <v-progress-circular indeterminate color="white" size="40"></v-progress-circular>
      </v-overlay>

      <!-- Calendar header with navigation -->
      <div class="calendar-header">
        <v-btn icon @click="navigateMonth(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <v-btn icon @click="navigateMonth(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Month selector -->
      <div class="month-selector mb-4" style="justify-self: center;">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              {{ $t("global.select-month") }}
              <v-icon right>mdi-calendar-month</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(month, i) in availableMonths" :key="i" @click="selectMonth(month.value)">
              <v-list-item-title :class="{ 'primary--text font-weight-bold': isCurrentMonthSelected(month.value) }">
                {{ month.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Days of week header -->
      <div class="calendar-grid-header">
        <div class="day-name" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>

      <!-- Calendar grid -->
      <div class="calendar-grid">
        <!-- Empty cells for days before start of month -->
        <div class="calendar-day empty" v-for="n in firstDayOfMonth" :key="'empty-start-'+n"></div>

        <!-- Calendar days -->
        <div class="calendar-day" v-for="day in daysInMonth" :key="day"
          :class="{ today: isToday(day), 'has-sessions': hasSessions(day) }" @click="showDaySessions(day)">
          <div class="day-number">{{ day }}</div>

          <!-- Session indicators - Updated style to match image -->
          <div class="sessions-container">
            <template v-if="getDaySessions(day).length <= 2">
              <div class="session-indicator" v-for="(session, index) in getDaySessions(day)"
                :key="'session-'+day+'-'+index">
                <div class="session-dot" :style="{ backgroundColor: getSessionColor(session) }"></div>
                <span class="session-name">{{ session.name.length > 22 ? session.name.substring(0, 15) + '...' : session.name }}</span>
              </div>
            </template>
            <template v-else>
              <div class="session-indicator">
                <div class="session-dot" :style="{ backgroundColor: getSessionColor(getDaySessions(day)[0]) }"></div>
                <span class="session-name">{{ getDaySessions(day)[0].name.length > 22 ? getDaySessions(day)[0].name.substring(0, 15) + '...' : getDaySessions(day)[0].name }}</span>
              </div>
              <div class="session-indicator more-sessions">
                <div class="session-dot" style="backgroundColor: #9e9e9e"></div>
                <span class="session-name">+{{ getDaySessions(day).length - 1 }} {{ $t("global.more") }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Empty cells for days after end of month -->
        <div class="calendar-day empty" v-for="n in emptyCellsAfterMonth" :key="'empty-end-'+n"></div>
      </div>

      <!-- Files dialog -->
      <v-dialog v-model="filesDialog" max-width="500">
        <v-card>
          <v-card-title style="font-weight: 300">
            {{ $t("global.attached-files") }}
            <v-spacer></v-spacer>
            <v-btn icon @click="filesDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                @click="openFile(file)"
                style="cursor: pointer; border: 1px solid #e0e0e0; margin-bottom: 8px; border-radius: 4px;"
              >
                <v-list-item-avatar>
                  <v-icon color="primary">mdi-file-document</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ file.name || file.filename || $t("global.unnamed-file") }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-open-in-new</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <div v-if="!selectedFiles || selectedFiles.length === 0" class="text-center pa-4 grey--text">
              {{ $t("global.no-attached-files") }}
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Session details dialog -->
      <v-dialog v-model="sessionDialog" max-width="600">
        <v-card>
          <v-card-title style="font-weight: 300">
            {{ $t("global.sessions-for") }} {{ selectedDate }}
            <v-spacer></v-spacer>
            <v-btn icon @click="sessionDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list two-line>
              <v-list-item v-for="(session, index) in selectedDaySessions" :key="'detail-'+index"
                class="popup-session-card">
                <v-list-item-content>
                  <v-list-item-title>{{ session.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <template>
                      {{ $t("global.teacher") }}: {{ getTeacherName(session) }}
                    </template>
                    <br>
                    <template>
                      {{ $t("global.starts-at") }}: {{ formatTime(session.formatted_date) }}
                    </template>
                    <br>
                    {{ $t("global.duration") }}: {{ session.duration }} {{ $t("global.hours") }}
                    <br>
                    <v-btn 
                    color="primary"
                    style="padding: 0 5px;"
                      v-if="session.files && session.files.length > 0"
                      @click.stop="showFilesDialog(session)"
                    >
                      {{ $t("global.view-attached-files") }} ({{ session.files.length }})
                    </v-btn>
                    <span v-else>
                      {{ $t("global.attached-files") }}: 0
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <!-- Button to Join Now -->
                  <v-btn 
                    v-if="session.link && !isSessionInPast(session.formatted_date) && !isSessionInFuture(session.formatted_date)"
                    color="green" 
                    dark 
                    :href="session.link" 
                    target="_blank"
                  >
                    <v-icon left>mdi-open-in-new</v-icon>
                    {{ $t("global.join-now") }}
                  </v-btn>

                  <!-- Button for Upcoming Session -->
                  <v-btn 
                    v-else-if="session.link && isSessionInFuture(session.formatted_date)"
                    disabled 
                    color="grey"
                  >
                    <v-icon left>mdi-circle-off-outline</v-icon>
                    {{ $t("global.upcoming-session") }}
                  </v-btn>

                  <!-- Button for Session Not Started (No Link Yet) -->
                  <v-btn 
                    v-else-if="!session.link && !isSessionInPast(session.formatted_date)"
                    disabled 
                    color="grey"
                  >
                    <v-icon left>mdi-circle-off-outline</v-icon>
                    {{ $t("global.not-started-yet") }}
                  </v-btn>

                  <!-- Button for Past Session -->
                  <v-btn 
                    v-else-if="isSessionInPast(session.formatted_date)"
                    disabled 
                    color="grey"
                  >
                    <v-icon left>mdi-circle-off-outline</v-icon>
                    {{ $t("global.session-ended") }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
  `,
  
  data: /* js */`
    function() {
      return {
        loading: false,
        sessions: [],
        teachers: [],
        currentDate: new Date(),
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
        sessionDialog: false,
        selectedDate: null,
        selectedDaySessions: [],
        daysOfWeek: [],
        filesDialog: false,
        selectedFiles: []
      };
    }
  `,
  
  mounted: /* js */`
    async function() {
      this.loading = true;

      // Initialize days of week with i18n
      this.daysOfWeek = [
        this.$t("global.sun"),
        this.$t("global.mon"),
        this.$t("global.tue"),
        this.$t("global.wed"),
        this.$t("global.thu"),
        this.$t("global.fri"),
        this.$t("global.sat")
      ];

      // Load sessions for the current month
      await this.loadSessions();

      // Load teachers data for displaying teacher names
      await this.loadTeachers();

      this.loading = false;
    }
  `,
  
  computed: /* js */`
    {
      currentMonthName() {
        return new Date(this.selectedYear, this.selectedMonth).toLocaleString(this.$i18n.locale, { month: 'long' });
      },
      currentYear() {
        return this.selectedYear;
      },
      daysInMonth() {
        return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
      },
      firstDayOfMonth() {
        return new Date(this.selectedYear, this.selectedMonth, 1).getDay();
      },
      emptyCellsAfterMonth() {
        const totalCells = 35; // 5 rows of 7 days
        return totalCells - this.daysInMonth - this.firstDayOfMonth;
      },
      availableMonths() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const months = [];

        // Previous 6 months
        for (let i = 6; i > 0; i--) {
          let month = currentMonth - i;
          let year = currentYear;

          if (month < 0) {
            month += 12;
            year--;
          }

          const date = new Date(year, month);
          months.push({
            text: date.toLocaleString(this.$i18n.locale, { month: 'long' }) + " " + year,
            value: { month, year }
          });
        }

        // Current month
        months.push({
          text: today.toLocaleString(this.$i18n.locale, { month: 'long' }) + " " + currentYear,
          value: { month: currentMonth, year: currentYear }
        });

        // Next 6 months
        for (let i = 1; i <= 6; i++) {
          let month = currentMonth + i;
          let year = currentYear;

          if (month > 11) {
            month -= 12;
            year++;
          }

          const date = new Date(year, month);
          months.push({
            text: date.toLocaleString(this.$i18n.locale, { month: 'long' }) + " " + year,
            value: { month, year }
          });
        }

        return months;
      }
    }
  `,
  
  methods: /* js */`
    {
      async loadSessions() {
        this.loading = true;

        try {
          // Calculate date range for the selected month
          const startDate = new Date(this.selectedYear, this.selectedMonth, 1).getTime();
          const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0, 23, 59, 59).getTime();

          const response = await this.$dataCaller("get", "@PA/student-sessions?date_filter_start="+startDate+"&date_filter_end="+endDate);

          this.sessions = response.items || [];
        } catch (error) {
          console.error("Error loading sessions:", error);
          this.sessions = [];
        }

        this.loading = false;
      },
      async loadTeachers() {
        try {
          const response = await this.$dataCaller("get", "@PA/get-all-teachers-for-students");
          this.teachers = response || [];
        } catch (error) {
          console.error("Error loading teachers:", error);
          this.teachers = [];
        }
      },
      navigateMonth(direction) {
        let newMonth = this.selectedMonth + direction;
        let newYear = this.selectedYear;
        if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        } else if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        }
        this.selectedMonth = newMonth;
        this.selectedYear = newYear;
        this.loadSessions();
      },
      selectMonth(monthData) {
        this.selectedMonth = monthData.month;
        this.selectedYear = monthData.year;
        this.loadSessions();
      },
      isToday(day) {
        const today = new Date();
        return day === today.getDate() &&
          this.selectedMonth === today.getMonth() &&
          this.selectedYear === today.getFullYear();
      },
      isCurrentMonthSelected(monthValue) {
        return monthValue.month === this.selectedMonth && monthValue.year === this.selectedYear;
      },
      isSessionInPast(sessionTimestamp) {
        if (!sessionTimestamp) return true; // Consider it past if no timestamp
        const sessionDate = new Date(sessionTimestamp);
        const now = new Date();

        // Set time to 00:00:00 for both dates to only compare dates, not time
        sessionDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return sessionTimestamp < now;
      },
      isSessionInFuture(sessionTimestamp) {
        if (!sessionTimestamp) return true; // Consider it past if no timestamp

        const sessionDate = new Date(sessionTimestamp);
        const now = new Date();

        // Set time to 00:00:00 for both dates to only compare dates, not time
        sessionDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        return sessionDate > now; // true if session is after today
      },
      hasSessions(day) {
        return this.getDaySessions(day).length > 0;
      },
      getDaySessions(day) {
        return this.sessions.filter(session => {
          const sessionDate = new Date(session.formatted_date);
          const isSameDay = sessionDate.getDate().toString() == day.toString();
          return isSameDay;
        });
      },
      showDaySessions(day) {
        this.selectedDaySessions = this.getDaySessions(day);
        this.selectedDate = this.currentMonthName + " " + day + ", " + this.currentYear;
        this.sessionDialog = true;
      },
      getTeacherName(session) {
        if (!session.teacherId) return "N/A";

        const teacher = this.teachers.find(t => t.id === session.teacherId);
        return teacher ? teacher.user.name : "Unknown";
      },
      formatTime(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
      getSessionColor(session) {
        // Generate consistent colors based on session ID or name
        const colors = [
          "#4285F4", // Blue
          "#EA4335", // Red
          "#FBBC05", // Yellow
          "#34A853", // Green
          "#8F00FF", // Purple
          "#FF6D01", // Orange
        ];
        // Simple hash function to get a consistent index
        const hash = session.id.split('').reduce((acc, char) => {
          return acc + char.charCodeAt(0);
        }, 0);
        return colors[hash % colors.length];
      },
      showFilesDialog(session) {
        this.selectedFiles = session.files || [];
        this.filesDialog = true;
      },
      openFile(file) {
        // Open file in new window
        if (file.url) {
          window.open(file.url, '_blank');
        } else if (file.path) {
          window.open(file.path, '_blank');
        } else {
          this.$toast.error(this.$t('global.file-url-not-available'));
        }
      }
    }
  `,
  
  style: /* css */`
  .student-calendar-page {
    padding: 20px;
  }

  .student-calendar-page h1 {
    font-weight: 300;
    margin-bottom: 7px;
  }
  .student-calendar-page h1 i {
    font-size: 60px;
  }

  .student-calendar-page .sessions-calendar {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .student-calendar-page .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .student-calendar-page .calendar-grid-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .student-calendar-page .day-name {
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  .student-calendar-page .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
    max-width: 100%;
    overflow: auto;
  }

  .student-calendar-page .calendar-day {
    min-height: 100px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 5px;
    position: relative;
    transition: background-color 0.2s;
    max-width: 20vw;
  }

  .student-calendar-page .calendar-day:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }

  .student-calendar-page .calendar-day.empty {
    background-color: #f7f7f7;
    cursor: default;
  }

  .student-calendar-page .calendar-day.today {
    border: 2px solid #4285F4;
  }

  .student-calendar-page .day-number {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .student-calendar-page .sessions-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .student-calendar-page .popup-session-card {
    border: 1px solid #818181;
    border-radius: 5px;
    border-left-width: 4px;
    margin-bottom: 7px;
  }

  /* Updated session indicator styles to match the image */
  .student-calendar-page .session-indicator {
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .student-calendar-page .session-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .student-calendar-page .session-name {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .student-calendar-page .more-sessions {
    color: #757575;
    font-size: 11px;
  }

  .student-calendar-page .has-sessions .day-number::after {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #4285F4;
    border-radius: 50%;
    margin-left: 3px;
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