const express = require('express');
const router = express.Router();
const pool = require('../pools/pool');

router.get('/', (req, res)=>{
   console.log('Handling GET for /history');
   const queryText = `select entry.id as entry_id, entry.description as description, entry.date as date, entry.hours as hours, project_id, project.name as project from entry 
      join project on entry.project_id = project.id
      order by date desc;`;
      pool.query(queryText).then((result)=>{
         console.log(result.rows);
         res.send(result.rows);
      }).catch((error)=>{
         console.log('Error handling GET for /history: ', error);
         res.sendStatus(500);
      });
   
});

router.post('/', (req, res)=>{
   queryText = 'insert into entry ("description", "date", "hours", "project_id") values ($1, $2, $3, $4);';
   pool.query(queryText, [req.body.description, req.body.date, req.body.hours, req.body.project_id]).then((result)=>{
      res.sendStatus(201);
   }).catch((error)=>{
      console.log('Error handling POST for /history: ', error);
      res.sendStatus(500);
   });
});

router.delete('/:id', (req, res)=>{
   queryText = 'delete from entry where id = $1';
   pool.query(queryText, [req.params.id]).then((result)=>{
      res.sendStatus(200);
   }).catch((error)=>{
      console.log('Error handling DELETE for /history: ', error);
      res.sendStatus(404);
   });
});

router.put('/:id', (req, res)=>{
      queryText = 'update entry set hours = $1 where id = $2;';
      pool.query(queryText, [req.body.hours, req.params.id]).then((result)=>{
            res.sendStatus(200);
      }).catch((error)=>{
            console.log('Error', error);
            res.sendStatus(500);
      });
});

module.exports = router;