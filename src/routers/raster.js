const express = require('express');
const { check, body, validationResult } = require('express-validator');
const db = require('../db/pgAdaptor');

const router = new express.Router();
const tableExists = require('../db/utils');

// All data loaded to Postgres using SRID: 4326
const srid = 4326;

/**
 * Get the raster cell value at the location of the passed in lat-lng coordinate pair.
 */
router.get('/raster/:tablename/cell-value', [
    check('lng').isDecimal(),
    check('lat').isDecimal(),
  ], async (req, res) => {
    // Handle request validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
    }
  
    try {
      // Check table in db.
      const tableName = req.params.tablename.toLowerCase();
      const exists = await tableExists(tableName);
      console.log("Checking for table");
      // if (!exists) {
      //   res.status(404).send({ message: `tablename: '${tableName}' not found` });
      // }
  
      // Perform spatial query.
      const result = await db.any(`
          SELECT rid, ST_Value(rast, (ST_SetSRID(ST_MakePoint($1,$2),${srid})))
          FROM public.${tableName}
          WHERE ST_Intersects(rast, (ST_SetSRID(ST_MakePoint($1,$2),${srid})));
        `, [req.query.lng, req.query.lat]);
      res.status(200).send(result);
    } catch (e) {
      console.log('Error: ' + e);
      res.status(500);
    }
  });

  module.exports = router;