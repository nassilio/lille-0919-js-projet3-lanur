const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const passport = require("passport");
const {
  CONFIG: { backendPort },
  db,
  cloudinary
} = require("./conf");
const bodyParser = require("body-parser");
const upload = multer({ dest: "tmp/" });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(passport.initialize());

// Authentification
app.use("/api/auth", require("./auth"));

// USERS || GET & POST & PATCH
app.get("/api/users", (req, res) => {
  db.query(
    "SELECT id, firstname, lastname, team_id, pseudo, gender, address, avatar, email, age, country, city, creation_date, twitch, bio, mixer, youtube, LOL_pseudo, Fortnite_pseudo, CSGO_pseudo, OW_pseudo, HOTS_pseudo, SMITE_pseudo, APEX_pseudo, STARCRAFT2_pseudo, Hearstone_pseudo, KROSMAGA_pseudo, SSBU_pseudo, Tekken_pseudo, SF5_pseudo, ROCKETLEAGUE_pseudo, TFT_pseudo, PUBG_pseudo, R6S_pseudo, Paladins_pseudo from user",
    (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des données");
        console.log(err)
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/search/users/", (req, res) => {
  const request = req.query.pseudo;
  db.query(
    'SELECT id, pseudo, avatar AS user_avatar, team_id from user where pseudo like concat("%"?"%")',
    request,
    (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des données");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.put(
  "/api/user/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const formData = req.body;
    db.query(
      "UPDATE user SET ? WHERE id = ?",
      [formData, req.user.id],
      (err, result) => {
        if (err) {
          res.status(500).send("Erreur lors de la sauvegarde du message");
        } else {
          res.sendStatus(201);
        }
      }
    );
  }
);

// USER || GET for the userPage
app.get(
  "/api/profile/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      "SELECT user.avatar, user.id, user.pseudo, user.age, user.country, user.city, user.bio, user.team_id, user.gender, user.role, user.mixer, user.youtube, user.twitch, user.lastname, user.firstname, user.discord_pseudo FROM user WHERE user.id=?",
      [req.params.id],
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send("Erreur lors de la récupération des données de profile");
        } else {
          res.status(200).json(results);
        }
      }
    );
  }
);

app.get("/api/user/posts/:id/:offset", (req, res) => {
  db.query(
    "SELECT post.id, post.user_id, user.pseudo, user.avatar as user_avatar, post.game_id, post.message, post.date, post.image_url, tags, team.name as team_name, COUNT(`like`.post_id) AS nbLike, \
    CASE WHEN post.id IN (SELECT `like`.post_id from `like`) THEN 1 ELSE 0 END AS liked \
    FROM post \
    LEFT JOIN `like` \
    ON post.id=`like`.post_id \
    JOIN user \
    ON post.user_id = user.id \
    LEFT JOIN team \
    ON user.team_id = team.id \
    WHERE post.user_id = ? \
    GROUP BY post.id \
    ORDER BY post.id DESC \
    LIMIT 10 OFFSET ?",
    [parseInt(req.params.id), parseInt(req.params.offset)],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// FIL-ACTU || GET & POST

app.get(
  "/api/posts/:limit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      "SELECT post.id, post.circle_id, post.user_id, user.avatar AS user_avatar, user.pseudo, post.game_id, post.message, post.date, post.image_url, team.name as team_name, tags, COUNT(`like`.post_id) AS nbLike, \
    CASE WHEN post.id IN (SELECT `like`.post_id from `like` WHERE `like`.user_id=?) THEN 1 ELSE 0 END AS liked \
    FROM post \
    LEFT JOIN `like` \
    ON post.id=`like`.post_id \
    JOIN user \
    ON post.user_id=user.id \
    LEFT JOIN team \
    ON user.team_id = team.id \
    GROUP BY post.id \
    ORDER BY post.id DESC \
    LIMIT 10 OFFSET ?",
      [req.user.id, parseInt(req.params.limit)],
      (err, results) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(results);
        }
      }
    );
  }
);

app.get("/api/posts/discover/:limit", (req, res) => {
  db.query(
    "SELECT post.id, post.user_id, user.pseudo, user.avatar as user_avatar, post.game_id, post.message, post.date, post.image_url, team.name as team_name, tags, COUNT(`like`.post_id) AS nbLike \
    FROM post \
    LEFT JOIN `like` \
    ON post.id=`like`.post_id \
    JOIN user \
    ON post.user_id=user.id \
    LEFT JOIN team \
    ON user.team_id = team.id \
    GROUP BY post.id \
    ORDER BY post.id DESC \
    LIMIT 10 OFFSET ?",
    [parseInt(req.params.limit)],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Récupérer le nombre total de post
app.get("/api/totalposts", (req, res) => {
  db.query("SELECT count(post.id) as totalpost from post", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/gamelist/", (req, res) => {
  db.query("SELECT * from game", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});


app.get("/api/gamelist/:id", (req, res) => {
  const game = req.params.id;
  db.query(
    "SELECT * from game WHERE twitch_game_id = ?",
    [game],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});


app.post("/api/postimg", upload.single("file"), (req, res) => {
  const formData = req.file;
  cloudinary.v2.uploader.upload(formData.path, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la sauvegarde de l'image");
    } else {
      res.send(result);
    }
  });
});

app.post("/api/posts", (req, res) => {
  const formData = req.body;
  formData.tags = formData.tags.join(" ");
  db.query("INSERT INTO post SET ?", formData, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la sauvegarde du message");
    } else {
      res.sendStatus(201);
    }
  });
});

app.put(
  "/api/posts/:id/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const postId = parseInt(req.params.id);
    const formData = req.body;
    const userId = req.user.id;
    const userLike = formData.userLike;
    if (userLike)
      db.query(
        "INSERT INTO `like` (user_id,post_id) VALUES (?,?)",
        [userId, postId],
        (err, results) => {
          if (err) {
            res.status(500).send("Erreur lors de la sauvegarde du like");
          } else {
            res.sendStatus(201);
          }
        }
      );
    else
      db.query(
        "DELETE FROM `like` WHERE user_id=? AND post_id=?",
        [userId, postId],
        (err, results) => {
          if (err) {
            res.status(500).send("Erreur lors de la suppression du message");
          } else {
            res.sendStatus(201);
          }
        }
      );
  }
);

app.get("/api/comments/post/:id", (req, res) => {
  db.query(
    "SELECT comment.id, comment.user_id, comment.content, comment.post_id, user.pseudo, user.avatar from comment JOIN user on comment.user_id=user.id where comment.post_id = ? ",
    [Number(req.params.id)],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.post("/api/comments", (req, res) => {
  const formData = req.body;
  db.query("INSERT INTO comment SET ?", formData, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la sauvegarde du post");
    } else {
      res.sendStatus(201);
    }
  });
});

//team GET & POST
app.get("/api/teams", (req, res) => {
  const team = req.params.id;
  db.query(
    "SELECT name, image_team, description FROM team",
    [team],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.listen(backendPort, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
});
