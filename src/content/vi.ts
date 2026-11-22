import type { Dictionary } from "./types";

export const vi: Dictionary = {
  meta: {
    title: "Nguyễn Mạnh Hùng — Kỹ sư phần mềm tại Hà Nội",
    description:
      "Kỹ sư phần mềm tại Hà Nội, nhận làm trọn gói website, web app, app di động và tính năng AI cho doanh nghiệp và cửa hàng: làm theo hợp đồng, demo mỗi tuần, bàn giao đủ mã nguồn và tài khoản.",
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
    { id: "process", label: "Quy trình" },
    { id: "about", label: "Về tôi" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Liên hệ" },
  ],
  hero: {
    status: "Đang nhận dự án · Hà Nội, UTC+7",
    headline: "Làm phần mềm tới ngày chạy thật.",
    intro:
      "Tôi là Nguyễn Mạnh Hùng, kỹ sư phần mềm tại Hà Nội. Tôi nhận làm trọn gói website, web app, app di động và tính năng AI cho doanh nghiệp và cửa hàng: làm theo hợp đồng, demo mỗi tuần, bàn giao đủ mã nguồn và tài khoản.",
    primaryCta: "Gửi yêu cầu",
    secondaryCta: "Xem dự án",
    stripLabel: "Ảnh chụp các sản phẩm tôi đã làm",
    stripGroupLabel: "Ảnh chụp sản phẩm",
    stripPause: "Dừng dải ảnh",
    statsLabel: "Con số chính",
    figures: {
      live: "sản phẩm đang chạy thật",
      total: "sản phẩm đã và đang xây",
      sameClient: "sản phẩm do cùng một khách đặt liên tiếp",
      rankdleDays: "ngày từ dòng code đầu tới ngày Rankdle chạy thật",
    },
  },
  sections: {
    projects: {
      index: "01",
      label: "Dự án",
      heading: "Sản phẩm tôi đã làm",
      lede: "Năm sản phẩm, mỗi sản phẩm ghi rõ khách đặt, thời gian làm và trạng thái hiện tại.",
    },
    services: {
      index: "02",
      label: "Dịch vụ",
      heading: "Việc tôi nhận làm",
      lede: "Bốn loại việc, mỗi loại ghi rõ sản phẩm đã làm. Không thấy thứ bạn cần? Cứ nhắn, tôi sẽ trả lời thật.",
    },
    process: {
      index: "03",
      label: "Quy trình",
      heading: "Cách tôi làm việc",
      lede: "Năm bước rõ ràng. Bạn luôn biết dự án đang ở đâu và sắp có gì.",
    },
    about: {
      index: "04",
      label: "Về tôi",
      heading: "Một người nhận làm từ đầu tới ngày chạy thật",
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
      heading: "Gửi yêu cầu cho tôi",
      lede: "Kể tôi nghe bạn cần gì. Chọn kênh tiện nhất với bạn, tôi sẽ trả lời trong vòng 24 giờ.",
    },
  },
  work: {
    viewCaseStudy: "Xem dự án",
    live: "Xem sản phẩm",
    askSource: "Hỏi mua mã nguồn",
    statusLabels: {
      live: "Đang chạy",
      launching: "Sắp phát hành",
      forSale: "Bán mã nguồn",
      building: "Đang phát triển",
      testBuild: "Bản thử nghiệm",
    },
    items: {
      tingtingvac: {
        title: "TingTingVác",
        client: "Công ty TNHH Liên Phong Group",
        platform: "Ứng dụng iOS và Android, trang quản trị web, website",
        summary:
          "Nền tảng kết nối người cần chuyển đồ, bốc xếp hoặc lắp đặt nội thất với những người thợ đã được kiểm duyệt tại Hà Nội.",
        problem:
          "Người cần chuyển đồ, bốc xếp hoặc lắp đặt nội thất tại Hà Nội cần một nơi đăng việc và nhận báo giá từ những người thợ đã được kiểm duyệt.",
        delivered: [
          "Khách đăng việc, thợ ra giá, khách chọn trong mười mức giá thấp nhất, xác nhận công việc và đánh giá.",
          "Hồ sơ thợ do nhân viên duyệt, có hỗ trợ tổ đội và thợ thay thế.",
          "Tài khoản phí trả trước cho thợ, mọi thay đổi về tiền cần hai người duyệt.",
          "Trang quản trị cho nhân viên, cổng trực khẩn cấp, website công khai và trang xóa tài khoản.",
          "Đăng nhập bằng mã SMS và Google, thông báo đẩy và giám sát máy chủ.",
          "6.049 ca kiểm thử cơ sở dữ liệu đều đạt; máy chủ đặt tại Viettel IDC kèm một môi trường staging song song.",
        ],
        coverAlt: "Trang chủ website TingTingVác: tiêu đề thuê thợ bốc vác gần bạn và màn hình danh sách báo giá của thợ trong ứng dụng",
        galleryAlt: [
          "Phần bốn bước của website TingTingVác, từ đăng việc kèm ảnh tới nghiệm thu, cùng màn hình đăng việc và báo giá trong ứng dụng",
          "Phần website cho thấy tin đăng hiển thị với thợ, các loại việc thợ có thể chọn và màn hình gửi báo giá",
        ],
      },
      rankdle: {
        title: "Rankdle",
        client: "team Levi",
        platform: "Web, cài được như ứng dụng",
        summary: "Trò chơi hằng ngày: người chơi Mobile Legends xem clip rồi đoán hạng của người chơi trong clip.",
        delivered: [
          "Mỗi ngày ba clip có chấm điểm, rút từ một kho clip, cộng tối đa sáu clip thêm không tính điểm.",
          "Bảng xếp hạng theo kỳ, theo mùa và theo chuỗi ngày chơi, kèm bảng giải thưởng.",
          "Người chơi gửi clip, quản trị viên duyệt và che thông tin trước khi đăng.",
          "Chống gian lận: tối đa ba tài khoản trên một thiết bị và danh sách tài khoản đáng ngờ.",
          "Thông báo qua email và ngay trong trang.",
          "Trang quản trị để sửa nội dung, xem thống kê, sao lưu và khôi phục, bật chế độ bảo trì.",
          "3.570 bài kiểm thử tự động.",
        ],
        coverAlt: "Trang chủ Rankdle: tiêu đề Đoán Rank MLBB, các giải thưởng và nút Chơi ngay",
        galleryAlt: [
          "Hộp thoại Cách chơi Rankdle với ba bước: xem clip, chọn rank và leo bảng xếp hạng",
          "Trang Luật chơi của Rankdle với thể lệ, cách tính điểm và cơ cấu giải thưởng",
        ],
      },
      mythiep: {
        title: "mythiep",
        client: "Chủ thương hiệu mythiep",
        platform: "Web",
        summary:
          "Thiệp mời online tự phục vụ: chọn mẫu, trả tiền một lần, tự sửa ngay trên trình duyệt rồi chia sẻ bằng một đường link.",
        problem:
          "Chủ thiệp muốn tự hoàn thiện tấm thiệp: chọn mẫu, cá nhân hóa, gửi link và nhận phản hồi, không phải thuê designer.",
        delivered: [
          "51 mẫu thiệp thuộc sáu loại: cưới, sinh nhật, thôi nôi, tân gia, sự kiện và tốt nghiệp.",
          "Thanh toán một lần bằng VietQR qua SePay, có phương án dự phòng bằng webhook ngân hàng và đối soát.",
          "Gói Basic sửa chữ và ảnh; gói Pro sửa bố cục bằng kéo thả.",
          "Xác nhận tham dự (RSVP), lời chúc của khách và quà tặng ảo.",
          "Chế độ hiển thị toàn màn hình cho tiệc cưới.",
          "Trang quản trị cho mẫu thiệp, bảng giá và đơn hàng.",
          "Chương trình đại lý và đối tác giới thiệu.",
        ],
        choices: [
          {
            title: "Thanh toán SePay VietQR: mỗi thiệp trả một lần, thông báo thanh toán từ ngân hàng được xác thực bằng secret header và có đối soát dự phòng",
          },
          { title: "Ảnh thiệp lưu trên Cloudflare R2 dưới dạng webp nhiều kích thước (768/1200/1600 px), phục vụ bằng srcset thay vì next/image" },
          {
            title: "Next.js và Prisma trên PostgreSQL với 80 migration; ứng dụng và Redis chạy trong Docker trên VPS",
          },
          { title: "Cloudflare Turnstile cho form RSVP và lời chúc, để thiệp công khai nhận phản hồi mà không cần tài khoản và hạn chế spam" },
        ],
        coverAlt: "Danh mục mẫu thiệp của mythiep với 51 mẫu, chia theo loại thiệp và bộ lọc",
        galleryAlt: [
          "Trang mẫu thiệp cưới Phong bì vàng kim với danh sách tính năng và các nút dùng thử, xem demo",
          "Bản demo thiệp mời trên điện thoại: phong bì có dấu sáp vàng, chạm vào để mở thiệp",
        ],
      },
      hadi: {
        title: "Hadi",
        client: "Chủ sản phẩm Hadi",
        platform: "Ứng dụng iOS và Android, website giới thiệu, tiện ích Chrome",
        summary:
          "App ghi âm buổi giảng và hiển thị phụ đề dịch theo thời gian thực giữa tiếng Hàn hoặc tiếng Nhật và tiếng Việt, theo cả hai chiều.",
        problem:
          "Người học tiếng Hàn, Nhật cần phụ đề dịch theo thời gian thực trong buổi giảng kèm ghi chú có mốc thời gian.",
        delivered: [
          "Phụ đề song ngữ theo thời gian thực, dịch giữa tiếng Hàn hoặc tiếng Nhật và tiếng Việt, theo cả hai chiều.",
          "Tóm tắt bằng AI, sơ đồ tư duy và thẻ từ vựng.",
          "Lưu ưu tiên offline, đồng bộ nhiều thiết bị và không lưu âm thanh.",
          "Mua trong app trên Apple và Google Play, được xác minh ở phía server.",
          "Giao diện bốn ngôn ngữ: Việt, Anh, Hàn và Nhật.",
          "Tiện ích Chrome Hadi Live và website giới thiệu.",
          "Bản iOS đã có trên App Store (phiên bản 1.5); bản Android đang thử nghiệm kín.",
        ],
        choices: [
          {
            title: "Điện thoại stream âm thanh thẳng tới Soniox stt-rt-v6 qua WebSocket thô, dùng khóa tạm dùng một lần do Cloud Function cấp",
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
        coverAlt: "Trang chủ website Hadi: tiêu đề Theo kịp bài giảng và màn hình app đang ghi một buổi học",
        galleryAlt: [
          "Màn hình bản ghi trong app Hadi: câu gốc tiếng Hàn và bản dịch tiếng Việt xen kẽ theo mốc thời gian",
          "Màn hình bản ghi có phần tóm tắt AI với nội dung chính, thuật ngữ và câu hỏi ôn tập",
          "Thẻ từ vựng hiện ra trong app: một danh từ tiếng Hàn kèm nghĩa và giải thích bằng tiếng Việt",
          "Trang chủ app Hadi với nút Bắt đầu ghi, chế độ nghe và các tính năng nổi bật",
          "Màn hình đang ghi một buổi giảng với phụ đề song ngữ hiện theo thời gian thực",
        ],
      },
      tinvid: {
        title: "TinVid",
        client: "Sản phẩm riêng",
        platform: "Dòng lệnh, giao diện web chạy trên máy và bot Telegram",
        summary:
          "Biến một đường link bài báo, một chủ đề hoặc một đoạn văn thành video ngắn hoàn chỉnh, có kịch bản, hình động và giọng đọc tiếng Việt.",
        delivered: [
          "Kịch bản do AI viết, có bước kiểm tra sự kiện.",
          "Giọng đọc tiếng Việt kèm phụ đề theo từng từ.",
          "11 mẫu cảnh và 4 bộ màu.",
          "Bản dọc và bản ngang trong một lần chạy, kèm ảnh bìa, tiêu đề và mô tả.",
          "Dùng được bằng dòng lệnh, giao diện web chạy trên máy hoặc bot Telegram.",
          "Ước tính chi phí trước khi dựng video.",
          "Từng chạy như một dịch vụ trả phí tại tinvid.com trước khi tôi chuyển sang bán mã nguồn.",
        ],
        coverAlt: "Trang chủ TinVid: tiêu đề Biến bài viết thành video giọng Việt cùng hai khung xem trước video ngang và dọc",
        galleryAlt: [],
      },
    },
    building: {
      heading: "Khách của Hadi đặt tiếp hai app",
      lede: "Cùng một khách đã đặt Hadi, đặt tiếp hai app này. Cả hai chưa phát hành.",
      items: {
        classnote: {
          title: "classnote",
          summary:
            "App di động cho gia sư: lịch dạy, điểm danh, tự tính học phí, biên lai kèm VietQR, tự đối soát chuyển khoản ngân hàng và báo cáo cho phụ huynh.",
        },
        hanyu: {
          title: "Hanyu",
          summary:
            "App iPhone cho người Việt học tiếng Trung: 87 bài HSK 1–3, từ điển offline 1.049 mục và 680 câu luyện nói được chấm phát âm. Phiên bản 0.1.0.",
        },
      },
    },
  },
  caseStudy: {
    back: "Tất cả dự án",
    client: "Khách hàng",
    period: "Thời gian",
    platform: "Nền tảng",
    status: "Trạng thái",
    problem: "Bài toán",
    delivered: "Đã bàn giao",
    gallery: "Hình ảnh",
    links: "Liên kết",
    technical: "Chi tiết kỹ thuật, dành cho người làm kỹ thuật",
    why: "Lý do",
    tradeoff: "Đánh đổi",
    stack: "Công nghệ",
    next: "Dự án tiếp theo",
    previous: "Dự án trước",
  },
  services: {
    provenBy: "Sản phẩm đã làm",
    request: "Gửi yêu cầu cho loại việc này",
    items: {
      web: {
        title: "Website công ty và cửa hàng",
        description: "Website giới thiệu công ty, cửa hàng hoặc sản phẩm của bạn, hiển thị tốt trên điện thoại, kèm SEO cơ bản.",
        duration: "Landing page: 1–2 tuần",
      },
      webapp: {
        title: "Web app và hệ thống quản lý",
        description: "Hệ thống bạn dùng hằng ngày trên trình duyệt: đăng nhập, thanh toán, trang quản trị và thống kê.",
        duration: "1–3 tháng tùy phạm vi",
      },
      mobile: {
        title: "App iOS và Android",
        description: "App cho iPhone và Android, có thể dùng khi không có mạng và đồng bộ giữa nhiều thiết bị khi sản phẩm cần.",
      },
      ai: {
        title: "Tích hợp AI",
        description: "Đưa AI vào sản phẩm của bạn: phụ đề và dịch theo thời gian thực, tóm tắt, tạo kịch bản và giọng đọc.",
      },
    },
  },
  about: {
    paragraphs: [
      "Tôi là Nguyễn Mạnh Hùng, kỹ sư phần mềm ở Hà Nội. Tôi làm trọn một sản phẩm: từ cơ sở dữ liệu và máy chủ tới giao diện web và app di động, rồi đưa nó lên chạy thật.",
      "Tôi làm việc từ xa với khách trong và ngoài nước, họp qua Zoom hoặc Google Meet, và có thể gặp trực tiếp tại Hà Nội.",
      "Mỗi sản phẩm trên trang này đều ghi trạng thái thật, kể cả sản phẩm chưa phát hành. Nếu bạn cần một người làm trọn gói, hãy gửi yêu cầu cho tôi.",
    ],
    skillsTitle: "Công nghệ",
    skillGroups: [
      { name: "Web", items: ["React", "React Router", "Next.js", "TypeScript"] },
      { name: "Di động", items: ["React Native", "Expo", "Flutter", "SQLite"] },
      { name: "Máy chủ và dữ liệu", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Prisma", "Redis", "Firebase", "Cloud Functions"] },
      { name: "Hạ tầng", items: ["Docker", "Cloudflare Workers", "Cloudflare D1", "Cloudflare R2", "Mux", "Amazon SES", "Sentry"] },
      { name: "AI và video", items: ["Claude", "ElevenLabs", "Soniox", "Remotion"] },
    ],
  },
  process: {
    steps: [
      { title: "Trao đổi", duration: "1–2 ngày", description: "Tôi nghe yêu cầu của bạn, chốt phạm vi và những gì sẽ bàn giao. Buổi trao đổi đầu tiên miễn phí." },
      { title: "Thiết kế và kế hoạch", duration: "3–5 ngày", description: "Bản phác giao diện và kế hoạch làm việc. Bạn duyệt rồi tôi mới bắt đầu viết code." },
      { title: "Xây dựng", duration: "Theo phạm vi", description: "Tôi làm theo hợp đồng và demo mỗi tuần để bạn góp ý. Bạn luôn biết dự án đang ở đâu." },
      { title: "Ra mắt", duration: "1–2 ngày", description: "Đưa lên chạy thật, gắn tên miền, cài SEO cơ bản và hướng dẫn bạn dùng trang quản trị." },
      { title: "Hỗ trợ", duration: "30 ngày miễn phí", description: "Sửa lỗi và hướng dẫn trong 30 ngày đầu. Sau đó có gói bảo trì hàng tháng nếu bạn cần." },
    ],
    ownership: "Sau khi thanh toán đủ, mã nguồn, tên miền và tài khoản cửa hàng ứng dụng được bàn giao đứng tên bạn.",
    payment: "Thanh toán chia ba đợt: 30%, 40%, 30%.",
  },
  faq: {
    items: [
      { q: "Một sản phẩm tốn bao lâu để làm xong?", a: "Landing page: 1–2 tuần. Web app: 1–3 tháng tùy phạm vi. Tôi sẽ báo timeline cụ thể sau buổi trao đổi đầu tiên." },
      { q: "Bạn có nhận khách ngoài Hà Nội hoặc nước ngoài không?", a: "Có. Tôi làm việc từ xa hoàn toàn, họp qua Zoom hoặc Google Meet, trao đổi qua email hoặc Zalo tùy bạn quen. Nếu bạn ở Hà Nội, tôi có thể gặp trực tiếp." },
      { q: "Có hỗ trợ sau khi ra mắt không?", a: "30 ngày đầu tôi sửa lỗi miễn phí. Sau đó có gói bảo trì hàng tháng nếu bạn muốn tôi duy trì lâu dài." },
      { q: "Bạn dùng công nghệ gì? Tôi có cần biết code không?", a: "Tùy bài toán. Các sản phẩm gần đây của tôi dùng Next.js, React Native (Expo), Flutter và Node.js. Bạn không cần biết code: tôi giải thích bằng ngôn ngữ thường ngày." },
      { q: "Tôi đã có website cũ, bạn nâng cấp được không?", a: "Được, miễn là nó không bị khóa vào nền tảng đóng (Wix, Squarespace). Tôi xem xét miễn phí trước khi báo giá." },
      { q: "Thanh toán theo dạng nào?", a: "Thường chia ba đợt: 30% khi ký, 40% giữa dự án (khi bản demo ổn), 30% khi bàn giao. Chuyển khoản trong nước, hoặc Wise cho khách nước ngoài." },
      { q: "Tôi có sở hữu mã nguồn sau khi xong không?", a: "Có. Sau khi thanh toán đủ, mã nguồn thuộc về bạn 100%, kèm hướng dẫn triển khai và chỉnh sửa." },
    ],
  },
  contact: {
    labels: { zalo: "Zalo", phone: "Điện thoại", email: "Email", github: "GitHub", cv: "Tải CV" },
    response: "Trả lời trong vòng 24 giờ",
    form: {
      title: "Gửi yêu cầu",
      fields: {
        name: "Tên của bạn",
        company: "Công ty hoặc cửa hàng (nếu có)",
        reply: "Số điện thoại, Zalo hoặc email để tôi liên hệ lại",
        kind: "Loại việc",
        message: "Bạn cần làm gì",
        timeline: "Thời gian mong muốn (nếu có)",
      },
      kindPrompt: "Chọn loại việc",
      kinds: {
        web: "Website công ty hoặc cửa hàng",
        webapp: "Web app, hệ thống quản lý",
        mobile: "App iOS và Android",
        ai: "Tích hợp AI",
        other: "Việc khác",
      },
      placeholders: {
        message: "Mô tả ngắn việc bạn cần, ai sẽ dùng và dùng để làm gì.",
        timeline: "Ví dụ: cần xong trước tháng 3",
      },
      submit: "Gửi yêu cầu",
      sending: "Đang gửi…",
      success: "Đã gửi. Tôi sẽ trả lời bạn trong vòng 24 giờ.",
      failure: "Chưa gửi được yêu cầu. Bạn nhắn qua Zalo hoặc gọi 0971 084 430 giúp tôi nhé.",
      invalid: {
        name: "Vui lòng nhập tên của bạn.",
        company: "Tên công ty hoặc cửa hàng quá dài.",
        reply: "Vui lòng nhập số điện thoại, Zalo hoặc email hợp lệ.",
        kind: "Vui lòng chọn loại việc.",
        message: "Vui lòng mô tả việc bạn cần.",
        timeline: "Thời gian mong muốn quá dài.",
      },
      noScript: "Biểu mẫu cần JavaScript. Bạn có thể liên hệ trực tiếp qua các kênh bên cạnh.",
    },
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
