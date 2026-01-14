# ELX Custom Pages API Documentation

## Overview

These endpoints allow you to retrieve and update custom ELX (E-Learning Experience) pages. The pages are Liquid templates that can be customized for different sections of the e-learning platform.

---

## Authentication

All endpoints require authentication. You must include the `_token` header in your requests.

**Required Header:**

| Header | Description |
|--------|-------------|
| `_token` | Your authentication token |

**Unauthorized Response (403):**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

> **Note:** Only users with `admin` role can access these endpoints.

---

## Endpoints

### 1. Get ELX Pages

Retrieves all custom ELX pages.

**URL:** `GET https://domain_name.com/api/plugin_api/el-x/get_elx_pages`

**Response:**

```json
{
  "success": true,
  "pages": [
    {
      "type": "template", // "template" or "section"
      "key": "home_page",
      "content": "<!-- Liquid template content -->",
      "created_at": 123456798,
      "updated_at": 123456798
    },
    {
      "type": "template", // "template" or "section"
      "key": "courses_page",
      "content": "<!-- Liquid template content -->",
      "created_at": 123456798,
      "updated_at": 123456798
    }
  ]
}
```

**Default Page Keys (Templates):**

| Key | Description |
|-----|-------------|
| `home_page` | Home page template |
| `courses_page` | Courses listing page template |
| `course_page` | Single course page template |
| `about_page` | About page template |
| `category_page` | Category page template |
| `blogs_page` | Blogs listing page template |
| `blog_page` | Single blog page template |
| `contact_page` | Contact page template |

- The API may return sections or more pages, so if detected just created them locally, and when updating, update the sections and pages.

---

### 2. Update ELX Pages

Updates one or more custom ELX pages.

**URL:** `POST https://domain_name.com/api/plugin_api/el-x/update_elx_pages`

**Request Body:**

```json
{
  "pages": [
    {
      "type": "template", // "template" or "section"
      "key": "home_page",
      "content": "<!-- Your custom Liquid template -->"
    },
    {
      "type": "template", // "template" or "section"
      "key": "courses_page",
      "content": "<!-- Your custom Liquid template -->"
    }
  ]
}
```

**Allowed Page Keys:**

- `home_page`
- `courses_page`
- `course_page`
- `about_page`
- `category_page`
- `blogs_page`
- `blog_page`
- `contact_page`

**Response (Success):**

```json
{
  "success": true,
  "message": "Pages updated successfully",
  "updatedpages": [
    {
      "type": "template", // "template" or "section"
      "key": "home_page",
      "content": "<!-- Your custom Liquid template -->",
      "created_at": 123456798,
      "updated_at": 123456798
    },
    ...
  ]
}
```

**Response (No valid pages):**

```json
{
  "success": true,
  "message": "No pages to update, Allowed pages are 0",
  "updatedpages": []
}
```

---

### 3. Get ELX Default Pages (As an example for the user)

Retrieves all default ELX pages.

**URL:** `GET https://domain_name.com/api/plugin_api/el-x/get_defaults_for_elx_pages`

**Response:**

```json
{
  "success": true,
  "pages": [
    {
      "type": "template", // "template" or "section"
      "key": "home_page",
      "content": "<!-- Liquid template content -->",
      "created_at": 123456798,
      "updated_at": 123456798
    },
    {
      "type": "template", // "template" or "section"
      "key": "courses_page",
      "content": "<!-- Liquid template content -->",
      "created_at": 123456798,
      "updated_at": 123456798
    }
  ]
}
```

- The API will return all defaults (Defaults may change in the future at any given time)

---

## Behavior Notes

1. **Empty Content:** Pages with empty or whitespace-only content will be skipped during update.

2. **Validation:** Only pages with keys matching the allowed list will be processed. Invalid keys are silently ignored.
