const router = require("express").Router();
const db = require("../db/index");
const checkToken = require("../jwt/index");

router.get("/sheets/user", checkToken, (req, res) => {
  db.query("select * from sheets where user_id = $1", [req.user.uuid])
    .then((r) => {
      res.status(200).json(r.rows);
    })  
    .catch((e) => {
      res.sendStatus(500);
    });
});

router.post("/sheets/edit", (req, res) => {
  const sheet = req.body;
  db.query("insert into sheets(user_id,class,level,background,name,race,alignment,experience_points,strength,dexterity,constitution,intelligence,wisdom,charisma,bonus,armor_class,initiative,speed,hp) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);",
  [sheet.user_id, sheet.class, sheet.level, sheet.background, sheet.name, sheet.race, sheet.alignment, sheet.experience_points, sheet.strength, sheet.dexterity, sheet.constitution, sheet.intelligence, sheet.wisdom, sheet.charisma, sheet.bonus, sheet.armor_class, sheet.initiative, sheet.speed, sheet.hp])
  .then(result => {
    res.sendStatus(201);
  })
  .catch(() => res.sendStatus(500));
})

router.put("/sheets/edit", (req, res) => {
  const sheet = req.body;
  db.query("update sheets set class = $1, level = $2, background = $3, name = $4, race = $5, alignment = $6, experience_points = $7, strength = $8, dexterity = $9, constitution = $10, intelligence = $11, wisdom = $12, charisma = $13, bonus = $14, armor_class = $15, initiative = $16, speed = $17, hp = $18 where id = $19",
  [sheet.class, sheet.level, sheet.background, sheet.name, sheet.race, sheet.alignment, sheet.experience_points, sheet.strength, sheet.dexterity, sheet.constitution, sheet.intelligence, sheet.wisdom, sheet.charisma, sheet.bonus, sheet.armor_class, sheet.initiative, sheet.speed, sheet.hp, sheet.id])
  .then(result => {
    res.sendStatus(200);
  })
  .catch((e) => {
    res.sendStatus(500);
    console.log(e);
  });
})

router.delete("/sheets/user", checkToken, (req, res) => {
  db.query("select delete_sheet($1)", [req.body.id])
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((e) => {
      res.sendStatus(500);
    });
});

module.exports = router;