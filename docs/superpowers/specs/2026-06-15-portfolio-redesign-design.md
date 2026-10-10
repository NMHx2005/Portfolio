# Portfolio Redesign — Dark Aurora Studio

> **Superseded** by the 2026-10-10 Product Engineer redesign (`docs/superpowers/specs/2026-10-10-product-engineer-redesign-design.md`). Kept for history.

**Date**: 2026-06-15
**Owner**: Nguyễn Mạnh Hùng
**Status**: Approved, ready for implementation plan

---

## 1. Mục tiêu

Redesign hoàn toàn portfolio cá nhân để phục vụ 2 mục đích song song:

1. **Quảng bá hình ảnh cá nhân** — visual statement mạnh, đáng nhớ
2. **Thuyết phục khách hàng thuê làm website** — tăng uy tín, giảm ma sát khi liên hệ

Định vị: **Freelance Web Developer** (không còn là "intern tìm internship").

## 2. Non-goals

- Không xây CMS / blog backend (section blog sẽ ẩn cho đến khi có content)
- Không integrate email service (contact dùng CTA trực tiếp, không có form)
- Không thay portrait/logo thật (tiếp tục dùng `portrait.svg` placeholder, user sẽ swap sau)
- Không bổ sung dự án giả/concept (giữ LMS + MinhLoc đến khi user cung cấp thêm)
- Không build i18n routing (`/vi`, `/en`) — giữ client-side locale toggle như hiện tại
- Không refactor những phần không phục vụ redesign (giữ `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`)

## 3. Design direction — "Dark Aurora Studio"

**Vibe**: high-end developer studio. Dark default + light toggle. Nền aurora gradient, glassmorphism, accent neon. Premium, technical, đáng tin.

### 3.1 Color tokens

Định nghĩa qua CSS variables trong `globals.css`, dùng OKLCH cho gamut rộng + dark/light mode đảo cặp.

| Token                   | Dark                                                             | Light                 |
| ----------------------- | ---------------------------------------------------------------- | --------------------- |
| `--background`          | `#070617`                                                        | `#FAFAFA`             |
| `--background-elevated` | `#0d0d24`                                                        | `#FFFFFF`             |
| `--foreground`          | `#F5F5FA`                                                        | `#0A0A1F`             |
| `--muted-foreground`    | `#9A9AB8`                                                        | `#5C5C7A`             |
| `--border`              | `rgba(255,255,255,0.08)`                                         | `rgba(10,10,30,0.08)` |
| `--primary`             | `#8B5CF6` (violet 500)                                           | giữ                   |
| `--accent`              | `#06B6D4` (cyan 500)                                             | giữ                   |
| `--secondary`           | `#EC4899` (pink 500)                                             | giữ                   |
| `--gradient-aurora`     | `linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)` | giữ                   |

Theme mặc định: `dark`. Toggle giữ `next-themes`.

### 3.2 Typography

- **Sans (body, UI)**: `Geist Sans` (đã có) — `--font-geist-sans`
- **Mono (code, kbd, accents)**: `Geist Mono` (đã có) — `--font-geist-mono`
- **Display (headline lớn, italic dramatic)**: `Instrument Serif` (mới) — `--font-display`
  - Import qua `next/font/google`
  - Dùng cho h1, h2 lớn, accent phrase (kèm `italic` để tạo điểm nhấn editorial)

Type scale (mobile → desktop):

- Display: `clamp(2.5rem, 6vw, 5rem)`
- H1: `clamp(2rem, 5vw, 4rem)`
- H2: `clamp(1.75rem, 3.5vw, 2.75rem)`
- H3: `clamp(1.25rem, 2vw, 1.75rem)`
- Body: `1rem` → `1.125rem`

### 3.3 Layout & spacing

- Container max-width: `1280px`
- Section vertical padding: `clamp(80px, 12vw, 160px)`
- Grid: 12 cols desktop, 6 cols tablet, 4 cols mobile
- Generous whitespace, "breathy"

### 3.4 Cursor

- Custom magnetic cursor follower (desktop ≥1024px, có pointer fine)
- Auto-disable trên touch device
- Scale up khi hover lên CTA, link, project card
- Mix-blend-mode `difference` để readable trên mọi nền

## 4. Information Architecture

8 sections, trình tự cố định trên 1 trang. Bỏ blog/testimonials/awards section hoàn toàn (xoá file để gọn).

| #   | Section ID  | Mục đích                                                  |
| --- | ----------- | --------------------------------------------------------- |
| 1   | `#hero`     | Hook + positioning + 2 CTA chính                          |
| 2   | `#services` | 4 dịch vụ cụ thể, tăng "thuê được"                        |
| 3   | `#projects` | LMS + MinhLoc — case-study style                          |
| 4   | `#stack`    | Tech marquee, visual proof                                |
| 5   | `#process`  | 5 bước làm việc, giảm lo lắng khách                       |
| 6   | `#about`    | Câu chuyện + values ngắn gọn                              |
| 7   | `#faq`      | 6-8 Q&A khách hay hỏi                                     |
| 8   | `#contact`  | Multi-channel CTAs (Email, Zalo, Phone, GitHub, LinkedIn) |

Header sticky, có nav anchor đến từng section + theme toggle + language switcher.

## 5. Per-section detail

### 5.1 Hero

**Mục đích**: 5 giây đầu thuyết phục khách "đây là người làm web nghiêm túc, có gu".

**Layout**:

- Full viewport height (`min-h-screen`)
- Left: text block (greeting, name display, role, 1-line value prop, 2 CTAs)
- Right: portrait + floating "tech card" với code snippet style (giữ ý tưởng `CoderProfileCard` hiện tại nhưng redesign)
- Background: aurora gradient blob theo cursor + grid pattern overlay

**Copy mới (VI)**:

- Greeting: "Xin chào, tôi là"
- Name: "Nguyễn Mạnh Hùng"
- Role headline: "Freelance Web Developer"
- Value prop: "Tôi xây website nhanh, đẹp, chạy mượt — từ landing page đến web app full-stack."
- CTAs:
  - Primary: "Xem dự án" → `#projects`
  - Secondary: "Thuê tôi" → `#contact`

**Copy mới (EN)**:

- Greeting: "Hi, I'm"
- Role: "Freelance Web Developer"
- Value prop: "I build fast, beautiful, reliable websites — from landing pages to full-stack web apps."
- CTAs: "View work" / "Hire me"

**Animations**:

- GSAP intro timeline (load): split text reveal từng chữ (name → role → value prop), portrait drop-in với scale, CTA stagger
- Aurora blob theo cursor (`gsap.quickTo`)
- Grid pattern parallax nhẹ khi scroll

### 5.2 Services (MỚI)

**Mục đích**: trả lời câu hỏi "anh nhận làm gì" — quan trọng nhất cho conversion.

**Layout**: grid 2x2 (desktop) / stack (mobile). Mỗi card có icon, title, 1 line mô tả, list 3-4 bullets.

**4 services**:

1. **Landing Page / Website giới thiệu**
   - Cho: doanh nghiệp nhỏ, sự kiện, cá nhân, portfolio
   - Bullets: SEO chuẩn, mobile-first, animation đẹp, deploy free trên Vercel
   - Giá: KHÔNG hiển thị trong v1 (để khách inbox hỏi). Có thể bật sau qua flag `showPricing` trong content.

2. **Web Application Full-Stack**
   - Cho: SaaS, dashboard, hệ thống nội bộ
   - Bullets: React + Next.js, API Node.js, database, auth, admin panel

3. **E-Commerce / Bán hàng online**
   - Cho: shop, brand, đa kênh
   - Bullets: thanh toán, quản lý sản phẩm/đơn, tích hợp Zalo/Facebook, dashboard

4. **Custom CMS / Bảo trì website**
   - Cho: khách đã có web cần nâng cấp/bảo trì
   - Bullets: refactor, performance, SEO audit, content editor riêng

**Animations**:

- Card stagger fade-up khi scroll vào (GSAP ScrollTrigger)
- 3D tilt theo cursor (Motion `useMotionValue` + `useTransform`)
- Icon morph khi hover (Motion `whileHover`)

### 5.3 Projects (case-study redesign)

**Mục đích**: chứng minh có làm thật, có sản phẩm sống.

**Layout**: sticky-pin scroll. Khi scroll, image bên phải pin lại, content bên trái thay đổi (problem → solution → result + metrics → links). 1 project = 1 viewport.

**Per-project structure**:

- Category tag (E-Learning, E-Commerce, …)
- Title
- 1-2 dòng problem statement
- Solution: tech stack chips
- Highlights: 3-4 bullets
- Metrics: số liệu (placeholder, đợi user cung cấp số thật)
- 2 buttons: Live site + GitHub

**Animations**:

- GSAP ScrollTrigger pin (`pin: true`, scrub)
- Image crossfade giữa các project
- Number counter animation cho metrics
- Tech chip stagger entrance

### 5.4 Tech Stack (MỚI)

**Mục đích**: visual proof về breadth công nghệ. Khách lướt qua thấy logo quen thuộc → yên tâm.

**Layout**: 2 hàng marquee (1 chạy trái → phải, 1 chạy phải → trái), pause on hover.

**Logos** (~20 cái, dùng `lucide-react` + SVG inline cho các logo riêng):

- Frontend: React, Next.js, TypeScript, Tailwind, Framer Motion, GSAP, Material-UI
- Backend: Node.js, Express, MongoDB, MySQL, Socket.io, JWT, Cloudinary
- Tools: Git, GitHub, Vercel, Postman, Figma

**Animations**:

- GSAP `to` infinite marquee (yoyo: false, repeat: -1)
- Hover logo → tilt + glow accent

### 5.5 Process (MỚI)

**Mục đích**: trấn an khách "anh làm có quy trình, không phải làm bừa". Giảm bounce ở giai đoạn đang đắn đo.

**5 bước** (vertical timeline):

1. **Discovery (1-2 ngày)** — nghe yêu cầu, xác định scope, báo giá
2. **Design & Plan (3-5 ngày)** — wireframe, design mockup, tech plan
3. **Build (theo scope)** — code, demo từng tuần, feedback loop
4. **Launch (1-2 ngày)** — deploy, domain, SEO basics, hướng dẫn admin
5. **Support (30 ngày miễn phí)** — fix bug, hướng dẫn, sau đó option bảo trì

**Layout**: sticky number bên trái, content bên phải scroll qua. Tương tự pattern của projects nhưng đơn giản hơn.

**Animations**:

- Number scale-in khi step active
- Progress line vẽ dọc theo scroll
- Content fade-slide khi vào view

### 5.6 About

**Mục đích**: nhân hoá. Khách thấy 1 con người, không chỉ 1 dịch vụ.

**Layout**: 2 cols — left là chân dung/avatar nhỏ (dùng `portrait.svg` placeholder hiện tại, user thay sau) + 3 value chips, right là story 2 đoạn.

**Copy mới (VI)**:

> Tôi là Hùng, sinh viên năm 3 Công nghệ Thông tin tại Đại học Mở Hà Nội. Nhưng tôi không chờ tốt nghiệp mới bắt đầu — tôi đã làm web full-stack được vài năm và đang nhận dự án freelance.
>
> Tôi thích những thứ chạy nhanh, nhìn đẹp, và làm xong rồi vẫn còn dùng tốt 5 năm sau. Nếu bạn cần một người làm web hiểu cả code lẫn UX, gửi mình email.

**Values** (3 chips): "Clean code", "User-first", "Ship on time"

**Animations**:

- Word-by-word fade-up cho story (GSAP SplitText)
- Value chips magnetic hover

### 5.7 FAQ (MỚI)

**Mục đích**: trả lời câu hỏi khách hay hỏi → giảm friction → tăng tỉ lệ liên hệ.

**Layout**: accordion (single open). 6-8 Q&A.

**Câu hỏi mẫu** (VI):

1. Một website tốn bao lâu để làm xong?
2. Chi phí trung bình bao nhiêu?
3. Anh nhận khách ngoài Hà Nội / nước ngoài không?
4. Có hỗ trợ sau khi launch không?
5. Anh dùng công nghệ gì? Tôi có cần biết code không?
6. Tôi đã có web cũ, anh nâng cấp được không?
7. Thanh toán theo dạng nào?
8. Tôi có sở hữu source code sau khi xong không?

User sẽ viết câu trả lời sau, mình điền draft ban đầu.

**Animations**:

- Accordion expand/collapse với Motion `AnimatePresence` + `layout`
- Icon chevron rotate
- Hover row glow

### 5.8 Contact

**Mục đích**: đường dẫn liên hệ rõ ràng, đa kênh, không có form làm khó.

**Layout**:

- Big headline ("Hãy nói chuyện với tôi")
- 1 dòng intro
- 5 CTA tiles lớn, full-width grid: Email, Zalo, Phone, GitHub, LinkedIn
- Mỗi tile có icon, label, value, arrow

**Channels**:

- Email: `` (mailto:)
- Zalo: link Zalo (cần user cung cấp, placeholder tạm `https://zalo.me/0971084430`)
- Phone: `+84 971 084 430` (tel:)
- GitHub: `https://github.com/NMHx2005`
- LinkedIn: placeholder, user điền sau

**Animations**:

- Tile magnetic hover
- Icon morph trên hover
- Curtain reveal khi scroll vào

## 6. Animation system — GSAP + Framer Motion phân vai

| Library           | Vai trò                                                   | Khi nào dùng                                                              |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| **GSAP**          | Scroll-triggered, timeline phức tạp, performance critical | Hero intro, section pin, marquee, scroll-driven number, split text reveal |
| **Framer Motion** | React-integrated, micro-interactions, layout transitions  | Hover state, 3D tilt, accordion, theme toggle morph, page transition      |
| **Lenis**         | Smooth scroll global                                      | Giữ nguyên                                                                |

### 6.1 GSAP setup

- Plugins cần: `ScrollTrigger` (free)
- Split text reveal: KHÔNG dùng GSAP `SplitText` (Club premium). Tự implement helper `splitWords()` / `splitChars()` chia `<span>` rồi GSAP animate — đủ cho use case này, không phụ thuộc license
- Register plugin một lần ở `src/lib/gsap.ts`, import client-side
- Tất cả GSAP hook trong React component dùng `@gsap/react`'s `useGSAP()` để cleanup an toàn

### 6.2 Reduce motion

- Tất cả non-essential animation phải respect `prefers-reduced-motion: reduce`
- Custom hook `useReducedMotion()` (Motion đã có sẵn) để skip GSAP timeline khi user không muốn
- Mobile (≤768px) disable: custom cursor, 3D tilt, parallax depth

### 6.3 Performance

- GSAP `will-change` chỉ apply khi đang animate (cleanup sau)
- Image: dùng `next/image` cho mọi raster, lazy load mặc định
- Aurora blob: dùng CSS gradient + GSAP transform, không re-render React
- Marquee: `transform3d` để GPU accelerate

## 7. Tech additions

### 7.1 Dependencies thêm

```json
"gsap": "^3.13.0",
"@gsap/react": "^2.1.2"
```

### 7.2 Dependencies bỏ

```json
// devDependencies
"pdf-parse": "^2.4.5"   // không dùng ở đâu cả
```

### 7.3 Font thêm

`Instrument Serif` qua `next/font/google` trong `layout.tsx`.

## 8. File structure mới

```
src/
├── app/
│   ├── layout.tsx                    # cập nhật fonts + default theme dark
│   ├── page.tsx                      # rewrite, mount sections mới
│   ├── globals.css                   # cập nhật tokens + reduced-motion query
│   ├── blog/                         # XÓA (placeholder rỗng)
│   └── api/contact/                  # XÓA (không dùng form nữa)
├── components/
│   ├── effects/                      # MỚI
│   │   ├── custom-cursor.tsx
│   │   ├── aurora-background.tsx
│   │   ├── magnetic.tsx              # wrapper cho element bất kỳ
│   │   ├── tilt-card.tsx
│   │   ├── split-text.tsx            # GSAP SplitText wrapper
│   │   └── number-counter.tsx
│   ├── sections/
│   │   ├── hero-section.tsx          # rewrite
│   │   ├── services-section.tsx      # MỚI
│   │   ├── projects-section.tsx      # rewrite (sticky pin)
│   │   ├── stack-section.tsx         # MỚI (marquee)
│   │   ├── process-section.tsx       # MỚI
│   │   ├── about-section.tsx         # rewrite (gọn lại)
│   │   ├── faq-section.tsx           # MỚI
│   │   ├── contact-section.tsx       # rewrite (CTA tiles)
│   │   ├── experience-section.tsx    # XÓA (education ngắn được nhắc inline trong About)
│   │   ├── awards-section.tsx        # XÓA
│   │   ├── testimonials-section.tsx  # XÓA
│   │   └── blog-section.tsx          # XÓA
│   ├── providers/                    # giữ
│   ├── site-header.tsx               # cập nhật nav, theme default
│   ├── site-footer.tsx               # gọn lại
│   ├── action-button.tsx             # cập nhật magnetic
│   ├── section-header.tsx            # giữ, có thể tinh chỉnh
│   ├── language-switcher.tsx         # giữ
│   ├── theme-toggle.tsx              # giữ, morph icon
│   ├── animated-section.tsx          # giữ, có thể nâng cấp với GSAP
│   └── hero/coder-profile-card.tsx   # rewrite hoặc bỏ tuỳ hero mới
├── hooks/                            # MỚI
│   ├── use-magnetic.ts
│   ├── use-tilt.ts
│   ├── use-cursor.ts
│   └── use-media-query.ts
├── lib/
│   ├── gsap.ts                       # MỚI: register + config
│   ├── animations.ts                 # MỚI: reusable timelines
│   ├── schemas.ts                    # XÓA (contact form bỏ)
│   └── utils.ts                      # giữ
├── config/
│   └── site.ts                       # cập nhật positioning
└── content/
    └── index.ts                      # rewrite hoàn toàn cho freelance positioning
```

## 9. Content strategy

### 9.1 Locale

- VI làm default (browser detect → VI fallback, có thể detect `navigator.language` startsWith "vi")
- EN có sẵn đầy đủ, switcher rõ ở header
- LocaleProvider giữ nguyên architecture, chỉ đổi default value

### 9.2 Content rewrite scope

Toàn bộ `src/content/index.ts` rewrite cho positioning freelance. Schemas thêm cho các section mới:

- `ServiceContent`
- `ProcessContent`
- `FaqContent`
- `ContactChannel` (thay cho `ContactContent` cũ)

Schemas cũ không dùng nữa sẽ xoá: `Testimonial`, `Award`, `BlogPost`, `BlogContent`.

### 9.3 SEO metadata

Update `siteConfig` (trong `src/config/site.ts`):

- `description`: copy freelance-focused
- `keywords`: thêm "freelance web developer", "thuê làm website", "next.js developer hanoi"
- `name`: "Nguyễn Mạnh Hùng — Freelance Web Developer"

OG image: dùng `og-cover.svg` hiện tại trong v1. Remake là việc ngoài scope (xem section 12).

## 10. Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>` với `aria-labelledby`
- Skip-to-content link
- Focus ring rõ ràng (không bỏ outline)
- Tất cả icon button có `aria-label`
- Color contrast WCAG AA cho cả 2 theme
- Reduced motion: tất cả non-essential animation skip / instant

## 11. Performance budget

- LCP: < 2.5s trên 3G fast
- Total JS: < 200kb gzip first load
- Cursor + heavy effect chỉ load trên desktop (dynamic import)
- Image: `next/image`, AVIF/WebP, sizes prop chính xác
- GSAP plugin import on-demand từng section, không global

## 12. Out of scope (defer)

| Item                            | Lý do                 | Khi nào quay lại           |
| ------------------------------- | --------------------- | -------------------------- |
| Real portrait image             | User chưa có ảnh thật | Khi user gửi ảnh           |
| Thêm dự án ngoài LMS + MinhLoc  | User sẽ cung cấp sau  | Sau khi có dự án mới       |
| Testimonials section            | Không có quote thật   | Khi có ≥3 testimonial thật |
| Real email integration (Resend) | User chọn bỏ form     | Nếu user đổi ý             |
| Blog                            | Không có content      | Khi user muốn viết         |
| i18n routing `/vi`, `/en`       | Phức tạp, overkill    | Sau khi có traffic đáng kể |
| Real Zalo/LinkedIn link         | Cần user cung cấp     | Trước khi production       |
| FAQ answers nội dung thật       | User chỉnh sau        | Trước khi production       |

## 13. Acceptance criteria

Để coi là done:

1. ✅ 8 section render đúng theo IA, layout responsive ≥360px
2. ✅ Hero intro timeline chạy mượt, không layout shift
3. ✅ Projects section pin/scroll hoạt động trên Chrome/Safari/Firefox
4. ✅ Tech marquee chạy infinite, pause on hover
5. ✅ Custom cursor chỉ active desktop, không lag
6. ✅ Theme toggle hoạt động, không flash
7. ✅ Locale toggle hoạt động, default VI
8. ✅ `prefers-reduced-motion` được respect (test bằng DevTools)
9. ✅ Lighthouse mobile ≥ 90 (Performance, Accessibility, SEO)
10. ✅ Không có console error / warning
11. ✅ Build production thành công (`next build`)
12. ✅ Tất cả CTA contact dẫn đúng channel (mailto, tel, https)

## 14. Open questions

Cần user trả lời trước khi production:

1. Link Zalo chính xác (hiện đoán theo số phone)?
2. Có LinkedIn không, URL?
3. Có muốn show giá tham khảo trong Services không, hay ẩn?
4. FAQ answers — user viết hay mình draft trước rồi user duyệt? (default: mình draft)
5. Domain triển khai: vẫn `nmhx.info`?
