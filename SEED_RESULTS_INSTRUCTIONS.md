# How to Seed Results Data

## Step 1: Open Neon Console

1. Go to: https://console.neon.tech
2. Navigate to your project: `gentle-lake-77593039`
3. Click on "SQL Editor" in the left sidebar

## Step 2: Execute the SQL Script

1. Open the file: `seed-sample-results.sql`
2. Copy all the SQL content
3. Paste it into the Neon SQL Editor
4. Click "Run" to execute

## Step 3: Verify Results

After running the script, you should see:

- **1 DELETE** statement (removes old sample data)
- **10 INSERT** statements (adds 10 sample results)
- **1 SELECT** statement showing all inserted results

## Expected Results

The script will add 10 sample results:

### 2026 (3 results)

- National Para Shooting Championship 2026 - 10m Air Rifle
- National Para Shooting Championship 2026 - 10m Air Pistol
- National Para Shooting Championship 2026 - 50m Rifle 3 Positions

### 2025 (4 results)

- Asian Para Shooting Championship 2025
- World Para Shooting Championship 2025
- Selection Trials 2025 - 10m Air Rifle
- Selection Trials 2025 - 10m Air Pistol

### 2024 (3 results)

- National Para Shooting Championship 2024
- WSPS Grand Prix France 2024
- Asian Para Games 2024

## Step 4: Verify on Website

After seeding, visit: https://web-res-api.vercel.app/results

You should see all 10 results displayed on the page!

---

**Note**: The file URLs in the sample data are placeholder URLs. You can update them later with actual PDF files when available.
