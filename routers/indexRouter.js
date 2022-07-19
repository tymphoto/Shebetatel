const router = require('express').Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../middlewares/checkAuth');
const { Post, User, Like } = require('../db/models');
const upload = require('../middlewares/upload');

router.route('/')
  .get(async (req, res) => {
    const posts = await Post.findAll({
      include: { model: User },
    });
    res.render('index', { posts });
  });

router.route('/error')
  .get(async (req, res) => {
    res.render('error');
  });

router.route('/register')
  .get(checkAuth, async (req, res) => {
    res.render('register');
  })
  .post(checkAuth, async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (name && email && password) {
        const hashPass = await bcrypt.hash(password, Number(process.env.SALTROUNDS));
        const user = await User.create({
          name, email, password: hashPass,
        });
        req.session.userId = user.id;
        res.sendStatus(200);
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  });

router.route('/login')
  .get(async (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ where: { email } });
        const passCheck = await bcrypt.compare(password, user.password);
        if (user && passCheck) {
          req.session.userId = user.id;
          req.session.userName = user.name;
          res.redirect('/');
        } else {
          res.sendStatus(404);
        }
      }
    } catch (err) {
      console.log(err);
      res.redirect('/login');
    }
  });

router.route('/logout')
  .get((req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }
      res.clearCookie('auth').redirect('/');
    });
  });

router.route('/addPost')
  .get(async (req, res) => {
    res.render('addPost');
  });

router.route('/new')
  .post(upload.single('image'), async (req, res) => {
    req.body.user_id = res.locals.userId;
    if (req.file) {
      await Post.create({ ...req.body, image: req.file.path.replace('public', '') });
    } else {
      await Post.create({ ...req.body });
    }
    res.sendStatus(200);
  });

router.route('/lk')
  .get(async (req, res) => {
    const posts = await Post.findAll({
      include: { model: User },
      where: { user_id: res.locals.userId },
    });
    // console.log(posts);
    res.render('lk', { posts });
  });

router.route('/:id')
  .delete(async (req, res) => {
    await Post.destroy({ where: { id: req.params.id } });
    res.sendStatus(200);
  });

router.route('/edit/:id')
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findOne({ where: { id: req.params.id } });
      if (post.user_id === res.locals.userId) {
        res.render('edit', { post, id });
      } else {
        res.redirect('/error');
      }
    } catch (err) {
      console.log(err);
      res.redirect('/error');
    }
  })
  .put(upload.single('image'), async (req, res) => {
    // console.log(req.body);
    console.log(req.params);
    try {
      await Post.update(
        { text: req.body.text, image: req.file.path.replace('public', '') },
        { where: { id: req.params.id }, returning: true, plain: true },
      );
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.redirect('/lk');
    }
  });

module.exports = router;
