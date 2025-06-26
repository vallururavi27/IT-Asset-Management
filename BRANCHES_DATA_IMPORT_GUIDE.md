# 🏢 BRANCHES DATA IMPORT GUIDE

## ✅ **MOCK DATA CLEARED SUCCESSFULLY**

All mock/sample data has been removed from the database. The system now contains only:
- ✅ Admin user: `ravi.v@varsitymgmt.com`
- ✅ 3 Store Manager accounts for your branches
- ✅ Clean database ready for your real data

---

## 📊 **CSV IMPORT FORMAT (16 Columns)**

Your CSV file should have exactly these columns in this order:

```csv
name,description,category,subCategory,type,serialNumber,model,manufacturer,purchaseDate,purchaseCost,warrantyExpiry,status,location,quantity,availableQty,purchaseOrderNo
```

### **Column Descriptions:**

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| **name** | ✅ Yes | Asset name | "Dell Latitude 7420" |
| **description** | No | Detailed description | "Business laptop for branch office" |
| **category** | ✅ Yes | HARDWARE/SOFTWARE/NETWORKING/DATACENTER/LEGACY | "HARDWARE" |
| **subCategory** | No | Computing Devices, Storage Devices, etc. | "Computing Devices" |
| **type** | ✅ Yes | Laptop Computer, Desktop Computer, etc. | "Laptop Computer" |
| **serialNumber** | No | Unique serial number | "DL7420001" |
| **model** | No | Asset model | "Latitude 7420" |
| **manufacturer** | No | Manufacturer name | "Dell" |
| **purchaseDate** | No | YYYY-MM-DD format | "2024-01-15" |
| **purchaseCost** | No | Cost in rupees | "50000.00" |
| **warrantyExpiry** | No | YYYY-MM-DD format | "2027-01-15" |
| **status** | No | AVAILABLE/ASSIGNED/MAINTENANCE/RETIRED | "AVAILABLE" |
| **location** | No | Physical location | "Main Branch - IT Room" |
| **quantity** | No | Total quantity | "1" |
| **availableQty** | No | Available quantity | "1" |
| **purchaseOrderNo** | No | Purchase order number | "PO-2024-001" |

---

## 🎯 **STEP-BY-STEP IMPORT PROCESS**

### **Step 1: Prepare Your CSV File**
1. Create a CSV file with your branches data
2. Use the template: `branches-template.csv` (provided)
3. Ensure all required fields are filled
4. Use proper date format: YYYY-MM-DD
5. Save as UTF-8 encoded CSV

### **Step 2: Login to System**
1. Go to: http://localhost:3000
2. Login with: `ravi.v@varsitymgmt.com` / `varsity@2024`

### **Step 3: Import Your Data**
1. Navigate to **Assets** → **Import Assets**
2. Download the CSV template (if needed)
3. Upload your prepared CSV file
4. Review any validation errors
5. Confirm the import

### **Step 4: Verify Import**
1. Go to **Assets** page
2. Check that your data is imported correctly
3. Use search and filters to verify
4. Check asset counts and details

---

## 📝 **SAMPLE CSV FORMAT**

```csv
name,description,category,subCategory,type,serialNumber,model,manufacturer,purchaseDate,purchaseCost,warrantyExpiry,status,location,quantity,availableQty,purchaseOrderNo
Dell Laptop Branch 1,Business laptop for main branch,HARDWARE,Computing Devices,Laptop Computer,DL001BRANCH,Latitude 7420,Dell,2024-01-15,55000.00,2027-01-15,AVAILABLE,Main Branch - IT Department,1,1,PO-2024-001
HP Desktop Branch 2,Desktop computer for branch office,HARDWARE,Computing Devices,Desktop Computer,HP002BRANCH,EliteDesk 800,HP,2024-02-01,35000.00,2027-02-01,AVAILABLE,Branch Office - Admin,1,1,PO-2024-002
Canon Printer Branch 1,Multifunction printer for main branch,HARDWARE,Peripherals,Printer (Laser),CN003BRANCH,ImageCLASS MF445dw,Canon,2024-01-20,25000.00,2026-01-20,AVAILABLE,Main Branch - Reception,1,1,PO-2024-003
```

---

## ⚠️ **IMPORTANT VALIDATION RULES**

### **Required Fields:**
- ✅ `name` - Must not be empty
- ✅ `category` - Must be one of: HARDWARE, SOFTWARE, NETWORKING, DATACENTER, LEGACY
- ✅ `type` - Must not be empty

### **Data Format Rules:**
- 📅 **Dates:** Use YYYY-MM-DD format (e.g., 2024-12-25)
- 💰 **Costs:** Use decimal format (e.g., 50000.00)
- 🔢 **Quantities:** Use whole numbers (e.g., 1, 5, 10)
- 📧 **Serial Numbers:** Must be unique if provided

### **Category Options:**
- **HARDWARE** - Physical equipment (computers, printers, etc.)
- **SOFTWARE** - Software licenses and applications
- **NETWORKING** - Network equipment (switches, routers, etc.)
- **DATACENTER** - Server and data center equipment
- **LEGACY** - Old/retired equipment

---

## 🔧 **DROPDOWN & FONT FIXES APPLIED**

### **Fixed Issues:**
- ✅ **Dropdown Visibility** - Export menu now has proper z-index and shadow
- ✅ **Font Color** - All dropdown options now have dark, readable text
- ✅ **Select Styling** - All select elements have proper contrast
- ✅ **Hover Effects** - Better hover states for dropdown items

### **Styling Improvements:**
- ✅ `z-50` for proper layering
- ✅ `text-gray-900` for dark, readable text
- ✅ `bg-white` for proper background
- ✅ `shadow-xl` for better visibility
- ✅ `font-medium` for better readability

---

## 🎯 **POST-IMPORT TASKS**

### **After Successful Import:**
1. **Verify Data** - Check all imported assets
2. **Set Locations** - Update specific branch locations
3. **Assign Assets** - Assign assets to users/departments
4. **Create Departments** - Add your branch departments
5. **Configure Users** - Add branch-specific users
6. **Test Workflows** - Test gate pass, movements, etc.

### **Branch-Specific Setup:**
1. **Create Departments:**
   - Main Branch - IT Department
   - Main Branch - Administration
   - Branch Office - Operations
   - Branch Office - Finance

2. **Add Branch Users:**
   - Branch managers
   - Department heads
   - Asset custodians

3. **Configure Locations:**
   - Update asset locations to match your branches
   - Set up proper location hierarchy

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues:**
- **CSV Format Errors** - Check column order and headers
- **Date Format Issues** - Use YYYY-MM-DD format
- **Duplicate Serial Numbers** - Ensure uniqueness
- **Category Validation** - Use exact category names

### **Import Validation:**
- System will show detailed error messages
- Fix errors in CSV and re-import
- Partial imports are supported

---

## ✅ **READY TO IMPORT YOUR BRANCHES DATA!**

**Current System Status:**
- 🟢 Mock data cleared
- 🟢 Essential users created
- 🟢 Dropdown visibility fixed
- 🟢 Font colors improved
- 🟢 CSV import ready

**Next Steps:**
1. Prepare your branches CSV file
2. Login to the system
3. Import your data
4. Verify and configure

**Login:** http://localhost:3000  
**Credentials:** ravi.v@varsitymgmt.com / varsity@2024

Your IT Asset Management System is now ready for your real branches data! 🚀
