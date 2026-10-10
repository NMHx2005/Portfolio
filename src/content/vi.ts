import type { Dictionary } from "./types";

export const vi: Dictionary = {
  meta: {
    title: "Nguyễn Mạnh Hùng — Product Engineer (Web & Mobile)",
    description:
      "Product engineer tại Hà Nội, xây sản phẩm web và mobile bằng React, Next.js, React Native và Node.js. Đang nhận dự án freelance.",
  },
  a11y: {
    skip: "Bỏ qua, tới nội dung chính",
    mainNav: "Điều hướng chính",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    toggleTheme: "Đổi giao diện sáng/tối",
    switchLanguage: "Đổi ngôn ngữ",
    copyEmail: "Sao chép email",
    copied: "Đã sao chép",
    copyFailed: "Không sao chép được",
    backToTop: "Lên đầu trang",
  },
  nav: [
    { id: "projects", label: "Dự án" },
    { id: "services", label: "Dịch vụ" },
    { id: "about", label: "Về mình" },
    { id: "process", label: "Quy trình" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Liên hệ" },
  ],
  hero: {
    status: "Đang nhận dự án · Hà Nội, UTC+7",
    headline: "Product engineer xây sản phẩm web và mobile.",
    intro:
      "Mình là Nguyễn Mạnh Hùng. Mình xây sản phẩm web và mobile rồi đưa chúng vào production — hiện đang nhận dự án freelance.",
    primaryCta: "Xem dự án",
    secondaryCta: "Liên hệ",
    nowTitle: "Hiện tại",
    updatedLabel: "Cập nhật",
    now: [
      { label: "Đã ra mắt", value: "mythiep và Hadi chạy production; crossweave mã nguồn mở" },
      { label: "Đang học", value: "Công nghệ thông tin, Đại học Mở Hà Nội" },
    ],
  },
  sections: {
    projects: {
      index: "01",
      label: "Dự án",
      heading: "Sản phẩm đã ra mắt",
      lede: "Hai sản phẩm đang chạy production và một công cụ mã nguồn mở. Mở case study để xem bài toán và các lựa chọn kỹ thuật.",
    },
    services: {
      index: "02",
      label: "Dịch vụ",
      heading: "Mình có thể giúp gì",
      lede: "Bốn loại việc mình nhận thường xuyên. Không thấy thứ bạn cần? Cứ nhắn, mình sẽ trả lời thật.",
    },
    about: {
      index: "03",
      label: "Về mình",
      heading: "Một người làm web hiểu cả code lẫn UX",
    },
    process: {
      index: "04",
      label: "Quy trình",
      heading: "Cách mình làm việc",
      lede: "Quy trình 5 bước rõ ràng. Bạn biết chính xác đang ở đâu và sắp có gì.",
    },
    faq: {
      index: "05",
      label: "FAQ",
      heading: "Câu hỏi thường gặp",
      lede: "Những điều khách hay hỏi nhất trước khi bắt đầu.",
    },
    contact: {
      index: "06",
      label: "Liên hệ",
      heading: "Hãy nói chuyện với mình",
      lede: "Sẵn sàng nhận dự án mới. Chọn kênh tiện nhất với bạn, mình sẽ trả lời trong vòng 24 giờ.",
    },
  },
  work: {
    viewCaseStudy: "Xem case study",
    live: "Xem sản phẩm",
    repository: "Mã nguồn",
    metricLabels: {
      templates: "mẫu thiệp",
      migrations: "DB migration",
      commits: "commit",
      languages: "ngôn ngữ",
      version: "phiên bản",
      license: "giấy phép",
      testFiles: "file test",
    },
    items: {
      mythiep: {
        title: "mythiep",
        category: "Thiệp mời online · SaaS tự phục vụ",
        summary:
          "Sản phẩm thiệp mời online tự phục vụ: chọn mẫu, trả tiền một lần, tự sửa ngay trên trình duyệt rồi xuất bản thành một đường link để khách xác nhận tham dự. Không phí duy trì hằng năm.",
        status: "Đang chạy production",
        problem:
          "Chủ thiệp muốn tự hoàn thiện một tấm thiệp trong một ngày: chọn mẫu, cá nhân hóa, gửi link và nhận phản hồi — không phải thuê designer và không phải trả phí hằng năm để giữ thiệp trực tuyến.",
        choices: [
          {
            title: "Puck làm trình chỉnh sửa canvas, chỉ nạp ở phần editor; thiệp công khai render bằng <Render> của Puck",
            why: "Puck mặc định xếp bố cục theo luồng, trong khi mẫu thiệp dùng vị trí tuyệt đối, nên mình chạy một spike giới hạn thời gian trên canvas tối giản trước khi viết schema. Spike cho thấy vị trí tuyệt đối dùng được khi chỉ gắn react-moveable ở phía editor, và editor không bao giờ được tải xuống máy khách mời.",
          },
          {
            title: "Thanh toán SePay: form POST có chữ ký (HMAC-SHA256) và thông báo thanh toán được xác thực bằng secret header, mỗi thiệp trả một lần, giá Basic/Pro theo từng loại thiệp",
          },
          { title: "Ảnh thiệp lưu trên Cloudflare R2 dưới dạng webp nhiều kích thước (768/1200/1600 px), phục vụ bằng srcset thay vì next/image" },
          {
            title: "Next.js 16 và Prisma 7 trên PostgreSQL: app và Redis chạy trên VPS, cơ sở dữ liệu ở Supabase chỉ dùng như Postgres thuần (không dùng Supabase Auth, Storage hay Realtime)",
          },
          { title: "Cloudflare Turnstile cho form RSVP và lời chúc, để thiệp công khai nhận phản hồi mà không cần tài khoản và hạn chế spam" },
        ],
        flow: ["Chọn mẫu thiệp", "Trả tiền một lần (SePay VietQR)", "Tự sửa trên trình duyệt", "Xuất bản tại /thiep/[slug]", "Khách xác nhận tham dự (RSVP)"],
        services: [
          { label: "Dữ liệu", detail: "Prisma 7 trên PostgreSQL (Supabase)" },
          { label: "Đăng nhập", detail: "Auth.js" },
          { label: "Thanh toán", detail: "SePay (VietQR)" },
          { label: "Ảnh", detail: "Cloudflare R2" },
          { label: "Cache và hàng đợi", detail: "Redis" },
          { label: "Giám sát", detail: "Sentry" },
        ],
        shipped: [
          "51 mẫu thuộc sáu loại thiệp: cưới, sinh nhật, thôi nôi, tân gia, sự kiện và tốt nghiệp.",
          "Gói Basic sửa qua form; gói Pro mở trình chỉnh sửa canvas đầy đủ.",
          "Mua một lần cho mỗi tấm thiệp, thanh toán qua SePay VietQR.",
          "Khối RSVP, sổ mừng và bản đồ trên thiệp đã xuất bản.",
          "Khu quản trị cho loại thiệp, mẫu, bảng giá, đơn hàng và hóa đơn.",
          "Đang chạy tại mythiep.com.",
        ],
        imageAlt: "Danh mục mẫu thiệp của mythiep, các mẫu được nhóm theo loại",
      },
      hadi: {
        title: "Hadi",
        category: "Ứng dụng di động · React Native",
        summary:
          "App ghi âm buổi giảng và hiển thị phụ đề dịch hai chiều Hàn/Nhật ↔ Việt theo thời gian thực, lưu offline-first rồi đồng bộ sau buổi học.",
        status: "Đang chạy production",
        problem:
          "Người học tiếng Hàn, Nhật cần phụ đề dịch theo thời gian thực trong buổi giảng kèm ghi chú có mốc thời gian. Đa số app dịch giọng nói chỉ hỗ trợ một chiều, độ trễ cao hoặc không lưu lại được bài học.",
        choices: [
          {
            title: "Điện thoại stream âm thanh thẳng tới Soniox stt-rt-v5 qua WebSocket thô, dùng khóa tạm dùng một lần do Cloud Function cấp",
            why: "Khóa gốc của nhà cung cấp không bao giờ được nằm trong client. Khóa tạm chỉ có quyền phiên âm và hết hạn sau 300 giây.",
            tradeoff: "Soniox là nhà cung cấp duy nhất trên đường ghi âm: nếu nó ngừng, ghi âm và dịch realtime cũng ngừng, nên bắt buộc có cảnh báo số dư và giám sát lỗi.",
          },
          {
            title: "Mọi xử lý AI hậu kỳ chạy trong Cloud Functions: tóm tắt, dịch lại, nhãn lịch sự và tra chữ Hán",
          },
          { title: "Offline-first: buổi học lưu trong expo-sqlite, đồng bộ Firestore đa thiết bị sau mỗi buổi" },
          { title: "Không lưu âm thanh, chỉ lưu transcript và bản dịch; Firestore security rules chặn mọi truy cập chéo giữa người dùng" },
          {
            title: "Gói design token dùng chung kèm test sẽ đỏ nếu có màu viết cứng và kiểm tra tương phản WCAG AA bằng số trên 56 cặp màu",
          },
        ],
        flow: [
          "Giọng nói",
          "Soniox stt-rt-v5 (WebSocket, khóa tạm)",
          "Phụ đề song ngữ realtime",
          "expo-sqlite (offline)",
          "Đồng bộ Firestore",
          "Cloud Functions: tóm tắt và dịch lại",
        ],
        services: [
          { label: "Lưu trữ cục bộ", detail: "expo-sqlite" },
          { label: "Đồng bộ và dữ liệu", detail: "Firestore" },
          { label: "Xác thực", detail: "Firebase Auth (Apple, Email)" },
          { label: "Logic phía server", detail: "Cloud Functions" },
          { label: "Thanh toán", detail: "Apple in-app purchase, xác minh ở server" },
        ],
        shipped: [
          "Phụ đề song ngữ realtime Hàn/Nhật ↔ Việt trên cùng một socket.",
          "Lưu offline-first bằng expo-sqlite, đồng bộ Firestore đa thiết bị.",
          "Website giới thiệu xây bằng Next.js.",
          "Hadi Live, tiện ích Chrome tạo phụ đề cho âm thanh của tab (đang phát triển).",
          "Đang chạy production, app phiên bản 1.3.2.",
        ],
        imageAlt: "Website Hadi với app đang ghi một buổi giảng và phụ đề song ngữ realtime",
      },
      crossweave: {
        title: "crossweave",
        category: "Công cụ cho lập trình viên · Mã nguồn mở",
        summary:
          "Cockpit chạy local để điều khiển nhiều phiên làm việc trên cùng một repo, mỗi phiên nằm trong một git worktree riêng, rồi gộp chúng lại mà không phải merge tay.",
        status: "Mã nguồn mở · v0.5.0",
        problem:
          "Chạy nhiều coding agent hoặc dev server song song trên một repo thì cuối ngày phải merge tay, và các lượt chạy song song còn đụng nhau ở cổng, cache và cơ sở dữ liệu.",
        choices: [
          {
            title: "Một phiên là một git worktree cộng một shell trong đó, có khối cổng, thư mục cache và tên database hoặc Docker (tùy chọn) riêng",
            why: "Chỉ cô lập file là chưa đủ: các lượt chạy song song còn đụng nhau ở cổng và trạng thái dùng chung.",
          },
          {
            title: "Một daemon chạy nền thử merge các phiên với nhau, nên khi land biết phiên nào an toàn để gộp và theo thứ tự nào",
          },
          {
            title: "crossweave không chọn, cấu hình hay khởi chạy agent; thứ gì chạy trong shell là do bạn quyết",
            tradeoff: "Một số tính năng bị gỡ có chủ đích (collision radar, điều khiển từ xa qua trình duyệt, nhập giọng nói trong app) và vẫn truy cập được qua các tag phát hành.",
          },
          { title: "Bun cho CLI và daemon, đóng gói thành binary đã biên dịch; Electron kèm Vite cho cockpit trên desktop" },
          { title: "Gói debug cho AI: một bản tóm tắt gọn, đã xóa secret, về lý do phiên thất bại, để dán thẳng vào trợ lý" },
        ],
        flow: ["cw session new", "Làm việc trong worktree của phiên", "cw converge status", "cw check", "cw land all"],
        services: [
          { label: "Runtime", detail: "Bun (macOS, Linux)" },
          { label: "Desktop", detail: "Electron + Vite" },
          { label: "Phân phối", detail: "GitHub Releases, trình cài đặt có kiểm tra checksum" },
        ],
        shipped: [
          "Cô lập theo worktree với cổng, cache và tên database riêng cho từng phiên.",
          "Convergence engine: ma trận xung đột từng cặp, thứ tự merge được đề xuất và land-all.",
          "Cockpit desktop với thanh danh sách phiên, trình soạn prompt gửi một prompt tới nhiều phiên và so sánh song song.",
          "Phân phối và tự cập nhật, giao diện terminal và thông báo.",
          "Mã nguồn mở theo giấy phép MIT, phiên bản 0.5.0.",
        ],
        imageAlt: "Cockpit của crossweave: thanh danh sách phiên bên trái và hai khung agent cạnh nhau",
      },
    },
  },
  caseStudy: {
    back: "Tất cả dự án",
    role: "Vai trò",
    platform: "Nền tảng",
    status: "Trạng thái",
    stack: "Công nghệ",
    links: "Liên kết",
    problem: "Bài toán",
    choices: "Lựa chọn kỹ thuật",
    why: "Lý do",
    tradeoff: "Đánh đổi",
    architecture: "Kiến trúc",
    flow: "Luồng chính",
    services: "Dịch vụ hỗ trợ",
    shipped: "Đã bàn giao",
    facts: "Thông tin thêm",
    next: "Dự án tiếp theo",
    previous: "Dự án trước",
    platforms: { web: "Web", mobile: "Mobile", tool: "Công cụ lập trình" },
  },
  services: {
    items: [
      {
        title: "Sản phẩm web",
        description: "SaaS, dashboard và hệ thống nội bộ: frontend, API, database, đăng nhập và trang quản trị.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
      },
      {
        title: "Ứng dụng di động",
        description: "App React Native/Expo chạy offline-first, đồng bộ nhiều thiết bị, tích hợp realtime và AI.",
        tags: ["React Native", "Expo", "SQLite", "Firebase"],
      },
      {
        title: "Website và cửa hàng online",
        description: "Landing page, website giới thiệu và cửa hàng: chuẩn SEO, mobile-first, thanh toán và quản lý đơn hàng.",
        tags: ["Next.js", "SEO", "Payments"],
      },
      {
        title: "Nâng cấp và bảo trì",
        description: "Refactor, tối ưu hiệu năng và SEO, content editor riêng, bảo trì hàng tháng cho website đang chạy.",
        tags: ["Performance", "SEO", "Maintenance"],
      },
    ],
  },
  about: {
    paragraphs: [
      "Mình là Hùng, product engineer ở Hà Nội. Mình làm full-stack: từ database và API đến giao diện, rồi đưa lên production.",
      "Mình là sinh viên Công nghệ thông tin tại Đại học Mở Hà Nội, đã làm web full-stack được vài năm và đang nhận dự án freelance.",
      "Mình thích những thứ chạy nhanh, nhìn đẹp và làm xong rồi vẫn còn dùng tốt 5 năm sau. Nếu bạn cần một người làm web hiểu cả code lẫn UX, hãy nhắn mình.",
    ],
    habitsLabel: "Cách mình làm kỹ thuật",
    habits: [
      {
        title: "Test nằm cạnh code",
        detail: "Hơn 900 file test trong mythiep, hơn 500 trong Hadi và hơn 200 trong crossweave; mình viết test cùng lúc với tính năng chứ không để sau.",
      },
      {
        title: "Quyết định được viết ra trước khi code",
        detail: "Các tính năng lớn bắt đầu bằng spec và plan. mythiep chạy một spike giới hạn thời gian cho trình chỉnh sửa và ghi lại quyết định trước khi chốt schema.",
      },
      {
        title: "Khóa bí mật không bao giờ nằm trong client",
        detail: "Hadi cấp khóa tạm 300 giây cho app; mythiep xác thực thông báo thanh toán bằng chữ ký và secret header ở phía server.",
      },
      {
        title: "Khả năng tiếp cận được đo bằng số",
        detail: "Hadi có test tương phản WCAG AA trên 56 cặp màu. Chính website này chạy axe trong e2e và đạt 100 điểm Accessibility trên Lighthouse.",
      },
      {
        title: "Hiệu năng được đo chứ không đoán",
        detail: "Website này đạt 99 điểm Performance trên Lighthouse mobile với CLS 0; phương pháp đo và số liệu thô được lưu trong repo.",
      },
    ],
    skillsTitle: "Công nghệ",
    skillGroups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Material-UI", "Framer Motion", "GSAP", "Electron"] },
      { name: "Mobile", items: ["React Native", "Expo", "expo-sqlite"] },
      {
        name: "Backend & dữ liệu",
        items: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "MySQL", "Socket.io", "Firebase", "Auth.js", "JWT", "Redis", "Bun"],
      },
      { name: "Hạ tầng & công cụ", items: ["Vercel", "Supabase", "Cloudflare R2", "Git", "GitHub", "Postman", "Figma"] },
    ],
    portraitAlt: "Chân dung Nguyễn Mạnh Hùng",
  },
  process: {
    steps: [
      { title: "Discovery", duration: "1–2 ngày", description: "Nghe yêu cầu, xác định phạm vi, sản phẩm bàn giao và báo giá. Không tính phí." },
      { title: "Design & Plan", duration: "3–5 ngày", description: "Wireframe, mockup và kế hoạch kỹ thuật. Bạn duyệt rồi mới code." },
      { title: "Build", duration: "Theo phạm vi", description: "Code, demo từng tuần, phản hồi liên tục. Không bao giờ biến mất." },
      { title: "Launch", duration: "1–2 ngày", description: "Deploy, domain, SEO cơ bản, hướng dẫn quản trị. Sẵn sàng đón khách." },
      { title: "Support", duration: "30 ngày miễn phí", description: "Sửa lỗi, hướng dẫn. Sau đó có gói bảo trì hàng tháng nếu cần." },
    ],
  },
  faq: {
    items: [
      { q: "Một sản phẩm tốn bao lâu để làm xong?", a: "Landing page: 1–2 tuần. Web app: 1–3 tháng tùy phạm vi. Mình sẽ báo timeline cụ thể sau buổi Discovery." },
      { q: "Chi phí trung bình bao nhiêu?", a: "Phụ thuộc phạm vi. Landing page khởi đầu từ vài triệu, web app từ vài chục triệu. Nhắn mình để báo giá cụ thể cho dự án của bạn." },
      { q: "Bạn có nhận khách ngoài Hà Nội hoặc nước ngoài không?", a: "Có. Mình làm việc remote toàn bộ, họp qua Zoom/Google Meet, trao đổi qua email/Zalo/Slack tùy bạn quen." },
      { q: "Có hỗ trợ sau khi launch không?", a: "30 ngày đầu miễn phí sửa lỗi. Sau đó có gói bảo trì hàng tháng nếu bạn muốn mình duy trì lâu dài." },
      { q: "Bạn dùng công nghệ gì? Tôi có cần biết code không?", a: "Mặc định React + Next.js cho frontend, Node.js cho backend, React Native (Expo) cho app di động. Bạn không cần biết code — mình giải thích bằng ngôn ngữ thường ngày." },
      { q: "Tôi đã có website cũ, bạn nâng cấp được không?", a: "Được, miễn là không bị khóa vào nền tảng đóng (Wix, Squarespace). Mình audit miễn phí trước khi báo giá." },
      { q: "Thanh toán theo dạng nào?", a: "Thường chia 3 đợt: 30% khi ký, 40% giữa dự án (demo ổn), 30% khi bàn giao. Chuyển khoản Việt Nam hoặc Wise cho khách nước ngoài." },
      { q: "Tôi có sở hữu mã nguồn sau khi xong không?", a: "Có. Sau khi thanh toán đủ, mã nguồn thuộc về bạn 100%, kèm hướng dẫn deploy và chỉnh sửa." },
    ],
  },
  contact: {
    labels: { email: "Email", telegram: "Telegram", phone: "Điện thoại", github: "GitHub", cv: "Tải CV" },
    response: "Trả lời trong vòng 24 giờ",
  },
  palette: {
    open: "Mở bảng lệnh",
    placeholder: "Tìm mục, dự án hoặc hành động…",
    empty: "Không có kết quả",
    groups: { sections: "Mục", projects: "Dự án", actions: "Hành động" },
    actions: {
      copyEmail: "Sao chép email",
      github: "Mở GitHub",
      switchLanguage: "Switch to English",
      toggleTheme: "Đổi giao diện sáng/tối",
    },
    hint: "↑↓ chọn · Enter mở · Esc đóng",
  },
  footer: {
    tagline: "Sẵn sàng cho dự án mới.",
    note: "© 2026 Nguyễn Mạnh Hùng. Xây dựng tại Hà Nội bằng Next.js.",
  },
};
