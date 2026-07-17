# Security Specification for Zealguy Venture Firebase Integration

This specification outlines the data invariants, 12 adversarial test payloads designed to attack database safety, and rules structure.

## 1. Data Invariants

1. **Contact Submissions**:
   - Anyone can write a submission to request a discovery call.
   - General public CANNOT read, update, or delete submissions (protects PII).
   - Email must be a valid length string (3 to 100 characters).
   - Name must be a valid non-empty string up to 100 characters.
   - Message must not exceed 1000 characters.

2. **Chats / Developer Feed**:
   - Users can read and write messages.
   - `sender` must strictly be either `'client'` or `'ai'`.
   - Message text must be a valid string of length 1 to 500.
   - Immutability of messages: Once written, messages cannot be updated or deleted.

3. **Platform Sales Logs**:
   - Users can read and write sales.
   - `customer` must be a valid string of length 1 to 100.
   - `amount` must be a positive number.
   - `type` must be a valid string up to 100.
   - Sales cannot be deleted by general users.

---

## 2. The "Dirty Dozen" Payloads

Here are 12 malicious payloads designed to bypass identity, integrity, and volumetric rules:

### A. Contact Submissions (PII & Injection Attacks)
1. **PII Reader Attack**: Trying to query or read other users' contact submissions.
2. **Volumetric Flood Message**: Submitting a contact message with a 1MB string size.
3. **Empty Email Attack**: Submitting a contact request with an empty email address.
4. **ID Poisoning (Long ID)**: Submitting a contact request with a huge junk document ID (e.g., 500 characters) containing emoji or special symbols.

### B. Chat Messages (Spoofing & Immutability Attacks)
5. **Sender Spoofing**: Attempting to insert a message with a spoofed/non-enum sender (e.g. `sender: "administrator"` or `sender: "moderator"`).
6. **Chat Update Attack**: Attempting to edit or update an existing chat message.
7. **Empty Chat Message**: Attempting to post a chat message with an empty or non-string `text` field.
8. **Chat Deletion Attack**: Attempting to delete developer/client feed messages.

### C. Sales Logs (Resource Poisoning & Privilege Escalation)
9. **Negative Transaction**: Attempting to insert a sales log with negative amount (e.g. `amount: -50000`).
10. **Transaction Type Poisoning**: Inserting a sales log with non-string custom payload or extremely long title (e.g., SQL/JS injection string).
11. **Sale Update Attack**: Client trying to overwrite existing transaction records to change amounts.
12. **Sale Deletion Attack**: Unauthorized deletion of sales log documents.

---

## 3. Test Cases Configuration

The Firestore rules will be configured to block each of these malicious payloads explicitly by validating types, sizes, regex, and actions.
