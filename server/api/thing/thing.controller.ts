/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

import express = require("express");
import _ = require('lodash');
import thing = require('./thing.model');

class ThingController {
  // Get list of things
  public static index(req: express.Request, res: express.Response) {
    return res.json(thing.Model.find({}));
    // thing.Model.find((err, things) => {
    //   if(err) { return handleError(res, err); }
    //   return res.json(200, things);
    // });
  }

  // Get a single thing
  public static show(req: express.Request, res: express.Response) {
    return res.json(thing.Model.findById(req.params.id));
    // thing.Model.findById(req.params.id, function (err, thing) {
    //   if(err) { return handleError(res, err); }
    //   if(!thing) { return res.send(404); }
    //   return res.json(thing);
    // });
  }

  // Creates a new thing in the DB.
  public static create(req: express.Request, res: express.Response) {
    return res.json(thing.Model.create(req.body));
    // thing.Model.create(req.body, function(err, thing) {
    //   if(err) { return handleError(res, err); }
    //   return res.json(201, thing);
    // });
  }

  // Updates an existing thing in the DB.
  public static update(req: express.Request, res: express.Response) {
    if(req.body._id) { 
      delete req.body._id; 
    }
    
    return res.json(
      thing.Model.findByIdAndUpdate(req.params.id, req.body)
    );

    // thing.Model.findById(req.params.id, (err, thing) => {
    //   if (err) { 
    //     return ThingController.handleError(res, err);
    //   }
    //   if(!thing) { 
    //     return res.json(404); 
    //   }
    //   var updated = <thing.IThing>_.merge(thing, req.body);
    //   return res.json(updated.save());
    //   // updated.save(function (err) {
    //   //   if (err) { return handleError(res, err); }
    //   //   return res.json(200, thing);
    //   // });
    // });
  }

  // Deletes a thing from the DB.
  public static destroy(req: express.Request, res: express.Response) {
    return res.json(
      thing.Model.findByIdAndRemove(req.params.id)
    );
    // thing.Model.findById(req.params.id, function (err, thing) {
    //   if(err) { return ThingController.handleError(res, err); }
    //   if(!thing) { return res.json(404); }
    //   thing.remove(function(err) {
    //     if(err) { return ThingController.handleError(res, err); }
    //     return res.send(204);
    //   });
    // });
  }

  // private static handleError(res: express.Response, err) {
  //   return res.json(500, err);
  // }
}

export = ThingController;