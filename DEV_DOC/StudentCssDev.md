# Student Dashboard Customization Guide (using CSS)

## All student dashboard pages background color
- **IMPORTANT:** The background color should be very light, since most of pages content are dark
```css
.v-main {
  background: #e2f1ffff !important;
}
```
- **Do not** Edit `.v-main::before` or `.v-main::after` unless requested

### Project Colors (Required)

- Primary: `--elx-primary-color`
- Secondary: `--elx-secondary-color`

## Navbar Customization Guide

### Important: CSS Selector Rules

**All your custom CSS must start with this selector:**

- `.navbar` - Applies to the navbar/top bar

##### Example Structure:
```css
/* Navbar styles */
.navbar { }
```

### Basic Structure

Main classes within the navbar:
- `.navbar` - The main top bar container
- `.v-btn` - Buttons (menu toggle, profile button)
- `.profile` - User profile avatar
- `.toolbar-menu-item` - User dropdown menu
- `.v-list-item` - Menu items in dropdown

### Common Customizations

### 1. Change Navbar Background Color

```css
/* Navbar background - use ::before for proper override */
.navbar::before {
  /* --- those are required for background to be applied --- */
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* ------ */
  background-color: #1c4bd5 !important; /* Desired color here (Should be a dark color, since all texts are white) */
}
```

### 2. Change Navbar border

```css
.navbar {
  border-bottom: 2px solid #e0e0e0 !important;
}
```

### 3. Customize Profile Name Text

```css
/* Profile name styling */
.navbar .v-btn span {
  color: #333333 !important;
  font-size: 15px !important;
  font-weight: 600 !important;
}
```

### 4. Customize Profile Avatar

```css
/* Avatar border/styling */
.navbar .profile {
  border: 2px solid #1976d2 !important;
}
```

### 5. Customize Sidebar Toggle Button

```css
/* Sidebar toggle button color */
.navbar .v-btn .v-icon {
  color: #333333 !important;
}

/* Sidebar toggle button on hover */
.navbar .v-btn:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
```

### 6. Customize Dropdown Menu

```css
/* Dropdown menu background */
.navbar .toolbar-menu-item .v-list {
  background-color: #ffffff !important;
}

/* Dropdown menu items */
.navbar .v-list-item {
  color: #333333 !important;
}

/* Dropdown menu items on hover */
.navbar .v-list-item:hover {
  background-color: #f5f5f5 !important;
}

/* Dropdown menu item titles */
.navbar .v-list-item-title {
  font-size: 14px !important;
  font-weight: 400 !important;
}
```

### 7. Customize Icons Color

```css
/* All icons in navbar */
.navbar .v-icon {
  color: #555555 !important;
}

/* Icons in dropdown menu */
.navbar .v-list-item .v-icon {
  color: #666666 !important;
}
```

### 8. Add Gradient Background

```css
/* Gradient navbar background */
.navbar::before {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
}

/* Adjust text colors for gradient */
.navbar .v-btn span,
.navbar .v-icon {
  color: white !important;
}
```

### 9. Navbar Height

- **Do not change the height**, it is not customizable

### Tips
- **Always** start selectors with `.navbar`
- Use `.navbar::before` for background color changes
- Always use `!important` to override defaults
- Keep contrast ratios accessible
- Keep in mind that all Vuetify elements used are in dark mode, so most of the texts color is white

## Sidebar Customization Guide

This guide will help you customize the sidebar appearance using CSS. Add your custom CSS to your theme or style settings.

### Important: CSS Selector Rules

**All your custom CSS must start with one of these selectors:**

- `.sidebar` - Applies to sidebar in all states
- `.sidebar:not(.v-navigation-drawer--is-mouseover)` - Only applies when sidebar is collapsed/minimized
- `.sidebar.v-navigation-drawer--is-mouseover` - Only applies when sidebar is expanded/full width

#### Example Structure:
```css
/* Applies always */
.sidebar { }

/* Only when sidebar is minimized */
.sidebar:not(.v-navigation-drawer--is-mouseover) { }

/* Only when sidebar is expanded */
.sidebar.v-navigation-drawer--is-mouseover { }
```

### Sidebar States

The sidebar has two states:

1. **Expanded** (`.sidebar.v-navigation-drawer--is-mouseover`) - Full sidebar showing text and icons
2. **Minimized** (`.sidebar:not(.v-navigation-drawer--is-mouseover)`) - Collapsed sidebar showing only icons

### Basic Structure

Main classes within the sidebar:
- `.v-list-item` - Menu items
- `.v-list-item--active` - Active/selected menu item
- `.sidebar-menu-subitem` - Submenu items
- `.v-toolbar` - Top bar (logo area) || it is better **not to make a background color change** for this, since the sidebar background color is already under it

### Common Customizations

#### 1. Change Sidebar Background Color
- **IMPORTANT:** The background color should be dark, since it's content is light

```css
/* Light theme sidebar - all states */
.sidebar::before {
  background-color: #1b42eeff !important;
} /* As you can see, the sidebar background color is changable from ::before */
```

#### 2. Change Active Item Color

```css
/* Active menu item text color */
.sidebar .v-list-item--active .v-list-item__title {
  color: #ff6b6b !important;
  font-weight: bold;
}

/* Active menu item icon color */
.sidebar .v-list-item--active .v-icon {
  color: #ff6b6b !important;
}

/* Active item in expanded sidebar only */
.sidebar.v-navigation-drawer--is-mouseover .v-list-item--active {
  border-left: 4px solid #ff6b6b;
}
```

#### 3. Customize Menu Item Hover Effect

```css
/* Hover effect - all states */
.sidebar .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* Different hover for minimized state */
.sidebar:not(.v-navigation-drawer--is-mouseover) .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
```

#### 4. Change Top Bar (Logo Area) Colors

```css
/* Top toolbar background */
.sidebar .v-toolbar {
  background-color: #1c4bd5 !important; /* (ONLY WHEN NEEDED) Better not change the background color, for more stylized sidebar, set a background for the whole sidebar::before instead */
}

/* App name text color */
.sidebar .toolbar .text {
  color: white !important;
}

/* Hide logo when minimized */
.sidebar:not(.v-navigation-drawer--is-mouseover) .wide-logo-img {
  opacity: 0.7;
}
```

#### 5. Customize Submenu Items

```css
/* Submenu background - only visible in expanded state */
.sidebar.v-navigation-drawer--is-mouseover .sidebar-menu-subitem {
  background-color: #fafafa !important;
  /* Do not change margins/transform:translate to do not break the layout */
}

/* Active submenu item */
.sidebar .sidebar-menu-subitem.v-list-item--active {
  background-color: #e3f2fd !important;
  border-left: 3px solid #2196f3;
  /* Do not change margins/transform:translate to do not break the layout */
}
```

#### 6. Change Font Sizes

```css
/* Main menu items */
.sidebar .v-list-item-title {
  font-size: 16px !important;
  font-weight: 400 !important;
}

/* Smaller font when minimized (shown on hover) */
.sidebar:not(.v-navigation-drawer--is-mouseover) .v-list-item-title {
  font-size: 14px !important;
}

/* App name */
.sidebar .toolbar .text {
  font-size: 24px !important;
}
```

#### 7. Width Customization

- **Do not change the width**, it is not customizable

### Tips
- **Always** start selectors with `.sidebar`
- Use `.sidebar:not(.v-navigation-drawer--is-mouseover)` for minimized state styles
- Use `.sidebar.v-navigation-drawer--is-mouseover` for expanded state styles
- Always use `!important` to override defaults
- Keep contrast ratios accessible
- Keep in mind that all Vuetify elements used are in dark mode, so most of the texts color is white