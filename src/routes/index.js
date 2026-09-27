// Aggregates one express.Router() per resource, same as the support desk
// case study. Mount your own resources here as you add them.
import express from 'express';
import movieRoutes from './movie.routes.js';
import userRoutes from './user.routes.js';
import directorRoutes from './director.routes.js';
import genreRoutes from './genre.routes.js';


// reviews exist on movies can be viewed on users
// order viewed by user
const router = express.Router();

router.use('/movies', movieRoutes);
// reviews showed on /movies/:id

router.use('/users', userRoutes);
// /users/:id/orders shows order by user
// reviews can show up on a /user/:id or /users/:id/reviews

router.use('/genres', genreRoutes);
// /genres/:id shows all movies on specific genre

router.use('/directors',directorRoutes);
// /directors shows all directors
// /direcrors/:id shows all movies by specific director

export default router;
