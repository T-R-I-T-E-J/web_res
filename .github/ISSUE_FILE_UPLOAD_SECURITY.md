# 🛡️ Critical Security: Insecure File Upload Validation - Magic Number Bypass

## Problem Description

### What is happening

The file upload validation system has a **critical security vulnerability** that allows attackers to upload malicious files (PHP scripts, JavaScript, executables) by simply renaming them with a `.pdf` extension. The validation only checks the browser-provided MIME type and file extension, **not the actual file content**, making it trivial to bypass.

### Where it is happening

- **Backend**: `apps/api/src/results/services/results.service.ts` - `validateFile()` method
- **Upload Endpoint**: `/api/v1/results/upload`
- **Storage**: `uploads/results/` directory
- **Impact**: Server filesystem and application security

### Why it is a problem

This is a **critical security vulnerability** that:

- ✗ Allows upload of malicious executable files (PHP, JS, EXE, etc.)
- ✗ Enables Remote Code Execution (RCE) if files are executed
- ✗ Bypasses all file type restrictions with simple file renaming
- ✗ Exposes server to malware, backdoors, and data theft
- ✗ Violates security best practices for file uploads
- ✗ Creates legal liability and compliance violations
- ✗ Puts entire infrastructure at risk

### Who is affected

- **Server Infrastructure**: At risk of compromise
- **All Users**: Data could be stolen or corrupted
- **Organization**: Reputation damage, legal liability
- **Compliance**: Violates security standards (OWASP, PCI-DSS, etc.)

---

## Root Cause Analysis

### The Vulnerability: Trusting Client-Provided Data

**Current (Insecure) Code**:

```typescript
// apps/api/src/results/services/results.service.ts

private validateFile(file: Express.Multer.File): void {
  // ❌ CRITICAL VULNERABILITY: Only checks browser-provided MIME type
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Only PDF files are allowed');
  }

  // ❌ CRITICAL VULNERABILITY: Only checks file extension
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  if (ext !== 'pdf') {
    throw new BadRequestException('Only PDF files are allowed');
  }

  // ❌ NO VALIDATION OF ACTUAL FILE CONTENT
  // Attacker can bypass both checks by:
  // 1. Renaming malicious.php to malicious.pdf
  // 2. Browser sends mimetype: application/pdf (based on extension)
  // 3. Both checks pass, malicious file is uploaded
}
```

### Attack Scenario

**Step 1: Create Malicious File**

```php
<?php
// malicious.php - Remote Code Execution backdoor
system($_GET['cmd']);
?>
```

**Step 2: Rename to Bypass Validation**

```bash
# Attacker renames the file
mv malicious.php malicious.pdf
```

**Step 3: Upload Through Admin Panel**

- File extension: `.pdf` ✅ (passes check)
- MIME type: `application/pdf` ✅ (browser guesses based on extension)
- Actual content: PHP code ❌ (never checked)

**Step 4: Execute Malicious Code**

```bash
# If server executes PHP files (Apache, Nginx with PHP-FPM)
curl http://localhost:8080/results/malicious.pdf?cmd=whoami
# Returns: www-data (server user)

curl http://localhost:8080/results/malicious.pdf?cmd=cat%20/etc/passwd
# Returns: entire password file

curl http://localhost:8080/results/malicious.pdf?cmd=rm%20-rf%20/
# Deletes entire server (if permissions allow)
```

**Impact**: Full server compromise, data theft, ransomware deployment.

---

## Technical Details: Magic Number Validation

### What Are Magic Numbers?

Magic numbers (file signatures) are **byte sequences at the beginning of files** that identify the file type, regardless of extension or MIME type.

**Examples**:

```
PDF:  %PDF-1.4 (hex: 25 50 44 46 2D 31 2E 34)
PNG:  \x89PNG (hex: 89 50 4E 47)
JPEG: \xFF\xD8\xFF (hex: FF D8 FF)
ZIP:  PK (hex: 50 4B)
EXE:  MZ (hex: 4D 5A)
PHP:  <?php (hex: 3C 3F 70 68 70)
```

### Why Magic Numbers Are Secure

| Validation Method | Can Be Faked?                        | Secure? |
| ----------------- | ------------------------------------ | ------- |
| File Extension    | ✅ Yes (rename file)                 | ❌ No   |
| MIME Type         | ✅ Yes (browser guesses)             | ❌ No   |
| Magic Number      | ❌ No (requires binary modification) | ✅ Yes  |

**Example**:

```typescript
// Read first 8 bytes of file
const buffer = await fs.readFile(filePath);
const header = buffer.slice(0, 8).toString("hex");

// PDF magic number: 25 50 44 46 (hex for "%PDF")
if (!header.startsWith("25504446")) {
  throw new Error("Not a valid PDF file");
}
```

---

## Steps to Reproduce

### Setup

1. Create a malicious file (e.g., `test.txt` with any content)
2. Rename to `test.pdf`
3. Log in as admin

### Exploitation

1. **Navigate to Results Management**
2. **Upload the renamed file**:

   - Select `test.pdf` (actually a text file)
   - Click upload
   - Observe: **Upload succeeds** ❌

3. **Verify the attack**:

   ```bash
   # Check uploaded file
   cat uploads/results/test.pdf
   # Shows: Text content, not PDF

   # Check file type
   file uploads/results/test.pdf
   # Shows: ASCII text, not PDF document
   ```

4. **Advanced attack** (if PHP is enabled):

   ```bash
   # Create PHP backdoor
   echo '<?php system($_GET["cmd"]); ?>' > backdoor.pdf

   # Upload through admin panel
   # Access: http://localhost:8080/results/backdoor.pdf?cmd=ls
   # Result: Directory listing (RCE achieved)
   ```

---

## Impact Assessment

### Security Impact

- **Severity**: Critical (CVSS 9.8 - Critical)
- **Attack Complexity**: Low (just rename a file)
- **Privileges Required**: Low (any user with upload permission)
- **User Interaction**: None
- **Scope**: Changed (affects entire server)
- **Confidentiality Impact**: High (data theft possible)
- **Integrity Impact**: High (file system modification)
- **Availability Impact**: High (server can be crashed/deleted)

### Real-World Consequences

- **Remote Code Execution (RCE)**: Full server control
- **Data Breach**: Access to database, environment variables, secrets
- **Malware Distribution**: Server becomes malware host
- **Ransomware**: Files can be encrypted and held for ransom
- **Botnet Recruitment**: Server joins DDoS network
- **Cryptocurrency Mining**: Server resources hijacked

### Compliance Impact

- **OWASP Top 10**: A03:2021 - Injection
- **PCI-DSS**: Requirement 6.5.1 (Input Validation)
- **GDPR**: Article 32 (Security of Processing)
- **ISO 27001**: A.14.2.1 (Secure Development)

---

## Scope & Constraints

### ✅ In Scope

- Implement magic number (file signature) validation
- Validate actual PDF file structure
- Add file size limits (if not present)
- Sanitize filenames (prevent path traversal)
- Add virus scanning (optional but recommended)
- Test with various file types (PDF, EXE, PHP, JS, etc.)
- Document secure file upload practices

### ❌ Out of Scope

- Implementing file encryption at rest (separate issue)
- Adding watermarks to PDFs (separate feature)
- Implementing file versioning (separate feature)
- Cloud storage migration (separate enhancement)

### 📋 Assumptions

- Only PDF files should be allowed
- Files are stored locally in `uploads/results/`
- Server may have PHP/scripting engines installed
- Users with upload permission are semi-trusted (but validation still required)

### 🔗 Dependencies

- Requires `file-type` or `mmmagic` npm package for magic number detection
- May require `clamscan` for virus scanning (optional)
- Requires sufficient permissions to read file headers

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Magic Number Validation**

  - [ ] File content validated using magic numbers
  - [ ] Only valid PDF files accepted (starts with `%PDF`)
  - [ ] Renamed malicious files rejected
  - [ ] Clear error message for invalid files

- [ ] **Additional Security Measures**

  - [ ] File size limit enforced (e.g., 50MB max)
  - [ ] Filename sanitized (no path traversal: `../`, `..\\`)
  - [ ] Filename sanitized (no special characters: `;`, `|`, `&`)
  - [ ] Random filename generated (prevent overwriting)

- [ ] **Testing**

  - [ ] Valid PDF uploads successfully
  - [ ] Renamed text file rejected
  - [ ] Renamed PHP file rejected
  - [ ] Renamed executable rejected
  - [ ] File with `.pdf` extension but wrong content rejected
  - [ ] Large files (>50MB) rejected
  - [ ] Malicious filenames rejected (`../../../etc/passwd.pdf`)

- [ ] **Error Handling**

  - [ ] Clear error messages for invalid files
  - [ ] Failed uploads logged with details
  - [ ] No sensitive information in error messages

- [ ] **Documentation**
  - [ ] Secure file upload practices documented
  - [ ] Allowed file types documented
  - [ ] File size limits documented
  - [ ] Security considerations documented

---

## Suggested Labels

- `security` - Security vulnerability
- `critical` - Highest severity
- `rce` - Remote Code Execution risk
- `file-upload` - File upload security
- `backend` - Backend validation fix
- `owasp` - OWASP Top 10 vulnerability
- `compliance` - Compliance requirement
- `high-priority` - Must fix before production

---

## Priority

**🔴 CRITICAL**

**Justification**:

- **Remote Code Execution (RCE)** vulnerability
- **Trivial to exploit** (just rename a file)
- **Full server compromise** possible
- **Data breach risk** (database, secrets, user data)
- **Cannot deploy to production** with this vulnerability
- **Legal and compliance** implications

---

## Environment

- **Branch**: All branches (affects core upload logic)
- **Environment**: All environments (local, staging, production)
- **Affected Code**: `apps/api/src/results/services/results.service.ts`
- **Upload Endpoint**: `/api/v1/results/upload`
- **Storage**: `uploads/results/`

---

## Recommended Fix (Implementation Guidance)

### Step 1: Install Required Packages

```bash
cd apps/api
npm install file-type
npm install -D @types/file-type
```

### Step 2: Implement Secure File Validation

**File**: `apps/api/src/results/services/results.service.ts`

```typescript
import { fileTypeFromBuffer } from "file-type";
import { promises as fs } from "fs";
import * as path from "path";
import * as crypto from "crypto";

export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_MIME_TYPES = ["application/pdf"];

  /**
   * ✅ SECURE FILE VALIDATION
   * Validates file using magic numbers (binary content)
   */
  private async validateFile(file: Express.Multer.File): Promise<void> {
    // 1. Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // 2. Sanitize filename (prevent path traversal)
    const sanitizedName = this.sanitizeFilename(file.originalname);
    if (sanitizedName !== file.originalname) {
      throw new BadRequestException("Invalid filename");
    }

    // 3. ✅ MAGIC NUMBER VALIDATION (Critical Security Check)
    const buffer = await fs.readFile(file.path);
    const fileType = await fileTypeFromBuffer(buffer);

    // Check if file type was detected
    if (!fileType) {
      throw new BadRequestException("Unable to determine file type");
    }

    // Check if it's actually a PDF
    if (fileType.mime !== "application/pdf") {
      this.logger.warn(
        `File upload rejected: Expected PDF, got ${fileType.mime}`,
        { filename: file.originalname, detectedType: fileType.mime }
      );
      throw new BadRequestException(
        `Invalid file type. Expected PDF, got ${fileType.ext.toUpperCase()}`
      );
    }

    // 4. Additional PDF structure validation (optional but recommended)
    const isPdfValid = await this.validatePdfStructure(buffer);
    if (!isPdfValid) {
      throw new BadRequestException("Invalid or corrupted PDF file");
    }

    this.logger.log(`File validation passed: ${file.originalname}`);
  }

  /**
   * Sanitize filename to prevent path traversal and command injection
   */
  private sanitizeFilename(filename: string): string {
    // Remove path traversal attempts
    let sanitized = filename.replace(/\.\./g, "");

    // Remove special characters that could be dangerous
    sanitized = sanitized.replace(/[;|&$`<>]/g, "");

    // Remove leading/trailing spaces and dots
    sanitized = sanitized.trim().replace(/^\.+/, "");

    // Ensure filename is not empty
    if (!sanitized) {
      throw new BadRequestException("Invalid filename");
    }

    return sanitized;
  }

  /**
   * Validate PDF structure (checks for PDF header and trailer)
   */
  private async validatePdfStructure(buffer: Buffer): Promise<boolean> {
    try {
      // Check PDF header (must start with %PDF)
      const header = buffer.slice(0, 5).toString("ascii");
      if (!header.startsWith("%PDF-")) {
        return false;
      }

      // Check for PDF trailer (should contain %%EOF)
      const content = buffer.toString("ascii");
      if (!content.includes("%%EOF")) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error("PDF structure validation failed", error);
      return false;
    }
  }

  /**
   * Generate secure random filename
   */
  private generateSecureFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const randomName = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    return `${timestamp}-${randomName}${ext}`;
  }

  /**
   * Upload result with secure validation
   */
  async uploadResult(
    file: Express.Multer.File,
    dto: CreateResultDto,
    userId: string
  ): Promise<Result> {
    // ✅ Validate file BEFORE processing
    await this.validateFile(file);

    // Generate secure filename (prevent overwriting)
    const secureFilename = this.generateSecureFilename(file.originalname);
    const filePath = path.join("uploads", "results", secureFilename);

    // Move file to secure location
    await this.storageService.saveFile(file.path, filePath);

    // Save to database
    const result = this.resultsRepository.create({
      ...dto,
      file_path: filePath,
      file_name: file.originalname,
      file_size: file.size,
      uploaded_by: userId,
    });

    await this.resultsRepository.save(result);

    this.logger.log(`Result uploaded: ${result.id} by user ${userId}`);
    return result;
  }
}
```

### Step 3: Add Virus Scanning (Optional but Recommended)

```bash
# Install ClamAV scanner
npm install clamscan
```

```typescript
import NodeClam from "clamscan";

export class ResultsService {
  private clamScan: NodeClam;

  async onModuleInit() {
    // Initialize ClamAV
    this.clamScan = await new NodeClam().init({
      clamdscan: {
        host: "localhost",
        port: 3310,
      },
    });
  }

  private async scanForViruses(filePath: string): Promise<void> {
    try {
      const { isInfected, viruses } = await this.clamScan.isInfected(filePath);

      if (isInfected) {
        this.logger.error(`Virus detected in file: ${viruses.join(", ")}`);

        // Delete infected file
        await fs.unlink(filePath);

        throw new BadRequestException("File contains malware and was rejected");
      }
    } catch (error) {
      this.logger.error("Virus scan failed", error);
      // Decide: Reject file or allow (risky)
      throw new InternalServerErrorException("Unable to scan file for viruses");
    }
  }
}
```

### Step 4: Update Multer Configuration

**File**: `apps/api/src/results/results.controller.ts`

```typescript
import { diskStorage } from "multer";
import * as crypto from "crypto";

@Controller("results")
export class ResultsController {
  @Post("upload")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/temp", // Temporary location
        filename: (req, file, cb) => {
          // Generate random filename for temp storage
          const randomName = crypto.randomBytes(16).toString("hex");
          cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 1, // Only one file at a time
      },
      fileFilter: (req, file, cb) => {
        // Basic extension check (will be validated further in service)
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".pdf") {
          return cb(new BadRequestException("Only PDF files allowed"), false);
        }
        cb(null, true);
      },
    })
  )
  async uploadResult(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateResultDto,
    @Request() req
  ) {
    return this.resultsService.uploadResult(file, dto, req.user.id);
  }
}
```

### Step 5: Add Security Headers

**File**: `apps/api/src/main.ts`

```typescript
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    })
  );

  // Disable X-Powered-By header
  app.getHttpAdapter().getInstance().disable("x-powered-by");

  await app.listen(8080);
}
```

---

## Testing Checklist

### Valid Files

- [ ] Upload valid PDF → Success
- [ ] Upload large valid PDF (40MB) → Success
- [ ] Upload PDF with complex structure → Success

### Invalid Files (Should Be Rejected)

- [ ] Upload renamed text file (`test.txt` → `test.pdf`) → Rejected
- [ ] Upload renamed PHP file (`backdoor.php` → `backdoor.pdf`) → Rejected
- [ ] Upload renamed executable (`virus.exe` → `virus.pdf`) → Rejected
- [ ] Upload renamed image (`photo.jpg` → `photo.pdf`) → Rejected
- [ ] Upload corrupted PDF → Rejected
- [ ] Upload file >50MB → Rejected

### Security Tests

- [ ] Filename with path traversal (`../../../etc/passwd.pdf`) → Rejected
- [ ] Filename with special chars (`test;rm -rf /.pdf`) → Rejected
- [ ] Malicious PDF with embedded JavaScript → Detected (if scanner enabled)
- [ ] ZIP file renamed to PDF → Rejected

---

## Related Issues

- **Static File 404** (ensure uploaded files are served securely)
- **Orphaned Files** (cleanup after validation failures)
- **Audit Logging** (log all upload attempts and rejections)

---

## Additional Resources

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [File Signatures (Magic Numbers)](https://en.wikipedia.org/wiki/List_of_file_signatures)
- [ClamAV Antivirus](https://www.clamav.net/)

---

**Issue Created**: 2025-12-29  
**Reported By**: Security Audit  
**Severity**: Critical - Remote Code Execution Risk  
**CVE**: (To be assigned if publicly disclosed)  
**Estimated Fix Time**: 3-4 hours  
**Testing Time**: 2 hours
