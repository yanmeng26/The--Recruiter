const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require("path");

const app = express();

const connection = mysql.createConnection({
    host: 'therecruiterdb.cnj20joucjaw.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'therecruiteruser',
    password: 'therecruiterpw',
    database: 'therecruiter_schema'
});

const bodyParser = require("body-parser");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/endpoints/recruits.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    console.log("Query items:");
    let query = "";
    console.log(req.query);
    if (req.query.not_club_id) {
      query = "SELECT DISTINCT recruits.* FROM recruits LEFT JOIN club_recruits ON recruits.recruit_id = club_recruits.recruit_id WHERE recruits.recruit_id NOT IN (SELECT recruit_id from club_recruits WHERE club_id=" + req.query.not_club_id + ") OR recruits.recruit_id NOT IN (select recruit_id from club_recruits);";
    }
    else {
      const id = (req.query.id ? " r.recruit_id = " + req.query.id + " AND " : '');
      const fname = (req.query.fname ? " r.fname LIKE '%" + req.query.fname + "%' AND " : '');
      const lname = (req.query.lname ? " r.lname LIKE '%" + req.query.lname + "%' AND " : '');
      const position = (req.query.position ? " r.position = '" + req.query.position + "' AND " : '');
      const notSchool = (req.query.not_school_id ? " r.school_id != " + req.query.not_school_id + " AND " : '');
      const calcAge = "DATEDIFF(NOW(),dob)/365"
      let age = "";
      let addlCoachTables = "LEFT JOIN school_coaches sc ON s.school_id = sc.school_id LEFT JOIN club_recruits cr ON r.recruit_id = cr.recruit_id LEFT JOIN club_coaches cc ON cr.club_id = cc.club_id ";
      if (req.query.agefrom || req.query.ageto) {
          age = (req.query.agefrom ? " " + calcAge + " >= " + req.query.agefrom + " AND " : '') +
                      (req.query.ageto ? " " + calcAge + " <= " + (parseInt(req.query.ageto) + 1) + " AND " : '')
      }
      let team_id = "";
      let teamTable = "";
      if (req.query.team_id) {
          team_id = " (t.team_id = " + req.query.team_id + " OR t.team_id = " + req.query.team_id + ") AND ";
          teamTable = addlCoachTables + " INNER JOIN team t ON cr.club_id = t.club_id OR s.school_id = t.school_id ";
          addlTables = "";
      }
      let coach_id = "";
      let coachTable = "";
      if (req.query.coach_id) {
          coach_id = " (cc.coach_id = " + req.query.coach_id + " OR sc.coach_id = " + req.query.coach_id + ") AND ";
          coachTable = addlCoachTables;
      }
      let filter = "WHERE" + fname + lname + position + age + id + coach_id + team_id + notSchool;
      filter = filter.substring(0,filter.length-5);
      query = "SELECT DISTINCT r.*, " + calcAge + " AS age, s.school_id AS school_id, s.school_name, s.street_address_1 AS school_address_1, s.street_address_2 AS school_address_2, s.city AS school_city, s.zip AS school_zip FROM recruits r LEFT JOIN schools s ON r.school_id = s.school_id " + teamTable + coachTable + filter;
    }
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results});
        }
    });
});

app.get('/endpoints/evaluations.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    const id = (req.query.id ? " WHERE recruit_id = " + req.query.id : '');
    const query = "SELECT * FROM evaluations" + id;
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results});
        }
    });
});

app.get('/endpoints/coaches.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    let recruit_id = "";
    let recruitTable = "";
    if (req.query.recruit_id) {
        recruit_id = " (r.recruit_id = " + req.query.recruit_id + " OR cr.recruit_id = " + req.query.recruit_id + ") AND";
        recruitTable = " LEFT JOIN recruits r ON s.school_id = r.school_id LEFT JOIN club_recruits cr ON cc.club_id = cr.club_id";
    }
    const not_club_id = (req.query.not_club_id ? " (cc.club_id != " + req.query.not_club_id + ") OR coaches.coach_id NOT IN (select coach_id FROM club_coaches) AND " : "");
    const not_school_id = (req.query.not_school_id ? " (sc.school_id != " + req.query.not_school_id + ") OR coaches.coach_id NOT IN (select coach_id FROM school_coaches) AND " : "");
    const coach_id = (req.query.id ? " coaches.coach_id = " + req.query.id + " AND": "");
    const club_id = (req.query.club_id ? " cc.club_id = " + req.query.club_id + " AND": "");
    const school_id = (req.query.school_id ?  " sc.school_id = " + req.query.school_id + " AND": '');
    const fname = (req.query.fname ? " fname LIKE '%" + req.query.fname + "%' AND " : '');
    const lname = (req.query.lname ? " lname LIKE '%" + req.query.lname + "%' AND " : '');
    const schools = (req.query.schools ? " s.school_name LIKE '%" + req.query.schools + "%' AND " : '');
    const clubs = (req.query.clubs ? " c.club_name LIKE '%" + req.query.clubs + "%' AND " : '');
    const WHERE = (recruit_id != "" || club_id != "" || school_id != "" || fname || lname || schools || clubs || coach_id || not_club_id || not_school_id ? " WHERE": "");
    const filter = recruit_id + club_id + school_id + fname + lname + schools + clubs + coach_id + not_club_id + not_school_id;
    const query = "SELECT coaches.*,  GROUP_CONCAT(DISTINCT s.school_name SEPARATOR ', ') as schools,GROUP_CONCAT(DISTINCT c.club_name SEPARATOR ', ') as clubs FROM coaches LEFT JOIN club_coaches cc ON coaches.coach_id = cc.coach_id LEFT JOIN school_coaches sc ON coaches.coach_id = sc.coach_id LEFT JOIN schools s ON sc.school_id = s.school_id LEFT JOIN club c ON cc.club_id = c.club_id" + recruitTable + WHERE + filter.substring(0,filter.length-4) + " GROUP BY coaches.coach_id";
    console.log(query)
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results}); 
        }
    });
});
app.get('/endpoints/teams.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    let recruit_id = "";
    let recruitTable = "";
    if (req.query.recruit_id) {
        recruit_id = " (r.recruit_id = " + req.query.recruit_id + " OR cr.recruit_id = " + req.query.recruit_id + ") AND";
        recruitTable = " LEFT JOIN recruits r ON team.school_id = r.school_id LEFT JOIN club_recruits cr ON c.club_id = cr.club_id";
    }
    let coach_id = "";
    let coachTable = "";
    if (req.query.coach_id) {
        coach_id = " (cc.coach_id = " + req.query.coach_id + " OR sc.coach_id = " + req.query.coach_id + ") AND";
        coachTable = " LEFT JOIN club_coaches cc ON c.club_id = cc.club_id LEFT JOIN school_coaches sc ON s.school_id = sc.school_id";
    }
    const club_id = (req.query.club_id ? " c.club_id = " + req.query.club_id + " AND": "");
    const school_id = (req.query.school_id ?  " s.school_id = " + req.query.school_id + " AND": '');
    const type = (req.query.type ?  " team.type = '" + req.query.type + "' AND": '');
    const id = (req.query.id ?  " team.team_id = '" + req.query.id + "' AND": '');
    const org = (req.query.org ? " COALESCE(s.school_name, c.club_name) LIKE '%" + req.query.org + "%' AND " : '');
    const team_name = (req.query.teamname ? " team.team_name LIKE '%" + req.query.teamname + "%' AND " : '');
    const filter = recruit_id + club_id + school_id + coach_id + type + org + team_name + id;
    const WHERE = (filter != "" ? " WHERE": "");
    const query = "SELECT team.*, COALESCE(s.school_name, c.club_name) AS school_club_name, COALESCE (c.street_address_1, s.street_address_1) AS street_address_1, COALESCE (c.street_address_2, s.street_address_2) AS street_address_2, COALESCE (c.city, s.city) AS city, COALESCE (c.state, s.state) AS state, COALESCE (c.zip, s.zip) AS zip from team LEFT JOIN schools s ON team.school_id = s.school_id LEFT JOIN club c ON team.club_id = c.club_id" + recruitTable + coachTable + WHERE + filter.substring(0,filter.length-4);
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results});
        }
    });
});
app.get('/endpoints/calls.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    const id = (req.query.id ? " WHERE recruit_id = " + req.query.id : '');
    const query = "SELECT * FROM call_log" + id;
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results});
        }
    });
});
app.get('/endpoints/guardians.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    const id = (req.query.id ? " WHERE recruit_parent.recruit_id = " + req.query.id : '');
    const select = (req.query.id ? "parents.*, recruit_parent.relation" : "parents.*")
    let query = "select distinct " + select + " from recruit_parent INNER JOIN parents ON parents.parent_id = recruit_parent.parent_id" + id;
    if (req.query.distinct === "true") {
      query = "SELECT * FROM parents";
    }
    else if (req.query.notid) {
      query = "select distinct parents.* from parents LEFT JOIN recruit_parent ON parents.parent_id = recruit_parent.parent_id WHERE recruit_parent.recruit_id != " + req.query.notid + " OR parents.parent_id NOT IN (select parent_id FROM recruit_parent)";
    }
    console.log(query);
    connection.query(query, (err, results) => {
        if (err) {
            return res.send({data: err});
        }
        else {
            return res.json({data: results});
        }
    });
});


app.get("/endpoints/schools.json", (req, res) => {
  res.set("Content-Type", "application/json");
  const id = (req.query.id ? "school_id = " + req.query.id : '');
  const not_coach_id = (req.query.not_coach_id ? "schools.school_id NOT IN (select school_id FROM school_coaches WHERE coach_id = " + req.query.not_coach_id + ")" : "");
  const WHERE = (id != "" || not_coach_id != "" ? " WHERE " : "")
  const query = "SELECT * FROM schools" + WHERE + id + not_coach_id;
  console.log(query);
  connection.query(query, (err, results) => {
    if (err) {
      return res.send({ data: err });
    } else {
      return res.json({ data: results });
    }
  });
});


app.post("/endpoints/newrecruit", (req, res) => {
  var recruit ;
  connection.query(
    "INSERT INTO `recruits` (`fname`, `mname`, `lname`, `suffix`, `dob`, `height`, `gender`, `funnelstatus`, `hsgradyear`, `school_id`, `position`, `dominant_hand`, `street_address_1`, `street_address_2`, `city`, `state`, `zip`, `phone`, `email`, `twitter`, `instagram`, `snapchat`, `facebook`, `gpa`, `fafsa_started`, `fafsa_completed`, `or_promise_started`, `or_promise_completed`, `osac_gen_schol_started`, `osac_gen_schol_completed`, `efc_received`, `efc_num`, `chafee_eligible`) VALUES (?, NULLIF(?,''), ?, NULLIF(?,''), NULLIF(?,''), ?, ?, NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''))",
    [req.body.fname, req.body.mname, req.body.lname, req.body.suffix, req.body.dob, req.body.height, req.body.gender, req.body.funnelstatus, req.body.hsgradyear, req.body.school_id, req.body.position, req.body.dominant_hand, req.body.street_address_1, req.body.street_address_2, req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.email, req.body.twitter, req.body.instagram, req.body.snapchat, req.body.facebook, req.body.gpa, req.body.fafsa_started, req.body.fafsa_completed, req.body.or_promise_started, req.body.or_promise_completed, req.body.osac_gen_schol_started, req.body.osac_gen_schol_completed, req.body.efc_received, req.body.efc_num, req.body.chafee_eligible],
    (err, results) => {
      if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
      } 
      else {
          console.log(results);
          res.write(JSON.stringify(results));
          res.status(200);
          res.end();
      }
    }
  );
});
app.post("/endpoints/update-coach", (req, res) => {
  const query = "UPDATE coaches SET fname=?, mname=?, lname=?, suffix=? WHERE coach_id=?";
  const inserts = [req.body.fname, req.body.mname, req.body.lname, req.body.suffix, req.body.coach_id];
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.write(JSON.stringify(results));
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/update-team", (req, res) => {
  var query = "";
  var inserts = "";
  if (req.body.update_secondary && req.body.type === "Club") {  // Update club table and team table
    query = "UPDATE club SET street_address_1=?, street_address_2=?, city=?, state=?, zip=? WHERE club_id=?";
    inserts = [req.body.street_address_1, req.body.street_address_2, req.body.city, req.body.state, req.body.zip, req.body.club_id];
  }
  else if (req.body.update_secondary && req.body.type === "School") {  // Update schools table and team table
    query = "UPDATE schools SET street_address_1=?, street_address_2=?, city=?, state=?, zip=? WHERE school_id=?";
    inserts = [req.body.street_address_1, req.body.street_address_2, req.body.city, req.body.state, req.body.zip, req.body.school_id];
  }
  else {  // Only update team table if no other data has been changed
    if (req.body.type === "Club") { 
      query = "UPDATE team SET type=?, team_name=?, club_id=?, school_id=null WHERE team_id=?"
      inserts = [req.body.type, req.body.team_name, req.body.club_id, req.body.team_id];
    }
    else if (req.body.type === "School") { 
      query = "UPDATE team SET type=?, team_name=?, club_id=null, school_id=? WHERE team_id=?"
      inserts = [req.body.type, req.body.team_name, req.body.school_id, req.body.team_id];
    }
  }
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.write(JSON.stringify(results));
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/guardian-post", (req, res) => {
  var query = "";
  var inserts = "";
  if (req.body.type === "add") {  // Add relationship for existing parent
    query = "INSERT INTO `recruit_parent` (`recruit_id`, `parent_id`, `relation`) VALUES (?, ?, ?)";
    inserts = [req.body.recruit_id, req.body.parent_id, req.body.relationship];
  }
  else if (req.body.type === "new") { // Add new parent
    query = "INSERT INTO `parents` (`fname`, `mname`, `lname`) VALUES (NULLIF(?,''), NULLIF(?,''), NULLIF(?,''))";
    inserts = [req.body.fname, req.body.mname, req.body.lname]; 
  }
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.write(JSON.stringify(results));
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/add-call-log", (req, res) => {
  var query = "INSERT INTO `call_log` (`caller`, `time`, `phone_number`, `duration`, `recruit_id`) VALUES (NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''))";
  var inserts = [req.body.caller, req.body.time, req.body.phone_number, req.body.duration, req.body.recruit_id];
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.send(results)
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/add-coach", (req, res) => {
  var query = "INSERT INTO `coaches` (`fname`,`mname`,`lname`,`suffix`) VALUES (?, ?, ?, ?)";
  var inserts = [req.body.fname, req.body.mname, req.body.lname, req.body.suffix];
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.send(results)
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/add-evaluation", (req, res) => {
  var query = "INSERT INTO `evaluations` (`recruit_id`, `eval_type`, `eval_date`, `eval_opponent`, `jump_shooting`, `dribble_pull_up`, `driving_finish`, `both_hands`, `free_throw_shooting`, `has_post_moves`, `rh_jump_hook`, `lh_jump_hook`, `rh_step_through`, `lh_step_through`, `rh_drop_step`, `lh_drop_step`, `rh_drop_step_counter`, `lh_drop_step_counter`, `rh_fadeaway`, `lh_fadeaway`, `post_spin`, `post_face_up`, `speed`, `quickness`, `lateral_quickness`, `stance`, `initiates_contact`, `bounce`, `second_bounce`, `closeout`, `anticipation`, `rh_ball_handling`, `lh_ball_handling`, `front_x_over`, `middle_x_over`, `back_x_over`,`passing`, `pivots`, `rebound_outside_zone`, `rebound_anticipation`, `rebound_physicality`, `talk`, `moving_on_air_time`, `eval_rating`, `notes`) VALUES (?, ?, ?, NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), NULLIF(?,''))";
  var inserts = [req.body.recruit_id, req.body.eval_type, req.body.eval_date, req.body.eval_opponent, req.body.jump_shooting, req.body.dribble_pull_up, req.body.driving_finish, req.body.both_hands, req.body.free_throw_shooting, req.body.has_post_moves, req.body.rh_jump_hook, req.body.lh_jump_hook, req.body.rh_step_through, req.body.lh_step_through, req.body.rh_drop_step, req.body.lh_drop_step, req.body.rh_drop_step_counter, req.body.lh_drop_step_counter, req.body.rh_fadeaway, req.body.lh_fadeaway, req.body.post_spin, req.body.post_face_up, req.body.speed, req.body.quickness, req.body.lateral_quickness, req.body.stance, req.body.initiates_contact, req.body.bounce, req.body.second_bounce, req.body.closeout, req.body.anticipation, req.body.rh_ball_handling, req.body.lh_ball_handling, req.body.front_x_over, req.body.middle_x_over, req.body.back_x_over, req.body.passing, req.body.pivots, req.body.rebound_outside_zone, req.body.rebound_anticipation, req.body.rebound_physicality, req.body.talk, req.body.moving_on_air_time, req.body.eval_rating, req.body.notes];
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.send(results)
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/update-evaluation", (req, res) => {
  var query = "UPDATE evaluations SET eval_date=?, eval_opponent=?, jump_shooting=?, dribble_pull_up=?, driving_finish=?, both_hands=?, free_throw_shooting=?, has_post_moves=?, rh_jump_hook=?, lh_jump_hook=?, rh_step_through=?, lh_step_through=?, rh_drop_step=?, lh_drop_step=?, rh_drop_step_counter=?, lh_drop_step_counter=?, rh_fadeaway=?, lh_fadeaway=?, post_spin=?, post_face_up=?, speed=?, quickness=?, lateral_quickness=?, stance=?, initiates_contact=?, bounce=?, second_bounce=?, closeout=?, anticipation=?, rh_ball_handling=?, lh_ball_handling=?, front_x_over=?, middle_x_over=?, back_x_over=?, passing=?, pivots=?, rebound_outside_zone=?, rebound_anticipation=?, rebound_physicality=?, talk=?, moving_on_air_time=?, eval_rating=?, notes=? WHERE eval_id=?";
  var inserts = [req.body.eval_date, req.body.eval_opponent, req.body.jump_shooting, req.body.dribble_pull_up, req.body.driving_finish, req.body.both_hands, req.body.free_throw_shooting, req.body.has_post_moves, req.body.rh_jump_hook, req.body.lh_jump_hook, req.body.rh_step_through, req.body.lh_step_through, req.body.rh_drop_step, req.body.lh_drop_step, req.body.rh_drop_step_counter, req.body.lh_drop_step_counter, req.body.rh_fadeaway, req.body.lh_fadeaway, req.body.post_spin, req.body.post_face_up, req.body.speed, req.body.quickness, req.body.lateral_quickness, req.body.stance, req.body.initiates_contact, req.body.bounce, req.body.second_bounce, req.body.closeout, req.body.anticipation, req.body.rh_ball_handling, req.body.lh_ball_handling, req.body.front_x_over, req.body.middle_x_over, req.body.back_x_over, req.body.passing, req.body.pivots, req.body.rebound_outside_zone, req.body.rebound_anticipation, req.body.rebound_physicality, req.body.talk, req.body.moving_on_air_time, req.body.eval_rating, req.body.notes, req.body.eval_id];
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.send(results)
        res.status(200);
        res.end();
    }
  });
});
app.post("/endpoints/update-recruit", (req, res) => {
    var query = "UPDATE recruits SET recruit_id=?, fname=?, mname=?, lname=?, suffix=?, dob=?, height=?, gender=?, funnelstatus=?, hsgradyear=?, school_id=?, position=?, dominant_hand=?, street_address_1=?, street_address_2=?, city=?, state=?, zip=?, phone=?, email=?, twitter=?, instagram=?, snapchat=?, facebook=?, gpa=?, fafsa_started=?, fafsa_completed=?, or_promise_started=?, or_promise_completed=?, osac_gen_schol_started=?, osac_gen_schol_completed=?, efc_received=?, efc_num=?, chafee_eligible=? WHERE recruit_id=?";
		var inserts = [req.body.recruit_id, req.body.fname, req.body.mname, req.body.lname, req.body.suffix, req.body.dob, req.body.height, req.body.gender, req.body.funnelstatus, req.body.hsgradyear, req.body.school_id, req.body.position, req.body.dominant_hand, req.body.street_address_1, req.body.street_address_2, req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.email, req.body.twitter, req.body.instagram, req.body.snapchat, req.body.facebook, req.body.gpa, req.body.fafsa_started, req.body.fafsa_completed, req.body.or_promise_started, req.body.or_promise_completed, req.body.osac_gen_schol_started, req.body.osac_gen_schol_completed, req.body.efc_received, req.body.efc_num, req.body.chafee_eligible, req.body.recruit_id];
    connection.query(query, inserts, (err, results) => {
      if (err) {
          res.write(JSON.stringify(err));
          res.status(500);
          console.log(err);
          res.end();
      } else {
        res.status(200);
        res.end();
      }
  });
});

app.get("/endpoints/clubs.json", (req, res) => {
    res.set("Content-Type", "application/json");
    const id = (req.query.id ? "club_id = " + req.query.id : '');
    const not_coach_id = (req.query.not_coach_id ? "club.club_id NOT IN (select club_id FROM club_coaches WHERE coach_id = " + req.query.not_coach_id + ")" : "");
    const WHERE = (id != "" || not_coach_id != "" ? " WHERE " : "")
    let query = "SELECT * FROM club" + WHERE + id + not_coach_id;
    if (req.query.not_recruit_id) {
      query = "SELECT DISTINCT club.* FROM club LEFT JOIN club_recruits ON club.club_id = club_recruits.club_id WHERE club_recruits.club_id NOT IN (SELECT club_id FROM club_recruits WHERE recruit_id = " + req.query.not_recruit_id + ") OR club_recruits.recruit_id IS NULL";
    }
    console.log(query);
    connection.query(query, (err, results) => {
      if (err) {
        return res.send({ data: err });
      } else {
        return res.json({ data: results });
      }
    });
  });

app.post("/endpoints/newcoach", (req, res) => {
  var coach ;
  connection.query(
    "INSERT INTO `coaches` (`fname`,`mname`,`lname`,`suffix`) VALUES (?, ?, ?, ?)",
    [
      req.body.fname,
      req.body.mname,
      req.body.lname,
      req.body.suffix
    ],
    (err, results) => {
      if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
      } 
      else {
          console.log(results);
          res.write(JSON.stringify(results));
          res.status(200);
          res.end();
      }
    }
  );
});

app.post("/endpoints/add-team-recruit", (req, res) => {
  const query = "INSERT INTO `club_recruits` (`club_id`, `recruit_id`) VALUES (?,?)";
  const inserts = [req.body.club_id, req.body.recruit_id];
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
      res.write(JSON.stringify(err));
      res.status(500);
      console.log(err);
      res.end();
    } 
    else {
      console.log(results);
      res.write(JSON.stringify(results));
      res.status(200);
      res.end();
    }
  });
});

app.post("/endpoints/add-team-coach", (req, res) => {
  let query = "";
  let inserts = [];
  if (req.body.type === "Club") {
    query = "INSERT INTO `club_coaches` (`club_id`, `coach_id`) VALUES (?,?)";
    inserts = [req.body.club_id, req.body.coach_id];
  }
  else if (req.body.type === "School") {
    query = "INSERT INTO `school_coaches` (`school_id`, `coach_id`) VALUES (?,?)";
    inserts = [req.body.school_id, req.body.coach_id];
  }
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
      res.write(JSON.stringify(err));
      res.status(500);
      console.log(err);
      res.end();
    } 
    else {
      console.log(results);
      res.write(JSON.stringify(results));
      res.status(200);
      res.end();
    }
  });
});

app.post("/endpoints/add-team", (req, res) => {
  let query = "";
  inserts = [req.body.type, req.body.team_name, req.body.club_id, req.body.school_id];
  query = "INSERT INTO `team` (`type`, `team_name`, `club_id`, `school_id`) VALUES (?,?,NULLIF(?,''),NULLIF(?,''))";
  console.log(query);
  console.log(inserts);
  connection.query(query, inserts, (err, results) => {
    if (err) {
      res.write(JSON.stringify(err));
      res.status(500);
      console.log(err);
      res.end();
    } 
    else {
      console.log(results);
      res.write(JSON.stringify(results));
      res.status(200);
      res.end();
    }
  });
});

app.post("/endpoints/add-club-or-school", (req, res) => {
  let query = "";
  inserts = [req.body.school_club_name, req.body.street_address_1, req.body.street_address_2, req.body.city, req.body.state, req.body.zip];
  if (req.body.type === "Club") {
    query = "INSERT INTO `club` (`club_name`, `street_address_1`, `street_address_2`, `city`, `state`, `zip`) VALUES (?,?,NULLIF(?,''),?,?,?)";
  }
  else if (req.body.type === "School") {
    query = "INSERT INTO `schools` (`school_name`, `street_address_1`, `street_address_2`, `city`, `state`, `zip`) VALUES (?,?,NULLIF(?,''),?,?,?)";
  }
  console.log(query);
  console.log(inserts)
  connection.query(query, inserts, (err, results) => {
    if (err) {
      res.write(JSON.stringify(err));
      res.status(500);
      console.log(err);
      res.end();
    } 
    else {
      console.log(results);
      res.write(JSON.stringify(results));
      res.status(200);
      res.end();
    }
  });
});

app.post("/endpoints/newclub", (req, res) => {
  var club ;
  connection.query(
    "INSERT INTO `club` (`club_name`) VALUES (?)",
    [
      req.body.name
    ],
    (err, result) => {
      if (err) {
        throw err;
        
      }
      console.log("add new club");
      connection.query(
        "SELECT club_id as id FROM `club` ORDER BY club_id DESC LIMIT 1",(err, result) => {
          if (err) {
            throw err;
      
          }
         
          club = result[0].id;
          console.log("club id " + club);
          console.log("coach_id is" + req.body.coach_id);
   if(req.body.coach_id){
  connection.query(
    "INSERT INTO `club_coaches` (`coach_id`, `club_id`) VALUES (?,?)",
    [req.body.coach_id, club],
    (err, result) => {
      if (err) {
        throw err;
      
      }
      console.log("update coach and club table");
    }
  );}
      }
    )
    }
  );
});

app.post("/endpoints/newschool", (req, res) => {
  console.log("test");
  connection.query(
    "INSERT INTO `schools` (`school_name`,`street_address_1`,`street_address_2`,`city`,`state`,`zip`) VALUES (?, ?, ?, ?, ?, ?)",
    [
      req.body.school_name,
      req.body.street_address_1,
      req.body.street_address_2,
      req.body.city,
      req.body.state,
      req.body.zip
    ],
    (err, result) => {
      if (err) {
        throw err;
        
      }
      console.log("add new school ");
      connection.query(
        "SELECT school_id as id FROM `schools` ORDER BY school_id DESC LIMIT 1",(err, result) => {
          if (err) {
            throw err;
      
          }
         
          var school = result[0].id;
          console.log("school " + school);
          console.log("coach_id is" + req.body.coach_id);
   if(req.body.coach_id){
  connection.query(
    "INSERT INTO `school_coaches` (`school_id`, `coach_id`) VALUES (?,?)",
    [school,req.body.coach_id],
    (err, result) => {
      if (err) {
      
        throw err;
      
      }
      console.log("update coach and school table");
    }
  );}
      }
    )
    }
  );
});

app.post("/endpoints/delete", (req, res) => {
  const table = req.body.entity;
  const condition = req.body.idname + " = " + req.body.id;
  const condition2 = (req.body.idname2 && req.body.id2 ? " AND " + req.body.idname2 + " = " + req.body.id2 : "");
  var query = "DELETE FROM " + table + " WHERE " + condition + condition2;
  console.log(query);
  connection.query(query, (err, results) => {
    if (err) {
        res.write(JSON.stringify(err));
        res.status(500);
        console.log(err);
        res.end();
    } 
    else {
        console.log(results);
        res.send(results)
        res.status(200);
        res.end();
    }
  });
});

app.get('/login', function (req, res) {
    res.redirect('/dashboard');
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(8080, () => {
	console.log('Running on port ' + port);
});
