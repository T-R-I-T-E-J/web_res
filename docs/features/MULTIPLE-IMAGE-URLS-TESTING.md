# Multiple Image URLs - Verification Steps

## Quick Test Guide

### 1. Verify Database Schema

```powershell
docker exec -i psci_postgres psql -U admin -d psci_platform -c "\d news_articles" | Select-String -Pattern "image"
```

**Expected Output**:

```
featured_image_url | text                     |           |          |
image_urls         | jsonb                    |           |          | '[]'::jsonb
"idx_news_articles_image_urls" gin (image_urls)
```

### 2. Test Create Page (Admin)

1. **Navigate to**: http://localhost:3000/admin/news/create
2. **Login** if not already authenticated
3. **Verify**:
   - [ ] Single "Image URLs" input field appears
   - [ ] "Add Another Image URL" button is visible
4. **Test Add URLs**:
   - [ ] Click "Add Another Image URL"
   - [ ] New input field appears
   - [ ] Add 2-3 test URLs (e.g., https://picsum.photos/800/450?random=1)
5. **Test Remove URLs**:
   - [ ] Click X button on second URL
   - [ ] URL field is removed
   - [ ] Cannot remove last URL (X button disabled/hidden)
6. **Create Article**:
   - [ ] Fill in required fields (Title, Content)
   - [ ] Add 2-3 image URLs
   - [ ] Click "Create News"
   - [ ] Redirected to news list page

### 3. Test Edit Page (Admin)

1. **Navigate to**: http://localhost:3000/admin/news
2. **Click Edit** on the article you just created
3. **Verify**:
   - [ ] All image URLs loaded correctly
   - [ ] Can add more URLs
   - [ ] Can remove URLs
   - [ ] Can modify existing URLs
4. **Update Article**:
   - [ ] Make changes to URLs
   - [ ] Click "Update News"
   - [ ] Changes saved successfully

### 4. Test Display Page (Public)

1. **Navigate to**: http://localhost:3000/news
2. **Click** on the article you created
3. **Verify**:
   - [ ] All images display in order
   - [ ] Each image shows in full-width card
   - [ ] Images are stacked vertically
   - [ ] No layout issues

### 5. Test Backward Compatibility

1. **Find an old article** (created before this update)
2. **Navigate to** the article detail page
3. **Verify**:
   - [ ] Article displays correctly
   - [ ] Featured image shows (if it had one)
   - [ ] No errors in console
4. **Edit the old article**:
   - [ ] Navigate to edit page
   - [ ] Verify featured_image_url appears in image_urls array
   - [ ] Can add more URLs
   - [ ] Save changes successfully

### 6. Test API Directly (Optional)

**Create News with Multiple URLs**:

```bash
curl -X POST http://localhost:8080/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Multiple Images",
    "content": "Testing multiple image URLs feature",
    "category": "NEWS",
    "status": "published",
    "image_urls": [
      "https://picsum.photos/800/450?random=1",
      "https://picsum.photos/800/450?random=2",
      "https://picsum.photos/800/450?random=3"
    ]
  }'
```

**Verify Response**:

```json
{
  "data": {
    "id": 123,
    "title": "Test Multiple Images",
    "image_urls": [
      "https://picsum.photos/800/450?random=1",
      "https://picsum.photos/800/450?random=2",
      "https://picsum.photos/800/450?random=3"
    ],
    ...
  }
}
```

## Test Image URLs

Use these free placeholder image URLs for testing:

1. `https://picsum.photos/800/450?random=1`
2. `https://picsum.photos/800/450?random=2`
3. `https://picsum.photos/800/450?random=3`
4. `https://via.placeholder.com/800x450/0066cc/ffffff?text=Image+1`
5. `https://via.placeholder.com/800x450/00cc66/ffffff?text=Image+2`

## Common Issues & Solutions

### Issue: "Cannot add more than one URL"

**Solution**: Check browser console for JavaScript errors. Ensure `handleImageUrlChange`, `addImageUrl`, and `removeImageUrl` functions are defined.

### Issue: "Images not displaying on public page"

**Solution**:

1. Check if `image_urls` field exists in API response
2. Verify image URLs are accessible (not blocked by CORS)
3. Check browser console for image loading errors

### Issue: "Database error when creating news"

**Solution**:

1. Verify migration ran successfully
2. Check if `image_urls` column exists in database
3. Ensure backend entity and DTO are updated

### Issue: "Old articles not displaying"

**Solution**:

1. Check if `featured_image_url` fallback is working
2. Verify backward compatibility logic in display page
3. Check if old articles have `image_urls` as empty array

## Success Criteria

✅ **All tests pass**:

- [ ] Can add multiple URLs in create page
- [ ] Can edit multiple URLs in edit page
- [ ] All images display on public page
- [ ] Old articles still work (backward compatibility)
- [ ] No console errors
- [ ] No database errors
- [ ] UI is responsive and user-friendly

## Rollback Plan (If Needed)

If issues arise, you can rollback the database changes:

```sql
-- Remove the new column
ALTER TABLE public.news_articles DROP COLUMN IF EXISTS image_urls;

-- Remove the index
DROP INDEX IF EXISTS idx_news_articles_image_urls;
```

Then revert the code changes using git:

```bash
git checkout HEAD -- apps/api/src/news/entities/news.entity.ts
git checkout HEAD -- apps/api/src/news/dto/create-news.dto.ts
git checkout HEAD -- apps/web/src/app/(dashboard)/admin/news/create/page.tsx
git checkout HEAD -- apps/web/src/app/(dashboard)/admin/news/[id]/page.tsx
git checkout HEAD -- apps/web/src/app/(public)/news/[slug]/page.tsx
```
