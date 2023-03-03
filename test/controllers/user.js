const db = require("../data/db");
const { querySync } = require("../data/query");

exports.get_blog = async (req, res, next) => {
  try {
    const [blogs] = await db.execute("select * from blog where status=1");
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

exports.post_blog = async (req, res, next) => {
  const {
    title,
    aciglama,
    image,
    homePage,
    confirm,
    categoryid,
    altbaslig,
    userid,
  } = req.body;
  // const title = req.body.title;
  //   console.log(req.body.title);
  try {
    const [blogs] = await db.execute(
      `INSERT INTO blog(baslig,aciglama,image,homePage,confirm,categoryid,altbaslig,userid) VALUES ('${title}','${aciglama}','${image}','${homePage}','${confirm}','${categoryid}','${altbaslig}','${userid}')`
    );

    res.send("qeyd Olunmusudr");
  } catch (err) {
    next(err);
  }
};

exports.get_blog_edit = async (req, res, next) => {
  console.log(req.params.id);
  const blogid = req.params.id;
  try {
    const [blogs] = await db.execute(
      "SELECT * FROM blog where blogid=? and status=1",
      [blogid]
    );

    querySync("SELECT * from blog").then((result) => {
      console.log(result);
    });

    res.json(blogs[0]);
  } catch (err) {
    next(err);
  }
};

exports.put_blog_edit = async (req, res, next) => {
  console.log(req.headers.authorization);
  const {
    blogid,
    title,
    aciglama,
    image,
    homePage,
    confirm,
    categoryid,
    altbaslig,
    userid,
  } = req.body;
  try {
    // const [blogs, ] = await db.execute("select * from blog left join users on users.id=blog.userid where blog.userid= ? and blogid= ?" , [blogid]);
    const [blogs] = await db.execute(
      "select * from blog where blogid = ? and status=1",
      [blogid]
    );
    console.log(blogid);
    if (blogs.length > 0) {
      await db.execute(
        "UPDATE blog SET baslig = ?, aciglama = ?, image = ?, homePage = ?, confirm = ?, categoryid = ?, altbaslig = ?, userid = ? WHERE blogid= ?",
        [
          title,
          aciglama,
          image,
          homePage,
          confirm,
          categoryid,
          altbaslig,
          userid,
          blogid,
        ]
      );
      res.json({ message: "Uğurla yeniləndi!", status: 200, data: blogs[0] });
    } else {
      return res.send("This blog not found in db.");
    }
  } catch (err) {
    next(err);
  }
};

exports.delete_blog = async (req, res, next) => {
  const blogid = req.body.blogid;
  console.log(blogid);
  try {
    const [blogs] = await db.execute("select * from blog where blogid = ?", [
      blogid,
    ]);
    console.log(blogs[0]);
    if (blogs.lentgh > 0) {
      await db.execute("UPDATE blog SET status = 0 WHERE blogid=?", [blogid]);
      res.json({ message: "Blog deleted!", status: 200, data: blogs[0] });
    } else {
      return res.send("Blog not deleted!");
    }
  } catch (err) {
    next(err);
  }
};
