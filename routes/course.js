const router = require('express').Router();
const Course = require('../models').course;
const courseValidation = require('../validation').courseValidation;
const mongoose = require('mongoose');

// 獲得所有課程
router.get('/', async (req, res) => {
  try {
    // 用 populate 找出和 instructor 有關的資料，陣列限制提供的資訊
    let courseFound = await Course.find({})
      .populate('instructor', ['username', 'email'])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師 id 尋找課程
router.get('/instructor/:_instructor_id', async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate('instructor', ['username', 'email'])
    .exec();
  return res.send(coursesFound);
});

// 用學生 id 尋找課程
router.get('/student/:_student_id', async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate('instructor', ['username', 'email'])
    .exec();
  return res.send(coursesFound);
});

// 用課程 id 尋找課程
router.get('/:_id', async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findById(_id)
      .populate('instructor', ['username', 'email'])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 發佈課程
router.post('/', async (req, res) => {
  // 驗證資料是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send('只有講師才能發佈新課程。若您已經是講師，請透過講師帳號登入。');
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send('新課程已經保存');
  } catch (e) {
    return res.status(500).send('無法創建課程');
  }
});

// 讓學生透過 課程id 來註冊新課程
router.post('/enroll/:_id', async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findById(_id).exec();
    course.students.push(req.user._id);
    await course.save();
    res.send('註冊完成');
  } catch (e) {
    return res.send(e);
  }
});

// 更改課程
router.patch('/:_id', async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;

  try {
    // 如果 課程id 格式有錯，代表課程不存在
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .send('找不到課程。無法更新課程內容！(課程ID格式錯誤)');
    }

    // 若 課程id 格式正確，進一步確認此課程是否存在
    let courseFound = await Course.findById(_id);

    if (!courseFound) {
      return res
        .status(400)
        .send('找不到課程。無法更新課程內容！(此課程ID不存在)');
    }

    // 使用者必須是此課程講師，才能編輯課程
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true, // 代表會拿到更新後的資料
        runValidators: true, // 更新資料時也能保有驗證機制
      });
      return res.send({
        message: '課程已經更新成功!',
        updatedCourse,
      });
    } else {
      return res.status(403).send('只有此課程的講師才能編輯課程');
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete('/:_id', async (req, res) => {
  let { _id } = req.params;

  try {
    // 如果 課程id 格式有錯，代表課程不存在
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .send('找不到課程。無法更新課程內容！(課程ID格式錯誤)');
    }

    // 若 課程id 格式正確，進一步確認此課程是否存在
    let courseFound = await Course.findById(_id);

    if (!courseFound) {
      return res
        .status(400)
        .send('找不到課程。無法更新課程內容！(此課程ID不存在)');
    }

    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send('課程已經刪除');
    } else {
      return res.status(403).send('只有此課程的講師才能刪除課程');
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
