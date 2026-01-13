# Tử Vi AI - Project TODO

## Core Features

### 1. Tử Vi (Purple Star Astrology) Chart
- [x] User input form: full name, date of birth (lunar/solar), birth hour, gender
- [x] 12-palace chart display with primary and secondary stars
- [x] Traditional Tử Vi algorithm implementation
- [x] Lunar-solar calendar conversion
- [x] Heavenly Stems and Earthly Branches calculation
- [x] Star placement following classical Tử Vi rules
- [x] AI-powered detailed analysis for each palace

### 2. Numerology (Thần Số Học)
- [x] User input form: name and date of birth
- [x] Life Path Number calculation
- [x] Soul Number calculation (vowels)
- [x] Personality Number calculation (consonants)
- [x] Destiny Number calculation (full name)
- [x] Birth Day Number calculation
- [x] Birth Chart visualization
- [x] Pythagorean algorithm for Vietnamese letters with diacritics
- [x] Master Numbers handling (11, 22, 33)
- [x] AI interpretation of each number

### 3. 2026 Zodiac Forecast
- [x] Zodiac animal selection (12 animals)
- [x] Monthly predictions for 2026
- [x] Career forecast
- [x] Finance forecast
- [x] Romance forecast
- [x] Health forecast
- [x] Advice and guidance

### 4. Auspicious Dates & Times (Ngày Đẹp Giờ Tốt)
- [x] Purpose selection (wedding, business opening, groundbreaking, travel, moving house)
- [x] Time range selection
- [x] Good dates list
- [x] Auspicious hours (giờ hoàng đạo)
- [x] Favorable directions
- [x] Activities to do or avoid

### 5. Lunar New Year 2026 Tools (Công Cụ Tết 2026)
- [x] House-entering ceremony recommendations (suitable ages for xông đất)
- [x] Lucky colors based on Five Elements destiny
- [x] Lucky money amount suggestions based on recipient's destiny

### 6. LLM Configuration System
- [x] Using built-in LLM integration (BUILT_IN_FORGE_API)
- [ ] Admin panel for custom LLM settings (optional)
- [ ] Configure custom base_url, model, api_key (optional)

### 7. Query History
- [x] Save user's Tử Vi chart queries
- [x] Save user's numerology readings
- [x] History list view for logged-in users
- [x] View previous results

### 8. PDF Export
- [ ] Tử Vi chart PDF export
- [ ] Numerology results PDF export
- [ ] Beautiful formatting with Vietnamese text

## Database Schema
- [x] Users table (existing)
- [x] LLM settings table
- [x] Tử Vi readings table
- [x] Numerology readings table

## UI/UX
- [x] Homepage with feature cards
- [x] Navigation menu
- [x] Responsive design
- [x] Vietnamese language throughout
- [x] Modern mystic design theme
- [x] Loading states and animations

## Testing
- [x] Backend API tests
- [x] Algorithm accuracy tests (Tử Vi & Numerology)
- [x] All 32 tests passing


## Admin LLM Configuration
- [x] Admin page for LLM settings
- [x] Form to configure base_url, model, api_key
- [x] Save LLM settings to database
- [x] Load custom LLM settings in AI services
- [x] Test connection button
- [x] Admin-only access control
- [x] Delete settings to reset to default
- [x] Unit tests for admin APIs (38 tests passing)

## UI Improvements (Reported Issues)
- [x] Create consistent Layout component with Header and Footer
- [x] Fix navigation menu - link to all pages properly
- [x] Fix Vietnamese font rendering issues - Using Inter font
- [x] Improve color scheme and overall design - Clean purple theme
- [x] Add sticky header with proper navigation
- [x] Add footer with links and copyright
- [x] Improve page layouts and spacing
- [x] Better visual hierarchy and typography

## New Features (User Request)

### Animation & Interactions
- [x] Page transition animations (fade-in, slide)
- [x] Card hover effects with scale and shadow
- [x] Button hover/click animations
- [x] Scroll reveal animations for sections
- [x] Loading state animations
- [x] Form input focus animations

### Mobile Menu Optimization
- [x] Hamburger menu icon for mobile
- [x] Slide-out mobile navigation drawer
- [x] Touch-friendly menu items
- [x] Smooth open/close transitions
- [x] Close menu on link click
- [x] Backdrop overlay when menu open

### PDF Export Feature
- [x] PDF generation for Tử Vi results
- [x] PDF generation for Numerology results
- [x] Beautiful Vietnamese text formatting
- [x] Include charts and analysis in PDF
- [x] Download button on result pages
- [x] Client-side PDF generation with jsPDF


## New Features (User Request - Jan 9)

### Social Sharing Integration
- [x] Share to Facebook button
- [x] Share to Zalo button
- [x] Native Web Share API support
- [x] Copy link to clipboard
- [x] Share from result pages and history

### Improve Tử Vi Chart Display
- [x] Better 12-palace grid layout (4x3)
- [x] Show stars in each palace clearly
- [x] Color-coded star nature (cát/hung)
- [x] Interactive palace details with tabs
- [x] Visual star indicators (main/secondary)
- [x] Palace info with Chinese names

### History Feature Enhancement
- [x] Save Tử Vi results to database
- [x] Save Numerology results to database
- [x] History page with list of past readings
- [x] View detailed past results in dialog
- [x] Re-export PDF from history
- [x] Share from history
- [ ] Delete history entries (future)
- [ ] Filter by date/type (future)


## New Features (User Request - Jan 9 - Batch 2)
### Date Format Change
- [x] Change all date formats to dd/mm/yyyy
- [x] Update date picker display format
- [x] Update date display in results
- [x] Update date display in history

### Delete History Feature
- [x] Add delete button for each history item
- [x] Add delete API endpoint for Tử Vi
- [x] Add delete API endpoint for Numerology
- [x] Confirmation dialog before delete
- [x] Update history list after delete

### OG Image Generation
- [x] Create default OG image for website
- [x] Add OG meta tags to index.html
- [x] Create favicon.svg

### Compatibility Comparison Feature
- [x] New page for compatibility check (/compatibility)
- [x] Input forms for two people
- [x] Ngũ Hành (Five Elements) compatibility
- [x] Con Giáp (Zodiac) compatibility (Tam Hợp, Lục Hợp, Xung, Hại)
- [x] Numerology compatibility
- [x] AI analysis for detailed insights
- [x] Visual compatibility score display with circles
- [x] Advice section
- [x] Share buttons integration


## UI Improvements (User Request - Jan 9 - Batch 3)

### Form Input Improvements
- [x] Separate date input fields: Day, Month, Year
- [x] Add calendar type selector (Dương lịch / Âm lịch)
- [x] Add birth hour dropdown with Vietnamese zodiac hours
- [x] Add gender radio buttons (Nam / Nữ)
- [x] Clean form layout matching reference design
- [x] Updated Tử Vi, Numerology, and Compatibility forms

### Tử Vi Chart Redesign (4x4 Grid Layout)
- [x] Create 4x4 grid layout for 12 palaces
- [x] Center area with user info and destiny details
- [x] Show palace name with position
- [x] Show main stars (Chính tinh) in red/green colors
- [x] Show secondary stars (Phụ tinh) with proper formatting
- [x] Show palace number/score
- [x] Show Địa Chi at corners
- [x] Show Tràng Sinh and Ngũ Hành info
- [x] Color coding: red for auspicious (cát), green for inauspicious (hung)
- [x] Center info: Name, Year, Month, Day, Hour, Âm/Dương, Bản mệnh, Chủ mệnh, Chủ thân
- [x] Five elements display in center


## UI Improvements (User Request - Jan 9 - Batch 4)

### Tử Vi Chart Display - Detailed Layout
- [ ] Create detailed 4x4 grid component matching reference image
- [ ] Show all 12 palaces with full information
- [ ] Display palace number and name in each cell
- [ ] Show main stars (Chính tinh) with colors (red for cát, green for hung)
- [ ] Show secondary stars (Phụ tinh) below main stars
- [ ] Display Địa Chi (Earthly Branch) at corners
- [ ] Show Tràng Sinh cycle information
- [ ] Display Ngũ Hành (Five Elements) in center
- [ ] Center info panel with user details
- [ ] Generate chart as image for sharing/export

### Star & Palace Explanations
- [ ] Create modal/popover for palace details
- [ ] Add descriptions for each palace (12 cung)
- [ ] Add descriptions for each star (Tử, Phá, Thăng, etc.)
- [ ] Show star nature (cát/hung) and meaning
- [ ] Show palace relationships and influences
- [ ] Add click handlers to open explanations
- [ ] Smooth animations for modal open/close


## New Features (User Request - Jan 9 - Batch 5)

### Star Database (100+ Tử Vi Stars)
- [ ] Create stars table in database
- [ ] Add 100+ star records with Vietnamese names
- [ ] Add Chinese names for each star
- [ ] Add nature (cát/hung) for each star
- [ ] Add meaning/description for each star
- [ ] Add influence on different palaces
- [ ] Add remedies/solutions for bad stars
- [ ] Create API endpoint to fetch star details
- [ ] Add star explanations to modal

### Radar Chart for Indicators
- [ ] Create component for Radar chart using Recharts
- [ ] Calculate health score (0-100)
- [ ] Calculate finance score (0-100)
- [ ] Calculate romance score (0-100)
- [ ] Calculate career score (0-100)
- [ ] Display radar chart on result page
- [ ] Add interpretation text for each score
- [ ] Show recommendations based on scores
