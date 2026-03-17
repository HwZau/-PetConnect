# 🎤 FOODFUND PRESENTATION - SPEECH NOTES & TALKING POINTS

## SLIDE 1: KIẾN TRÚC HỆ THỐNG (System Architecture)

### Opening Statement (30 seconds)
"FoodFund được xây dựng với một kiến trúc hiện đại, microservices-based, kết hợp React trên frontend, Node.js và Express trên backend, PostgreSQL làm cơ sở dữ liệu chính, kèm theo message broker Kafka và Debezium để đồng bộ dữ liệu real-time. Điều này cho phép chúng tôi xây dựng một platform không chỉ nhanh, mà còn có khả năng mở rộng vô hạn để phục vụ hàng triệu người dùng."

### Explaining Architecture (2-3 minutes)

**Presentation Tier (Frontend):**
"Trên frontend, chúng tôi sử dụng React kết hợp TypeScript để đảm bảo type safety. Giao diện được thiết kế mobile-first, responsive trên tất cả thiết bị. Donors thấy campaign listings, fundraisers quản lý campaigns, admins review proposals. Chúng tôi sử dụng WebSocket từ Socket.IO để cập nhật real-time - khi có donation mới, campaign progress bar update ngay trên màn hình của fundraiser."

**API Layer (Communication):**
"Giao tiếp giữa frontend và backend thông qua GraphQL - client chỉ request dữ liệu cần thiết, không over-fetch. Ví dụ, mobile app chỉ lấy campaign title, goal, progress bar - không cần toàn bộ 2000 characters description. Còn giữa các microservices, chúng tôi dùng gRPC - protocol nhị phân, nhanh hơn JSON 7 lần."

**Business Logic Tier (Microservices):**
"Backend được tổ chức thành các microservice độc lập:
- User Service quản lý authentication, profile, roles
- Campaign Service xử lý campaign CRUD, publishing
- Donation Service ghi lại mỗi lần donate
- Payment Service tích hợp với RayOS (payment gateway)
- Disbursement Service quản lý proposal và money transfer
- Notification Service gửi email, SMS, push notification
- Analytics Service tính toán metrics

Mỗi service có thể scale riêng. Nếu donations tăng đột ngột, ta chỉ cần scale Donation Service, không cần touch cái khác."

**Data Tier (Database & Cache):**
"PostgreSQL là primary database - ACID transactions đảm bảo tính toàn vẹn dữ liệu, đặc biệt quan trọng với money. Valkey (distributed cache) lưu campaign listings, leaderboards - giảm database load 50-60%. Khi campaign được update, cache auto-invalidate."

**Message Broker (Asynchronous Communication):**
"BullMQ là job queue cho Node.js - khi donation được tạo, thay vì khiến API response chậm, ta push một job 'send-receipt-email' vào queue, response lập tức. Background worker xử lý job và gửi email. Nếu email service down, job retry automatically.

Kafka là event streaming - mỗi donation được publish như event, multiple consumers đều nhận (Analytics Service, Notification Service, Audit Log Service). Nếu thêm consumer mới, ta không cần touch producer code."

**Event Streaming (Debezium):**
"Debezium monitors PostgreSQL transaction log, capture mỗi INSERT/UPDATE/DELETE. Khi fundraiser update campaign, Debezium detect ngay, stream to Kafka. Cache invalidation service subscribe, clear cache. Real-time dashboard service subscribe, update UI. Audit log service subscribe, record mỗi change. Tất cả này xảy ra automatically, không cần explicit code."

### Key Points to Emphasize:
✅ "Reliability: Multi-layer redundancy - nếu một service down, platform vẫn hoạt động"
✅ "Real-time Updates: WebSocket ensure donors see campaign progress live"
✅ "Microservices-Ready: 8 independent services, mỗi cái có thể deploy riêng"
✅ "Event-Driven: Kafka + Debezium + BullMQ create loosely-coupled architecture"
✅ "Scalability: Each service horizontal scale based on load"

---

## SLIDE 2: TECH STACK

### Opening (20 seconds)
"Hành trình kỹ thuật của FoodFund là lựa chọn cẩn thận các công nghệ đã được chứng minh trong production, được cộng đồng hỗ trợ mạnh, và có performance tốt nhất cho charity platform."

### Frontend Technologies (1 minute)

"**React** với TypeScript là foundation - React cho component reusability, TypeScript cho type safety. Khi developer nhập (donationAmount: "abc"), TypeScript yêu cầu là number trước khi compile.

**Vite** làm build tool - 10x nhanh hơn Webpack. Lúc develop, save file → browser auto-refresh trong 100ms. Rất thoải mái.

**TailwindCSS** cho styling - utility-first CSS. Thay vì viết `background-color: #007bff`, ta viết `bg-blue-500`. Design consistency built-in, components nhìn unified.

**GraphQL** client (Apollo) cho data fetching - type-safe queries, auto-caching, real-time subscriptions for live updates."

### Backend Technologies (1.5 minutes)

"**Node.js** runtime - cho phép chúng tôi chạy JavaScript server-side. Async I/O model rất tốt cho operations như file upload (kitchen receipts), email sending, database queries. I/O không block.

**Express.js** framework - lightweight, flexible. Với Fastify hay NestJS, bạn phải tuân thủ framework patterns. Express cho bạn freedom để structure code theo cách thích hợp cho domain (fundraising, donations, etc.).

**PostgreSQL** database - chọn vì:
1. ACID transactions - money không bao giờ invalid
2. JSON support - campaign details, metadata flexible
3. Advanced queries - GROUP BY, window functions tính analytics
4. Migrations - version control database schema

**Valkey** (Redis alternative) cache - campaigns, donor leaderboards, session storage. Hit rate 85%+ = database queries giảm đáng kể.

**BullMQ** job queue - background tasks (send emails, generate reports, process image uploads) không block API response. Retry logic, progress tracking built-in.

**Kafka** event streaming - handle 1000s donations per second, multiple consumers subscribe mà không conflict. Perfect for scaling analytics pipeline."

### DevOps & Deployment (1 minute)

"**Docker** containerization - app + dependencies packaged together. Dev laptop chạy được = production chạy được. Không gặp 'works on my machine' problem.

**Kubernetes** orchestration - auto-scaling (100 concurrent users → 3 pods, 10,000 concurrent users → 30 pods), load balancing (request distribute evenly), self-healing (pod crash → restart automatically).

**GitHub Actions** CI/CD - mỗi push code, tự động run tests, linting, build, deploy. Bad code không bao giờ reach production.

**Vercel** frontend hosting - React app push lên GitHub → Vercel auto-build, deploy, CDN distribute. Deploy time 2-3 minutes.

**Debezium** change data capture - database changes automatically stream to Kafka, efficient data propagation."

### Technical Advantages (1 minute)

"Với stack này, chúng tôi đạt được:
- **Response Time**: < 100ms API latency ngay cả với 10,000 concurrent users
- **Reliability**: 99.95% uptime SLA - nếu một server crash, request tự động route sang server khác
- **Maintainability**: TypeScript + structured services = code dễ hiểu, dễ refactor
- **Cost**: Open-source stack, không license fee. Pay only for compute usage.
- **Scalability**: Add more servers không cần refactor code
- **Developer Velocity**: Deploy multiple times per day nếu cần, dengan zero downtime"

---

## SLIDE 3: ACTORS & ROLES

### Opening (20 seconds)
"FoodFund không phải platform chỉ cho một loại người dùng. Đó là một hệ sinh thái phức tạp với 5 diễn viên chính, mỗi người có role khác nhau, quyền hạn khác nhau."

### DONOR - Người Quyên Góp (1.5 minutes)

"Donor là trái tim của platform. Họ là người có tiền, có tâm, muốn giúp đỡ.

Hành động của Donor:
1. **Browse campaigns** - Xem các chiến dịch hiện đang active
2. **Choose campaign** - Lựa chọn chiến dịch thích hợp (child welfare, elderly, disaster relief)
3. **Donate money** - Transfer qua MoMo/Bank, bất ký lúc nào
4. **View history** - Xem tất cả donation đã từng làm
5. **Get receipt** - Download proof for tax deduction
6. **Share campaign** - Post lên social media để bạn bè cùng donate
7. **Leave review** - Comment trên campaign, chia sẻ cảm xúc

Donor motivations:
- Help people in need (primary)
- Tax reduction (Vietnam allows charity deduction)
- Community recognition (see name on leaderboard)
- Impact measurement (see exactly how money used)

In Vietnam, we have 30-40 million people with disposable income. Nếu 2% quyên góp trung bình 1M/year cho charity, đó là 600B VND market. FoodFund target capture 10% = 60B revenue potential."

### ADMIN - Người Quản Lý Platform (1.5 minutes)

"Admin là gatekeeper của platform. Chỉ 2-3 người manage mọi thứ, decision-making power rất lớn.

Responsibilities:
1. **Verify Fundraisers** - Xem documents, confirm organization legitimate
2. **Approve Campaigns** - Review campaign mới, duyệt publish
3. **Approve Disbursements** - Khi fundraiser muốn dùng tiền, admin verify ngân sách, approve money release
4. **Handle Disputes** - Nếu donor khiếu nại, admin mediate
5. **Review Receipts** - Verify kitchen staff purchased ingredients honestly
6. **Monitor Analytics** - Track GMV, user growth, fraud patterns
7. **Send Announcements** - Communicate platform updates

Admin authority yêu cầu judgment call. Mỗi decision có impact lớn trên trust. Nếu admin approve fraudulent campaign, donors mất tin. Nếu admin quá strict, legitimate campaigns bị reject, fundraisers frustrated."

### FUNDRAISER - Người Tạo Chiến Dịch (1.5 minutes)

"Fundraisers là people or organizations có mission muốn làm good.

Ví dụ:
- NGO muốn feed orphans
- Hospital muốn buy equipment
- School muốn build library
- Community muốn build water well

Actions:
1. **Create campaign** - Tạo campaign với title, description, goal, budget breakdown, photos
2. **Submit for approval** - Gửi cho admin review
3. **Track progress** - Xem real-time donations coming in
4. **Post updates** - Share photos, videos of impact as money được sử dụng
5. **Request disbursement** - Khi fund reaches threshold, propose use of funds
6. **Download report** - Export donors list, transaction history, impact metrics

Fundraisers cần:
- Access to donors (FoodFund provides)
- Accountability (admin oversight prevent embezzlement)
- Trust (donors know campaign legitimate)
- Support (FoodFund help with logistics)

Fundraisers commission: Không - FoodFund take 3% fee từ donors, 97% go không campaign. Rất transparent."

### KITCHEN STAFF - Nhân Viên Nấu Ăn (1 minute)

"Kitchen staff là actual heroes - họ prepare meals.

Workflow:
1. Admin approve disbursement → Kitchen staff notified
2. Staff receive task with budget & menu
3. Purchase ingredients (with receipts uploaded to app)
4. Cook meals to nutrition standard
5. Package meals
6. Mark 'ready for delivery'

Responsibilities:
- Execute meals to quality standard
- Submit receipts (proof of expense)
- Maintain food safety (hygiene, temperature)
- Track inventory
- Report issues

Kitchen staff working with platform:
- Transparency (every receipt verified)
- Efficiency (no cash handling, all digital)
- Career (job registration on platform, builds credential)
- Accountability (if found cheating, job lost)"

### DELIVERY STAFF - Nhân Viên Giao Hàng (1 minute)

"Delivery staff phân phối meals to beneficiaries.

Workflow:
1. Receive task: Route, meal count, beneficiary locations
2. Pick up from kitchen (11:30am)
3. Navigate using GPS
4. Deliver to locations (verify recipient, take photo)
5. Mark complete

Responsibilities:
- Safe transportation
- Accurate delivery to assigned beneficiaries
- Photo documentation
- Handle customer concerns
- Report delivery issues

Example delivery:
- 200 meals to 3 locations
- Location 1: Children's Home (100 kids)
- Location 2: Day-care Center (50 kids)
- Location 3: Shelter (50 kids)
- 4-hour operation, all on platform's delivery tracking map"

### Permission Matrix (on slide)

| Action | Donor | Fundraiser | Admin | Kitchen | Delivery |
|--------|-------|-----------|-------|---------|----------|
| Browse campaigns | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create campaign | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve campaign | ❌ | ❌ | ✅ | ❌ | ❌ |
| Donate | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve disbursement | ❌ | ❌ | ✅ | ❌ | ❌ |
| Upload receipts | ❌ | ❌ | ✅ | ✅ | ✅ |

### Key Interaction Pattern (30 seconds)

"Flow cơ bản từ donor perspective:
Donor → Browse → See 'Feed Orphans' → Read story → Donate 500k → Scan QR → Confirm payment → See receipt → Track impact

Flow từ fundraiser perspective:
Fundraiser → Create campaign → Submit → Admin review → Publish → Collect donations → Request disbursement → Kitchen prepares → Delivery distributes → Post photos updating donors"

---

## SLIDE 4: DONATION & TRANSACTIONS FLOW (MAIN FLOW)

### Opening (30 seconds)
"Donation là heart của platform - nó phải secure, transparent, fast. Hôm nay chúng tôi trace một actual donation từ đầu đến cuối, xem mỗi step xảy ra cái gì."

### Step 1: Campaign Discovery 🔍 (1 minute)

"Imagine, Anh Tú mở FoodFund app chiều thứ 5. Anh ta thấy:
- Featured section: 'Feed Orphans in An Giang' - goal 100M, raised 45M, 523 donors
- Recommended campaigns based on his donation history (child welfare)
- Top campaigns by trending (raising fastest this week)
- Filter options: charity type, location, urgency

Anh Tú intrigued về 'Feed Orphans'. Click vào campaign detail page. See full story:

'In An Giang province, 500 orphan children live in 3 facilities. Current budget only support 1 rice bowl per day. Nutritionists recommend 3 meals daily for proper development. Our goal: Provide 3 nutritious meals for 90 days, totaling 15,000 meals. Your donation directly purchase rice, chicken, vegetables, cook, deliver to mouth of hungry kids.'

Anh Tú see:
- Photos: Before (sparse), After (nutritious meals)
- Fundraiser: Mercy Foundation (verified, 4.9/5 rating)
- Breakdown: 60% food, 20% preparation, 15% delivery, 5% platform fee
- 523 donors already contributed
- Average donation: 200k VND
- Remaining days: 85 days"

### Step 2: Choose Amount & Method 💰 (1 minute)

"Anh Tú think 'Help 1 kid for 1 day = 7k VND per meal × 3 = 21k. I donate 500k = support 24 kids for 1 day, OK good.'

Click 'Donate Now' button.

Step 2a - Select amount:
Anh Tú see:
- Suggested amounts: 100k, 200k, 500k, 1M (with impact description)
- Or custom amount

Select 500k. Platform show:
'Your donation will feed approximately 24 children for 1 day'
'Cost per meal (after all expenses): ~7k VND'

Step 2b - Select payment method:
- MoMo (instant transfer, 99% Vietnamese use)
- TPBank (traditional banking)
- Future: Stripe, PayPal

Select MoMo.

Step 2c - Confirm
Screen shows:
- Campaign: Feed Orphans
- Amount: 500,000 VND
- Platform fee: 15,000 VND (3%, separate from donation)
- Total to transfer: 515,000 VND
- Fundraiser receives: 485,000 VND (97%)

[CONFIRM & CONTINUE]"

### Step 3: Payment Processing 🔄 (1.5 minutes)

"Screen now show QR code + countdown timer (2 minutes).

Backend called RayOS (payment gateway):
```
POST /api/payment/create
{
  orderId: "DO_20260317_12345",
  amount: 515000,
  description: "Donation - Feed Orphans",
  paymentMethod: "momo",
  callbackUrl: "https://foodfund.vn/api/payment/webhook",
  timeoutSeconds: 120
}
```

RayOS generates QR code pointing to MoMo payment.

Anh Tú:
1. Open MoMo app on phone
2. Tap 'Scanner' button
3. Point camera at screen
4. MoMo recognize QR code
5. Show transfer form:
   - Account: 0834339521
   - Name: Nguyễn Hữu Giàu
   - Amount: 515,000 VND
   - Message: 'Donation - Feed Orphans Campaign'
   - Fee: 1,000 VND (MoMo fee)
6. Anh Tú enter PIN
7. MoMo process transfer
8. Confirm screen: 'Transfer successful. Reference: 20260317ABC123'

Meanwhile on FoodFund:
- Timer counting down: 119, 118, 117...
- Status: 'Waiting for payment confirmation...'
- Behind scenes: Frontend polling every 3 seconds to RayOS webhook endpoint"

### Step 4: Payment Verification & Recording 📝 (1.5 minutes)

"MoMo send webhook to FoodFund:
```
POST /api/payment/webhook
{
  orderId: 'DO_20260317_12345',
  status: 'PAID',
  amount: 515000,
  referenceNo: '20260317ABC123',
  paidAt: '2026-03-17T14:30:45Z'
}
```

Backend verify:
1. Signature correct? (HMAC verify prevent spoofing) ✅
2. Amount match? (515k = 515k) ✅
3. Order exist in database? (DO_20260317_12345 recorded) ✅

If all pass, create donation record:
```
INSERT INTO donations VALUES (
  id: UUID(),
  donorId: 'anh-tu-123',
  campaignId: 'campaign-456',
  amount: 500000,
  platformFee: 15000,
  paymentMethod: 'momo',
  referenceNo: '20260317ABC123',
  status: 'completed',
  createdAt: NOW()
)
```

Update campaign progress:
```
UPDATE campaigns
SET raised = raised + 500000
WHERE id = 'campaign-456'
```

Result: 45M + 500k = 45.5M (45.5% of 100M goal)

Publish event to Kafka:
```
Topic: donations.created
{
  donationId: 'donation-xyz',
  campaignId: 'campaign-456',
  amount: 500000,
  date: '2026-03-17T14:30:45Z'
}
```

Multiple consumers subscribe:
- **Analytics Service**: Update stats (daily donation count, average amount, trending campaigns)
- **Notification Service**: Prepare emails to send
- **Audit Log Service**: Record for compliance
- **Dashboard Service**: Update real-time campaign progress bar"

### Step 5: Immediate User Feedback ✅ (1 minute)

"On Anh Tú's screen:
- Timer stop
- QR code disappear
- Big green checkmark ✅
- Message: 'Donation successful!'
- Impact card: 'Your donation will feed approximately 24 children for 1 day'
- Action buttons:
  * [Continue] (go back to campaign)
  * [Share on Facebook] (viral growth)
  * [View Receipt] (PDF download for tax)

Receipt contain:
- Donation amount: 500k
- Campaign: Feed Orphans
- Date: March 17, 2026
- Reference: 20260317ABC123
- For tax purpose: [QR code to verify with tax office]

Campaign page update live:
- Raised: 45.5M (was 45M)
- Progress bar: 45.5% (fill more)
- Donor count: 524 (was 523)
- Recent donor section: 'Nguyễn Hữu Tú donated 500k 1m ago'"

### Step 6: Notifications Sent 📢 (1 minute)

"Email to Anh Tú:
```
Subject: ✅ Thank you for your donation!

Dear Anh Tú,

Your donation of 500,000 VND to 'Feed Orphans in An Giang' 
has been successfully recorded.

Impact:
- Meals: 24 children × 3 meals = 72 meals
- Duration: 1 day of nutrition
- Reference: 20260317ABC123

Your Impact Progress:
Track your donations on campaign page: [link]

Tax Receipt:
For your tax deduction: [download PDF]

Thank You! ❤️
— FoodFund Team
```

Email to Fundraiser (Mercy Foundation):
```
Subject: 💚 New donation received - 500k VND!

Dear Mercy Foundation,

Great news! Your campaign 'Feed Orphans' received a new donation.

Campaign Progress:
- Previous: 45M / 100M (45%)
- New: 45.5M / 100M (45.5%)
- Donor count: 524
- Day: 32/90

You're on track! Keep sharing updates to inspire more donations.
```

Admin notification (in dashboard):
Green toast notification: '[Donation Alert] 500k added to Feed Orphans #456'

Broadcast to all campaign followers:
In-app notification: 'Campaign you followed updated! Feed Orphans now at 45.5M'

On campaign page, new donor appear in 'Recent Donors' section (name hidden if donor choose anonymous)"

### Step 7: On FoodFund Ledger 📊 (1 minute)

"Money flow track:
- Donor's MoMo account: -515,000 (500k donation + 15k platform fee)
- FoodFund platform account: +515,000
  * Fundraiser reserved: +500,000 (awaiting use)
  * Platform revenue: +15,000 (admin cut, for server, team, support)

Money sit in platform account until:
1. Campaign end date reached (June 15)
2. OR Fundraiser submit disbursement proposal (request to use funds)

When Fundraiser submit disbursement:
- Admin approve
- Money release to fundraiser bank account
- Kitchen staff receive authorization
- Purchasing begin

When food purchased (with receipt):
- FoodFund pay supplier from reserved donation funds
- Receipt stored on blockchain for transparency
- Donor can verify: 'Yes, my 500k purchased rice here'

Flow complete: Donor wire → FoodFund hold → Fundraiser spend → Kitchen cook → Beneficiary eat"

### Transaction Lifecycle Diagram (on slide)

```
PENDING (0-5 seconds)
     ↓ [QR shown, waiting payment]
COMPLETED (5-60 seconds)
     ↓ [MoMo confirm, money received]
APPROVED (optional, admin verify)
     ↓ [Admin check, verify legit]
UTILIZED (when fundraiser spend)
     ↓ [Money converted to meals]

Failure paths:
PENDING → EXPIRED (after 2 minutes no payment)
PENDING → FAILED (MoMo error)
```

"If payment fail:
- Donation status = 'failed'
- Money returned to anh tú's MoMo
- Notification: 'Payment failed, please try again'
- Can retry immediately"

---

## SLIDE 5: CAMPAIGN CREATION & PUBLISHING

### Opening (20 seconds)
"Chúng tôi tập trung vào Slide 4 (main flow). Slide 5 là quy trình tạo campaign từ phía fundraiser - quá trình này ngược lại: Organization create campaign, undergo admin review, get published, ready for donations."

### Step 1: Fundraiser Create Campaign (1.5 minutes)

"Mercy Foundation (registered NGO) login to FoodFund as fundraiser.

Click 'Create New Campaign' button.

Fill form:

**Campaign Title:**
'Feed Orphans in An Giang Province'

**Category:**
Select: Child Welfare

**Description (long form):**
'In An Giang province, 500 orphan children live in 3 facilities. Due to government budget constraints, each child receive only 1 rice bowl per day (est. 150 calories). This insufficient for proper cognitive development and physical growth. Nutritionists recommend 3 meals daily for ages 5-15.

Our goal: Provide 3 nutritious meals (breakfast, lunch, dinner) for 90 consecutive days to 500 children. This equal 15,000 total meals.

Expected outcomes:
- Improved nutrition status (height, weight gain)
- Better school performance (concentration, learning)
- Healthier immune system (fewer infections)

Our approach:
- Certified kitchen prepare fresh meals daily
- Dietary balance: carbs, protein, vegetables
- Hygiene & food safety standard compliance
- Photo documentation daily to show impact'

**Goal Amount:**
100,000,000 VND (100M)

**Duration:**
90 days (end date: June 15, 2026)

**Photos (5 photos required):**
1. Orphan house exterior
2. Orphans before meal (hungry)
3. Orphans during meal (happy)
4. Kitchen facility
5. Meal plate example

**Budget Breakdown (must sum to 100%):**
- Food & Ingredients: 60% (60M VND)
- Meal Preparation & Labor: 20% (20M VND)
- Delivery & Transportation: 15% (15M VND)
- Platform Fee: 5% (5M VND)
Total: 100% (100M VND)

**Impact Metrics:**
- Beneficiaries: 500 children
- Total meals: 15,000
- Duration: 90 days
- Cost per meal: ~6,667 VND

Click [SAVE AS DRAFT] (not publish yet)

Backend create:
```
INSERT INTO campaigns VALUES (
  id: UUID(),
  fundraiserId: 'mercy-foundation-123',
  title: 'Feed Orphans in An Giang Province',
  description: '...',
  goal: 100000000,
  raised: 0,
  category: 'child-welfare',
  endDate: '2026-06-15',
  status: 'draft',
  budgetBreakdown: {...},
  impactMetrics: {...},
  photos: ['s3://...', ...],
  createdAt: NOW()
)
```"

### Step 2: Submit for Admin Review (1 minute)

"After saving draft, Mercy Foundation click [SUBMIT FOR REVIEW].

System run validations:
- Title not empty? ✅
- Description > 500 chars? ✅
- Goal between 10M-2B? ✅ (100M reasonable)
- End date 30-180 days from now? ✅ (90 days)
- At least 1 photo? ✅ (5 photos)
- Budget breakdown = 100%? ✅
- Fundraiser verified? ✅ (Mercy Foundation registered)

All pass. Status change:
```
UPDATE campaigns
SET status = 'pending_review',
    submittedAt = NOW()
WHERE id = campaign123
```

Event published:
```
Topic: campaigns.submitted
{
  campaignId: 'campaign-123',
  fundraiserId: 'mercy-foundation-123',
  submittedAt: '2026-03-17T10:00:00Z'
}
```

Admin notified:
'Red badge: 5 campaigns pending review'
Older campaigns get older notification, newest ones highlighted."

### Step 3: Admin Review & Approval (1.5 minutes)

"Admin (Trang) open campaign for review.

Checklist:

**Fundraiser Verification:**
- Organization: Mercy Foundation ✅
- Registration: CT-123456 (valid since 2020) ✅
- Tax ID: 0987654321 ✅
- Reputation: 4.9/5 (previous 12 campaigns approved) ✅

**Campaign Details Check:**
- Title descriptive? ✅ 'Feed Orphans' - clear
- Description truthful? ✅ Story coherent, identifies beneficiaries
- Goal realistic? ✅ 100M for 15,000 meals = 6.6k/meal reasonable
- Budget breakdown sensible? 
  * 60M food = 4k/meal protein ✅
  * 20M labor = 2.6k/meal ✅
  * 15M delivery = 1k/meal ✅
  * 5M fee = 0.3k/meal ✅
  Total = 8k/meal (include all, not just ingredient) ✅

**Photos Check:**
- Real photos (not stock photos)? ✅ Photos geotag match location, faces matches
- Quality sufficient? ✅
- Appropriate content? ✅ No inappropriate material

**Risk Assessment:**
- Previous campaigns execute well? ✅
- All receipts submitted on time? ✅
- Any complaints? ✅ None
- Fraud patterns? ✅ None

Decision: APPROVE

Admin Add Notes:
'Clear campaign from established organization. Well-documented, strong track record, realistic budget. Ready for publishing.'

Click [APPROVE & PUBLISH]

Backend updated:
```
UPDATE campaigns
SET status = 'published',
    publishedAt = NOW(),
    approvedBy: 'admin-trang-123'
WHERE id = campaign123
```

Event published:
```
Topic: campaigns.published
{
  campaignId: 'campaign-123',
  publishedAt: '2026-03-17T10:30:00Z'
}
```"

### Step 4: Campaign Goes LIVE 🎉 (1 minute)

"Now campaign visible to all donors.

Notifications sent:

To Fundraiser:
'Congratulations! Your campaign is now LIVE!
Feed Orphans in An Giang Province
Goal: 100M VND
Link: https://foodfund.vn/campaign/123'

To Admin:
'Campaign published successfully. Monitoring for activity.'

To Interested Donors:
Email: 'New campaign match your interest: Feed Orphans'
Alert: 'Start of campaign - 90 day fundraising window'

Campaign now in:
- Home feed 'Active Campaigns'
- Category filter 'Child Welfare'
- Search results for 'orphans', 'An Giang'
- Recommendations to similar-interest donors

Fundraiser can now:
- Post updates (photos of operations)
- See donations coming in real-time
- Request disbursement after sufficient funds"

---

## SLIDE 6: OPERATION EXECUTION (6 Weeks Detailed Timeline)

### Opening (30 seconds)
"Slide 6 show flow từ khi campaign collect funds đến khi beneficiaries actually receive meals. Đây là 'messy' part - real-world logistics dengan receipts, kitchen, delivery, photo proof."

### PHASE 1: Campaign Launch (Week 1-2)

**Week 1 (March 17-23):**
"Campaign published March 17, 8am Vietnam time.

Day 1-7:
- Donations pour in: 5M day 1, 8M day 2, accelerate to 45M by day 7
- Kitchen staff standby, waiting disbursement approval
- Fundraiser post update: 'Campaign live! Help 500 orphans!'
- Media coverage (partner with news outlet)
- Social media viral

Progress: 45M / 100M (45% in 1 week)"

**Week 2 (March 24-30):**
"Donations continue:
- Daily: 3-5M coming in steady
- Celebrity/influencer donate 10M (boost)
- Cumulative: 50M by March 30

When reach 50% (50M fund), fundraiser can request first disbursement.

Fundraiser submit disbursement proposal March 29:
'Phase 1: Week 1-5 meal production
Budget: 75M (covers weeks 1-5, buffer for contingency)
Itemization:
- Rice: 500kg @ 15k/kg = 7.5M
- Chicken: 200kg @ 80k/kg = 16M
- Vegetables: 150kg @ 8k/kg = 1.2M
- Oil/Spices: 3M
- Labor: 12M
- Contingency: 3M
Total: 75M'

Admin review March 30, approve."

### PHASE 2: Operational Setup (Week 3)

**Week 3 (March 31 - April 6):**
"March 31, 8am: Kitchen staff receive authorization.

Actions:
1. Contact suppliers (3 quotes for each ingredient)
2. Verify quality & delivery time
3. Place orders for delivery April 2
4. Prepare kitchen facility (check equipment, cleanliness)
5. Plan meal schedule

April 2: Suppliers deliver.
- Rice: 500kg arrive, verify weight
- Chicken: 200kg arrive, verify temperature
- Vegetables: 150kg arrive, verify freshness

Upload receipts to FoodFund:
- Invoice 1: Rice 500kg, 7.5M VND
- Invoice 2: Chicken 200kg, 16M VND
- Invoice 3: Vegetables 150kg, 1.2M VND

Admin verify receipts:
- Price reasonable? ✅ (market checked)
- Quantity match? ✅ (weight verified)
- Date correct? ✅ (today)
- Receipts legit? ✅ (can call supplier to verify)

Receipts approved. Funds release immediately from reserved 75M."

### PHASE 3: Meal Production (Week 4-12)

**Week 4 Start (April 7, Monday, 6am):**
"Kitchen staff arrive. First day production marathon.

6:15am: Take inventory. Rice, chicken, vegetables, equipment all ready.
7:00am: Shift 1 (4 staff) start cooking.

Cooking process (4 staff):
- Staff 1: Boil 100kg rice (2 hours)
- Staff 2: Prepare chicken (cut, mix spices, cook)
- Staff 3: 裁 vegetables (small pieces for kids)
- Staff 4: Prepare oil mix, salt portions

10:00am: Plating begins.
- Container: 200 boxes per day
- Per box: 300g rice + 150g curry + 100g veg = 550g
- Each meal: ~400 calories, protein, vitamins
- Quality check: Temperature verify

11:00am: Take photos.
- Photo 1: Ingredients prepared
- Photo 2: Cooking process
- Photo 3: Plating
- Photo 4: 200 boxes lined up ready
- Photo 5: Quality check

11:30am: Delivery staff arrive, pickup.
- Verify box count: 200 ✅
- Verify temperature: Cold (6°C) ✅
- Seal boxes
- Load refrigerated van

12:00pm: Delivery begins.

Delivery route:
- Location 1 (Children's Home, Dist 1): 100 boxes
  * Arrive 12:30pm
  * Sister Mary receive, verify count
  * Photo: Children lining up for lunch
  * Children eat meal
  * Record: 100 meals delivered ✅

- Location 2 (Day-care Center, Dist 4): 50 boxes
  * Arrive 1:30pm
  * Similar process

- Location 3 (Shelter, Dist 7): 50 boxes
  * Arrive 2:30pm
  * Similar process

3:15pm: All delivery complete. Van return.

Update on campaign page:
'Day 1 Update: 200 meals prepared and delivered to 200 children across 3 locations. [Photo gallery]'

Daily cycle repeat:
- Monday-Friday: 200 meals/day
- Saturday: 200 meals
- Total per week: 1200 meals
- 13 weeks: 15,600 meals ✅ (exceed goal of 15,000)"

### PHASE 4: Completion & Impact (Week 13)

**Week 13 (May 25 - June 1):**
"Final week of meal production.

June 1: Last batch of meals prepared & delivered.

Total achievements:
- Meals prepared: 15,200
- Operating days: 90
- Beneficiaries served: 500 unique children
- Cost per meal: 6,579 VND (112M total / 15,200 meals)
- Photos: 450+ (daily documentation)
- Videos: 15 (progress videos)
- Downtime: 0 (no missed days)

Campaign page show final report:
'Campaign Completed Successfully! ✅

Results:
• 15,200 meals prepared
• 500 children fed
• 90 consecutive days
• 112M VND total (112% of goal)
• 450+ photos showing impact

What donors accomplished:
Each donor on average:
- Donated: ~39k VND (112M / 2,847 donors)
- Fed: ~0.17 children for 90 days
- Or: ~5 children for 3 days
- Or: 15 meals to hungry kids

Financial Breakdown:
Raised: 112M
Used: 112M
Balance: 0 (fully deployed)

Next Steps:
Thanks to your support, Mercy Foundation planning Phase 2 (June-August).
Would you like to support Phase 2? [DONATE]

Thank You Message: [Video from fundraiser]
'Thank you for changing these children's lives...' [2min video]
'"

---

## SLIDE 7: SYSTEM SUMMARY

### Opening (30 seconds)
"FoodFund không phải application - nó là social movement. Goal là make 'no one goes hungry' realizable, using technology làm bridge giữa donors và beneficiaries."

### Mission & Values (1 minute)

"**Mission:** 
Transform charity giving in Southeast Asia through technology & transparency.

**Values:**
- Transparency: Every VND tracked, documented, accountable
- Efficiency: 97% of donations reach beneficiaries (vs 40-50% traditional NGO)
- Trust: Admin verification, photo proof, blockchain receipt
- Impact: Measurable change in beneficiaries' lives
- Community: Donors, fundraisers, staff all part of movement"

### Market Opportunity (1.5 minutes)

"Vietnam charity market:

Current state:
- 100,000+ NGOs (many unregistered)
- 5-10M donors (occasional, not organized)
- 1T+ VND annual donations
- 40-50% overhead (inefficient)

FoodFund opportunity:
- 50% market: Individual donors (500B VND)
- 30% market: Corporate CSR (300B VND)
- 20% market: Government programs (200B VND)

Conservative target by 2028:
- 15% market share = 150B VND in donations processed
- 3% platform fee = 4.5B VND revenue
- Operating cost 2B VND
- Profit: 2.5B VND

By 2030 (regional):
- Vietnam + Thailand + Philippines
- 500B+ VND annual donations
- 50M donators active
- 500k+ beneficiaries helped year"

### Business Model (1 minute)

"**Revenue Streams:**

1. Platform Fee (3% per donation):
   'Transparent cut - donors know exactly: 500k donation → 485k to cause'

2. Insurance & Compliance:
   'Premium tier for fundraisers - get verified badge, priority support'

3. Analytics Dashboard:
   'Fundraisers pay for advanced reporting (future)'

4. B2B Corporate Programs:
   'Companies sponsor campaigns for employees (CSR matching, engagement'

5. Partnerships:
   'NGO networks pay to feature on platform'

**Sustainability:**
- 3-year break-even target
- Profitable year 4
- Self-sustaining by year 5"

### Competitive Advantages (1 minute)

"Why FoodFund win?

1. **Digital-First:**
   Competitors are NGOs with outdated websites. FoodFund mobile-first.

2. **Real-Time Transparency:**
   Competitors annual reports. FoodFund daily photos, live progress.

3. **Vietnamese Market:**
   I built for Vietnamese donors, not translated form English platforms.

4. **Network Effects:**
   More donors → attract fundraisers. More fundraisers → attract donors.

5. **Operational Excellence:**
   Integrated logistics (kitchen + delivery). End-to-end visibility.

6. **Low Fee + High Impact:**
   3% (vs 30-40% competitors). 97% reach beneficiary.

7. **Technology Moat:**
   Microservices, Kafka, Debezium not easy to replicate."

### Risks & Mitigation (1 minute)

"**Risk 1: Fraud**
Mitigation: Admin verification, receipts, photos, blockchain records

**Risk 2: Regulatory**
Mitigation: Compliance officer, transparent practices, government partnership

**Risk 3: Scale (Payment failures)**
Mitigation: Multiple payment gateway, webhook + polling backup, redundant systems

**Risk 4: Adoption**
Mitigation: Influencer partnerships, viral mechanics, corporate B2B"

### Vision 2030 (1 minute)

"By 2030, FoodFund is:

✨ Southeast Asia's leading charity platform
   - 10M+ registered users
   - 500B+ VND cumulative donations
   - 5M+ beneficiaries helped

✨ Industry standard
   - 80% of registered charities use FoodFund
   - Government partnership for oversight
   - Policy influence (tax incentives)

✨ Social norm
   - Monthly charity giving = normal (like Netflix subscription)
   - Transparency = expected (blockchain norm)
   - Impact tracking = standard practice

✨ Employment engine
   - 1000+ direct staff
   - 50,000+ kitchen/delivery workers
   - Career path in charity logistics"

### Call to Action (1 minute)

"**For Donors:**
Start small. 50k VND donation. See impact. Become advocate.

**For Fundraisers:**
Build your audience. Get verified. Launch campaigns. Measure impact.

**For Investors:**
1T+ market. 3% team. $2-3M Series A to scale. Join us.

**For Partners:**
NGO networks, banks, payment gateway, logistics - let's integrate.

**For Society:**
Imagine a Southeast Asia where no one goes hungry. Where charity is transparent. Where donors see impact. That's FoodFund."

---

## APPENDIX: Q&A ANSWERS

### Q1: Why platform fee 3%, not lower?

**A:** 3% cover operating costs:
- Server infrastructure (AWS) 0.5%
- Payment processing 1%
- Customer support team 0.8%
- Admin operatons 0.7%

Free platform wouldn't sustain. $0 fee = $0 capacity = $0 impact. We're committed to long-term, not quick exit.

### Q2: What prevent fraudulent campaigns?

**A:** Multiple layers:
1. Organization verification (documents reviewed)
2. Photo verification (geotag, metadata check)
3. Beneficiary verification (contact field locations)
4. Daily receipts (can verify with suppliers)
5. Admin review before publish
6. Donor complaints (flagging system)
7. Post-completion audit (mandatory)

If fraud detected, all funds refunded to donors, fundraiser banned.

### Q3: How guarantee better than traditional NGO?

**A:** Data:
- Traditional NGO: 40-50% overhead
- FoodFund: 3% overhead
- That means 97% reach beneficiary (vs 50-60%)

Transparency:
- Traditional NGO: Annual report
- FoodFund: Daily photos, real-time tracking

Cost:
- Traditional NGO: $100k to setup
- FoodFund: $0 to launch (no registration fee, no infrastructure cost)

### Q4: What if campaign not reach goal?

**A:** Flexible options:
1. Extend campaign (beyond 90 days)
2. Multiple tranches (achieve 70% → still operate at reduced scale)
3. Refund to donors (if fundraiser choose to cancel)
4. Hybrid (use what have, secure government/partner matching)

### Q5: Payment security?

**A:** Bank-grade:
- HTTPS encryption (all in-transit)
- PCI DSS compliance
- JWT token expiry (24h)
- Webhook signature verification

**Q6: Mobile app timeline?**

**A:** 
- Year 1 (2026): Web only ✅
- Year 2 (Q1 2027): iOS/Android beta
- Year 2 (Q2 2027): Full launch
- React Native share code with web, faster rollout

---

*Speech deck provides 60-90 minutes of presentation content. Adjust timing for audience pace. Practice with audience Q&A. Good luck dengan FoodFund presentation!*
