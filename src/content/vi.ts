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
      { label: "Đã ra mắt", value: "HNWedding và Hadi — đang chạy production" },
      { label: "Đang học", value: "Công nghệ thông tin, Đại học Mở Hà Nội" },
    ],
  },
  sections: {
    projects: {
      index: "01",
      label: "Dự án",
      heading: "Sản phẩm đã ra mắt",
      lede: "Hai sản phẩm đang chạy thật ngoài production. Mở case study để xem bài toán và các lựa chọn kỹ thuật.",
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
      themes: "theme thiệp",
      migrations: "DB migration",
      commits: "commit",
      languages: "ngôn ngữ",
      version: "phiên bản",
    },
    items: {
      hnwedding: {
        title: "HNWedding",
        category: "Thiệp cưới điện tử · Agency platform",
        summary:
          "Nền tảng vận hành kiểu agency: khách đặt đơn công khai, đội ngũ dựng thiệp bằng block editor riêng rồi xuất bản tại /thiep/[slug].",
        status: "Đang chạy production",
        problem:
          "Các cặp đôi muốn thiệp cưới online đẹp, cá nhân hóa theo câu chuyện riêng. Công cụ kéo-thả có sẵn không đủ tinh tế, còn thuê dev riêng cho từng thiệp thì không mở rộng được.",
        choices: [
          {
            title: "Block editor riêng để đội ngũ dựng và xuất bản thiệp",
            why: "Công cụ kéo-thả có sẵn không đủ tinh tế, còn thuê dev riêng cho từng thiệp thì không mở rộng được.",
          },
          { title: "Next.js 16 App Router + Prisma 7 + Supabase PostgreSQL, TypeScript strict" },
          { title: "Thanh toán VietQR/PayOS" },
          { title: "Ảnh lưu trên Cloudflare R2, email tự động qua Resend" },
        ],
        flow: ["Khách đặt đơn công khai", "Admin dựng thiệp bằng block editor", "Xuất bản tại /thiep/[slug]"],
        services: [
          { label: "Dữ liệu", detail: "Prisma 7 trên Supabase PostgreSQL" },
          { label: "Đăng nhập", detail: "Auth.js" },
          { label: "Thanh toán", detail: "VietQR / PayOS" },
          { label: "Ảnh", detail: "Cloudflare R2" },
          { label: "Email", detail: "Resend" },
        ],
        shipped: [
          "Luồng đặt đơn công khai → admin dựng và xuất bản thiệp qua block editor riêng.",
          "4+ theme thiệp dựng sẵn (Gold Philosopher, Sage Classic, Wing Door…).",
          "Thanh toán VietQR/PayOS, email tự động qua Resend.",
          "Đang chạy production.",
        ],
        imageAlt: "Giao diện nền tảng thiệp cưới HNWedding",
      },
      hadi: {
        title: "Hadi",
        category: "Ứng dụng di động · React Native",
        summary:
          "App stream phụ đề dịch hai chiều Hàn/Nhật ↔ Việt theo thời gian thực, lưu offline-first rồi đồng bộ Firestore sau buổi học.",
        status: "Đang chạy production",
        problem:
          "Người học tiếng Hàn, Nhật cần phụ đề dịch theo thời gian thực trong buổi giảng kèm ghi chú có mốc thời gian. Đa số app dịch giọng nói chỉ hỗ trợ một chiều, độ trễ cao hoặc không lưu lại được bài học.",
        choices: [
          { title: "WebSocket thô tới Soniox stt-rt-v5, không dùng SDK; stream hai chiều Hàn/Nhật ↔ Việt trên cùng một socket" },
          { title: "Dịch hybrid qua Cloud Functions: Gemini 3.5 Flash-Lite → Gemini 3.6 Flash → Claude (fallback)" },
          { title: "Offline-first: lưu bằng expo-sqlite, đồng bộ Firestore đa thiết bị sau buổi học" },
          { title: "Đăng nhập Apple/Email qua Firebase Auth, theo Apple HIG" },
        ],
        flow: [
          "Giọng nói",
          "Soniox stt-rt-v5 (WebSocket)",
          "Cloud Functions: Gemini → Claude fallback",
          "Phụ đề song ngữ realtime",
          "expo-sqlite (offline)",
          "Đồng bộ Firestore",
        ],
        services: [
          { label: "Lưu trữ cục bộ", detail: "expo-sqlite" },
          { label: "Đồng bộ", detail: "Firestore" },
          { label: "Xác thực", detail: "Firebase Auth (Apple, Email)" },
        ],
        shipped: [
          "Phụ đề song ngữ realtime Hàn/Nhật ↔ Việt trên cùng một socket.",
          "Lưu offline-first bằng expo-sqlite, đồng bộ Firestore đa thiết bị.",
          "Đăng nhập Apple/Email qua Firebase Auth, theo Apple HIG.",
          "Đang chạy production, phiên bản V6.",
        ],
        imageAlt: "Giao diện ứng dụng dịch bài giảng Hadi",
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
    platforms: { web: "Web", mobile: "Mobile" },
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
    principlesLabel: "Nguyên tắc",
    principles: ["Clean code", "User-first", "Ship on time"],
    skillsTitle: "Công nghệ",
    skillGroups: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Material-UI", "Framer Motion", "GSAP"] },
      { name: "Mobile", items: ["React Native", "Expo", "expo-sqlite"] },
      {
        name: "Backend & dữ liệu",
        items: ["Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB", "MySQL", "Socket.io", "Firebase", "Auth.js", "JWT"],
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
  notFound: {
    title: "Không tìm thấy trang",
    text: "Đường dẫn này không tồn tại hoặc đã được chuyển đi.",
    cta: "Về trang chủ",
  },
};
