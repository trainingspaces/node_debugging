/*
  File: index.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:16
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import express from 'express';
import { logger } from './util/logger';
import bodyParser from 'body-parser';

import postRouter from './services/posts';
import mathRouter from './services/math';

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/posts', postRouter);
app.use('/math', mathRouter);

app.listen(port, () => logger.log(`Application running on port ${port}`));
