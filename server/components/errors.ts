/**
 * Error responses
 */

import express = require('express');

class ErrorHandlers {
  public static pageNotFound(req: express.Request, res: express.Response) {
    res.sendStatus(404);
  }
}

export = ErrorHandlers;
