# Admin Panel Setup Guide

## Overview
Admin panel তৈরি করা হয়েছে যেখানে admin property approve/reject করতে পারবে।

## Admin Login Credentials
- **Email**: `fagunandy@gmail.com`
- **Password**: `admin123`

## Features

### 1. Property Approval Workflow
- Owner যখন property add করে, সেটা automatically `approved: false` হয়ে যায়
- Property immediately featured section এ show হবে না
- Admin `/admin/properties` page এ গিয়ে approve করতে পারবে
- Admin approve করলে property featured section এ show হবে
- Admin reject করলে property delete হয়ে যাবে

### 2. Admin Dashboard (`/admin`)
- Total properties count
- Pending properties count (approval প্রয়োজন)
- Approved properties count
- Quick action button pending properties review করার জন্য

### 3. Properties Management (`/admin/properties`)
- **Pending Properties**: সব pending properties দেখাবে, approve/reject button সহ
- **Approved Properties**: সব approved properties দেখাবে
- Property details view করার option
- Approve/Reject actions

### 4. Property Detail Page (`/admin/properties/[id]`)
- Full property details
- Owner information
- Images, description, terms
- Approve/Reject buttons (যদি pending হয়)

## Database Changes

### Prisma Schema Update
Property model এ `approved` field যোগ করা হয়েছে:
```prisma
approved Boolean @default(false) // Admin approval required
```

### Migration Command
```bash
npx prisma migrate dev --name add_property_approval
npx prisma generate
```

## How It Works

### 1. Owner Property Add করলে:
```typescript
// app/api/properties/route.ts (POST)
approved: false // Automatically set to false
```

### 2. Regular Users দেখবে:
```typescript
// app/api/properties/route.ts (GET)
where.approved = true // Only approved properties
```

### 3. Featured Properties:
```typescript
// app/page.tsx
const featured = allProperties.filter(
  (p) => p.featured && p.available && p.approved
)
```

### 4. Admin Actions:
- **Approve**: `/api/admin/properties/[id]/approve` - Property approve করে
- **Reject**: `/api/admin/properties/[id]/reject` - Property delete করে

## User Roles

### ADMIN (`fagunandy@gmail.com`)
- Admin dashboard access (`/admin`)
- Property approve/reject করতে পারবে
- সব properties দেখতে পারবে (approved + pending)

### OWNER
- Property add করতে পারবে
- নিজের properties manage করতে পারবে
- কিন্তু property add করার পর admin approval লাগবে

### RENTER
- Properties browse করতে পারবে
- শুধু approved properties দেখতে পারবে
- Owner এর সাথে contact করতে পারবে

## Important Notes

1. **Property Visibility**: 
   - Owner property add করলে সেটা immediately visible হবে না
   - Admin approve করার পর visible হবে

2. **Featured Section**:
   - শুধু approved properties featured section এ show হবে
   - `featured: true` + `approved: true` + `available: true` হলে show হবে

3. **Admin Access**:
   - শুধু `fagunandy@gmail.com` email দিয়ে login করলে admin dashboard access পাবে
   - অন্য users admin routes access করতে পারবে না

## Next Steps

1. Database migration run করুন:
   ```bash
   npx prisma migrate dev --name add_property_approval
   npx prisma generate
   ```

2. Admin হিসেবে login করুন:
   - Email: `fagunandy@gmail.com`
   - Password: `admin123`

3. Admin dashboard এ যান: `/admin`

4. Test করুন:
   - Owner হিসেবে property add করুন
   - Admin হিসেবে approve করুন
   - Featured section check করুন

## File Structure

```
app/
  admin/
    layout.tsx          # Admin layout with sidebar
    page.tsx            # Admin dashboard
    properties/
      page.tsx          # Properties list (pending + approved)
      [id]/
        page.tsx        # Property detail view

components/
  admin/
    admin-sidebar.tsx   # Sidebar navigation
    admin-topbar.tsx   # Top bar with user info
    property-actions.tsx # Approve/Reject buttons

api/
  admin/
    properties/
      [id]/
        approve/
          route.ts      # Approve property API
        reject/
          route.ts      # Reject property API
```

## API Endpoints

### Admin Only
- `POST /api/admin/properties/[id]/approve` - Approve property
- `POST /api/admin/properties/[id]/reject` - Reject property

### Public (Filtered)
- `GET /api/properties` - Only approved properties (for regular users)
- `POST /api/properties` - Create property (sets approved: false)

## Testing Checklist

- [ ] Database migration successful
- [ ] Admin login works (`fagunandy@gmail.com`)
- [ ] Admin dashboard shows pending count
- [ ] Owner can add property
- [ ] New property doesn't show in featured section
- [ ] Admin can approve property
- [ ] Approved property shows in featured section
- [ ] Admin can reject property
- [ ] Rejected property is deleted
- [ ] Regular users only see approved properties

