import { createApp } from "./app.js"

import { MovieModel } from "./models/mysql_movie.js"

createApp({ movieModel: MovieModel })