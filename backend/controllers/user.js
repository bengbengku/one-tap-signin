const bcrypt = require('bcrypt');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const { validateEmail, validateLength } = require('../helpers/validation');
const { generateToken } = require('../helpers/tokens');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

exports.userProvider = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    const UserProvider = db.UserProvider;

    const check = await UserProvider.findOne({
      where: { email },
    });

    if (check) {
      return res.status(200).json({
        name: check.name,
        email: check.email,
        picture: check.picture,
        provider: 'Google',
      });
    }

    const userProvider = await UserProvider.create({
      name,
      email,
      picture,
    });

    return res.status(200).json({
      name: userProvider.name,
      email: userProvider.email,
      picture: userProvider.picture,
      provider: 'Google',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Email anda tidak valid.',
      });
    }

    const check = await db.User.findOne({
      where: { email },
    });
    if (check) {
      return res.status(400).json({
        message: 'Email sudah terdaftar.',
      });
    }

    if (!validateLength(name, 3, 30)) {
      return res.status(400).json({
        message: 'Jumlah character nama min[3] - max[30].',
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    const user = await db.User.create({
      name,
      email,
      password: cryptedPassword,
    });

    const token = generateToken({ id: user.id }, '1h');

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
      message: 'Register berhasil.',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Email tidak ditemukan, silahkan periksa kembali.',
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: 'Password salah. silahkan periksa kembali.',
      });
    }

    const token = generateToken({ id: user.id }, '1h');

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
      provider: 'Credentials',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await db.User.findOne({
      where: {
        id: user.id,
      },
    });

    if (validUser !== user.id) {
      return res.status(400).json({
        message: 'Otorisasi Gagal.',
      });
    }

    if (check) {
      return res.status(400).json({
        id: user.id,
        name: check.name,
        email: check.email,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
