'use strict';

import M = require('mongoose');
import commonModels = require("../../../libs/models");


var ThingSchema = new M.Schema({
  name: String,
  info: String,
  active: Boolean
});

export interface IThing extends commonModels.IThing, M.Document {}

export var Model = M.model<IThing>('Thing', ThingSchema);