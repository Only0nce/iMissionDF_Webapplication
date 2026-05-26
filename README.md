# iSense Web / iScan MR-10 WebRx

## คู่มือการใช้งานเบื้องต้น / Basic User Guide

### ภาษาไทย
เอกสารนี้เป็นคู่มือการใช้งานเบื้องต้นสำหรับระบบ iSense Web / iScan MR-10 WebRx ใช้สำหรับแนะนำการเข้าใช้งาน การดูสถานะระบบ การควบคุมอุปกรณ์ การตรวจสอบข้อมูลย้อนหลัง และการตั้งค่าพื้นฐานผ่านหน้าเว็บ

เอกสารฉบับนี้ไม่ลงรายละเอียดโครงสร้างไฟล์ ฐานข้อมูล พอร์ตภายใน หรือ logic เชิงลึกของระบบ เพื่อป้องกันการเปิดเผยข้อมูลภายในที่ไม่จำเป็น

### English
This document is a basic user guide for the iSense Web / iScan MR-10 WebRx system. It explains how to access the web interface, monitor device status, control basic functions, review recorded data, and perform basic system settings through the web application.

This document does not include internal file structures, database details, internal ports, or detailed system logic in order to avoid exposing unnecessary internal information.

---

## 1. ภาพรวมระบบ / System Overview

### ภาษาไทย
ระบบ iSense Web / iScan MR-10 WebRx เป็นเว็บสำหรับควบคุมและมอนิเตอร์อุปกรณ์ผ่าน Browser ผู้ใช้สามารถตรวจสอบสถานะอุปกรณ์ ดูข้อมูล Receiver ตรวจสอบ Event Log ใช้งาน Playback ดูข้อมูลบนแผนที่ จัดการผู้ใช้ และตั้งค่าระบบบางส่วนตามสิทธิ์ที่ได้รับ

การทำงานบางหน้าจำเป็นต้องเชื่อมต่อกับ service ฝั่งอุปกรณ์ หาก service เหล่านั้นไม่ทำงาน หน้าเว็บอาจเปิดได้แต่ข้อมูลอาจไม่อัปเดตหรือไม่สามารถสั่งงานได้

### English
The iSense Web / iScan MR-10 WebRx system is a browser-based interface for controlling and monitoring devices. Users can check device status, view receiver information, review event logs, use playback functions, view map information, manage users, and configure basic system settings according to their access permissions.

Some pages require device-side services to be running. If those services are not available, the web page may open normally, but data may not update or commands may not work.

---

## 2. สิ่งที่ต้องเตรียมก่อนใช้งาน / Before Using the System

### ภาษาไทย
ก่อนเข้าใช้งาน ควรตรวจสอบสิ่งต่อไปนี้:

- อุปกรณ์หรือ Server เปิดทำงานอยู่
- เครื่องผู้ใช้อยู่ใน network เดียวกับอุปกรณ์ หรือเชื่อมต่อผ่าน VPN ภายใน
- ใช้ Browser ที่รองรับ WebSocket เช่น Chrome, Edge หรือ Firefox
- ผู้ใช้มี Username และ Password ที่ได้รับจากผู้ดูแลระบบ
- Service ฝั่งอุปกรณ์ที่เกี่ยวข้องทำงานปกติ

### English
Before using the system, check the following:

- The device or server is powered on
- The user’s computer is on the same network as the device, or connected through an internal VPN
- The browser supports WebSocket, such as Chrome, Edge, or Firefox
- The user has a username and password provided by the system administrator
- The required device-side services are running normally

---

## 3. การเข้าใช้งานระบบ / System Login

### ภาษาไทย
การเข้าใช้งานพื้นฐาน:

1. เปิด Browser
2. เข้า URL ของระบบที่ได้รับจากผู้ดูแลระบบ
3. กรอก Username และ Password
4. กด Login
5. หลัง Login สำเร็จ ระบบจะเข้าสู่หน้า Dashboard หลัก

หากเป็นการใช้งานครั้งแรก ควรเปลี่ยนรหัสผ่านทันที และไม่ควรใช้รหัสผ่านร่วมกับผู้อื่น

### English
Basic login steps:

1. Open a web browser
2. Enter the system URL provided by the administrator
3. Enter your username and password
4. Click Login
5. After a successful login, the system will open the main Dashboard page

For first-time use, users should change their password immediately and should not share passwords with others.

---

## 4. หน้า Dashboard / Dashboard Page

### ภาษาไทย
หน้า Dashboard ใช้สำหรับดูภาพรวมของระบบ เช่น:

- สถานะการเชื่อมต่อของอุปกรณ์
- สถานะ Receiver หรือ WebRx
- ข้อมูลการทำงานของระบบ
- การแจ้งเตือนหรือเหตุการณ์สำคัญ
- สถานะข้อมูลที่อุปกรณ์ส่งกลับมา

ถ้าข้อมูลไม่แสดงหรือขึ้นว่าเชื่อมต่อไม่ได้ ให้ตรวจสอบว่าอุปกรณ์เปิดอยู่ และ service ฝั่งอุปกรณ์ทำงานปกติ

### English
The Dashboard page provides an overview of the system, such as:

- Device connection status
- Receiver or WebRx status
- System operation information
- Alerts or important events
- Data status reported from the device

If data is not displayed or the page shows a connection problem, check that the device is powered on and the related device-side services are running normally.

---

## 5. การควบคุม Receiver / Receiver Control

### ภาษาไทย
หน้าควบคุม Receiver ใช้สำหรับดูสถานะและควบคุมการทำงานพื้นฐานของ Receiver ตามสิทธิ์ของผู้ใช้

ผู้ใช้สามารถทำงานพื้นฐานได้ เช่น:

- ดูสถานะ Receiver
- ตรวจสอบการตอบสนองของอุปกรณ์
- ปรับค่าพื้นฐานที่ได้รับอนุญาต
- ใช้งานร่วมกับ WebRx หรือ service ที่เกี่ยวข้อง

การเปลี่ยนค่าบางอย่างอาจส่งผลต่อการรับสัญญาณจริง ควรปรับเฉพาะค่าที่เข้าใจและได้รับอนุญาตเท่านั้น

### English
The Receiver Control page is used to view receiver status and control basic receiver functions according to the user’s permission level.

Basic functions may include:

- Viewing receiver status
- Checking device response
- Adjusting permitted basic settings
- Working with WebRx or related services

Some settings may affect actual signal reception. Users should only modify settings that they understand and are authorized to change.

---

## 6. Playback Recording

### ภาษาไทย
หน้า Playback Recording ใช้สำหรับตรวจสอบหรือเล่นข้อมูลที่บันทึกย้อนหลัง

การใช้งานทั่วไป:

1. เปิดหน้า Playback
2. เลือกรายการบันทึกที่ต้องการ
3. กดเล่นเพื่อตรวจสอบข้อมูลย้อนหลัง
4. หากระบบเปิดสิทธิ์ไว้ อาจสามารถดาวน์โหลดไฟล์ได้

ถ้าไม่พบรายการบันทึก ให้ตรวจสอบช่วงเวลา เงื่อนไขการค้นหา และสถานะพื้นที่จัดเก็บข้อมูล

### English
The Playback Recording page is used to review or play previously recorded data.

Basic usage:

1. Open the Playback page
2. Select the required recording item
3. Click play to review the recorded data
4. If permitted, the file may also be downloadable

If no recording is found, check the selected time range, search conditions, and storage status.

---

## 7. Event Logger

### ภาษาไทย
หน้า Event Logger ใช้สำหรับดูเหตุการณ์และ log ของระบบ

ผู้ใช้สามารถใช้งานได้ เช่น:

- ดูรายการเหตุการณ์ย้อนหลัง
- ค้นหาหรือกรองข้อมูลตามช่วงเวลา
- ตรวจสอบสถานะ error, warning หรือ event สำคัญ
- Export ข้อมูล หากระบบเปิดสิทธิ์ให้ใช้งาน

หาก log ไม่แสดง อาจเกิดจากยังไม่มีข้อมูลในช่วงเวลาที่เลือก หรือ service ยังไม่ได้ส่งข้อมูลเข้าระบบ

### English
The Event Logger page is used to view system events and logs.

Users may be able to:

- View historical events
- Search or filter data by time range
- Check error, warning, or important event status
- Export data if the feature is permitted

If logs are not displayed, there may be no data in the selected time range, or the related service may not have sent data to the system.

---

## 8. Map / DF Monitoring

### ภาษาไทย
หน้า Map / DF Monitoring ใช้สำหรับแสดงข้อมูลตำแหน่งหรือข้อมูลทิศทางของอุปกรณ์

การใช้งานพื้นฐาน:

- เปิดหน้า Map
- ตรวจสอบว่าอุปกรณ์ที่ต้องการดูมีสถานะ online
- ดูตำแหน่งหรือข้อมูลทิศทางบนแผนที่
- ตรวจสอบข้อมูลที่อัปเดตจากอุปกรณ์แบบ real-time

หากแผนที่ไม่แสดงข้อมูล ให้ตรวจสอบการเชื่อมต่อ network, ข้อมูล GPS และ service ฝั่งอุปกรณ์

### English
The Map / DF Monitoring page is used to display device location or direction-finding information.

Basic usage:

- Open the Map page
- Check that the target device is online
- View location or direction information on the map
- Monitor real-time updates from the device

If the map does not show data, check the network connection, GPS data, and related device-side services.

---

## 9. การจัดการผู้ใช้ / User Management

### ภาษาไทย
หน้า User Management ใช้สำหรับจัดการบัญชีผู้ใช้ โดยผู้ดูแลระบบสามารถ:

- เพิ่มผู้ใช้ใหม่
- แก้ไขข้อมูลผู้ใช้
- เปลี่ยนรหัสผ่าน
- กำหนดสิทธิ์การใช้งาน
- ปิดหรือจำกัดบัญชีที่ไม่ต้องการใช้งาน

ควรกำหนดสิทธิ์ให้เหมาะสมกับหน้าที่ของผู้ใช้ และไม่ควรใช้บัญชีผู้ดูแลระบบร่วมกันหลายคน

### English
The User Management page is used to manage user accounts. Administrators can:

- Add new users
- Edit user information
- Change passwords
- Assign access permissions
- Disable or restrict accounts that should no longer be used

Permissions should be assigned according to each user’s role. Administrator accounts should not be shared among multiple users.

---

## 10. การตั้งค่าระบบ / System Settings

### ภาษาไทย
หน้า Settings ใช้สำหรับตรวจสอบและตั้งค่าพื้นฐานของระบบตามสิทธิ์ของผู้ใช้

การใช้งานทั่วไป:

- ตรวจสอบข้อมูลระบบ
- ปรับค่าพื้นฐานที่ได้รับอนุญาต
- อัปโหลดไฟล์ update หรือ restore เฉพาะกรณีที่ได้รับอนุญาต
- ตรวจสอบผลลัพธ์หลังบันทึกค่า

ก่อน update หรือ restore ควรสำรองข้อมูลสำคัญ และไม่ควรปิดเครื่องระหว่างดำเนินการ

### English
The Settings page is used to check and configure basic system settings according to the user’s permission level.

Basic usage includes:

- Checking system information
- Adjusting permitted basic settings
- Uploading update or restore files only when authorized
- Verifying the result after saving settings

Before performing an update or restore, important data should be backed up. Do not power off the device during the process.

---

## 11. การตั้งค่า Wi-Fi / LTE / Wi-Fi / LTE Settings

### ภาษาไทย
หน้าตั้งค่า Wi-Fi / LTE ใช้สำหรับจัดการการเชื่อมต่อ network ของอุปกรณ์

การใช้งานพื้นฐาน:

1. เปิดหน้า Network, Wi-Fi หรือ LTE
2. ตรวจสอบรายการเครือข่ายที่ระบบพบ
3. เลือกเครือข่ายที่ต้องการ
4. กรอกรหัสผ่านหรือข้อมูลที่จำเป็น
5. บันทึกค่าและรอระบบเชื่อมต่อใหม่

หลังเปลี่ยนค่า network หน้าเว็บอาจหลุดชั่วคราว ให้เข้าใช้งานใหม่ด้วย IP ล่าสุดของอุปกรณ์

### English
The Wi-Fi / LTE settings page is used to manage the device’s network connection.

Basic usage:

1. Open the Network, Wi-Fi, or LTE page
2. Check the available network list
3. Select the required network
4. Enter the password or required information
5. Save the settings and wait for the device to reconnect

After changing network settings, the web page may disconnect temporarily. Access the system again using the latest device IP address.

---

## 12. การอัปโหลดไฟล์ Update / Update File Upload

### ภาษาไทย
กรณีที่ต้องอัปเดตระบบ:

1. ตรวจสอบว่าไฟล์ update ถูกต้องกับรุ่นอุปกรณ์
2. เข้าเมนูสำหรับอัปโหลด update
3. เลือกไฟล์และเริ่มอัปโหลด
4. รอจนระบบแจ้งผลสำเร็จหรือแจ้ง error
5. หากระบบต้อง reboot ให้รอจนเครื่องกลับมา online แล้วจึงเข้าใช้งานใหม่

ห้ามปิดเครื่อง รีเฟรชหน้าเว็บ หรือถอดไฟระหว่างขั้นตอน update

### English
When a system update is required:

1. Verify that the update file matches the device model
2. Open the update upload menu
3. Select the file and start uploading
4. Wait until the system reports success or an error
5. If the system needs to reboot, wait until the device is online again before logging in

Do not power off the device, refresh the page, or disconnect power during the update process.

---

## 13. ข้อควรระวังด้านความปลอดภัย / Security Notes

### ภาษาไทย
ข้อควรระวังสำคัญ:

- ใช้งานระบบผ่าน network ภายในหรือ VPN เท่านั้น
- ไม่ควรเปิดระบบออก internet โดยตรง
- เปลี่ยนรหัสผ่านเริ่มต้นหลังติดตั้ง
- ไม่แชร์บัญชีผู้ดูแลระบบให้ผู้อื่น
- สำรองข้อมูลก่อน update หรือ restore
- จำกัดสิทธิ์ผู้ใช้ตามความจำเป็น
- ตรวจสอบ log เป็นระยะเพื่อดูความผิดปกติของระบบ

### English
Important security notes:

- Use the system only through an internal network or VPN
- Do not expose the system directly to the internet
- Change the initial password after installation
- Do not share administrator accounts with others
- Back up important data before update or restore operations
- Limit user permissions based on actual needs
- Review logs periodically to detect abnormal system behavior

---

## 14. ปัญหาที่พบบ่อย / Common Problems

### 14.1 Login ไม่ได้ / Cannot Login

#### ภาษาไทย
ให้ตรวจสอบ:

- Username และ Password ถูกต้องหรือไม่
- บัญชีผู้ใช้ถูกปิดหรือถูกจำกัดสิทธิ์หรือไม่
- ระบบฐานข้อมูลผู้ใช้พร้อมใช้งานหรือไม่
- ติดต่อผู้ดูแลระบบหากยังไม่สามารถเข้าใช้งานได้

#### English
Check the following:

- The username and password are correct
- The account is not disabled or restricted
- The user database is available
- Contact the system administrator if login still fails

### 14.2 Dashboard ไม่มีข้อมูล / Dashboard Shows No Data

#### ภาษาไทย
ให้ตรวจสอบ:

- อุปกรณ์เปิดอยู่หรือไม่
- Service ฝั่งอุปกรณ์ทำงานอยู่หรือไม่
- เครื่องผู้ใช้อยู่ใน network เดียวกับอุปกรณ์หรือไม่
- มี firewall หรือ network policy บล็อกการเชื่อมต่อหรือไม่

#### English
Check the following:

- The device is powered on
- The device-side services are running
- The user’s computer is on the same network as the device
- A firewall or network policy is not blocking the connection

### 14.3 Receiver ไม่ตอบสนอง / Receiver Does Not Respond

#### ภาษาไทย
ให้ตรวจสอบ:

- Service ของ Receiver ทำงานอยู่หรือไม่
- อุปกรณ์ปลายทาง online หรือไม่
- มีการเปลี่ยนค่าระบบก่อนเกิดปัญหาหรือไม่
- ลอง refresh หน้าเว็บหรือ login ใหม่อีกครั้ง

#### English
Check the following:

- The receiver service is running
- The target device is online
- System settings were not changed incorrectly before the issue occurred
- Try refreshing the page or logging in again

### 14.4 Playback ไม่มีไฟล์ / No Playback File Found

#### ภาษาไทย
ให้ตรวจสอบ:

- มีไฟล์บันทึกในช่วงเวลาที่เลือกหรือไม่
- เงื่อนไขการค้นหาถูกต้องหรือไม่
- พื้นที่จัดเก็บข้อมูลพร้อมใช้งานหรือไม่
- ผู้ใช้มีสิทธิ์เข้าถึง Recording หรือไม่

#### English
Check the following:

- There are recordings in the selected time range
- The search conditions are correct
- The storage system is available
- The user has permission to access recordings

### 14.5 Upload หรือ Update ไม่สำเร็จ / Upload or Update Failed

#### ภาษาไทย
ให้ตรวจสอบ:

- ไฟล์ถูกต้องตามรุ่นอุปกรณ์หรือไม่
- ขนาดไฟล์ไม่เกินข้อจำกัดของระบบหรือไม่
- พื้นที่จัดเก็บข้อมูลเพียงพอหรือไม่
- ผู้ใช้มีสิทธิ์อัปโหลดหรือ update หรือไม่

#### English
Check the following:

- The file matches the device model
- The file size is within the system limit
- There is enough storage space
- The user has permission to upload or update

### 14.6 Wi-Fi / LTE เชื่อมต่อไม่ได้ / Wi-Fi or LTE Cannot Connect

#### ภาษาไทย
ให้ตรวจสอบ:

- รหัสผ่านถูกต้องหรือไม่
- สัญญาณเครือข่ายเพียงพอหรือไม่
- อุปกรณ์รองรับ network ที่เลือกหรือไม่
- หลังเปลี่ยนค่า network ต้องเข้าใช้งานใหม่ด้วย IP ที่ถูกต้อง

#### English
Check the following:

- The password is correct
- The network signal is strong enough
- The device supports the selected network
- After changing network settings, access the system again using the correct IP address

---

## 15. คำแนะนำหลังติดตั้ง / Recommended Checks After Installation

### ภาษาไทย
หลังติดตั้งหรือหลังอัปเดตระบบ ควรตรวจสอบตามลำดับนี้:

1. Login เข้าระบบได้
2. Dashboard แสดงสถานะอุปกรณ์
3. Receiver / WebRx ตอบสนอง
4. Event Logger มีข้อมูล
5. Playback ใช้งานได้
6. Map แสดงข้อมูลถูกต้อง
7. Wi-Fi / LTE ใช้งานได้ตามต้องการ
8. บัญชีผู้ใช้และสิทธิ์ถูกต้อง
9. เปลี่ยนรหัสผ่านเริ่มต้นแล้ว
10. สำรองข้อมูลสำคัญเรียบร้อย

### English
After installation or system update, check the following:

1. Login works correctly
2. The Dashboard displays device status
3. Receiver / WebRx responds normally
4. Event Logger shows data
5. Playback works correctly
6. Map information is displayed correctly
7. Wi-Fi / LTE works as required
8. User accounts and permissions are correct
9. Initial passwords have been changed
10. Important data has been backed up

---

## 16. หมายเหตุ / Notes

### ภาษาไทย
เอกสารนี้จัดทำขึ้นเพื่อเป็นคู่มือใช้งานเบื้องต้นสำหรับผู้ใช้งานหรือผู้ดูแลระบบทั่วไปเท่านั้น รายละเอียดเชิงลึก เช่น โครงสร้างไฟล์ภายใน ระบบฐานข้อมูล API พอร์ตภายใน และ logic การทำงาน ควรเก็บไว้ในเอกสารภายในสำหรับทีมพัฒนา

### English
This document is intended as a basic user guide for general users or system administrators. Detailed technical information such as internal file structure, database design, APIs, internal ports, and system logic should be kept in internal documentation for the development team only.