export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: `Route non trouvée: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? '💤' : err.stack
  });
};
