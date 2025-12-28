# 🔍 Security Log Monitoring - Live Demo Guide

## 📊 **How to Monitor Your Database for Attacks**

**Date:** 2025-12-29  
**Purpose:** Real-time security monitoring demonstration

---

## 🚀 **Quick Start - 3 Ways to Monitor**

### **Method 1: Automated Monitoring (Recommended)** ⭐

```powershell
.\monitor-security-logs.ps1
```

**What it does:**

- ✅ Checks recent logs for threats
- ✅ Shows summary of security events
- ✅ Monitors in real-time
- ✅ Color-coded alerts (Red = Critical, Yellow = Warning, Green = OK)
- ✅ Runs continuously until you stop it (Ctrl+C)

**Example Output:**

```
========================================
Database Security Log Monitor
========================================

Monitoring database: psci_postgres

[Checking recent logs...]

Recent Activity Summary:
  Security Alerts: 0     ✅
  Warnings: 0            ✅
  Normal Connections: 5  ✅

No security threats detected!

========================================
Continuous Monitoring (Press Ctrl+C to stop)
========================================

[INFO] Authorized connection ✅
[INFO] Authorized connection ✅
```

---

### **Method 2: Manual Log Check**

```powershell
# View last 50 log entries
docker logs psci_postgres --tail 50

# View last 100 entries
docker logs psci_postgres --tail 100

# View all logs
docker logs psci_postgres
```

---

### **Method 3: Real-Time Following**

```powershell
# Follow logs in real-time (like tail -f)
docker logs -f psci_postgres
```

Press `Ctrl+C` to stop.

---

## 🎯 **Step-by-Step Monitoring Demo**

### **Step 1: Check Database is Running**

```powershell
docker ps --filter "name=psci_postgres"
```

**Expected Output:**

```
NAMES           STATUS                    PORTS
psci_postgres   Up (healthy)              5432/tcp
```

✅ If you see this, database is running!

---

### **Step 2: View Recent Logs**

```powershell
docker logs psci_postgres --tail 20
```

**What you'll see:**

```
2025-12-29 00:30:00 UTC [1] LOG:  database system is ready to accept connections
2025-12-29 00:30:05 UTC [45] LOG:  connection authorized: user=admin database=psci_platform
2025-12-29 00:30:10 UTC [46] LOG:  connection authorized: user=admin database=psci_platform
```

✅ These are **NORMAL** connections (your application)

---

### **Step 3: Search for Failed Login Attempts**

```powershell
docker logs psci_postgres | Select-String "FATAL.*authentication"
```

**If NO attacks:**

```
(No output - good!)
```

**If UNDER ATTACK:**

```
2025-12-29 00:25:00 UTC [123] FATAL:  password authentication failed for user "admin"
2025-12-29 00:25:05 UTC [124] FATAL:  password authentication failed for user "admin"
2025-12-29 00:25:10 UTC [125] FATAL:  password authentication failed for user "admin"
```

🚨 **This means someone is trying to brute force your password!**

---

### **Step 4: Search for Unknown IP Connections**

```powershell
docker logs psci_postgres | Select-String "connection received"
```

**What you'll see:**

```
connection received: host=172.25.0.3 port=54321  ✅ GOOD (Docker network)
connection received: host=127.0.0.1 port=54322   ✅ GOOD (localhost)
```

**If you see:**

```
connection received: host=203.0.113.45 port=12345  🚨 BAD (unknown IP)
FATAL: no pg_hba.conf entry for host "203.0.113.45"
```

⚠️ **Someone from outside is trying to connect!**

---

### **Step 5: Count Failed Attempts**

```powershell
(docker logs psci_postgres | Select-String "FATAL.*authentication").Count
```

**Results:**

- `0` = ✅ No attacks
- `1-5` = ⚠️ Some failed attempts (might be legitimate mistakes)
- `10+` = 🚨 Likely under attack!

---

### **Step 6: Check for Errors**

```powershell
docker logs psci_postgres | Select-String "ERROR|PANIC"
```

**Normal (no output):**

```
(No errors - good!)
```

**If you see errors:**

```
ERROR: syntax error at or near "DROP"  🚨 Possible SQL injection!
ERROR: permission denied for table users  ⚠️ Unauthorized access attempt
```

---

### **Step 7: View Logs from Last Hour**

```powershell
docker logs psci_postgres --since 1h
```

**Shows only logs from the last hour.**

Other time options:

- `--since 30m` (last 30 minutes)
- `--since 24h` (last 24 hours)
- `--since 2025-12-29` (since specific date)

---

### **Step 8: Save Logs to File**

```powershell
docker logs psci_postgres > database-logs.txt
notepad database-logs.txt
```

**Useful for:**

- Detailed analysis
- Sharing with team
- Audit trail
- Incident investigation

---

## 🎨 **Understanding Log Colors (Automated Monitor)**

When you run `.\monitor-security-logs.ps1`:

| Color         | Meaning         | Example                         |
| ------------- | --------------- | ------------------------------- |
| 🟢 **Green**  | Normal activity | `[INFO] Authorized connection`  |
| 🟡 **Yellow** | Warning         | `[WARNING] Long-running query`  |
| 🔴 **Red**    | Critical alert  | `[ALERT] Failed login attempt!` |
| ⚪ **Gray**   | Informational   | Timestamps, details             |

---

## 🚨 **What Different Alerts Mean**

### **🔴 [SECURITY ALERT] Failed login attempt detected!**

**Meaning:** Someone tried to login with wrong password  
**Action:**

1. Check the IP address in the log
2. If unknown IP, it's a hacker
3. IP will be auto-blocked after 5 attempts
4. Monitor for more attempts

**Example:**

```
[SECURITY ALERT] Failed login attempt detected!
  FATAL: password authentication failed for user "admin" from 203.0.113.45
```

---

### **🟡 [WARNING] Connection from unknown IP!**

**Meaning:** Someone from outside Docker network tried to connect  
**Action:**

1. Check if it's your production server
2. If unknown, it's suspicious
3. Connection will be rejected by pg_hba.conf
4. Monitor for repeated attempts

**Example:**

```
[WARNING] Connection from unknown IP!
  connection received: host=203.0.113.45 port=12345
  FATAL: no pg_hba.conf entry for host "203.0.113.45"
```

---

### **🔴 [SECURITY ALERT] Possible DoS attack!**

**Meaning:** Too many connections at once  
**Action:**

1. Check connection count
2. Kill idle connections
3. IP will be auto-blocked
4. Restart database if needed

**Example:**

```
[SECURITY ALERT] Possible DoS attack - too many connections!
  FATAL: sorry, too many clients already
```

---

### **🟡 [WARNING] Long-running query detected**

**Meaning:** Query taking more than expected time  
**Action:**

1. Check if it's a legitimate query
2. If suspicious, kill the query
3. Review for SQL injection patterns
4. Optimize if legitimate

**Example:**

```
[WARNING] Long-running query detected (potential attack)
  duration: 35000.123 ms  statement: SELECT * FROM users WHERE...
```

---

### **🟢 [INFO] Authorized connection**

**Meaning:** Normal, legitimate connection  
**Action:** None - this is good!

**Example:**

```
[INFO] Authorized connection
  connection authorized: user=admin database=psci_platform
```

---

## 📊 **Live Monitoring Demo**

Let me show you a **live monitoring session**:

### **Start Monitoring:**

```powershell
.\monitor-security-logs.ps1
```

### **What You'll See:**

```
========================================
Database Security Log Monitor
========================================

Monitoring database: psci_postgres
Press Ctrl+C to stop monitoring

[Checking recent logs...]

Recent Activity Summary:
  Security Alerts: 0     ✅
  Warnings: 0            ✅
  Normal Connections: 5  ✅

No security threats detected!

========================================
Continuous Monitoring (Press Ctrl+C to stop)
========================================

Monitoring for security events...

[INFO] Authorized connection ✅
  connection authorized: user=admin database=psci_platform

[INFO] Authorized connection ✅
  connection authorized: user=admin database=psci_platform

# If an attack happens, you'll see:

[SECURITY ALERT] Failed login attempt detected! 🚨
  FATAL: password authentication failed for user "admin"
  IP: 203.0.113.45

[WARNING] Connection from unknown IP! ⚠️
  connection received: host=203.0.113.45
  FATAL: no pg_hba.conf entry for host "203.0.113.45"
```

---

## 🎯 **Monitoring Schedule**

### **Daily (5 minutes):**

```powershell
# Quick check for failed logins
docker logs psci_postgres --since 24h | Select-String "FATAL.*authentication"

# Quick check for errors
docker logs psci_postgres --since 24h | Select-String "ERROR"
```

### **Weekly (15 minutes):**

```powershell
# Full log review
docker logs psci_postgres > weekly-review.txt
notepad weekly-review.txt

# Run automated monitor for 10 minutes
.\monitor-security-logs.ps1
```

### **Monthly (30 minutes):**

```powershell
# Comprehensive security test
.\quick-security-test.ps1

# Review all blocked IPs (when implemented)
# Check for patterns or trends
# Update security rules if needed
```

---

## 🛠️ **Advanced Monitoring Commands**

### **1. Search for Specific User:**

```powershell
docker logs psci_postgres | Select-String "user=admin"
```

### **2. Search for Specific Database:**

```powershell
docker logs psci_postgres | Select-String "database=psci_platform"
```

### **3. Search for Specific IP:**

```powershell
docker logs psci_postgres | Select-String "203.0.113.45"
```

### **4. Count Connections:**

```powershell
(docker logs psci_postgres | Select-String "connection authorized").Count
```

### **5. Find All Errors:**

```powershell
docker logs psci_postgres | Select-String "ERROR|FATAL|PANIC" | Select-Object -First 20
```

### **6. Export Logs with Timestamp:**

```powershell
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
docker logs psci_postgres > "logs_$timestamp.txt"
```

---

## 📱 **Quick Reference Card**

| Task                      | Command                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| **Automated monitoring**  | `.\monitor-security-logs.ps1`                                      |
| **View recent logs**      | `docker logs psci_postgres --tail 50`                              |
| **Follow in real-time**   | `docker logs -f psci_postgres`                                     |
| **Find failed logins**    | `docker logs psci_postgres \| Select-String "FATAL.*auth"`         |
| **Find errors**           | `docker logs psci_postgres \| Select-String "ERROR"`               |
| **Last hour logs**        | `docker logs psci_postgres --since 1h`                             |
| **Save to file**          | `docker logs psci_postgres > logs.txt`                             |
| **Count failed attempts** | `(docker logs psci_postgres \| Select-String "FATAL.*auth").Count` |

---

## ✅ **Monitoring Checklist**

### **Daily:**

- [ ] Run `.\monitor-security-logs.ps1` for 5 minutes
- [ ] Check for failed login attempts
- [ ] Check for errors
- [ ] Verify normal connection count

### **Weekly:**

- [ ] Full log review
- [ ] Save logs to file
- [ ] Check for patterns
- [ ] Update security rules if needed

### **Monthly:**

- [ ] Run comprehensive security test
- [ ] Review all security metrics
- [ ] Update documentation
- [ ] Test incident response

---

## 🎯 **Summary**

**Monitoring Tools:**

- ✅ `monitor-security-logs.ps1` - Automated monitoring
- ✅ `docker logs` - Manual log viewing
- ✅ PowerShell commands - Advanced searching

**What to Monitor:**

- 🚨 Failed login attempts (brute force)
- ⚠️ Unknown IP connections
- 🚨 Too many connections (DoS)
- ⚠️ Long-running queries
- ⚠️ Database errors
- ✅ Normal connections

**How Often:**

- **Real-time:** Use automated monitor
- **Daily:** 5-minute quick check
- **Weekly:** 15-minute full review
- **Monthly:** 30-minute comprehensive test

---

**🔍 You can now monitor your database 24/7! 🛡️**

**Start monitoring now:**

```powershell
.\monitor-security-logs.ps1
```

**Press Ctrl+C to stop when done.**

---

**Last Updated:** 2025-12-29 00:30  
**Status:** ✅ **MONITORING READY**  
**Protection:** ⭐⭐⭐⭐⭐ MAXIMUM
