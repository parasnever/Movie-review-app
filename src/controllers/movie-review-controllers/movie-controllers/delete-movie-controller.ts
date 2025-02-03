import { Request, Response, NextFunction } from "express";
import { movieService } from "../../../services/movie";
import {
  InvalidMovieReviewPayload,
  MovieNotFound,
} from "../../../services/movie-review-errors";
import { MovieReviewAppError } from "../../../error";
import { movieMongoService } from "../../../mongo/movie/mongoMovieService";

export async function deleteMovieController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (process.env.DATABASE_TYPE === "MYSQL") {
      const movieId = Number(req.params.movieId);
      if (!movieId) {
        const invalidPayLoadError = new InvalidMovieReviewPayload(movieId);
        next(invalidPayLoadError);
        return;
      }

      const movie = await movieService.getByIdMovie(movieId);
      if (!movie) {
        const movieNotFoundError = new MovieNotFound();
        next(movieNotFoundError);
        return;
      }

      movieService.deleteMovie(movieId);

      res.json({
        message: "Movie deleted successfully.",
      });
    } else {
      const movieId = req.params.movieId;
      await movieMongoService.deleteMovie(movieId);
      res.json({
        message: "Movies deleted successfully.",
      });
    }
  } catch (error) {
    const movieError = new MovieReviewAppError("Not found the MoviewID", 500);
    next(movieError);
  }
}
