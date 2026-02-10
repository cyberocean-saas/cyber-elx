# CyberOcean Custom Elx Theme

## Summary

- [CyberOcean Custom Elx Theme](#cyberocean-custom-elx-theme)
  - [Summary](#summary)
  - [Steps to create/update the theme](#steps-to-createupdate-the-theme)
  - [Defaults](#defaults)
  - [Customization](#customization)
    - [Layout](#layout)
    - [Sections](#sections)
    - [Templates](#templates)
    - [Available Liquid Variables](#available-liquid-variables)
      - [Global Available vairables:](#global-available-vairables)
      - [Home Page Available vairables:](#home-page-available-vairables)
      - [Course Page Available vairables:](#course-page-available-vairables)
      - [Courses Page Available vairables:](#courses-page-available-vairables)
      - [Category Page Available vairables:](#category-page-available-vairables)
      - [Blog Page Available vairables:](#blog-page-available-vairables)
      - [Blogs Page Available vairables:](#blogs-page-available-vairables)
      - [Contact Page Available vairables:](#contact-page-available-vairables)
      - [About Page Available vairables:](#about-page-available-vairables)
      - [Objects Structure:](#objects-structure)
  - [Website URLs](#website-urls)


## Steps to create/update the theme

Note: Even in a new fresh theme, The files are already created, but empty, the only files you need to create are the additional sections you plan to use (if you won't use some empty files, just keep them empty, removing is not required)

1. Make a detailled plan of the website
  - Layout
  - List all the pages
  - List all the sections
  - Header & Footer
  - Which available variables are going to be used
  - Confirm with the user
    + Give the user the plan of the pages
    + Ask for images/icons if you need (The user can upload files from the admin dashboard and give you back the links)
    + Ask about the language to use
    + Ask about the colors to use
2. Start by updating the layout
  - Update the `layouts/theme.liquid` file
  - Update the `sections/header.liquid` file
  - Update the `sections/footer.liquid` file
  - **Important**: If there will be modifications on the existing, then always start by creating a fresh copy from the default files, and then modify it
3. Update the rest of the pages (With the sections IN CASE YOU USED THEM)
  - Update the `templates/home_page.liquid`
  - Update the `templates/course_page.liquid`
  - Update the `templates/about_page.liquid`
  - Update the `templates/category_page.liquid`
  - Update the `templates/courses_page.liquid`
  - Update the `templates/contact_page.liquid`
  - Update the `templates/blogs_page.liquid`
  - Update the `templates/blog_page.liquid`
  - Rules:
    + **Do not** use translation unless asked for it
    + **Do not** try to always to copy paste the default files, use them as a reference, unless asked for it
    + **Do not** try to always use all available variables, use only the variables you need, unless asked for it
    + **Always** make your design mobile responsive
    + **Always** keep sections, templates and layouts file names simple
      > Correct: `sections/header.liquid`
      > Wrong: `sections/header_custom_elx.liquid`
4. Check your work
  - Ensure you have imported the sections in the right way `{% section '<SECTION_NAME>_custom_elx.liquid' %}` (If you used sections)

## Defaults

The default files are stored in the `defaults` folder
- The files in `defaults` folder are read-only
- Their purpose is to provide a reference when creating custom files
- The files in `defaults` folder are created using an old template
- The files in `defaults` folder use css/js/media files from the server, you can use them too, if needed
- The files in `defaults` folder are going to be used by the server if you don't provide custom files, example: if you don't provide a custom `layouts/theme.liquid`, the server will use the default one from `defaults/layouts/theme.liquid`

## Customization

- You are not forced to use all the available variables in the templates/sections/layouts, you can use only the variables you need
- To add custom JS/CSS simply add them as sections, then import them where needed, example to make a main.js file:
    > Create a file `sections/main_js.liquid`
    > Import it in any place as: `{% section 'main_js_custom_elx.liquid' %}`

### Layout

- `layouts/theme.liquid` is the main layout file of the website
- By editing it, you can modify the layout of the website
- To override the default layout's header or footer, you need to:
  1. Create a custom file in `sections` folder (example: `sections/header.liquid` or `sections/footer.liquid`)
  2. Use the `section` tag in `layouts/theme.liquid` to include the custom section, like this:
    ```liquid
    {% section 'header_custom_elx.liquid' %}
    {{ content_for_layout }}
    {% section 'footer_custom_elx.liquid' %}
    ```
  3. The tag `{{ content_for_layout }}` is crucial as it represents the content of the page, the pages (templates) will not be displayed without it
  4. The custom section is MANDATORY, the admin uses it for third-party services, scripts and styles:
    ```liquid
      <script>
        {% setting "el-x.custom_js" %}
      </script>
      <style>
        {% setting "el-x.custom_css" %}
      </style>
      {% setting "el-x.custom_html" %}
    ```

### Sections

- The sections can be loaded using the `section` tag from any template, layout or section, using the syntax: `{% section '<SECTION_NAME>_custom_elx.liquid' %}`, example: `{% section 'header_custom_elx.liquid' %}`
- Examples:
  > **WRONG:** section file `sections/header_custom_elx.liquid`
  > **CORRECT:** section file `sections/header.liquid`
  > **WRONG:** Import section file as `{% section 'header.liquid' %}`
  > **CORRECT:** Import section file as `{% section 'header_custom_elx.liquid' %}`

### Templates

- The templates represent the pages of the website
- The `home_page.liquid` is the home page of the website
- The `course_page.liquid` is a single course page on the website
- The `courses_page.liquid` is the page that shows all courses on the website
- The `category_page.liquid` s a single category page on the website
- The `blog_page.liquid` is a single blog page on the website
- The `blogs_page.liquid` is the main blogs page of the website
- The `contact_page.liquid` is the contact page of the website
- The `about_page.liquid` is the about page of the website

### Available Liquid Variables

- All variables have default values, so use them without setting default values

#### Global Available vairables:
Note: Available in All pages, and configurable from the website administration, recommended to use, so the user can change them from the admin, without the need to edit the code
- Path to the logo image:
  + Name: `logo`
  + Sample:
    ```json
    {
      "path": "https://example.com/logo.png"
    }
    ```
- Primary Color:
  + Name: `primary`
  + Sample: `#ff0000`
- Secondary Color:
  + Name: `secondary`
  + Sample: `#00ff00`
- Texts used in the footer
  + Name: `footerTexts`
  + Sample:
    ```json
    {
      "descreption": "...", // Footer description (yes it's misspelled as `descreption`, it will be fixed in the future)
      "newsletter": "...", // Newsletter text
      "copyright": "..." // Copyright text
    }
    ```
- Links to be used in the footer
  + Name: `footerLinks`
  + Sample:
    ```json
    [
      {
        "title": "...", // Link title
        "link": "..." // Link url
      },
      ... // The admin can add as many links as he wants
    ]
    ```
- Social media Urls
  + Name: `footerSocial`
  + Sample:
    ```json
    {
      "twitter": "...",
      "facebook": "...",
      "linkedIn": "..."
    }
    ```
- About us texts:
  + Name: `aboutUsTexts`
  + Sample:
    ```json
    {
      "title": "...",
      "descreption": "..."
      "picture_one": {
        "path": "...", // Image path
      }
      "picture_two": {
        "path": "...", // Image path
      }
    }
    ```
- CTA texts:
  + Name: `ctaTexts`
  + Sample:
    ```json
    {
      "title": "...",
      "button": "..."
    }
    ```
- Apply now text:
  + Name: `applyNow`
  + Sample:
    ```json
    [
      {
        "title": "...",
        "descreption": "..."
        "picture": {
          "path": "...", // Image path
        }
      },
      ... // The admin can add as many applyNow as he wants
    ]
    ```
- Blog section text:
  + Name: `blogText`
  + Sample:
    ```json
    {
      "title": "...",
      "descreption": "...",
      "number_blogs": 5 // The limit of blogs to be displayed in the blog main page (Configurable from the admin)
    }
    ```
- Pages top banner background:
  + Name: `pagesTopBannerBackground`
  + Sample:
    ```json
    {
      "picture": {
        "path": "...", // Image path
      }
    }
    ```
- Promotion background:
  + Name: `promotionBackground`
  + Sample:
    ```json
    {
      "picture": {
        "path": "...", // Image path
      }
    }
    ```
- Address:
  + Name: `adresse`
  + Sample: `"123 Main St, City"`
- Phone:
  + Name: `phone`
  + Sample: `"+1 234 567 890"`
- Email:
  + Name: `email`
  + Sample: `"contact@example.com"`
- Frame (embedded Maps iframe code):
  + Name: `frame`
  + Sample: `"<iframe>...</iframe>"`
- Icon for the browser tab:
  + Name: `icon`
  + Sample: `"https://example.com/icon.png"`
- All categories:
  + Name: `allCategories`
  + Sample:
    ```json
    [
      { ... }, // Category object
      ...
    ]
    ```
- Website URL (The url of the website):
  + Name: `websiteUrl`
  + Sample: `"https://example.com"`
- Admin URL (The url of the website App, where users and admins can login):
  + Name: `adminUrl`
  + Sample: `"https://admin.example.com"`
  + Login url: `{{ adminUrl }}/public/el-x/login`
  + Register url: `{{ adminUrl }}/public/el-x/register`
- Website name:
  + Name: `websiteName`
  + Sample: `"My Website"`
- Navbar categories style:
  + Name: `navbarCategoriesStyle`
  + Sample: `true` or `false` (If true, the categories should be displayed in the navbar as a dropdown menu, parent [with parentId == null])
  + Important: If `true`, all categories `category.parentId` will be `null`
- Language:
  + Name: `lang`
  + Sample: `"en"`, `"ar"` or `"fr"`
- Current user:
  + Name: `user`
  + Sample:
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "image": {
        "path": "...", // Image path
        "thumbnail": "...", // Lower res, and truncated 200x200 variant of the image
      }
    }
    ```

#### Home Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `home_page`
- All categories:
  + Name: `categories`
  + Sample:
    ```json
    [
      { // Category object
        ... 
        "courses": [ // Additional field per category
          { ... }, // Course object
          ...
        ]
      },
      ...
    ]
    ```
- All courses:
  + Name: `allCourses`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```
- All reviews:
  + Name: `allReviews`
  + Sample:
    ```json
    [
      { ... }, // Review object
      ...
    ]
    ```
- List of all courses on promo (with `course.promo == true`):
  + Name: `coursePromo`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```
- To subscribe to newsletter, you should send a `POST /p/newsletter-post-message` request with:
  + `body.email`
  + The endpoint will return `{ "success": true }` if the subscribtion was successfully
  + Note: Do not make the `<form>` post, but use JS to post, since the endpoint to do not handle redirects, then if succesful show a success dialog

#### Course Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `course_page`
- Course object:
  + Name: `course`
  + Sample:
    ```json
    { ... } // Course object
    ```
- Course Elements array:
  + Name: `chapterWithElements`
  + Sample:
    ```json
    [
      { ... }, // Course Element object
      ...
    ]
    ```
  + **Important**: Never ever show the content of the course elements with `element.free == false` (The user must purchase the course to access the content), and always show the content of the course elements with `element.free == true && element.type == "video"` (The user need to watch the free video to decide if he wants to purchase the course or not)
- Course duration:
  + Name: `minutes`
  + Sample: `45` (number of minutes)
- Course duration in hours:
  + Name: `hours`
  + Sample: `2` (number of hours)
- Courses list from the same category:
  + Name: `courses`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```
- If online payment is enabled (User can pay with credit card):
  + Name: `onlineMode`
  + Sample: `true` or `false`
- If offline payment is enabled (User can demand the course, and admin will contact the user):
  + Name: `offlineMode`
  + Sample: `true` or `false`
- If the course is purchased (User has already purchased the course):
  + Name: `isPurchased`
  + Sample: `true` or `false`
  + Course Url if purchased: `<ADMIN_URL>/p/el-x/course-player/<COURSE_ID>`

#### Courses Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `courses_page`
- Courses list (With pagination and search):
  + Name: `courses`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```
- Keyword:
  + Name: `keyword`
  + Sample: `...` (search keyword)
- Total items:
  + Name: `totalItems`
  + Sample: `100` (number of courses)
- Current page:
  + Name: `currentPage`
  + Sample: `100` (number of courses)
- Page size:
  + Name: `pageSize`
  + Sample: `10` (number of courses per page)
- Total pages:
  + Name: `totalPages`
  + Sample: `10` (number of pages)
- Query Parameters:
  + `?keyword=...` => `keyword` variable
  + `?page=...` => `currentPage` variable
  + `?page_size=...` => `pageSize` variable
  + `?sort_by_tag=...` => handled by the server
  + `?sort_by_direction=...` => handled by the server

#### Category Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `categories_page`
- Courses list of the category:
  + Name: `courses`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```
- Category:
  + Name: `category`
  + Sample:
    ```json
    { ... }, // Category object
    ```

#### Blog Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `blog_page`
- Page title:
  + Name: `page_title`
  + Sample: `...` (page title)
- Blog Post:
  + Name: `article`
  + Sample:
    ```json
    { ... }, // Article object
    ```

#### Blogs Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `blogs_page`
- Page title:
  + Name: `page_title`
  + Sample: `...` (page title)
- Blog Posts:
  + Name: `articles`
  + Sample:
    ```json
    [
      { ... }, // Article object
      ...
    ]
    ```

#### Contact Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `contact_page`
- To Post contact info, you should send a `POST /p/contact-post-message` request with:
  + `name`
  + `email`
  + `subject`
  + `message`
  + It accepts dynamic fields (Add as many as you want, like `phone`, `address`, etc.)
  + The endpoint will return `{ "success": true }` if the message was sent successfully
  + Note: Do not make the `<form>` post, but use JS to post, since the endpoint to do not handle redirects, then if succesful show a success dialog

#### About Page Available vairables:
- Page template key:
  + Name: `template`
  + Value: key that includes the string `about_page`
- All reviews:
  + Name: `allReviews`
  + Sample:
    ```json
    [
      { ... }, // Review object
      ...
    ]
    ```
- List of all courses on promo (with `course.promo == true`):
  + Name: `coursePromo`
  + Sample:
    ```json
    [
      { ... }, // Course object
      ...
    ]
    ```

#### Objects Structure:
- Course Object:
  ```json
  {
    "id": "...",
    "name": "...",
    "description": "...",
    "promo": true, // If true, the course is on promo
    "price": "99.99", // "0" if free
    "barredPrice": "99.99", // The price before the promo
    "logo": {
      "path": "..."
    },
    "elements": [ // Use {{ elements.size }} to get length in liquid
      "...", // Course Element ID
      ...
    ]
  }
  ```

- Course Element Object:
  ```json
  {
    "freePreview": false, // If true, and type is "video", the `element.content` will be available
    "type": "...", // Types: quiz, youtube, video, pdf, iframe, video-iframe
    "title": "...", // The title of the element
    "time": {
      "minutes": 3,
      "seconds": 20
    },
    "content": { // Only available if type is "video"
      "path": "..." // The path of the video
    }
  }

- Category Object:
  ```json
  {
    "parentId": null, // Or the id of the parent category
    "id": "...",
    "logo": {
      "path": "...", // Image path
      "thumbnail": "...", // Lower res, and truncated 200x200 variant of the image
    },
    "name": "..."
  }
  ```

- Article Object:
  ```json
  {
    "image": {
      "path": "..." // Image path
    },
    "excerpt": "...",
    "parsedBody": "...", // HTML content
    "title": "...",
    "formatted_created_at": "...", // Formatted date
    "formatted_updated_at": "...", // Formatted date
  }

- Review Object:
  ```json
  {
    "userName": "...",
    "reviewContent": "...",
    "userImage": {
      "path": "..."
    }
  }
  ```

## Website URLs

- The website main URL `/` automatically redirects to the home page
- The Home page URL: `/p/home`
- The Blogs page URL: `/p/blogs`
- The Blog page URL: `/p/blog/<ARTICLE_ID>`
- The Courses page URL: `/p/courses` (Doesn't use it, unless asked for it, since clients prefer to make the users navigate to the categories page then the courses)
- The Course page URL: `/p/course/<COURSE_ID>`
- The Contact page URL: `/p/contact`
- The Category page URL: `/p/categories/<CATEGORY_ID>`
- The About page URL: `/p/about`