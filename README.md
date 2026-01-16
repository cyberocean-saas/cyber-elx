# cyber-elx

CyberOcean CLI tool to upload/download ELX custom pages (Liquid templates).

## Installation

```bash
npm install -g .
# or
npm link
```

## Usage

### Initialize a new project

```bash
cd /path/to/your/project
cyber-elx init
```

This will:
1. Prompt for your website URL and authentication token
2. Create `cyber-elx.jsonc` config file
3. Download all pages from the server

### Download pages

```bash
cyber-elx download
```

Downloads pages from the server. If local files have been modified, you'll be prompted before overwriting.

Options:
- `-f, --force` - Force download without confirmation prompts

### Upload pages

```bash
cyber-elx upload
```

Uploads local pages to the server. If server pages have been modified since last download, you'll be prompted before overwriting.

Options:
- `-f, --force` - Force upload without confirmation prompts

## Folder Structure

```
your-project/
├── cyber-elx.jsonc     # Config file (url + token)
├── .cache              # Timestamps cache (auto-generated)
├── layouts/            # Custom layouts (*.liquid)
├── sections/           # Custom sections (*.liquid)
├── templates/          # Custom templates (*.liquid)
└── defaults/           # Read-only default templates
    ├── sections/
    └── templates/
```

## Config File

The `cyber-elx.jsonc` file contains your website URL and authentication token:

```jsonc
{
  // ELX Custom Pages Configuration
  "url": "https://my-website.net",
  "token": "your-auth-token"
}
```

## Default Templates

The `defaults/` folder contains read-only copies of the default templates. Use these as reference when creating your custom pages. If a custom page is empty, the default will be used automatically by the server.

## Available Page Keys

### Templates
- `home_page` - Home page
- `courses_page` - Courses listing
- `course_page` - Single course
- `about_page` - About page
- `category_page` - Category page
- `blogs_page` - Blogs listing
- `blog_page` - Single blog
- `contact_page` - Contact page

### Sections
Additional sections may be available depending on your server configuration.
