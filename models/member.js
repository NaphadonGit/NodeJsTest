const { Sequelize, DataTypes } = require('sequelize');

// เชื่อมต่อฐานข้อมูล MySQL ผ่าน Sequelize
const sequelize = new Sequelize('members_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // ใช้ MySQL
});

// สร้างโมเดล Member
const Member = sequelize.define('Member', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = { Member }; // ส่งออกโมเดล Member

// ทดสอบการเชื่อมต่อกับฐานข้อมูลและสร้างตาราง
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // สร้างตารางจากโมเดลถ้ายังไม่มีอยู่
    return sequelize.sync();
  })
  .then(() => {
    console.log('Tables have been created successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
