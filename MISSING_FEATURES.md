# Missing Dashboard Features

## Overview
The backend API (https://github.com/Obada-zaher/GovernmentComplaints) supports several features that are currently not implemented in the admin dashboard frontend. This document outlines the missing features that need to be added.

## Missing Features

### 1. Attachments Display
**Backend Support:** ✅ Available  
**Frontend Status:** ❌ Not Implemented

The backend supports complaint attachments, but the admin dashboard does not display them.

**Requirements:**
- Display list of attachments uploaded by citizens on complaint detail page
- Show attachment metadata (filename, size, upload date)
- Provide download/view functionality for attachments
- Support for image previews (if applicable)

**API Endpoints:**
- Complaint object includes `attachments` array (need to verify exact structure)
- Need to check backend for attachment download/view endpoints

**Implementation Location:**
- `app/[locale]/admin/complaints/[id]/page.tsx` - Add attachments section

---

### 2. Complaint Timeline/Status History
**Backend Support:** ✅ Available  
**Frontend Status:** ❌ Not Implemented

The backend tracks the complete history of complaint status changes and actions taken, but this is not displayed in the dashboard.

**Requirements:**
- Display chronological timeline of all status changes
- Show who made each change (admin/employee)
- Display notes/reasons for status changes
- Show timestamps for each action
- Visual timeline with appropriate icons for different action types

**API Endpoints:**
- Need to verify backend endpoint for complaint history/timeline
- Likely: `/admin/complaints/{id}/history` or similar

**Implementation Location:**
- `app/[locale]/admin/complaints/[id]/page.tsx` - Add timeline section

---

### 3. Request Additional Information from Citizen
**Backend Support:** ✅ Available  
**Frontend Status:** ❌ Not Implemented

Admins/employees can request additional information from citizens, but this functionality is missing from the dashboard.

**Requirements:**
- Form to submit information requests to citizens
- Track status of information requests
- Display citizen responses
- Notification system for when citizen responds
- Link information requests to specific complaints

**API Endpoints:**
- Need to verify backend endpoint for information requests
- Likely: `/admin/complaints/{id}/information-requests` or similar

**Implementation Location:**
- `app/[locale]/admin/complaints/[id]/page.tsx` - Add information request section
- May need separate component for managing requests

---

### 4. Type Definitions Updates

**Current `types/api.ts` Missing:**
```typescript
// Attachment type
export interface Attachment {
  id: string | number;
  complaint_id: string | number;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

// Complaint history/timeline entry
export interface ComplaintHistory {
  id: string | number;
  complaint_id: string | number;
  action_type: string; // 'status_change', 'assignment', 'department_change', etc.
  from_status?: ComplaintStatus;
  to_status?: ComplaintStatus;
  note?: string;
  performed_by?: User;
  created_at: string;
}

// Information request
export interface InformationRequest {
  id: string | number;
  complaint_id: string | number;
  question: string;
  status: 'pending' | 'answered' | 'closed';
  response?: string;
  requested_by?: User;
  answered_at?: string;
  created_at: string;
}
```

**Updated Complaint Interface:**
```typescript
export interface Complaint {
  id: string | number;
  reference_no?: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  department?: Department | null;
  category?: Category | null;
  priority?: Priority | null;
  citizen?: User | null;
  assigned_employee?: User | null;
  created_at: string;
  updated_at: string;
  // ADD THESE:
  attachments?: Attachment[];
  history?: ComplaintHistory[];
  information_requests?: InformationRequest[];
  [key: string]: unknown;
}
```

---

### 5. API Client Updates

**Add to `lib/api.ts`:**

```typescript
// ---------- Complaint Attachments ----------
export const adminAttachmentsApi = {
  list: (complaintId: string | number) =>
    request<{ attachments: Attachment[] }>(`/admin/complaints/${complaintId}/attachments`, {
      method: "GET",
    }),
  download: (attachmentId: string | number) =>
    request<Blob>(`/admin/attachments/${attachmentId}/download`, {
      method: "GET",
    }),
};

// ---------- Complaint History ----------
export const adminComplaintHistoryApi = {
  list: (complaintId: string | number) =>
    request<{ history: ComplaintHistory[] }>(`/admin/complaints/${complaintId}/history`, {
      method: "GET",
    }),
};

// ---------- Information Requests ----------
export const adminInformationRequestsApi = {
  list: (complaintId: string | number) =>
    request<{ requests: InformationRequest[] }>(`/admin/complaints/${complaintId}/information-requests`, {
      method: "GET",
    }),
  create: (complaintId: string | number, payload: { question: string }) =>
    request<{ request: InformationRequest }>(`/admin/complaints/${complaintId}/information-requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
```

---

## Implementation Priority

1. **High Priority:**
   - Attachments Display - Critical for reviewing citizen evidence
   - Complaint Timeline - Essential for audit trail and transparency

2. **Medium Priority:**
   - Request Additional Information - Improves communication with citizens

3. **Low Priority:**
   - Advanced filtering/search on history
   - Bulk download of attachments

---

## Backend Verification Needed

Before implementation, verify the following with the backend API:

1. **Attachments:**
   - Exact endpoint structure for listing attachments
   - Authentication requirements for downloading
   - Supported file types and size limits

2. **History/Timeline:**
   - Endpoint for fetching complaint history
   - Data structure of history entries
   - Available action types

3. **Information Requests:**
   - Endpoint structure for creating requests
   - How responses are tracked
   - Notification mechanism

---

## UI/UX Considerations

### Attachments Section
- Grid layout for multiple attachments
- File type icons
- Preview modal for images
- Download button with file size indicator

### Timeline Section
- Vertical timeline with connecting lines
- Color-coded action types
- Collapsible detailed view
- Filter by action type

### Information Requests Section
- Accordion-style list of requests
- Status badges (pending/answered/closed)
- Inline response display
- "Request More Info" button with modal form

---

## Testing Checklist

- [ ] Display attachments correctly
- [ ] Download attachments works
- [ ] Timeline shows all status changes
- [ ] Timeline displays correct user attribution
- [ ] Information request creation works
- [ ] Information request responses display correctly
- [ ] All features work in both Arabic and English
- [ ] Responsive design on mobile devices
