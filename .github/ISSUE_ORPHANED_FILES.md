# 🗑️ Critical Bug: Orphaned Files - Storage Leak from Commented Delete Code

## Problem Description

### What is happening

When administrators delete competition result records from the database, the physical PDF files remain on the server's disk indefinitely. The code responsible for deleting the actual file is **commented out**, causing a **storage leak** that will eventually fill up the server's disk space.

### Where it is happening

- **Backend**: `apps/api/src/results/services/results.service.ts` - `deleteResult()` method
- **Storage**: `uploads/results/` directory
- **Database**: `results` table (soft-delete works correctly)
- **Impact**: Server filesystem

### Why it is a problem

This is a **critical operational and cost issue** that:

- ✗ Causes unlimited disk space growth over time
- ✗ Will eventually fill up server storage (disk full errors)
- ✗ Increases hosting costs (paying for unused files)
- ✗ Creates data management and compliance issues
- ✗ Makes it difficult to track actual vs. deleted files
- ✗ May crash the application when disk is full
- ✗ Violates data retention policies (files never truly deleted)

### Who is affected

- **System Administrators**: Must manually clean up orphaned files
- **DevOps/Infrastructure**: Disk space monitoring and management
- **Organization**: Increased storage costs
- **Compliance**: Deleted data is not actually deleted
- **Users**: Application may crash when disk is full

---

## Root Cause Analysis

### The Issue: Commented File Deletion Code

**Current (Broken) Code**:

```typescript
// apps/api/src/results/services/results.service.ts

async deleteResult(id: string, userId: string): Promise<void> {
  const result = await this.resultsRepository.findOne({ where: { id } });

  if (!result) {
    throw new NotFoundException('Result not found');
  }

  // Soft delete in database
  result.deleted_at = new Date();
  result.deleted_by = userId;
  await this.resultsRepository.save(result);

  // ❌ CRITICAL BUG: File deletion is commented out
  // await this.storageService.deleteFile(result.file_path);

  // Result: Database record is soft-deleted, but file remains on disk forever
}
```

**What Should Happen**:

```typescript
async deleteResult(id: string, userId: string): Promise<void> {
  const result = await this.resultsRepository.findOne({ where: { id } });

  if (!result) {
    throw new NotFoundException('Result not found');
  }

  // ✅ Delete physical file FIRST (before database update)
  try {
    await this.storageService.deleteFile(result.file_path);
  } catch (error) {
    this.logger.error(`Failed to delete file: ${result.file_path}`, error);
    // Decide: Should we still soft-delete the record?
    // Option 1: Throw error and abort (file and record stay)
    // Option 2: Continue with soft-delete (file orphaned but flagged)
  }

  // Soft delete in database
  result.deleted_at = new Date();
  result.deleted_by = userId;
  await this.resultsRepository.save(result);
}
```

### Storage Leak Scenario

**Timeline**:

1. **Day 1**: Admin uploads 100 PDFs (average 5MB each) = 500MB
2. **Day 2**: Admin deletes 20 PDFs → Database records soft-deleted ✅, Files remain on disk ❌
3. **Day 3**: Admin uploads 50 more PDFs = 250MB
4. **Day 4**: Admin deletes 30 PDFs → Files remain on disk ❌
5. **After 1 month**: 500+ orphaned files, 2.5GB wasted storage
6. **After 6 months**: 3,000+ orphaned files, 15GB wasted storage
7. **After 1 year**: Disk full → Application crashes ❌

**Impact**:

- Database shows 100 active results
- Filesystem has 3,000+ files (30x more than expected)
- Storage costs increase unnecessarily
- Cleanup requires manual intervention

---

## Steps to Reproduce

### Setup

1. Start the application
2. Log in as admin
3. Upload a test PDF file

### Reproduction

1. **Upload a PDF**:

   - Navigate to Results Management
   - Upload `test-result.pdf`
   - Note the file path (e.g., `uploads/results/1234-test-result.pdf`)

2. **Verify file exists**:

   ```bash
   ls uploads/results/
   # Shows: 1234-test-result.pdf
   ```

3. **Delete the result**:

   - Click delete button in admin panel
   - Confirm deletion
   - Observe success message

4. **Check database**:

   ```sql
   SELECT id, title, deleted_at FROM results WHERE id = '1234';
   -- Shows: deleted_at is NOT NULL (soft-deleted) ✅
   ```

5. **Check filesystem**:

   ```bash
   ls uploads/results/
   # Shows: 1234-test-result.pdf STILL EXISTS ❌
   ```

6. **Repeat 10 times**:
   - Upload and delete 10 files
   - Observe all 10 files remain on disk
   - Database shows 0 active results
   - Filesystem has 10 orphaned files

---

## Impact Assessment

### Operational Impact

- **Severity**: Critical (will cause system failure)
- **Timeline**: Gradual degradation over weeks/months
- **Disk Full Consequences**:
  - Application crashes (cannot write logs, temp files)
  - Database corruption (cannot write to disk)
  - Upload failures (no space for new files)
  - System instability

### Cost Impact

- **Storage Costs**: Linear growth with each deletion
- **Example**: 1,000 deletions/month × 5MB = 5GB/month wasted
- **Annual Cost**: 60GB wasted storage (varies by hosting provider)

### Compliance Impact

- **Data Retention**: Files are never truly deleted
- **GDPR/Privacy**: User data may remain after deletion request
- **Audit Trail**: Mismatch between database and filesystem

### Maintenance Impact

- **Manual Cleanup**: Requires DevOps intervention
- **Downtime**: Cleanup may require stopping the application
- **Risk**: Accidentally deleting active files during cleanup

---

## Scope & Constraints

### ✅ In Scope

- Uncomment file deletion code in `deleteResult()` method
- Add error handling for file deletion failures
- Add logging for successful/failed deletions
- Test file deletion works correctly
- Create cleanup script for existing orphaned files
- Document file deletion behavior

### ❌ Out of Scope

- Implementing hard delete (permanent database deletion)
- Migrating to cloud storage (S3, GCS, etc.)
- Implementing file versioning
- Automatic orphaned file detection (future enhancement)
- Scheduled cleanup jobs (future enhancement)

### 📋 Assumptions

- Soft delete is the desired behavior for database records
- Files should be deleted when records are soft-deleted
- `storageService.deleteFile()` method exists and works
- Files are stored locally in `uploads/results/`
- No file recovery mechanism is needed (files are permanently deleted)

### 🔗 Dependencies

- `storageService.deleteFile()` must be implemented
- File paths in database must be accurate
- Sufficient permissions to delete files from filesystem

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Code Fix**

  - [ ] File deletion code uncommented in `deleteResult()`
  - [ ] Error handling added for file deletion failures
  - [ ] Logging added for deletion attempts (success and failure)
  - [ ] Transaction handling ensures consistency

- [ ] **Functionality**

  - [ ] Deleting a result removes the physical file
  - [ ] Database record is soft-deleted
  - [ ] No orphaned files after deletion
  - [ ] Error handling prevents partial deletions

- [ ] **Error Handling**

  - [ ] If file deletion fails, appropriate error is logged
  - [ ] Decision made: abort or continue with soft-delete
  - [ ] User receives clear error message if deletion fails
  - [ ] Failed deletions are tracked for manual cleanup

- [ ] **Cleanup Script**

  - [ ] Script created to identify orphaned files
  - [ ] Script can safely delete orphaned files
  - [ ] Script has dry-run mode (preview without deleting)
  - [ ] Script logs all actions

- [ ] **Testing**

  - [ ] Upload and delete a file → File is removed from disk
  - [ ] Delete non-existent file → Handled gracefully
  - [ ] Delete file with invalid path → Handled gracefully
  - [ ] Concurrent deletions work correctly
  - [ ] Cleanup script identifies existing orphaned files

- [ ] **Documentation**
  - [ ] File deletion behavior documented
  - [ ] Cleanup script usage documented
  - [ ] Error handling strategy documented
  - [ ] Data retention policy documented

---

## Suggested Labels

- `bug` - Defect in functionality
- `critical` - Will cause system failure
- `backend` - Backend code fix
- `storage` - File storage issue
- `data-integrity` - Data consistency issue
- `operations` - Operational impact
- `high-priority` - Must fix before production
- `cost-impact` - Affects hosting costs

---

## Priority

**🔴 CRITICAL**

**Justification**:

- **System Failure**: Will eventually fill disk and crash application
- **Cost Impact**: Unnecessary storage costs
- **Data Integrity**: Mismatch between database and filesystem
- **Compliance**: Deleted data is not actually deleted
- **Timeline**: Gradual but inevitable failure

---

## Environment

- **Branch**: All branches (affects core deletion logic)
- **Environment**: All environments (local, staging, production)
- **Affected Code**: `apps/api/src/results/services/results.service.ts`
- **Storage**: Local filesystem (`uploads/results/`)
- **Impact**: Server disk space

---

## Recommended Fix (Implementation Guidance)

### Step 1: Uncomment and Improve File Deletion

**File**: `apps/api/src/results/services/results.service.ts`

```typescript
import { Logger } from "@nestjs/common";

export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  async deleteResult(id: string, userId: string): Promise<void> {
    const result = await this.resultsRepository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException("Result not found");
    }

    // ✅ Delete physical file FIRST
    try {
      await this.storageService.deleteFile(result.file_path);
      this.logger.log(`File deleted successfully: ${result.file_path}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete file: ${result.file_path}`,
        error.stack
      );

      // Decision: Should we still soft-delete the record?
      // Option 1: Abort deletion (recommended for consistency)
      throw new InternalServerErrorException(
        "Failed to delete file. Please try again or contact support."
      );

      // Option 2: Continue with soft-delete (file orphaned but flagged)
      // result.file_deletion_failed = true;
      // this.logger.warn(`Soft-deleting record despite file deletion failure: ${id}`);
    }

    // Soft delete in database (only if file deletion succeeded)
    result.deleted_at = new Date();
    result.deleted_by = userId;
    await this.resultsRepository.save(result);

    this.logger.log(`Result soft-deleted: ${id} by user ${userId}`);
  }
}
```

### Step 2: Verify StorageService.deleteFile() Implementation

**File**: `apps/api/src/results/services/storage.service.ts`

```typescript
import { promises as fs } from "fs";
import { Injectable, Logger } from "@nestjs/common";
import * as path from "path";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async deleteFile(filePath: string): Promise<void> {
    try {
      // Resolve absolute path
      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

      // Check if file exists
      await fs.access(absolutePath);

      // Delete file
      await fs.unlink(absolutePath);

      this.logger.log(`File deleted: ${absolutePath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist (already deleted or never existed)
        this.logger.warn(`File not found (already deleted?): ${filePath}`);
        // Don't throw error - file is already gone
        return;
      }

      // Other errors (permissions, etc.)
      this.logger.error(`Failed to delete file: ${filePath}`, error.stack);
      throw error;
    }
  }
}
```

### Step 3: Add Database Column for Tracking (Optional)

If you want to track failed deletions:

```sql
-- Add column to track file deletion failures
ALTER TABLE results ADD COLUMN file_deletion_failed BOOLEAN DEFAULT FALSE;
ALTER TABLE results ADD COLUMN file_deletion_error TEXT;
```

### Step 4: Create Cleanup Script for Orphaned Files

**File**: `scripts/cleanup-orphaned-files.ts`

```typescript
import { promises as fs } from "fs";
import * as path from "path";
import { DataSource } from "typeorm";

async function findOrphanedFiles(dryRun = true) {
  // Connect to database
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await dataSource.initialize();

  // Get all file paths from database (including soft-deleted)
  const results = await dataSource.query("SELECT file_path FROM results");
  const dbFilePaths = new Set(results.map((r) => path.basename(r.file_path)));

  // Get all files from filesystem
  const uploadsDir = path.join(process.cwd(), "uploads", "results");
  const filesOnDisk = await fs.readdir(uploadsDir);

  // Find orphaned files (on disk but not in database)
  const orphanedFiles = filesOnDisk.filter(
    (file) => !dbFilePaths.has(file) && file !== ".gitkeep"
  );

  console.log(`\n📊 Orphaned Files Report:`);
  console.log(`Total files on disk: ${filesOnDisk.length}`);
  console.log(`Total files in database: ${dbFilePaths.size}`);
  console.log(`Orphaned files: ${orphanedFiles.length}\n`);

  if (orphanedFiles.length === 0) {
    console.log("✅ No orphaned files found!");
    await dataSource.destroy();
    return;
  }

  // Calculate total size
  let totalSize = 0;
  for (const file of orphanedFiles) {
    const filePath = path.join(uploadsDir, file);
    const stats = await fs.stat(filePath);
    totalSize += stats.size;
    console.log(`  - ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }

  console.log(
    `\nTotal wasted storage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
  );

  if (dryRun) {
    console.log("\n⚠️  DRY RUN MODE - No files were deleted");
    console.log("Run with --delete flag to actually delete files");
  } else {
    console.log("\n🗑️  Deleting orphaned files...");
    for (const file of orphanedFiles) {
      const filePath = path.join(uploadsDir, file);
      await fs.unlink(filePath);
      console.log(`  ✓ Deleted: ${file}`);
    }
    console.log("\n✅ Cleanup complete!");
  }

  await dataSource.destroy();
}

// Run script
const dryRun = !process.argv.includes("--delete");
findOrphanedFiles(dryRun).catch(console.error);
```

**Usage**:

```bash
# Dry run (preview only)
npx ts-node scripts/cleanup-orphaned-files.ts

# Actually delete orphaned files
npx ts-node scripts/cleanup-orphaned-files.ts --delete
```

### Step 5: Add Monitoring (Optional)

**File**: `apps/api/src/results/services/results.service.ts`

```typescript
// Add metrics for monitoring
async getStorageMetrics() {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'results');
  const files = await fs.readdir(uploadsDir);

  let totalSize = 0;
  for (const file of files) {
    const stats = await fs.stat(path.join(uploadsDir, file));
    totalSize += stats.size;
  }

  const activeResults = await this.resultsRepository.count({
    where: { deleted_at: null }
  });

  return {
    total_files: files.length,
    active_results: activeResults,
    potential_orphans: files.length - activeResults,
    total_size_mb: (totalSize / 1024 / 1024).toFixed(2),
  };
}
```

---

## Testing Checklist

- [ ] Upload a file and delete it → File removed from disk
- [ ] Check database → Record soft-deleted
- [ ] Check filesystem → File no longer exists
- [ ] Delete non-existent file → Handled gracefully
- [ ] Simulate file deletion failure → Error logged, record not deleted
- [ ] Run cleanup script (dry run) → Identifies orphaned files
- [ ] Run cleanup script (delete) → Removes orphaned files
- [ ] Verify no active files are deleted by cleanup script
- [ ] Test with multiple concurrent deletions
- [ ] Monitor disk space usage over time

---

## Rollback Plan

If issues arise after fix:

1. **Immediate**: Comment out file deletion code again (revert to current state)
2. **Investigate**: Check logs for file deletion errors
3. **Fix**: Address specific file deletion issues
4. **Redeploy**: Uncomment code after fixing issues

---

## Related Issues

- **Static File 404** (file serving configuration)
- **Storage Service Path Resolution** (unreliable upload paths)
- **Audit Logging** (track deletion events)

---

## Additional Context

### Why Was This Commented Out?

Possible reasons (speculation):

- Testing/debugging (forgot to uncomment)
- File deletion was causing errors (needs error handling)
- Uncertainty about soft vs. hard delete behavior
- Concern about accidentally deleting wrong files

### Best Practices for File Deletion

1. **Delete file BEFORE database update** (prevents orphans if DB update fails)
2. **Use transactions** (rollback DB if file deletion fails)
3. **Log all deletions** (audit trail)
4. **Handle errors gracefully** (don't leave partial state)
5. **Regular cleanup** (scheduled job to find orphans)

---

**Issue Created**: 2025-12-29  
**Reported By**: Code Review / Operations Team  
**Severity**: Critical - Will cause system failure  
**Estimated Fix Time**: 2 hours  
**Testing Time**: 1 hour  
**Cleanup Script Time**: 1 hour
