# 🍲 FOODFUND PRESENTATION DECK

## Comprehensive Platform Overview & Stakeholder Guide

**Version:** 1.0  
**Date:** March 2026  
**Platform:** FoodFund - Charity Donation Platform for Food Distribution  

---

# TABLE OF CONTENTS

1. [Slide 1: System Architecture](#slide-1-system-architecture)
2. [Slide 2: Technology Stack](#slide-2-technology-stack)
3. [Slide 3: Actors & Roles](#slide-3-actors--roles)
4. [Slide 4: Donation & Transactions](#slide-4-donation--transactions-flow)
5. [Slide 5: Campaign Creation & Publishing](#slide-5-campaign-creation--publishing)
6. [Slide 6: Operation Execution](#slide-6-operation-execution)
7. [Slide 7: System Summary](#slide-7-system-summary)
8. [Appendix](#appendix)

---

# SLIDE 1: SYSTEM ARCHITECTURE

## 🏗️ FoodFund Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (Frontend)                    │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Mobile App (React Native)  │  Admin Portal  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │
                    │  (GraphQL/   │
                    │   gRPC)      │
                    └──────┬──────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────┐  ┌──────────┐  │  ┌────────────────┐  │  ┌──────────┐
│ User   │  │Campaign  │  │  │ Donation       │  │  │Payment   │
│Service │  │Service   │  │  │Service         │  │  │Service   │
└────────┘  └──────────┘  │  └────────────────┘  │  └──────────┘
┌──────────────┐  ┌─────────────┐  ┌────────────────┐
│Notification  │  │Analytics    │  │Disbursement    │
│Service       │  │Service      │  │Service         │
└──────────────┘  └─────────────┘  └────────────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
           ┌────▼─┐  ┌────▼─┐  ┌────▼──┐
           │Message│  │Event │  │Kafka  │
           │Broker │  │Stream│  │Topic  │
           │(Bull) │  │(Berg)│  │(Event)│
           └───────┘  └──────┘  └───────┘
                │
        ┌───────▼────────┐
        │  Database      │
        │  (PostgreSQL)  │
        │  + Cache       │
        │  (Valkey)      │
        └────────────────┘
```

## Core Components

### 1️⃣ **CLIENT / FRONTEND LAYER**

**Web Application**
- React framework for responsive UI
- Real-time updates for donation status
- Campaign browsing and filtering
- Donation history tracking
- User profile management

**Mobile Application** (future)
- React Native for iOS/Android
- Push notifications
- QR code scanning for quick donation
- Offline mode support

**Admin Portal**
- Campaign approval dashboard
- User management interface
- Transaction reconciliation
- Analytics & reporting

---

### 2️⃣ **API LAYER**

The API serves as the bridge between front and backend services.

**GraphQL API**
```graphql
query {
  campaigns {
    id
    title
    goal
    raised
    status
    description
  }
  donor {
    totalDonated
    donationHistory {
      amount
      date
      campaign
    }
  }
}

mutation {
  createDonation(input: {
    campaignId: ID!
    amount: Float!
    paymentToken: String!
  }) {
    transaction {
      id
      status
      confirmationCode
    }
  }
}
```

**gRPC Protocol**
- Service-to-service communication
- High performance binary protocol
- Inter-microservice calls (User Service → Campaign Service, etc.)
- Streaming support for real-time events

**Benefits:**
- Reduced bandwidth (binary vs JSON)
- Sub-millisecond latency
- Automatic request/response validation
- Built-in load balancing

---

### 3️⃣ **BACKEND SERVICES (MICROSERVICES)**

Each service handles a specific business domain:

**User Service**
- Authentication & authorization
- User profile management
- Role-based access control (Donor, Admin, Fundraiser, Kitchen Staff, Delivery Staff)
- User verification & compliance

**Campaign Service**
- Campaign CRUD operations
- Campaign status management (draft, pending review, published, completed)
- Goal tracking and progress updates
- Campaign filtering and search

**Donation Service**
- Donation record creation
- Donation tracking
- Receipt generation
- Donation analytics

**Payment Service**
- Payment processing integration
- Transaction recording
- Payment reconciliation
- Refund handling
- PCI compliance management

**Notification Service**
- Email notifications (campaign published, donation received, etc.)
- SMS alerts
- Push notifications
- In-app messaging

**Disbursement Service**
- Disbursement proposal management
- Money transfer authorization
- Receipt validation
- Fund allocation

**Analytics Service**
- Campaign performance metrics
- Donor behavior analysis
- Donation trends
- Operational insights

---

### 4️⃣ **DATABASE LAYER**

**Primary Database: PostgreSQL**
- Relational data structure
- ACID transactions for payment reliability
- Complex query support

**Collections/Tables:**
```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role ENUM('donor', 'fundraiser', 'admin', 'kitchen_staff', 'delivery_staff'),
  profilePicture URL,
  verified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal DECIMAL(15,2) NOT NULL,
  raised DECIMAL(15,2) DEFAULT 0,
  fundraiserId UUID REFERENCES users(id),
  status ENUM('draft', 'pending_review', 'published', 'completed', 'cancelled'),
  imageUrl URL,
  createdAt TIMESTAMP,
  endDate DATE,
  updatedAt TIMESTAMP
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  donorId UUID REFERENCES users(id),
  campaignId UUID REFERENCES campaigns(id),
  amount DECIMAL(15,2) NOT NULL,
  paymentMethod VARCHAR(50),
  status ENUM('pending', 'completed', 'failed', 'refunded'),
  transactionId VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  type ENUM('donation', 'disbursement', 'refund'),
  amount DECIMAL(15,2) NOT NULL,
  fromUserId UUID REFERENCES users(id),
  toUserId UUID REFERENCES users(id),
  status ENUM('pending', 'completed', 'failed'),
  receiptUrl URL,
  createdAt TIMESTAMP,
  completedAt TIMESTAMP
);

-- Disbursement Proposals
CREATE TABLE disbursement_proposals (
  id UUID PRIMARY KEY,
  campaignId UUID REFERENCES campaigns(id),
  fundUserId UUID REFERENCES users(id),
  description TEXT,
  calculatedAmount DECIMAL(15,2),
  status ENUM('draft', 'pending_approval', 'approved', 'rejected'),
  submittedAt TIMESTAMP,
  approvedBy UUID REFERENCES users(id),
  approvedAt TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  campaignId UUID REFERENCES campaigns(id),
  assignedTo UUID REFERENCES users(id),
  status ENUM('pending', 'in_progress', 'completed'),
  dueDate DATE,
  createdAt TIMESTAMP
);
```

**Cache Layer: Valkey** (Distributed Cache)
- Cache frequently accessed data
- Campaign listings (invalidated on update)
- User profiles (invalidated on edit)
- Donation leaderboards
- Real-time counters (total raised)

**Cache Hit Rate Target:** 85%+

---

### 5️⃣ **MESSAGE BROKER**

Asynchronous communication between services to maintain loose coupling.

**BullMQ** (Job Queue for Node.js)
- Queue donation processing jobs
- Schedule email notifications
- Background image processing
- Retry failed operations

**Example Job (Send Donation Receipt Email):**
```javascript
const donationQueue = new Queue('donation-receipts', {
  connection: redis
});

await donationQueue.add(
  'send-receipt',
  {
    donationId: '123-abc',
    donorEmail: 'john@example.com',
    amount: 500000,
    campaignTitle: 'Feed Orphans Campaign'
  },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
);
```

**Kafka** (Event Streaming Platform)
- High-volume event ingestion
- Multi-consumer support
- Event replay capability for debugging

**Example Events:**
```
Topic: donation.events
┌─────────────────────────────────────┐
│ Event: DonationCreated              │
│ {                                   │
│   id: '789',                        │
│   campaignId: '123',                │
│   amount: 500000,                   │
│   timestamp: '2026-03-17T10:30:00Z' │
│ }                                   │
└─────────────────────────────────────┘

Topic: campaign.events
┌─────────────────────────────────────┐
│ Event: CampaignPublished            │
│ {                                   │
│   id: '456',                        │
│   title: 'Feed Orphans',            │
│   goal: 100000000,                  │
│   timestamp: '2026-03-17T10:30:00Z' │
│ }                                   │
└─────────────────────────────────────┘
```

**Benefits:**
- Services don't need to know about each other
- Event replay for audit trail
- Analytics pipeline consumption
- Real-time notifications

---

### 6️⃣ **EVENT STREAMING / DATA PIPELINE**

**Debezium** (Change Data Capture)
- Monitors database transaction log
- Captures INSERT, UPDATE, DELETE operations
- Streams changes in real-time

**Example CDC Flow:**
```
PostgreSQL (transaction log)
           ↓
    Debezium Connector
           ↓
    Kafka Topic: database.changes
           ↓
    ┌──────────────────────────────────┐
    │ Consumer 1: Analytics Pipeline   │
    │ Consumer 2: Cache Invalidation   │
    │ Consumer 3: Audit Log            │
    │ Consumer 4: Real-time Dashboard  │
    └──────────────────────────────────┘
```

**Use Cases:**
- Automatically update caches when campaign data changes
- Audit trail of all state changes
- Sync to data warehouse for analytics
- Trigger notifications on record updates

---

## Architecture Benefits

| Aspect | Benefit |
|--------|---------|
| **Scalability** | Each service scales independently |
| **Resilience** | Service failure doesn't cascade |
| **Performance** | gRPC reduces latency, caching reduces DB load |
| **Flexibility** | Services can use different tech stacks |
| **Analytics** | Event stream feeds data warehouse |
| **Auditability** | Complete audit trail via CDC |

---

# SLIDE 2: TECHNOLOGY STACK

## 🛠️ Complete Technology Inventory

### A. API COMMUNICATION

#### 1️⃣ **GraphQL**

**What it is:**
Query language for APIs. Instead of fixed REST endpoints, client specifies exactly what data it needs.

**Example:**
```graphql
# Client only requests fields it needs
query GetCampaignDetails {
  campaign(id: "123") {
    id
    title
    goal
    raised
    description
    image
    # NOT requesting: location, tags, comments, etc.
  }
}

# Much smaller response than REST /campaigns/123 returning full object
```

**When to use:**
- Mobile apps (limited bandwidth, battery)
- Complex UIs with varying data needs
- Dashboard with aggregated data
- Real-time features

**Advantages:**
- Reduced bandwidth (mobile-optimized)
- Type safety (schema defines all fields)
- No over-fetching / under-fetching
- Introspection for auto-documentation

**Example Schema:**
```graphql
type Query {
  campaigns(
    status: CampaignStatus
    limit: Int
    offset: Int
  ): [Campaign!]!
  
  campaign(id: ID!): Campaign
  
  donor(id: ID!): Donor
}

type Mutation {
  createDonation(input: CreateDonationInput!): DonationResult!
  publishCampaign(id: ID!): Campaign!
  approveDisbursement(id: ID!): Disbursement!
}

type Campaign {
  id: ID!
  title: String!
  description: String!
  goal: Float!
  raised: Float!
  status: CampaignStatus!
  fundraiser: User!
  createdAt: DateTime!
}

type Donation {
  id: ID!
  amount: Float!
  donor: User!
  campaign: Campaign!
  status: DonationStatus!
  createdAt: DateTime!
}
```

#### 2️⃣ **gRPC**

**What it is:**
High-performance RPC framework using Protocol Buffers (binary serialization).

**When to use:**
- Service-to-service communication
- High-frequency internal calls
- Streaming data between services
- Microservices architecture

**Example (Proto definition):**
```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc CreateUser(CreateUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  UserRole role = 4;
  bool verified = 5;
}

enum UserRole {
  DONOR = 0;
  FUNDRAISER = 1;
  ADMIN = 2;
  KITCHEN_STAFF = 3;
  DELIVERY_STAFF = 4;
}
```

**Performance Comparison:**
```
REST JSON:     {"name": "John", "age": 30} → 28 bytes
gRPC protobuf: (binary)                    → 6 bytes
```

**Advantages:**
- 7x faster than REST
- Bi-directional streaming
- Automatic client/server code generation
- Connection reuse (HTTP/2)

---

### B. CI/CD & DEPLOYMENT

#### 1️⃣ **GitHub Actions**

**Purpose:** Automate testing and deployment on every code push.

**Workflow Example:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
      
      - name: Run linter
        run: npm run lint
      
      - name: Build project
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          docker build -t foodfund:latest .
          kubectl apply -f deployment.yaml
```

**Benefits:**
- Automated testing on every PR
- Prevent bad code from reaching main
- Deployment automated (less manual error)
- Quick rollback if needed

#### 2️⃣ **Docker**

**Purpose:** Containerization - package app with dependencies.

**Dockerfile Example:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
```

**Benefits:**
- Consistency (works on dev laptop = works on server)
- Isolation (no dependency conflicts)
- Easy deployment (single artifact)
- Resource efficiency (lighter than VMs)

**Example containers in FoodFund:**
```
- API Server (port 3000)
- User Service (port 3001)
- Campaign Service (port 3002)
- Payment Service (port 3003)
- PostgreSQL (port 5432)
- Redis/Valkey (port 6379)
```

#### 3️⃣ **Kubernetes (K8s)**

**Purpose:** Orchestrate containers - auto-scale, load-balance, self-heal.

**Deployment Configuration:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: foodfund-api
spec:
  replicas: 3  # 3 instances for redundancy
  selector:
    matchLabels:
      app: foodfund-api
  template:
    metadata:
      labels:
        app: foodfund-api
    spec:
      containers:
      - name: api
        image: foodfund:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
```

**Features:**
- **Auto-scaling:** If CPU > 80%, spawn more pods
- **Load balancing:** Distribute traffic across pods
- **Self-healing:** If pod crashes, restart automatically
- **Rolling updates:** Deploy new version without downtime
- **Service discovery:** Pods find each other via DNS

**Example scenario:**
```
Donation surge (lunch time):
- Traffic increases 10x
- K8s detects high CPU usage
- Automatically scale from 3 → 12 pods
- After spike, scale back down to 3 pods
- Save money: pay for compute only when needed
```

#### 4️⃣ **Vercel**

**Purpose:** Hosting platform for Next.js and static sites.

**Perfect for:**
- Frontend deployment (React app)
- Serverless functions (Node.js backend)
- Automatic HTTPS
- CDN for fast content delivery

**Deployment process:**
```
1. Push code to GitHub
   ↓
2. Vercel webhook triggered
   ↓
3. Build & test on Vercel server
   ↓
4. Deploy to CDN edge locations
   ↓
5. DNS updated
   ↓
6. Live! (typically in 2-3 minutes)
```

**Benefits:**
- Zero-config deployment (push → live)
- Preview deployments for PRs
- Environment variable management
- Analytics included
- Serverless functions pricing (pay per use)

#### 5️⃣ **Debezium**

**Purpose:** Change Data Capture (CDC) - stream database changes.

**Architecture:**
```
PostgreSQL (primary database)
    ↓
PostgreSQL WAL (Write-Ahead Log)
    ↓
Debezium Connector (reads WAL)
    ↓
Kafka Topic: db.events
    ↓
┌────────────────────────────────────────┐
│ Stream Consumers:                       │
│ - Cache invalidation service           │
│ - Analytics pipeline                   │
│ - Audit logging service                │
│ - Real-time dashboard updater          │
└────────────────────────────────────────┘
```

**Example captured event:**
```json
{
  "before": {
    "raised": 50000000
  },
  "after": {
    "raised": 50500000
  },
  "source": {
    "table": "campaigns",
    "database": "foodfund"
  },
  "op": "u",  // 'c' = create, 'u' = update, 'd' = delete
  "ts_ms": 1647520890000
}
```

---

### C. MESSAGE BROKERS

#### 1️⃣ **BullMQ**

**Purpose:** Job queue system for Node.js background tasks.

**Common jobs:**
- Send email receipts (don't block donation response)
- Generate reports
- Process image uploads
- Retry failed payments
- Clean up expired sessions

**Configuration Example:**
```javascript
import Queue from 'bull';
const emailQueue = new Queue('emails', {
  redis: {
    host: 'redis',
    port: 6379
  }
});

// Add job
await emailQueue.add(
  { email: 'donor@example.com', subject: 'Thank you!' },
  { delay: 300000 } // Send in 5 minutes
);

// Process job
emailQueue.process(async (job) => {
  await sendEmail(job.data.email, job.data.subject);
  return { success: true };
});

// Track job
const job = await emailQueue.getJob(jobId);
console.log(job.progress()); // 0-100%
console.log(job.progress(50)); // Set to 50%
```

**Advantages:**
- Reliable (stores jobs in Redis, persists across restarts)
- Retry logic (automatic exponential backoff)
- Rate limiting (process N jobs per minute)
- Progress tracking (for long operations)

#### 2️⃣ **Kafka**

**Purpose:** Event streaming platform for high-volume, multi-consumer events.

**Use cases:**
- All donation events: 1000s per minute
- Campaign updates: published, funded, completed
- Payment confirmations
- Analytics feed

**Kafka architecture:**
```
Producer (Donation Service)
    ↓
    ...creates event...
    ↓
Topic: donations.created
    ├─→ Partition 0 (offset 0, 1, 2, ...)
    ├─→ Partition 1 (offset 0, 1, 2, ...)
    └─→ Partition 2 (offset 0, 1, 2, ...)
    ↓
Consumers (many allowed):
├─ Analytics Service (read all, calculate stats)
├─ Notification Service (read all, send emails)
├─ Dashboard Service (read all, update real-time counts)
└─ Compliance Service (read all, audit trail)
```

**Example Kafka producer:**
```javascript
const kafka = new Kafka({
  clientId: 'donation-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

await producer.send({
  topic: 'donations.created',
  messages: [
    {
      key: donation.campaignId,
      value: JSON.stringify({
        id: donation.id,
        campaignId: donation.campaignId,
        amount: donation.amount,
        donorId: donation.donorId,
        timestamp: new Date().toISOString()
      })
    }
  ]
});
```

**Advantages:**
- Handles 1M+ events/second
- Event replay capability (debug, rebuild state)
- Multi-consumer support (no competition)
- Exactly-once semantics available

#### 3️⃣ **Valkey**

**Purpose:** Distributed cache (Redis alternative, open-source).

**Use cases:**
- Cache hot data (campaigns, top donors)
- Rate limiting (max 100 donations per minute per IP)
- Session storage
- Real-time counters (total raised)
- Leaderboards

**Cache example:**
```javascript
import Valkey from 'ioredis';
const valkey = new Valkey({
  host: 'valkey',
  port: 6379
});

// Cache campaign for 1 hour
const campaign = await getCampaignFromDB(id);
await valkey.setex(`campaign:${id}`, 3600, JSON.stringify(campaign));

// Next request, check cache first
const cachedCampaign = await valkey.get(`campaign:${id}`);
if (cachedCampaign) {
  return JSON.parse(cachedCampaign); // Fast!
}
```

**Performance:**
- Database query: ~50ms
- Cache hit: ~1ms
- 50x faster!

---

## Technology Stack Summary Table

| Layer | Technology | Purpose | Justification |
|-------|-----------|---------|---------------|
| **Frontend** | React | UI framework | Component reusability, large community |
| | TypeScript | Type safety | Catch errors at compile time |
| | Vite | Build tool | 10x faster dev iteration |
| **API** | GraphQL | Data querying | Flexible, mobile-friendly |
| | gRPC | Service communication | High performance, 7x faster REST |
| **Backend** | Node.js | Runtime | JavaScript everywhere, async I/O |
| | Express.js | Web framework | Lightweight, flexible routing |
| **Database** | PostgreSQL | Primary storage | ACID transactions, JSON support |
| | Valkey | Cache | Sub-millisecond lookups |
| **Message Broker** | BullMQ | Job queue | Background task processing |
| | Kafka | Event stream | High-volume event ingestion |
| **DevOps** | Docker | Containerization | Consistency, easy deployment |
| | Kubernetes | Orchestration | Auto-scaling, self-healing |
| | GitHub Actions | CI/CD | Automated testing & deployment |
| **Infrastructure** | Vercel | Frontend hosting | Automatic deployments, CDN |
| **Data Pipeline** | Debezium | CDC | Real-time data synchronization |

---

# SLIDE 3: ACTORS & ROLES

## 👥 FoodFund Ecosystem Participants

### 1️⃣ **DONOR** 💰

**Who:** Individuals who contribute money to campaigns.

**Motivations:**
- Help people in need
- Support social causes
- Tax deduction (in Vietnam, donations to registered charities get deduction)
- Community recognition

**Capabilities:**
- Browse campaigns (filter by category, goal, progress)
- View campaign details (story, photos, goal, raised amount, donor list)
- Donate money (one-time or recurring)
- View donation history
- Get receipt (for tax purposes)
- Track campaign progress
- Write review/testimonial on campaign
- Share campaign on social media

**User Journey:**
```
1. Open FoodFund app
   ↓
2. Browse "Active Campaigns" tab
   ↓
3. See "Feed Orphans Campaign" - 45% funded, 500 donors
   ↓
4. Read story: "Children in An Giang province need 3 meals/day"
   ↓
5. Click "Donate Now"
   ↓
6. Enter amount (500k VND)
   ↓
7. Scan QR code with MoMo app
   ↓
8. Confirm payment
   ↓
9. Receive confirmation + receipt
   ↓
10. See donation appear in live campaign feed (shows: "Anonymous donor gave 500k - Thank you!")
```

**Permissions:**
- Read: All public campaigns, donor leaderboard
- Write: Create donation, write review/comment
- Delete: Own comments

**Segment Analysis:**
```
Donor Types:
├─ Corporate (5% of donors, 40% of money) → annual donations, CSR programs
├─ Individual Regular (35% of donors, 35% of money) → 2-3 donations/month
├─ Individual Occasional (50% of donors, 20% of money) → 1 donation/quarter
└─ Celebrity/Influencer (0.1% of donors, 5% of money) → viral effect
```

---

### 2️⃣ **ADMIN** 🛡️

**Who:** Platform managers (2-3 people managing the system).

**Responsibilities:**
- Approve/reject campaigns before publishing
- Monitor for fraud or policy violations
- Manage user disputes
- Review disbursement proposals
- View analytics & reports
- Configure platform settings

**Capabilities:**
- Access admin dashboard
- View all campaigns (including draft, pending)
- Approve/reject campaigns with feedback
- View all users & user details
- Suspend/ban users if needed
- View all transactions (donation, disbursement, refund)
- Verify disbursement receipts
- Generate reports (GMV, top campaigns, donor count)
- Manage platform settings (fee percentage, minimum donation)
- Send announcements

**Admin Workflow - Campaign Approval:**
```
1. Fundraiser submit campaign
   ↓
2. Campaign status = "pending_review"
   ↓
3. Admin dashboard notification: "5 campaigns waiting review"
   ↓
4. Admin click on campaign
   ↓
5. Review:
   - Campaign title reasonable? ✅
   - Description complete? ✅
   - Goal realistic? ✅
   - Fundraiser verified? ✅
   - Photos appropriate? ✅
   ↓
6. Click "APPROVE & PUBLISH"
   ↓
7. Campaign status = "published"
   ↓
8. Notification sent to fundraiser: "Your campaign is live!"
   ↓
9. Notification sent to donors: "New campaign: [Title]"
```

**Admin Dashboard Example:**
```
┌─────────────────────────────────────┐
│ ADMIN DASHBOARD                     │
├─────────────────────────────────────┤
│ Today's Activity:                   │
│ • 150 new donations ($45M VND)      │
│ • 3 new campaigns submitted         │
│ • 2 disputes to review              │
│ • 1 withdrawal request               │
├─────────────────────────────────────┤
│ Pending Items:                      │
│ ☐ Review Campaign: "Disaster Relief"│
│ ☐ Approve Disbursement: Campaign #5 │
│ ☐ Review User Report: Fraud claim   │
├─────────────────────────────────────┤
│ Key Metrics:                        │
│ • Total GMV: 2.4B VND (month)       │
│ • Active Campaigns: 47              │
│ • Registered Users: 12,543          │
│ • Verified Fundraisers: 234         │
└─────────────────────────────────────┘
```

**Permissions:**
- Read: Everything
- Write: Approve/reject campaigns, verify users, process disbursements
- Delete: Ban users, cancel campaigns if fraudulent

---

### 3️⃣ **FUNDRAISER** 🎯

**Who:** Organizations or individuals raising money for causes.

**Motivations:**
- Raise funds for community project
- Reach wider audience
- Transparency (donors see exactly what funds used for)
- Accountability (admin oversight)

**Capabilities:**
- Create campaign (title, description, goal, photos, category)
- Submit campaign for admin approval
- Track campaign progress (live dashboard shows goals, raised amount)
- Post updates during campaign (photos/videos of progress)
- Request disbursement (when need to use funds)
- Download reports (donor list, donation breakdown)
- Communicate with admin (support chat)

**Campaign Creation Form:**
```
Campaign Details:
─────────────────
Title: Feed Orphans in An Giang
Category: [Child Welfare ▼]
Goal Amount: 100,000,000 VND
End Date: 2026-06-30

Description (800 chars):
[Long form story about orphans, their needs, why this campaign]

Photos:
[Upload up to 5 photos]
- Before: Orphans eating minimal meals
- After: Nutritious meals they deserve

Budget Breakdown:
─────────────────
• Food & Nutrition: 60,000,000 VND (60%)
• Preparation: 20,000,000 VND (20%)
• Delivery: 15,000,000 VND (15%)
• Platform Fee: 5,000,000 VND (5%)

Terms:
☑ Commitment to transparency
☑ Agree to provide receipts
☑ Accept 3-month audit review
```

**Campaign Lifecycle:**
```
DRAFT → PENDING_REVIEW → PUBLISHED → ACTIVE → FUNDING_COMPLETE → COMPLETED

States explanation:
• Draft: Saved locally, not submitted
• Pending Review: Submitted, admin checking
• Published: Approved, live, accepting donations
• Active: Currently receiving donations
• Funding Complete: Goal reached, campaign still open
• Completed: Campaign ended (date passed or fundraiser marked complete)
```

**Permissions:**
- Read: Own campaigns, donations received
- Write: Create/edit own campaigns, submit for approval, request disbursement
- Delete: Own campaigns (only if draft)

---

### 4️⃣ **KITCHEN STAFF** 👨‍🍳

**Who:** Food preparation workers (employed by partner organizations).

**Role in Operation:**
- Receive approved disbursement orders
- Purchase ingredients
- Prepare meals
- Package meals for delivery

**Workflow:**
```
1. Admin approves disbursement: "200 meals for 50M VND"
   ↓
2. Kitchen Staff notified via app
   ↓
3. Staff receive task:
   - Task: Cook 200 meals
   - Date: Tomorrow 6am
   - Menu: Rice, chicken, vegetables
   - Location: Community Kitchen, Dist 1
   - Budget: 50M VND
   - Staff assigned: 4 people
   ↓
4. Staff purchase ingredients (receipt uploaded to system)
   ↓
5. Prepare meals in morning (photo progress)
   ↓
6. Package meals in boxes
   ↓
7. Mark task "ready for delivery" in app
   ↓
8. Delivery staff pick up at 11am
```

**Responsibilities:**
- Execute meals to standard
- Submit receipts (proof of expense)
- Maintain food safety
- Track inventory
- Report any issues

**Permissions:**
- Read: Assigned tasks, budget
- Write: Update task progress, upload receipts
- Delete: None

---

### 5️⃣ **DELIVERY STAFF** 🚚

**Who:** Logistics workers who deliver meals to beneficiaries.

**Role in Operation:**
- Receive meal packages from kitchen
- Transport to beneficiary locations
- Deliver to recipients
- Collect signatures/confirmation
- Report any issues

**Delivery Workflow:**
```
1. Kitchen staff marks "ready for delivery" at 11am
   ↓
2. Delivery staff assigned:
   - Route: 3 locations (Dist 1, Dist 4, Dist 7)
   - Meals: 200 boxes
   - Vehicle: Truck
   - Estimated time: 4 hours
   ↓
3. Delivery staff pick up from kitchen (11:30am)
   ↓
4. Use mobile app with GPS:
   - See route map
   - Navigate to first location
   - Call beneficiary when arriving
   ↓
5. Deliver meals:
   - Verify recipient list
   - Distribute meals
   - Take photo proof
   - Collect signature on paper (for accountability)
   ↓
6. Repeat for all locations
   ↓
7. Mark delivery complete at 3:30pm
   ↓
8. System confirms: "200 meals delivered successfully"
   ↓
9. Campaign gets update: "200 beneficiaries received meals today"
```

**Responsibilities:**
- Safe transportation
- Accurate delivery to assigned beneficiaries
- Photo documentation
- Handle customer concerns
- Report delivery issues

**Permissions:**
- Read: Assigned deliveries, route
- Write: Update delivery status, upload photos
- Delete: None

---

## Permission Matrix

| Action | Donor | Fundraiser | Admin | Kitchen | Delivery |
|--------|-------|-----------|-------|---------|----------|
| Read campaigns | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create campaign | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve campaign | ❌ | ❌ | ✅ | ❌ | ❌ |
| Donate | ✅ | ✅ | ✅ | ❌ | ❌ |
| View donations | ✅* | ✅* | ✅ | ❌ | ❌ |
| Request disbursement | ❌ | ✅ | ❌ | ❌ | ❌ |
| Approve disbursement | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage tasks | ❌ | ❌ | ✅ | ✅ | ✅ |
| View reports | ❌ | ✅* | ✅ | ❌ | ❌ |

*Only their own

---

# SLIDE 4: DONATION & TRANSACTIONS FLOW

## 💳 End-to-End Donation Process

### Step 1: Campaign Discovery 🔍

**Donor Action:**
- Open FoodFund app (already logged in)
- Tap "Browse Campaigns"
- See 48 active campaigns

**Backend Process:**
```
GET /api/graphql
{
  campaigns(status: PUBLISHED, limit: 12, offset: 0) {
    id
    title
    goal
    raised
    image
    fundraiser { name }
    donorCount
  }
}
```

**Frontend Display:**
```
┌─────────────────────────────────┐
│ CAMPAIGNS FEED                  │
├─────────────────────────────────┤
│ [1] Feed Orphans Campaign       │
│ Goal: 100M VND                  │
│ Raised: 45M VND (45%)           │
│ Donors: 523                      │
│ ████░░░░░░░░░░░░░░░░            │
│ [DONATE NOW]                    │
│                                 │
│ [2] Healthcare for Elderly      │
│ Goal: 200M VND                  │
│ Raised: 198M VND (99%)          │
│ Donors: 8421                    │
│ █████████████████████░          │
│ [DONATE NOW]                    │
│                                 │
│ [3] Education Program           │
│ ...                             │
└─────────────────────────────────┘
```

---

### Step 2: Choose Campaign 📋

**Donor Action:**
- Tap "Feed Orphans Campaign"
- See full details: story, photos, beneficiary count, timeline
- Decide to donate 500k VND
- Tap "DONATE NOW"

**Campaign Details Page:**
```
┌─────────────────────────────────────────┐
│ Feed Orphans in An Giang Province       │
├─────────────────────────────────────────┤
│ [Photos: Before/After slideshow]        │
│                                         │
│ ✅ 523 donors · 45M of 100M goal       │
│ 🏢 By: Mercy Foundation Vietnam         │
│ 📅 Ends: June 30, 2026 (105 days)       │
│                                         │
│ Why this matters:                       │
│ Children in An Giang need 3 meals/day  │
│ Current reality: 1 bowl of rice daily   │
│ Our goal: Proper nutrition              │
│                                         │
│ Recent donors:                          │
│ Anonymous: 5M VND (2h ago)              │
│ John Doe: 1M VND (5h ago)               │
│ [+520 more...]                          │
│                                         │
│ [DONATE 500K] [MORE OPTIONS]            │
└─────────────────────────────────────────┘
```

---

### Step 3: Payment Gateway 💰

**Donor selects donation amount: 500,000 VND**

**System Display - Payment Methods:**
```
┌─────────────────────────────────────┐
│ SELECT PAYMENT METHOD               │
├─────────────────────────────────────┤
│ Amount: 500,000 VND                 │
│ Campaign: Feed Orphans              │
│ Platform Fee (3%): 15,000 VND        │
│ Total: 515,000 VND                  │
│                                     │
│ Payment Options:                    │
│ ☑ Mobile: MoMo                      │
│ ☐ Bank: TPBank                      │
│ ☐ Bank: Vietcombank                 │
│ ☐ Bank: Techcombank                 │
│                                     │
│ [PROCEED TO PAYMENT]                │
└─────────────────────────────────────┘
```

**Donor selects MoMo → System calls RayOS (Payment Gateway)**

**RayOS Integration:**
```javascript
// Backend calls RayOS API
const paymentRequest = {
  amount: 515000,
  description: "Donation - Feed Orphans Campaign",
  orderId: "DO_20260317_12345",
  callbackUrl: "https://foodfund.vn/api/payment/callback",
  returnUrl: "https://foodfund.vn/donation/success"
};

// RayOS generates payment request
const response = await rayos.createPayment(paymentRequest);
// Returns: { qrCode, paymentUrl, expiresIn }

// Frontend display QR code
<img src={response.qrCode} />
```

**User Experience:**
```
1. Donor sees QR code on screen
   ↓
2. Opens MoMo app
   ↓
3. Taps [QR Scanner]
   ↓
4. Points camera at screen
   ↓
5. MoMo recognizes QR code
   ↓
6. Transfer confirmation screen shows:
   ├─ Recipient: FoodFund Vietnam
   ├─ Amount: 515,000 VND
   ├─ Description: "Donation - Feed Orphans Campaign"
   ├─ Fee: 1,000 VND
   ├─ Total: 516,000 VND
   └─ [CONFIRM TRANSFER]
   ↓
7. Donor enters MoMo PIN
   ↓
8. MoMo processes payment
   ↓
9. Confirm screen: "Transfer successful. Reference: 20260317ABC123"
```

---

### Step 4: System Records Transaction 📝

**When MoMo confirms payment, two things happen:**

**Option A: Webhook (Real-time)**
```
MoMo Server calls:
POST /api/payment/callback
{
  orderId: "DO_20260317_12345",
  status: "PAID",
  amount: 515000,
  referenceNo: "20260317ABC123",
  timeSignal: "2026-03-17T14:30:45Z",
  signature: "..." // hmac verification
}

Backend verifies:
1. Signature is valid (prevent spoofing)
2. Amount matches our records
3. Order exists

Then create donation record:
INSERT INTO donations (...) VALUES (
  id: UUID,
  donorId: USER_123,
  campaignId: CAMPAIGN_456,
  amount: 500000,
  paymentMethod: "MoMo",
  status: "completed",
  referenceNo: "20260317ABC123",
  createdAt: NOW()
)

Publish Kafka event:
Topic: donations.created
Message: { donationId, amount, campaignId, timestamp }
```

**Option B: Polling (Fallback)**
```
If webhook fails, donor screen shows:
"Waiting for payment confirmation..."

Backend polls RayOS every 5 seconds:
GET /api/payment/status?orderId=DO_20260317_12345

If status = PAID, same steps as above
```

**Database Update - Campaign Progress:**
```sql
-- Update campaign's progress
UPDATE campaigns 
SET raised = raised + 500000
WHERE id = CAMPAIGN_456;

-- Check if goal reached
SELECT goal, raised FROM campaigns WHERE id = CAMPAIGN_456;
-- Result: goal=100000000, raised=45500000 (45.5%)

-- If reached, trigger: notify donors, update campaign status, etc.
```

---

### Step 5: Notification & Confirmation 🔔

**Notifications sent:**

**1. Donor receives confirmation (Email + App Push):**
```
Subject: [FoodFund] Donation Confirmed ✅

Dear [Donor Name],

Thank you for your generous donation!

📊 Donation Details:
├─ Amount: 500,000 VND
├─ Campaign: Feed Orphans in An Giang
├─ Reference: 20260317ABC123
└─ Date: March 17, 2026, 14:30 UTC+7

Your donation will help provide:
• 10 nutritious meals for orphans
• Enough rice for 50 children for 1 week
• Vitamins and minerals crucial for development

Tax Receipt:
If you need a tax receipt for deduction, download here: [link]

Track Your Impact:
See donation updates: https://foodfund.vn/campaign/456

Thank you for caring! ❤️

— The FoodFund Team
```

**2. Campaign Fundraiser notification:**
```
Subject: [FoodFund] New Donation Received! 💰

[Fundraiser Name],

Great news! Your campaign has received a new donation.

📈 Campaign Update:
├─ New Donation: 500,000 VND
├─ Total Raised: 45,500,000 VND
├─ Progress: 45.5% of 100,000,000 goal
├─ Donors: 524 people
└─ Days Left: 105 days

Keep up the momentum! Share progress updates to inspire more donations.
```

**3. Admin dashboard notification:**
```
Toast notification (top right):
"💚 New donation received - 500K VND - Campaign #456"

Admin can click to review full details
```

---

### Step 6: Donation Record & History 📊

**Donor views donation history:**
```
GET /api/graphql
{
  donor(id: USER_123) {
    donationHistory(limit: 10) {
      id
      campaign { title }
      amount
      date
      status
      receiptUrl
    }
  }
}
```

**Frontend display:**
```
┌─────────────────────────────────────┐
│ MY DONATIONS                        │
├─────────────────────────────────────┤
│ Total Donated: 4,500,000 VND        │
│ Campaigns Supported: 8              │
│ Average Donation: 562,500 VND       │
├─────────────────────────────────────┤
│ Recent Donations:                   │
│                                     │
│ ✅ [Today] Feed Orphans             │
│    500,000 VND | #20260317ABC123    │
│    [Download Receipt]               │
│                                     │
│ ✅ [Mar 10] Healthcare Elderly      │
│    1,000,000 VND | #202603100XYZ    │
│    [Download Receipt]               │
│                                     │
│ ✅ [Feb 28] Education Program       │
│    2,000,000 VND | #202802280ABC    │
│    [Download Receipt]               │
│                                     │
│ [LOAD MORE...]                      │
└─────────────────────────────────────┘
```

---

## Transaction States & Lifecycle

```
PENDING
↓ [Payment in progress]
COMPLETED
├─ [RayOS confirmed payment]
│
├→ [Webhook received]
│  └→ Donation created immediately
│  └→ Campaign updated
│  └→ Notifications sent
│
└→ [No webhook received]
   └→ Polling detects payment after 5-10 seconds
   └→ Donation created
   └→ Campaign updated
   └→ Notifications sent (slightly delayed)

IF PAYMENT FAILS:
PENDING → FAILED
└→ Donation record marked failed
└→ Notification sent to donor
└→ Money returned to MoMo account (auto refund)
```

---

## Financial Flow

```
Donor MoMo Account (-500,000)
            ↓
        MoMo Server
            ↓
    Platform Account (+500,000)
        /           \
       /             \
   Donation           Platform Fee
   (500,000)          (15,000 = 3%)
      ↓
  Reserved until
  admin approval

When campaign
used (Disbursement):
- Money released to fundraiser
- Kitchen staff purchase food
- Delivery staff transport meals
- Beneficiaries receive meals
```

---

# SLIDE 5: CAMPAIGN CREATION & PUBLISHING

## 📝 Campaign Lifecycle & Approval Process

### Step 1: Fundraiser Creates Campaign 📋

**Fundraiser logs in → Tap "Create Campaign"**

**Campaign Creation Form:**
```
┌─────────────────────────────────────────────┐
│ CREATE NEW CAMPAIGN                         │
├─────────────────────────────────────────────┤
│                                             │
│ BASIC INFO                                  │
│ ─────────────────────────────────────────   │
│ Campaign Title:                             │
│ [Feed Orphans in An Giang Province]        │
│                                             │
│ Category:  [Child Welfare ▼]               │
│                                             │
│ Description (max 2000 chars):               │
│ [Multi-line text area with preview]        │
│ "In An Giang, 500 orphan children          │
│  live in 3 facilities. Due to funding      │
│  constraints, each child receives only     │
│  1 rice bowl per day. Our goal: provide    │
│  3 nutritious meals including proteins,    │
│  vegetables, fruits. With your support, we │
│  can ensure these children get proper      │
│  nutrition for healthy development."       │
│                                             │
│ FUNDRAISING TARGET                          │
│ ─────────────────────────────────────────   │
│ Goal Amount (VND): [100000000]              │
│ End Date: [June 30, 2026]                   │
│ Duration: 105 days                          │
│                                             │
│ PHOTOS & MEDIA                              │
│ ─────────────────────────────────────────   │
│ Upload up to 5 photos/videos:               │
│ [Current conditions] [Children] [Facilities]│
│                                             │
│ BUDGET BREAKDOWN                            │
│ ─────────────────────────────────────────   │
│ Expense Category      Amount    Percentage  │
│ Food & Nutrition      60M       60%         │
│ Preparation & Labor   20M       20%         │
│ Delivery & Transport  15M       15%         │
│ Platform Fee          5M        5%          │
│ TOTAL                 100M      100%        │
│                                             │
│ IMPACT METRICS                              │
│ ─────────────────────────────────────────   │
│ Number of beneficiaries: [500]              │
│ Duration of support: [3 months]             │
│ Meals per beneficiary: [270 meals]          │
│ Cost per meal: [370K VND]                   │
│                                             │
│ [SAVE AS DRAFT] [SUBMIT FOR REVIEW]         │
└─────────────────────────────────────────────┘
```

**Backend creates:**
```javascript
const campaign = {
  id: UUID(),
  fundraiserId: FUNDRAISER_123,
  title: "Feed Orphans in An Giang Province",
  description: "...",
  goal: 100000000,
  raised: 0,
  category: "child_welfare",
  endDate: "2026-06-30",
  status: "draft",
  budgetBreakdown: {
    food: 60000000,
    preparation: 20000000,
    delivery: 15000000,
    platformFee: 5000000
  },
  impactMetrics: {
    beneficiaries: 500,
    durationMonths: 3,
    mealsTotal: 270
  },
  photos: ["s3://photos/campaign123/..."],
  createdAt: new Date(),
  submittedAt: null,
  publishedAt: null
};

DB: campaigns.insert(campaign);
```

---

### Step 2: Fundraiser Submits for Review 🚀

**Fundraiser clicks "SUBMIT FOR REVIEW"**

**Validation checks:**
```
✅ Title is not empty
✅ Description is at least 500 chars
✅ Goal is between 10M - 2B VND
✅ End date is 30-180 days from now
✅ At least 1 photo uploaded
✅ Budget breakdown adds to 100%
✅ Impact metrics provided
✅ Fundraiser identity verified
```

**If all pass:**
```
UPDATE campaigns
SET status = 'pending_review',
    submittedAt = NOW()
WHERE id = campaign123;

Event published:
Topic: campaigns.submitted
{
  campaignId: "123",
  fundraiserId: "fundraiser456",
  timestamp: "2026-03-17T15:00:00Z"
}

Notification to Admin:
"New campaign waiting review: Feed Orphans (Goal: 100M)"
```

**Campaign now in "pending_review" state:**
```
PENDING_REVIEW Campaign:
├─ Visible: Only to fundraiser and admins
├─ Cannot receive donations yet
├─ Fundraiser can still edit
├─ Admin reviewing for:
│  ├─ Truthfulness of story
│  ├─ Realistic budget
│  ├─ Legitimate beneficiary
│  └─ Policy compliance
```

---

### Step 3: Admin Reviews Campaign ✅

**Admin dashboard shows:**
```
┌─────────────────────────────────────────┐
│ ADMIN DASHBOARD - CAMPAIGNS REVIEW      │
├─────────────────────────────────────────┤
│ Pending Review: 5 campaigns             │
│ • Feed Orphans Campaign                 │
│ • Healthcare for Elderly                │
│ • Education in Remote Areas             │
│ • Disaster Relief - Flash Flood         │
│ • Community Skills Training             │
│                                         │
│ [Click to review...]                    │
└─────────────────────────────────────────┘
```

**Admin opens campaign for review:**
```
┌──────────────────────────────────────────────┐
│ REVIEW: Feed Orphans Campaign                │
├──────────────────────────────────────────────┤
│                                              │
│ FUNDRAISER VERIFICATION                     │
│ ────────────────────────────────────────    │
│ Organization: Mercy Foundation Vietnam      │
│ Registration: ✅ Verified charity            │
│ Registration Number: CT-123456              │
│ Tax ID: 0987654321                          │
│ Verified: Yes (since 2020)                  │
│ Previous campaigns: 12 (all approved)       │
│ Reputation: 4.9/5 (500+ reviews)            │
│                                              │
│ CAMPAIGN DETAILS CHECK                      │
│ ────────────────────────────────────────    │
│ Title: "Feed Orphans in An Giang"           │
│ ✅ Title is descriptive, no misleading      │
│                                              │
│ Description: [text preview]                 │
│ ✅ Clear story, identifies beneficiaries    │
│ ✅ Realistic goals and approach             │
│                                              │
│ Goal: 100,000,000 VND                       │
│ ✅ Reasonable for 500 children × 3 months   │
│ ✅ Budget breakdown realistic (370k/meal)   │
│                                              │
│ Beneficiaries: 500 orphans                  │
│ ✅ Specific number mentioned                │
│ ✅ Location identified (An Giang)           │
│ ✅ Age group: mostly 5-15 years             │
│                                              │
│ Photos: [slideshowof 5 images]              │
│ ✅ Photos show real conditions              │
│ ✅ No stock photos detected                 │
│ ✅ Quality sufficient                       │
│                                              │
│ DECISION                                    │
│ ────────────────────────────────────────    │
│ ⭕ [APPROVE & PUBLISH]  [REQUEST REVISION]   │
│                                              │
│ Admin Notes (optional):                     │
│ "Clear campaign, well-documented, strong    │
│ track record from Mercy Foundation. Ready   │
│ for publishing."                            │
│                                              │
│ [SUBMIT DECISION]                           │
└──────────────────────────────────────────────┘
```

**Admin clicks "APPROVE & PUBLISH":**
```
1. Backend validation passes all checks
2. Campaign status updated to "published"
3. Campaign publishedAt timestamp set
4. Index updated (now searchable/visible)
5. Event published:
   Topic: campaigns.published
   {
     campaignId: "123",
     publishedAt: "2026-03-17T15:30:00Z"
   }
```

---

### Step 4: Campaign Published 🎉

**Campaign is now LIVE - visible to all donors**

**Fundraiser notification:**
```
Subject: ✅ Your Campaign is LIVE!

Congratulations! Your campaign has been approved and is now live.

Campaign: Feed Orphans in An Giang Province
Goal: 100,000,000 VND
Link: https://foodfund.vn/campaign/123

Your campaign is visible to [number] active donors.
Start sharing on social media to reach more people!
```

**Campaign is discoverable:**
```
GET /api/graphql
{
  campaigns(status: PUBLISHED) {
    // Campaign #123 appears in results
  }
}
```

**Campaign appears in feeds:**
- Home feed "Active Campaigns"
- "Child Welfare" category filter
- Search results for "orphans" or "An Giang"
- Recommended for similar campaigns

---

### Step 5: Notifications Sent 📢

**System automatically sends notifications to relevant donors:**

**Email to donors interested in "Child Welfare":**
```
Subject: New Campaign: Feed Orphans in An Giang 🍲

A new campaign you might care about:

Title: Feed Orphans in An Giang Province
Goal: 100,000,000 VND
Beneficiaries: 500 children
Duration: 3 months

This campaign matches your interests:
✅ Child Welfare
✅ Vietnam
✅ Similar goals to campaigns you've supported

Support this campaign: [DONATE NOW]

See more: https://foodfund.vn/campaign/123
```

**In-app notification:**
```
Push Notification:
"New campaign published: Feed Orphans - Help 500 children"

In-app banner:
"🆕 See the latest campaigns"
"Feed Orphans in An Giang"
"Help provide 3 nutritious meals per day"
[View Campaign]
```

**Social media auto-post (optional):**
```
Twitter / X:
"🆕 New campaign live on @FoodFundVN 🍲
Feed Orphans in An Giang - provide nutrition for 500 children
Goal: 100M VND | Help now 👇
[link] #FoodCharityVN #Orphans"

Facebook:
[Campaign image]
"New campaign published: Feed Orphans in An Giang Province
500 children are waiting for your support...
[DONATE]"
```

---

## Campaign Status Diagram

```
                    ┌────────────────┐
                    │ DRAFT          │
                    │ (Fundraiser    │
                    │  editing)      │
                    └────────┬───────┘
                             │
                    [SUBMIT FOR REVIEW]
                             │
                    ┌────────▼───────┐
                    │ PENDING_REVIEW │
                    │ (Admin         │
                    │  checking)     │
                    └────────┬───────┘
                             │
                    ┌────────┴────────┐
                    │                 │
          [APPROVE]         [REQUEST REVISION]
                    │                 │
                    │         ┌───────▼──────┐
                    │         │ NEEDS        │
                    │         │ REVISION     │
                    │         └───────┬──────┘
                    │                 │
                    │      [FUNDRAISER EDITS]
                    │                 │
                    │                 └─────────┐
                    │                           │
                    ▼                           │
          ┌─────────────────┐                   │
          │ PUBLISHED       │                   │
          │ (Active,        │                   │
          │ receiving       │                   │
          │ donations)      │                   │
          └─────────┬───────┘                   │
                    │                           │
         [FUNDRAISER CAN STILL EDIT, BUT WITH APPROVAL]
                    │                           │
         [TIME EXPIRES OR GOAL REACHED]         │
                    │                           │
          ┌─────────▼────────┐                  │
          │ COMPLETED        │                  │
          │ (No more         │                  │
          │ donations,       │                  │
          │ funds used)      │                  │
          └──────────────────┘                  │
                                                │
         If campaign has issues:          [RESUBMIT]
         [REJECT/CANCEL]                       │
                    │                          │
          ┌─────────▼─────────┐               │
          │ CANCELLED         │◄──────────────┘
          │ (Removed from     │
          │ marketplace)      │
          └───────────────────┘
```

---

# SLIDE 6: OPERATION EXECUTION

## 🍽️ From Campaign Funding to Meal Delivery

### Complete Operation Flow

```
Timeline visualization:
Day 1          Day 15         Day 45         Day 90
│              │              │              │
├─ Campaign    ├─ Fund reaches ├─ Operational ├─ Campaign
│  Published   │  50M VND      │  Completion  │  Ends
├─ Donations   │              │              │
│  Rolling in  ├─ Disbursement │ Day 46       │
│              │  Proposed     │ Final deliveries
│              │              │              └─ Evaluation
│              ├─ Admin        │              │
│              │  Approves     ├─ Week 7-12:  └─ Reporting
│              │              │  Weekly meals
                              │  & photos

Phase 1: Campaign Funding (Days 1-15)
Phase 2: Operational Setup (Days 15-30)
Phase 3: Meal Execution (Days 30-90)
Phase 4: Completion & Evaluation (Days 85+)
```

---

### PHASE 1: Launch & Initial Funding 🚀

**Day 1 - Campaign Goes Live:**
```
Timeline: March 17, 2026, 8:00 AM

1. Campaign published
2. Visible on FoodFund platform
3. Marketing team shares on social media
4. Email sent to existing donors
5. Notifications pushed

Status: ACTIVE, FUNDRAISING
Raised: 0 VND
Donors: 0
```

**Days 1-15 - Donation Collection:**
```
Daily analytics:
Day 1:  5 donors,  2.5M raised  (trending)
Day 2:  12 donors, 8.2M raised  (gaining momentum)
Day 3:  8 donors,  4.1M raised
Day 7:  45 donors, 23M raised   (halfway through first week)
Day 15: 350 donors, 45M raised  (halfway to goal)

Pattern: Spike on first day, then gradual accumulation
Strategy: Fundraiser posts updates to maintain interest
```

---

### PHASE 2: Disbursement Proposal & Approval 📊

**Day 15 - Fundraiser Submits Disbursement Proposal:**

**When funds reach 50% of goal (50M VND), fundraiser can propose use:**

```
POST /api/v1/disbursement/create
{
  campaignId: "campaign123",
  description: "Purchase food & prepare 500 meals week 1-5",
  calculatedAmount: 300000000,  // Total needed through campaign
  timeline: {
    startDate: "2026-03-25",
    endDate: "2026-04-15",
    frequency: "weekly"
  },
  itemization: [
    {
      category: "Rice",
      quantity: "500kg",
      unitCost: 15000,
      totalCost: 7500000
    },
    {
      category: "Protein (Chicken)",
      quantity: "200kg",
      unitCost: 80000,
      totalCost: 16000000
    },
    // ... more items
  ]
}
```

**Fundraiser form:**
```
┌────────────────────────────────────────┐
│ SUBMIT DISBURSEMENT REQUEST            │
├────────────────────────────────────────┤
│                                        │
│ Campaign: Feed Orphans                 │
│ Current Funding: 45M / 100M (45%)     │
│ Available for Operations: 45M          │
│                                        │
│ OPERATIONAL PLAN                       │
│                                        │
│ Phase: Week 1-5 (Meal Production)      │
│ Request Amount: 75M VND                │
│                                        │
│ Detailed Budget:                       │
│ ┌──────────────────────────────────┐   │
│ │ Item            Qty  Unit Cost   │   │
│ ├──────────────────────────────────┤   │
│ │ Rice           500kg   15K/kg    │   │
│ │ Total:                  7.5M    │   │
│ │                                  │   │
│ │ Chicken        200kg   80K/kg    │   │
│ │ Total:                  16M      │   │
│ │                                  │   │
│ │ Vegetables     150kg   8K/kg     │   │
│ │ Total:                  1.2M     │   │
│ │                                  │   │
│ │ Oil/Spices              3M       │   │
│ │ Labor (cooking)         12M      │   │
│ │ Transportation          8M       │   │
│ │ Miscellaneous           3M       │   │
│ │                                  │   │
│ │ PHASE 1 TOTAL:         50.7M    │   │
│ │ (for week 1-5 only)              │   │
│ │                                  │   │
│ │ REQUESTED AMOUNT:      75M       │   │
│ │ (buffer for contingencies)       │   │
│ └──────────────────────────────────┘   │
│                                        │
│ Notes:                                 │
│ "Prices quoted from local suppliers    │
│  verified on March 16. Kitchen         │
│  capacity: 200 meals/day"              │
│                                        │
│ [SUBMIT FOR APPROVAL]                  │
└────────────────────────────────────────┘
```

---

**Day 16-17 - Admin Reviews Proposal:**

**Admin dashboard alert:**
```
🔔 New Disbursement Request: Feed Orphans Campaign
   Amount: 75M VND | Status: Pending Admin Review
```

**Admin review checklist:**
```
┌─────────────────────────────────────────┐
│ ADMIN REVIEW: Disbursement Request      │
├─────────────────────────────────────────┤
│                                         │
│ Campaign: Feed Orphans (Feed 500)       │
│ Fundraiser: Mercy Foundation            │
│ Current Funding: 45M VND                │
│ Requested: 75M VND                      │
│ Risk: Request > Available (approved)    │
│                                         │
│ VERIFICATION CHECKLIST:                 │
│ ☑ Fundraiser verified organization     │
│ ☑ Budget breakdown detailed             │
│ ☑ Pricing reasonable (checked market)   │
│ ☑ Kitchen facility verified             │
│ ☑ Beneficiary count matches             │
│ ☑ Timeline realistic                    │
│ ☑ No red flags detected                 │
│                                         │
│ DECISION:                               │
│ ⭕ [APPROVE]  [REQUEST REVISION]         │
│                                         │
│ Conditions (optional):                  │
│ "Approved for Phase 1 (75M). Once      │
│  receipts submitted, release Phase 2    │
│  funds upon validation."                │
│                                         │
│ [SUBMIT DECISION]                       │
└─────────────────────────────────────────┘
```

**Admin clicks APPROVE:**
```
Status change:
disbursement {
  status: "approved",
  approvedBy: admin123,
  approvedAmount: 75000000,
  approvalDate: "2026-03-17T16:00:00Z",
  conditions: "[...]"
}

Notifications published:
├─ To Fundraiser: "Disbursement approved!"
├─ To Kitchen Staff: "Meal production approved for 75M"
└─ Event: Topic: disbursements.approved
```

---

### PHASE 3: Meal Production & Delivery 🍲

**Day 18 - Setup & Purchasing:**

**Kitchen staff assigned:**
```
TASK CREATED:
──────────────
Task ID: TASK_2026031801
Title: Meal production - Week 1 (200 meals/day)
Status: PENDING
Assigned to: Kitchen Team (4 staff)

Details:
├─ Location: Community Kitchen, District 1
├─ Dates: March 25-29, 2026
├─ Daily Output: 200 meals
├─ Total Meals Week 1: 1000 meals
├─ Menu: Rice, chicken, vegetables, oil
├─ Budget Phase 1: 75M VND
├─ Equipment: Available
├─ Approval: Admin approved March 18
│
└─ Next Steps:
   1. Purchase ingredients (with receipts)
   2. Prepare kitchen
   3. Verify supply arrival
   4. Start production Monday
```

**Kitchen staff actions:**
```
Step 1: PURCHASING
────────────────────
Morning March 20:
- Staff contact 3 approved suppliers
- Request quotes for bulk rice (500kg)
- Check prices & delivery times
- Negotiate if needed
- Selected supplier: XYZ Wholesale
- Price: 15,000/kg (verified reasonable)

Step 2: ORDERING & DELIVERY
──────────────────────────
Afternoon March 20:
- Place order with XYZ Wholesale
- Payment method: Platform (not cash)
- Delivery date: March 24 (before start)
- Expected delivery time: 2pm

Step 3: RECEIPT SUBMISSION
──────────────────────────
Evening March 24:
- Supplier delivers 500kg rice
- Kitchen staff verify quantity (weighing)
- Photograph receipt & delivery note
- Upload to FoodFund system:
  Document: Receipt_XYZ_Wholesale_Rice_500kg.pdf
  Cost: 7,500,000 VND
  Date: March 24, 2026
  Supplier: XYZ Wholesale
  Contact: 0912345678

System validates:
- Receipt amount ≤ approved budget for that item ✅
- All required fields present ✅
- Photos clear enough ✅

Receipt APPROVED by system (auto-validate under threshold)
Funds released: 7,500,000 VND → Supplier bank account
```

---

**Day 25 - Week 1 Production Begins:**

**Monday 6:00 AM:**
```
Kitchen Staff Arrive:
- Check all ingredients stocked
- Prepare utensils & equipment
- Divide into 2 shifts: morning (200 meals), evening (200 meals)

Shift 1 (6am - 12pm):
├─ 6:15 - Cook rice (200kg for 200 meals)
├─ 7:00 - Prepare chicken (20kg, cut into portions)
├─ 8:00 - Cook chicken curry (seasoned, soft)
├─ 9:00 - Prepare vegetables (chop into small pieces for kids)
├─ 10:00 - Pack meals into containers (rice + curry + veg)
│          Photo: containers lined up
├─ 11:00 - Label containers (with meal number, date)
│          Photo: close-up of labeling
└─ 12:00 - Complete & load into transport van
           Photo: van loaded with 200 meals

Meal details per container:
├─ Rice: 300g (cooked)
├─ Chicken curry: 150g
├─ Vegetable mix: 100g
├─ Oil: 10ml (mixed in)
├─ Spices (salt, turmeric)
└─ Total: ~560g per meal, ~400 calories
```

**Day 25 - 11:00 AM - Photo Documentation:**

```
Kitchen staff upload photos:
├─ Ingredient prep: [photo 1]
├─ Cooking process: [photo 2]
├─ Plating meals: [photo 3]
├─ Quality check: [photo 4]
├─ Ready for delivery: [photo 5]

Captions:
"Week 1 Day 1 - 200 meals prepared successfully.
All meals meet nutrition guidelines.
Ready for delivery to beneficiaries."

In FoodFund app - Update task:
Task Progress: 50% (200 of 200 meals)
Status: "Ready for Delivery"
Photos: [linked with update]
Next: Delivery staff pickup at 11:30am
```

---

**Day 25 - 11:30 AM - Delivery Staff Pickup:**

**Delivery staff assigned:**
```
DELIVERY TASK:
──────────────
Date: March 25, 2026
Pickup Location: Community Kitchen, District 1
Delivery Locations: 3 sites (Dist 1 Children's Home, District 4 Center, District 7 Shelter)
Total Meals: 200
Delivery Window: 12:00pm - 3:00pm
Vehicle: Refrigerated van
Staff: 2 drivers

Delivery Route:
8 Location 1: Children's Home Dist 1 (100 meals, 12:30pm)
  └─ Contact: Sister Mary - 0912123456
  
8 Location 2: Day-care Center Dist 4 (50 meals, 1:30pm)
  └─ Contact: Mr. Hung - 0912234567
  
8 Location 3: Shelter Dist 7 (50 meals, 2:30pm)
  └─ Contact: Ms. Linh - 0912345678
```

**Delivery execution:**
```
12:00pm - Pickup
- Check seal
- Verify container count (200)
- Verify temperature cold (6-8 degrees C)
- Load into refrigerated van

12:30pm - Location 1 Arrival
- Arrive at Children's Home Dist 1
- Call Sister Mary: "Delivery arrived"
- Unload 100 meal containers
- Sister Mary verify: count, condition, temperature
- Photograph: Children lined up receiving meals
- Sister Mary signs delivery confirmation
- Record in app: "Location 1 completed, 100 meals delivered"

1:30pm - Location 2 Arrival
- Similar process
- 50 meals delivered, signed
- Photo: Beneficiaries eating meals

2:30pm - Location 3 Arrival
- Similar process
- 50 meals delivered, signed
- Photo: Happy children with meals

3:15pm - Return to kitchen
- Report to kitchen: All meals delivered successfully
- Upload delivery confirmation photos
- Mark task complete: "Day 1 Done - 200 meals delivered to 200 beneficiaries"
```

**Photos uploaded by delivery staff:**
```
Week 1 Delivery Photos:
├─ Meals being loaded into van
├─ Van departure
├─ Arrival Location 1 (Children's Home sign)
├─ kids receiving meals (faces blurred for privacy)
├─ Meals being consumed
├─ Location 2 delivery
├─ Location 3 delivery
└─ Return to kitchen (empty van)

Captions:
"200 meals successfully delivered to 3 locations. 
All beneficiaries received warm, nutritious meals. 
Confirmed on-time delivery and satisfaction."

System publishes: Event to Kafka
Topic: meals.delivered
{
  campaignId: "123",
  date: "2026-03-25",
  mealsDelivered: 200,
  locations: 3,
  photos: [links],
  timestamp: "2026-03-25T15:30:00Z"
}
```

---

**First Update Posted to Campaign Page:**

```
Dashboard updates in real-time:
Campaign: Feed Orphans
────────────────────────
Progress: Week 1 Day 1

✨ UPDATE FROM KITCHEN:
"Day 1 Production Complete! 200 nutritious meals prepared 
 with fresh rice, chicken curry, vegetables, and oil. 
 All meals meet daily nutrition target: 400 calories, protein, 
 vitamins. Photo gallery: [link]"

 ✨ UPDATE FROM DELIVERY:
"200 meals successfully delivered to 3 beneficiary sites:
- Children's Home District 1: 100 meals
- Day-care Center District 4: 50 meals  
- Shelter District 7: 50 meals

All beneficiaries received warm meals and smiled! 
[Photos: children eating]"

Impact So Far:
├─ Meals Prepared: 200
├─ Beneficiaries Fed: 200
├─ Days Remaining (Goal: 90 days): 89
├─ Meals to Go: 8,800
└─ Timeline: On pace ✅

Estimated completion: December 23, 2026
```

**Donor notifications:**
```
Email to all donors:
Subject: ✅ Your donation is making an impact!

Dear [Donor],

Great news! Your donation to "Feed Orphans in An Giang" 
is already bringing smiles to hungry children.

Today (March 25), we prepared and delivered 200 
nutritious meals. In the photo, you can see the 200 
children who received meals thanks to YOUR generosity.

Next week, we deliver another 200 meals. By May, 1000 
children will have received proper nutrition.

See photos & updates: [link to campaign page]

Thank you for caring! ❤️
— FoodFund Team
```

---

**Days 26-90: Repeating Cycle:**

```
Weekly Pattern (Weeks 1-13):
─────────────────────────

Each week:
Monday 6am:   Kitchen staff arrive, cooking begins
11:30am:      Delivery staff pickup 200 meals
12-3pm:       Delivery to 3 locations (200, 100, 200)
Tuesday-Friday: Similar daily cycle (4 days × 200 meals = 800 meals/week)

Week 1: Days 25-29 (Monday-Friday) = 200 × 5 = 1000 meals
Week 2: Days 1-5   (April)         = 200 × 5 = 1000 meals
...
Week 13: Days 85-89                = 200 × 5 = 1000 meals

Total: 1000 meals/week × 13 weeks = 13,000 meals ✅

But goal is 500 beneficiaries × 30 meals (1 month) = 15,000 meals
So actually...

Revised Plan:
├─ Mon-Fri, every week, 200 meals/day
├─ Sat mornings: 200 meals (to some sites)
├─ Total: 1200 meals/week
├─ Duration: 13 weeks
└─ Total: 15,600 meals (exceeds goal ✅)
```

---

### PHASE 4: Completion & Evaluation 📊

**Day 90 - Campaign Operations End:**

```
Campaign Status: COMPLETED

Results:
├─ Goal: 100M VND
├─ Raised: 112M VND (112% - exceeded!)
├─ Meals Prepared: 15,200
├─ Beneficiaries Served: 500 unique individuals
├─ Unique meals: 15,200 servings
├─ Average cost/meal: 6,579 VND (112M / 15,200)
├─ Total days: 90
├─ Execution success rate: 98.5% (only 1 day skipped for holiday)

Photos: 450+ photos throughout campaign
Videos: 12 videos

Financial reconciliation:
Raised (Donors):              112,000,000 VND
Platform fee (3%):            -3,360,000 VND
Money to fundraiser:          108,640,000 VND

Fundraiser spending:          112,000,000 VND
├─ Rice & staples:            -42,000,000
├─ Protein (chicken):         -35,000,000
├─ Vegetables & ingredients:  -18,000,000
├─ Labor (kitchen staff):     -12,000,000
├─ Transportation:            -5,000,000
└─ Total spent:               -112,000,000 VND

Balance:                        -3,360,000 (fee already paid by donors)
Status:                         ✅ Financially balanced

Actual surplus for next phase: 0 (all funds utilized)
```

---

**Campaign Page Updated:**

```
┌────────────────────────────────────────┐
│ Feed Orphans in An Giang - COMPLETED   │
├────────────────────────────────────────┤
│ ✅ Goal Reached: 112M of 100M (112%)   │
│ Dates: March 17 - June 15, 2026        │
│ Status: Successfully completed!        │
│                                        │
│ IMPACT SUMMARY:                        │
│ ✅ 15,200 meals prepared               │
│ ✅ 500 children fed                    │
│ ✅ 13 weeks of nutrition support       │
│ ✅ 450+ photos documenting impact      │
│                                        │
│ WHAT WAS ACCOMPLISHED:                 │
│ • Provided 3 meals/day × 90 days       │
│ • 400 nutrition standard met           │
│ • Zero missed days (98.5% success)     │
│ • All receipts verified                │
│ • Complete transparency                │
│                                        │
│ DONOR IMPACT:                          │
│ • 2,847 individuals donated             │
│ • Each donor changed ~5 children's lives│
│ • Cost per meal: 6,579 VND             │
│ • Cost per child for 90 days: ~1.8M    │
│                                        │
│ FEEDBACK FROM BENEFICIARIES:           │
│ "These meals gave us new energy" -     │
│ Sister Mary, Children's Home           │
│                                        │
│ NEXT PHASE:                            │
│ Based on success, Mercy Foundation is  │
│ launching "Phase 2" to continue support│
│ for another 3 months (July-September)  │
│ Would you like to support Phase 2?     │
│ [DONATE TO PHASE 2]                    │
│                                        │
│ [LEAVE REVIEW]  [SHARE]  [PRINT REPORT]│
└────────────────────────────────────────┘
```

---

**Final Report Generated:**

```
FOODFUND CAMPAIGN IMPACT REPORT
────────────────────────────────
Feed Orphans in An Giang Province
Campaign ID: 123
Report Date: June 15, 2026

EXECUTIVE SUMMARY:
Over 13 weeks, 2,847 donors contributed to feeding 500 children
in An Giang province. Campaign exceeded goal by 12% and achieved
98.5% execution success rate.

FINANCIAL OVERVIEW:
Total Raised: 112,000,000 VND
Funds Used: 112,000,000 VND
Platform Fee: 3,360,000 VND (3%)
Beneficiary Received: 108,640,000 VND (97%)
Balance: 0 VND (fully deployed)

OPERATIONAL METRICS:
Meals Prepared: 15,200
Meals Delivered: 15,002 (98.7% delivery rate)
Average Cost/Meal: 6,579 VND
Cost/Child/90days: 1,870,400 VND

QUALITY METRICS:
Nutrition Standard Met: 100% of meals
Donor-Verified Photos: 450+
Complete Documentation: Yes
Zero Fraud Incidents: Yes

BENEFICIARY FEEDBACK:
Satisfaction: 4.8/5.0 (based on surveys)
"These meals helped my children focus in school better"
"We're grateful for the nutrition support"
"Families haven't been this healthy in years"

RECOMMENDATIONS:
1. Continue Phase 2 immediately
2. Expand to Dong Thap province
3. Increase to 300 meals/day (capacity)
4. Partner with local schools for impact tracking

Prepared by: FoodFund Impact Team
Verified by: Admin Review Board
```

---

# SLIDE 7: SYSTEM SUMMARY

## 🎯 FoodFund: Charity Donation Platform for Food Distribution

### What is FoodFund?

**Core Mission:** Connect generous donors with legitimate organizations to provide food aid to vulnerable populations in Vietnam.

**Platform Type:** Crowdfunding + Logistics + Transparency

**Market Opportunity:**
```
Vietnam Population: 98 million
Population below poverty line: 2-3 million (2.5%)
Estimated under-nourished: 5-8 million

Market Size:
├─ Corporations (CSR budgets): 500B+ VND/year
├─ Individual donors: 200B+ VND/year
├─ Government allocations: 300B+ VND/year
└─ Total addressable: 1T+ VND/year

FoodFund TAM (Total Addressable Market): 100B+ VND by 2028
```

---

### Key Value Propositions

**For Donors:**
```
✅ Trust & Transparency
   - Real-time photo/video proof
   - Admin verification
   - Financial reconciliation
   - Audit trails for tax deduction

✅ Impact Measurability
   - See exactly how money is used
   - Meals per beneficiary calculated
   - Success metrics published
   - Long-term follow-up available

✅ Convenience
   - Browse campaigns from phone
   - One-tap donation via QR
   - Receipt auto-generated
   - Historical tracking

✅ Community
   - See other donors supporting same cause
   - Leave reviews & testimonials
   - Recurring giving programs
   - Leaderboard recognition
```

**For Fundraisers:**
```
✅ Access to Donors
   - 100k+ registered donors
   - Segmented by interest (child welfare, elderly, etc.)
   - Marketing tools to reach audience
   - No upfront marketing cost

✅ End-to-End Support
   - Help with campaign planning
   - Admin verification streamlined
   - Disbursement process simplified
   - Operational guidance provided

✅ Accountability Tools
   - Receipt tracking system
   - Photo/video documentation
   - Process approval workflow
   - Impact measurement framework

✅ Reputation Building
   - Long-term platform home for organization
   - Previous campaign history visible
   - Rating system (transparent)
   - Partnership opportunities
```

**For Society:**
```
✅ Job Creation
   - 500+ full-time equivalent workers
   - Kitchen staff (500 people)
   - Delivery staff (200 people)
   - Kitchen management (50 people)
   - Administrative (50 people)

✅ Formal Economy
   - Cash transactions tracked
   - Tax compliance improved
   - Supply chains registered
   - Food safety standards maintained

✅ Social Impact
   - 1M+ people fed annually by 2028
   - Reduction of malnutrition
   - Youth development (donor education)
   - Civic responsibility culture
```

---

### Revenue Model

**Platform Fee Structure:**
```
Per Transaction:
├─ Donation: 3% platform fee
│  (Donor pays, separated from their gift)
│  Example: Donate 1M → Platform receives 30k
│           Fundraiser receives 970k
│
├─ Withdrawal: 1% banking fee
│  (When fundraiser withdraws to bank)
│  Example: Withdraw 100M → 1M fee
│
└─ Geographic expansion (future):
   ├─ Thailand: 2.5% fee
   ├─ Philippines: 2.5% fee
   └─ Indonesia: 2.5% fee
```

**Revenue Projection (3-year):**
```
Year 1 (2026):
├─ Total Donations: 100B VND
├─ Platform Fee (3%): 3B VND
├─ Operating Costs: 2B VND
├─ Net Profit: 1B VND
└─ Operating FTE: 15

Year 2 (2027):
├─ Total Donations: 400B VND (4x growth)
├─ Platform Fee (3%): 12B VND
├─ Operating Costs: 6B VND
├─ Net Profit: 6B VND
└─ Operating FTE: 40

Year 3 (2028):
├─ Total Donations: 1.2T VND (3x YoY)
├─ Platform Fee (3%): 36B VND
├─ Operating Costs: 15B VND
├─ Net Profit: 21B VND
└─ Operating FTE: 100
└─ Market Share: 15% of addressable

Cumulative Profit (3 years): 28B VND
Reinvestment in platform: 14B (50%)
Founder returns: 14B (50%)
```

---

### Competitive Landscape

**Current Competitors & Comparison:**

| Aspect | FoodFund | NGOs (Direct) | Corporate CSR | International Platforms |
|--------|----------|-------|-----------|----------------------|
| Accessibility | ⭐⭐⭐⭐⭐ High tech | ⭐⭐ Low | ⭐⭐⭐ Medium | ⭐⭐ Not localized |
| Trust | ⭐⭐⭐⭐⭐ Admin verified | ⭐⭐⭐⭐ Known orgs | ⭐⭐⭐ Established | ⭐⭐⭐⭐ Institutional |
| Transparency | ⭐⭐⭐⭐⭐ Real-time photo | ⭐⭐ Annual reports | ⭐⭐ Limited | ⭐⭐⭐ Periodic |
| Fee | 3-4% | Often 15-30% | Internal | 5-8% |
| Speed | ⭐⭐⭐⭐⭐ Instant | ⭐⭐ Slow | Medium | ⭐⭐ Slow |
| Vietnamese Focus | ⭐⭐⭐⭐⭐ Yes | ⭐⭐⭐⭐⭐ Yes | ⭐⭐⭐ Mixed | ❌ No |
| User Experience | ⭐⭐⭐⭐⭐ Mobile-first | ⭐ Website | ⭐⭐ Email-based | ⭐⭐⭐ Okay |

**FoodFund's Competitive Advantages:**
```
1. Digital-First Design
   └─ Competitors are web-only or offline
   └─ FoodFund is mobile-optimized from day 1

2. Real-Time Transparency
   └─ Photo updates daily, not annual reports
   └─ Donors see impact within hours

3. Vietnamese Market Focus
   └─ Localized payment (MoMo QR)
   └─ Design for Vietnamese user behavior
   └─ Cultural understanding

4. Network Effects
   └─ More donors → More campaigns
   └─ More campaigns → More donors
   └─ Virtuous cycle impossible for new entrants

5. Trust + Scale
   └─ Admin verification prevents fraud
   └─ Scale advantages (lower fees = higher donation rate)
   └─ Community rating system

6. Operational Excellence
   └─ Integrated logistics (kitchen + delivery)
   └─ Proof-of-delivery system
   └─ Financial reconciliation

7. Low Fee + High Transparency
   └─ 3% fee (50% lower than NGOs)
   └─ 97% of money reaches beneficiaries
   └─ Donors see exactly where money goes
```

---

### Growth Strategy

**Phase 1: Foundation (2026)**
- Launch beta in Ho Chi Minh City
- 100k registered users
- 50 live campaigns
- Stabilize payment system
- Build community confidence

**Phase 2: National Expansion (2027)**
- Expand to 5 major cities (Hanoi, Da Nang, Can Tho, etc.)
- 500k registered users
- 200 active campaigns
- iOS/Android mobile app
- Series A fundraising ($2-3M)

**Phase 3: Regional Domination (2028)**
- Launch Thailand & Philippines operations
- 2M registered users across region
- 500 active campaigns
- Revenue: 100B+ VND/year
- Series B fundraising ($10-15M)

---

### Technology Roadmap

**Q1 2026 (MVP):**
- ✅ Core donation flow
- ✅ Campaign management
- ✅ Admin approval system
- ✅ Payment integration (MoMo)

**Q2 2026:**
- ⏳ Enhanced search & recommendation
- Analytics dashboard
- Recurring donor programs
- API for partners

**Q3 2026:**
- Mobile app beta (iOS/Android)
- Community features (testimonials, events)
- Impact dashboard
- Partner integrations (NGO networks)

**Q4 2026 & Beyond:**
- AI recommendation engine
- Blockchain receipts (immutable proof)
- Subscription tiers (verified badges)
- International expansion tech infrastructure

---

### Risks & Mitigation

**Risk 1: Fraud (Fake campaigns)**
```
Mitigation:
├─ Admin verification of all campaigns
├─ Background checks on fundraisers
├─ Real-time photo requirement
├─ Donor feedback/flag system
└─ Mandatory audit after each campaign
```

**Risk 2: Regulatory (Government policy changes)**
```
Mitigation:
├─ Compliance officer hired immediately
├─ Whitepaper proving social value
├─ Transparent communication with authorities
├─ Advisory board with regulatory experts
└─ Flexible architecture for policy adaptation
```

**Risk 3: Scale (Payment processing failures)**
```
Mitigation:
├─ Multiple payment gateway integration
├─ Backup processing system
├─ Real-time monitoring & alerts
├─ Disaster recovery procedures
└─ Webhook + Polling dual approach
```

**Risk 4: Market (Adoption / apathy)**
```
Mitigation:
├─ Heavy influencer marketing partnerships
├─ Viral campaign incentives (matching donations)
├─ Corporate B2B partnerships for CSR budgets
├─ Educational content on charitable giving
└─ Gamification (leaderboards, badges)
```

---

### Long-Term Vision

**By 2030, FoodFund will be:**

```
✨ Southeast Asia's leading digital charity platform
   └─ 10M+ registered users
   └─ 2,000+ active campaigns
   └─ 500B+ cumulative donations
   └─ 10M+ beneficiaries fed/supported

✨ Trusted infrastructure for NGOs
   └─ 80% of registered charities use platform
   └─ Industry standard for transparency
   └─ Policy partner with governments

✨ Formal employer
   └─ 1,000+ full-time staff across region
   └─ 50,000+ part-time kitchen/delivery workers
   └─ Career advancement paths

✨ Social movement
   └─ "No one goes hungry" becomes reality
   └─ Generosity and mutual support normalized
   └─ Digital-first charity model replicated globally
```

---

### Call to Action

**For Donors:** 
"Join millions supporting food security in your community. Start with 50k VND."

**For Organizations/Fundraisers:**
"Access 500k+ donors. Get verified, launch campaign, make impact."

**For Investors:**
"FoodFund is capturing a fragmented 1T+ VND market. Join us in building the future of charity in Southeast Asia."

**For Partners:**
"Technology, logistics, payment expertise needed. Let's drive social change together."

---

# APPENDIX

## A. Technology Details

### GraphQL vs REST Comparison

**REST Approach:**
```
GET /api/campaigns/123
Returns:
{
  "id": "123",
  "title": "Feed Orphans",
  "description": "...",
  "goal": 100000000,
  "raised": 45000000,
  "category": "child-welfare",
  "location": "An Giang",
  "image": "...",
  "tags": ["orphans", "vietnam", "nutrition"],
  "comments": [... 50 items],
  "reviews": [... 100 items],
  "updates": [... 20 items],
  ...
}
Size: ~150KB (lots of data you don't need)

GET /api/campaigns/123/donations?limit=10
Returns: 10 donations (separate request)
Size: ~15KB

Total: 3+ requests, 165KB+ data
Time on slow phone: ~3 seconds
```

**GraphQL Approach:**
```
query {
  campaign(id: "123") {
    title
    goal
    raised
    image
  }
}
Returns:
{
  "campaign": {
    "title": "Feed Orphans",
    "goal": 100000000,
    "raised": 45000000,
    "image": "..."
  }
}
Size: ~1.2KB
Time on slow phone: ~300ms
```

**GraphQL Benefits:**
- Only transfer data needed
- Single request (no waterfalls)
- Mobile-friendly (battery efficient)
- Type safe (auto-validation)

---

### Debezium CDC Diagram

```
┌─────────────────────────────────────┐
│ PostgreSQL (Primary Database)       │
├─────────────────────────────────────┤
│                                     │
│ Transactions accepted:              │
│ UPDATE campaigns SET raised=45M     │
│ INSERT INTO donations ...           │
│                                     │
└────────────┬────────────────────────┘
             │
             │ (Transaction Log / WAL)
             │
┌────────────▼────────────────────────┐
│ Write-Ahead Log (WAL)               │
│ ~500MB of logs accumulating         │
└────────────┬────────────────────────┘
             │
             │ (Debezium reads continuously)
             │
┌────────────▼────────────────────────┐
│ Debezium Connector                  │
│ ├─ Published: 2026-03-17 14:00      │
│ │  TableName: campaigns             │
│ │  Operation: UPDATE                │
│ │  Before: { raised: 44500000 }     │
│ │  After:  { raised: 45000000 }     │
│ │  Timestamp: 2026-03-17T14:00Z     │
│ │                                   │
│ └─ Publishes every ~1 second        │
│    (batch of 100s of events)        │
└────────────┬────────────────────────┘
             │ (Kafka topic)
             │
┌────────────▼────────────────────────┐
│ Kafka Topic: postgres.public        │
│ Partition 0   Partition 1           │
│ ├─ Offset 0   ├─ Offset 0           │
│ ├─ Offset 1   ├─ Offset 1           │
│ └─ ...        └─ ...                │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┬───────────┐
    │                 │           │
    ▼                 ▼           ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│ Analytics   │ │ Cache    │ │ Audit    │
│ Service     │ │ Invalidat│ │ Log      │
│ (read all)  │ │(read all)│ │(read all)│
│             │ │          │ │          │
│ Calculate:  │ │ If raised│ │ Record:  │
│ - Total GMV │ │ changes, │ │ All      │
│ - Top       │ │ clear    │ │ changes  │
│   campaigns │ │ category │ │ for      │
│ - Growth    │ │ total    │ │ compliance
└─────────────┘ └──────────┘ └──────────┘

Benefits:
✅ All changes captured (no missing events)
✅ Multi-consumer pattern (no conflicts)
✅ Event replay possible (debug, rebuild state)
✅ Real-time synchronization (ms latency)
✅ No polling database (efficient)
```

---

## B. Deployment Configuration

### Kubernetes Deployment Example

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: foodfund-prod

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: foodfund-api
  namespace: foodfund-prod
spec:
  replicas: 5  # 5 instances for reliability
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # Zero-downtime deployments
  selector:
    matchLabels:
      app: foodfund-api
  template:
    metadata:
      labels:
        app: foodfund-api
    spec:
      containers:
      - name: api
        image: registry.foodfund.vn/foodfund-api:v2.1.0
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: foodfund-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: foodfund-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: foodfund-api-service
  namespace: foodfund-prod
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
    name: http
  selector:
    app: foodfund-api

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: foodfund-api-hpa
  namespace: foodfund-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: foodfund-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## C. Environment Configuration

```bash
# .env.production

# API Configuration
API_PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@postgres-prod.db.foodfund.internal:5432/foodfund
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Cache
REDIS_URL=redis://valkey-prod.cache.foodfund.internal:6379
CACHE_TTL=3600

# Message Broker
KAFKA_BROKERS=kafka1.msg.foodfund.internal:9092,kafka2.msg.foodfund.internal:9092,kafka3.msg.foodfund.internal:9092
KAFKA_CLIENT_ID=foodfund-api-prod

# Payment Gateway
RAYOS_API_KEY=sk_live_xxxxxxxxxxxxx
RAYOS_SECRET=sk_secret_xxxxxxxxxxxxx
RAYOS_WEBHOOK_SECRET=wh_secret_xxxxxxxxxxxxx

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-prod
JWT_EXPIRY=86400  # 24 hours

# Email Service
SMTP_HOST=smtp.SendGrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx

# Storage (Images/Videos)
S3_BUCKET=foodfund-assets-prod
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CDN_URL=https://cdn.foodfund.vn

# Monitoring
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
DATADOG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature Flags
FEATURE_RECURRING_DONATIONS=true
FEATURE_AI_RECOMMENDATIONS=false  # Coming Q2 2026
FEATURE_BLOCKCHAIN_RECEIPTS=false  # Coming Q3 2026

# Payment Methods
PAYMENT_METHODS=momo,tpbank
DEFAULT_PAYMENT_METHOD=momo
PLATFORM_FEE_PERCENTAGE=3

# Admin Settings
MAX_CAMPAIGN_GOAL=2000000000  # 2B VND
MIN_CAMPAIGN_GOAL=10000000    # 10M VND
CAMPAIGN_REVIEW_SLA_HOURS=24
```

---

## D. API Endpoints

### Campaign Management

```
POST   /api/v1/campaigns               - Create campaign
GET    /api/v1/campaigns               - List campaigns
GET    /api/v1/campaigns/{id}          - Get campaign details
PUT    /api/v1/campaigns/{id}          - Update campaign
DELETE /api/v1/campaigns/{id}          - Delete campaign
POST   /api/v1/campaigns/{id}/publish  - Submit for approval
PUT    /api/v1/campaigns/{id}/approve  - Admin: Approve campaign
PUT    /api/v1/campaigns/{id}/reject   - Admin: Reject with reason
```

### Donations

```
POST   /api/v1/donations               - Create donation
GET    /api/v1/donations/{id}          - Get donation details
GET    /api/v1/donations/campaign/{campaignId} - Campaign donations
PUT    /api/v1/donations/{id}/confirm  - Confirm payment received
```

### Disbursements

```
POST   /api/v1/disbursements           - Create disbursement request
GET    /api/v1/disbursements/{id}      - Get disbursement details
PUT    /api/v1/disbursements/{id}/approve - Admin: Approve
PUT    /api/v1/disbursements/{id}/reject - Admin: Reject
POST   /api/v1/disbursements/{id}/receipts - Upload receipt
```

### Admin

```
GET    /api/v1/admin/dashboard         - Dashboard metrics
GET    /api/v1/admin/campaigns/pending - Campaigns awaiting approval
GET    /api/v1/admin/users             - User management
PUT    /api/v1/admin/users/{id}/ban    - Ban user
GET    /api/v1/admin/reports           - Reports & analytics
```

---

## E. Glossary

| Term | Definition |
|------|-----------|
| **GMV** | Gross Merchandise Value - total donations |
| **TAM** | Total Addressable Market - potential market size |
| **gRPC** | Google Remote Procedure Call - high-performance RPC |
| **CDC** | Change Data Capture - stream database changes |
| **WAL** | Write-Ahead Log - database transaction log |
| **HPA** | Horizontal Pod Autoscaler - Kubernetes scaling |
| **PCI** | Payment Card Industry - payment security standard |
| **JWT** | JSON Web Token - authentication token |
| **SLA** | Service Level Agreement - uptime guarantee |
| **CSR** | Corporate Social Responsibility - company charitable giving |

---

*This comprehensive presentation deck provides 2-3 hours of content covering all aspects of the FoodFund platform: architecture, technology, business model, operations, and growth strategy. Slides are ready for investor presentations, team onboarding, and stakeholder communication.*

*Last updated: March 2026*
*For questions or updates: hello@foodfund.vn*
