const express = require('express');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// ตั้งค่า Sequelize เชื่อมต่อกับ MySQL
const sequelize = new Sequelize('members_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// สร้าง Model สำหรับ Table สมาชิก
const Member = sequelize.define('Member', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: ' + err));

// บังคับให้ Sequelize สร้างตาราง (กรณียังไม่มี)
sequelize.sync();

// ตั้งค่า multer สำหรับจัดการการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ตั้งค่า express เพื่อแยกข้อมูลจาก form เป็น json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// เส้นทางการเพิ่มข้อมูลสมาชิก
app.post('/members', upload.single('profilePicture'), async (req, res) => {
  try {
    // ดึงข้อมูลจากฟอร์ม
    const { title, name, lastName, age } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    // สร้างข้อมูลสมาชิกใหม่ในฐานข้อมูล
    const newMember = await Member.create({
      title,
      name,
      lastName,
      age,
      profilePicture,
    });

    res.send('Member added successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error adding member');
  }
});

// เริ่มการทำงานของเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
